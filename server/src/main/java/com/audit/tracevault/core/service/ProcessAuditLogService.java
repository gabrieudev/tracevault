package com.audit.tracevault.core.service;

import java.util.Arrays;
import java.util.List;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.ProcessAuditLogUseCase;
import com.audit.tracevault.core.ports.out.AlertRulesPort;
import com.audit.tracevault.core.ports.out.AlertSender;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;

public class ProcessAuditLogService
        implements ProcessAuditLogUseCase {
    private final AlertRulesPort repository;
    private final ApplicationRepositoryPort applicationRepository;
    private final AlertSender sender;

    public ProcessAuditLogService(AlertRulesPort repository,
            AlertSender sender, ApplicationRepositoryPort applicationRepository) {
        this.repository = repository;
        this.sender = sender;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void process(AuditLog log) {
        Application application = applicationRepository.findById(log.getApplication().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + log.getApplication().getId()));

        List<AlertRules> rules = repository.findActiveByApplication(
                application);

        for (AlertRules rule : rules) {
            if (!matches(rule, log))
                continue;

            AlertNotification notification = createNotification(rule, log);
            sender.send(notification);
        }

    }

    private boolean matches(AlertRules rule,
            AuditLog log) {
        return rule.getActive()
                && Arrays.stream(rule.getTriggerEvents()).anyMatch(event -> event.equals(log.getAction().toString()))
                && log.getSeverity().ordinal() >= rule.getMinSeverity().ordinal();
    }

    private AlertNotification createNotification(
            AlertRules rules,
            AuditLog auditLog) {
        AlertNotification notification = new AlertNotification();

        notification.setAlertRules(rules);
        notification.setAuditLog(auditLog);

        notification.setMessage(
                buildMessage(rules, auditLog));

        return notification;

    }

    private String buildMessage(
            AlertRules rule,
            AuditLog auditLog) {
        String template = rule.getMessageTemplate();

        if (template == null || template.isBlank()) {

            return String.format(
                    "[%s] Evento %s detectado para a aplicação %s",
                    auditLog.getSeverity(),
                    auditLog.getAction().toString(),
                    auditLog.getApplication().getName());

        }

        return template
                .replace("{event}", auditLog.getAction().toString())
                .replace("{severity}", auditLog.getSeverity().name())
                .replace("{applicationId}", auditLog.getApplication().getId().toString())
                .replace("{timestamp}", auditLog.getCreatedAt().toString());

    }

}
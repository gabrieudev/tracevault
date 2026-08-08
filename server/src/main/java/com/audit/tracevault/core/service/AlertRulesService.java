package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.exception.BusinessRuleException;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.in.AlertRulesUseCase;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.out.AlertRulesPort;

public class AlertRulesService implements AlertRulesUseCase {
    private final AlertRulesPort alertRulesRepositoryPort;

    public AlertRulesService(AlertRulesPort alertRulesRepositoryPort) {
        this.alertRulesRepositoryPort = alertRulesRepositoryPort;
    }

    @Override
    public AlertRules create(AlertRules alertRules) {
        if (alertRules.getApplication().getStatus().equals(ApplicationStatusEnum.INACTIVE)) {
            throw new BusinessRuleException(
                    "Application with id: " + alertRules.getApplication().getId()
                            + " is inactive and cannot create alert rules.");
        }

        alertRules.setCreatedAt(Instant.now());
        alertRules.setUpdatedAt(Instant.now());
        alertRules.setIsActive(true);

        return alertRulesRepositoryPort.save(alertRules);
    }

    @Override
    public PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput) {
        return alertRulesRepositoryPort.findAll(queryInput);
    }

    @Override
    public AlertRules findById(UUID id) {
        return alertRulesRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("alertRules not found with id: " + id));
    }

    @Override
    public AlertRules update(UUID id, AlertRules alertRules) {
        AlertRules existingAlertRules = alertRulesRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("alertRules not found with id: " + id));

        existingAlertRules.setChannelConfig(alertRules.getChannelConfig());
        existingAlertRules.setChannelType(alertRules.getChannelType());
        existingAlertRules.setMessageTemplate(alertRules.getMessageTemplate());
        existingAlertRules.setTriggerEvents(alertRules.getTriggerEvents());
        existingAlertRules.setMinSeverity(alertRules.getMinSeverity());
        existingAlertRules.setIsActive(alertRules.getIsActive());
        existingAlertRules.setUpdatedAt(Instant.now());

        return alertRulesRepositoryPort.save(existingAlertRules);
    }
}

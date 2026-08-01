package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.in.AlertRulesUseCase;
import com.audit.tracevault.core.ports.out.AlertRulesPort;

public class AlertRulesService implements AlertRulesUseCase {
    private final AlertRulesPort webhookRepositoryPort;
    
    public AlertRulesService(AlertRulesPort webhookRepositoryPort) {
        this.webhookRepositoryPort = webhookRepositoryPort;
    }

    @Override
    public AlertRules create(AlertRules webhook) {
        webhook.setCreatedAt(Instant.now());
        webhook.setUpdatedAt(Instant.now());
        webhook.setIsActive(true);

        return webhookRepositoryPort.save(webhook);
    }

    @Override
    public PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput) {
        return webhookRepositoryPort.findAll(queryInput);
    }

    @Override
    public AlertRules findById(UUID id) {
        return webhookRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook not found with id: " + id));
    }

    @Override
    public AlertRules update(UUID id, AlertRules webhook) {
        AlertRules existingWebhook = webhookRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook not found with id: " + id));

        existingWebhook.setChannelConfig(webhook.getChannelConfig());
        existingWebhook.setChannelType(webhook.getChannelType());
        existingWebhook.setMessageTemplate(webhook.getMessageTemplate());
        existingWebhook.setTriggerEvents(webhook.getTriggerEvents());
        existingWebhook.setMinSeverity(webhook.getMinSeverity());
        existingWebhook.setIsActive(webhook.getIsActive());
        existingWebhook.setUpdatedAt(Instant.now());

        return webhookRepositoryPort.save(existingWebhook);
    }
}

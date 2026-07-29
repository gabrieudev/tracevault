package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.Webhook;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.WebhookInputQuery;
import com.audit.tracevault.core.ports.in.WebhookUseCase;
import com.audit.tracevault.core.ports.out.WebhookRepositoryPort;

public class WebhookService implements WebhookUseCase {
    private final WebhookRepositoryPort webhookRepositoryPort;
    
    public WebhookService(WebhookRepositoryPort webhookRepositoryPort) {
        this.webhookRepositoryPort = webhookRepositoryPort;
    }

    @Override
    public Webhook create(Webhook webhook) {
        webhook.setCreatedAt(Instant.now());
        webhook.setUpdatedAt(Instant.now());
        webhook.setIsActive(true);

        return webhookRepositoryPort.save(webhook);
    }

    @Override
    public PageResult<Webhook> findAll(WebhookInputQuery queryInput) {
        return webhookRepositoryPort.findAll(queryInput);
    }

    @Override
    public Webhook findById(UUID id) {
        return webhookRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook not found with id: " + id));
    }

    @Override
    public Webhook update(UUID id, Webhook webhook) {
        Webhook existingWebhook = webhookRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webhook not found with id: " + id));

        existingWebhook.setEndpointUrl(webhook.getEndpointUrl());
        existingWebhook.setTriggerEvents(webhook.getTriggerEvents());
        existingWebhook.setMinSeverity(webhook.getMinSeverity());
        existingWebhook.setIsActive(webhook.getIsActive());
        existingWebhook.setUpdatedAt(Instant.now());

        return webhookRepositoryPort.save(existingWebhook);
    }
}

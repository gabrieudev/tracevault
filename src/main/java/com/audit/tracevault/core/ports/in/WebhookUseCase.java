package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.Webhook;

public interface WebhookUseCase {
    Webhook create(Webhook webhook);

    PageResult<Webhook> findAll(WebhookInputQuery queryInput);

    Webhook findById(UUID id);

    Webhook update(UUID id, Webhook webhook);
}

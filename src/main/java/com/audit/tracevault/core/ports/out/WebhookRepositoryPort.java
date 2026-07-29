package com.audit.tracevault.core.ports.out;

import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.Webhook;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.WebhookInputQuery;

public interface WebhookRepositoryPort {
    Webhook save(Webhook webhook);

    Optional<Webhook> findById(UUID id);

    PageResult<Webhook> findAll(WebhookInputQuery queryInput);
}

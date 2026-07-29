package com.audit.tracevault.infrastructure.adapters.out.persistence.mapper;

import org.mapstruct.Mapper;

import com.audit.tracevault.core.domain.Webhook;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.WebhookEntity;

@Mapper(componentModel = "spring")
public interface WebhookPersistenceMapper {
    WebhookEntity toEntity(Webhook webhook);

    Webhook toDomain(WebhookEntity webhookEntity);
}

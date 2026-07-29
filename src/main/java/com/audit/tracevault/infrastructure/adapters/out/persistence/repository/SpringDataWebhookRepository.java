package com.audit.tracevault.infrastructure.adapters.out.persistence.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.WebhookEntity;

public interface SpringDataWebhookRepository
        extends JpaRepository<WebhookEntity, UUID>, JpaSpecificationExecutor<WebhookEntity> {

}

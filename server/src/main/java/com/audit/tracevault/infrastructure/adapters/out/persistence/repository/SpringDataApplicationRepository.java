package com.audit.tracevault.infrastructure.adapters.out.persistence.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.ApplicationEntity;

public interface SpringDataApplicationRepository
                extends JpaRepository<ApplicationEntity, UUID>, JpaSpecificationExecutor<ApplicationEntity> {
        Optional<ApplicationEntity> findByApiKeyHash(String apiKeyHash);
}

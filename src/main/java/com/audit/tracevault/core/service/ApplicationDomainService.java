package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.exception.FailedCryptographyException;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.ApplicationQueryInput;
import com.audit.tracevault.core.ports.in.ApplicationUseCase;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.out.ApiKeyCryptographyRepositoryPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;

public class ApplicationDomainService implements ApplicationUseCase {
    private final ApplicationRepositoryPort applicationRepositoryPort;
    private final ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort;

    public ApplicationDomainService(ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        this.applicationRepositoryPort = applicationRepositoryPort;
        this.apiKeyCryptographyRepositoryPort = apiKeyCryptographyRepositoryPort;
    }

    @Override
    public String create(Application application) {
        String plainKey = apiKeyCryptographyRepositoryPort.generatePlainApiKey("aud")
                .orElseThrow(() -> new FailedCryptographyException("Failed to generate plain API key"));
        String hashedKey = apiKeyCryptographyRepositoryPort.hashApiKey(plainKey)
                .orElseThrow(() -> new FailedCryptographyException("Failed to hash API key"));

        application.setCreatedAt(Instant.now());
        application.setUpdatedAt(Instant.now());
        application.setStatus(ApplicationStatusEnum.ACTIVE);
        application.setApiKeyHash(hashedKey);

        applicationRepositoryPort.create(application);

        return plainKey;
    }

    @Override
    public PageResult<Application> findAll(ApplicationQueryInput queryInput) {
        return applicationRepositoryPort.findAll(queryInput);
    }

    @Override
    public Application findById(UUID id) {
        return applicationRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }
}

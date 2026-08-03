package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.exception.FailedCryptographyException;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.ApplicationInputQuery;
import com.audit.tracevault.core.ports.in.ApplicationUseCase;
import com.audit.tracevault.core.ports.in.CreateApplicationOutput;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.out.ApiKeyCryptographyPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;

public class ApplicationService implements ApplicationUseCase {
    private final ApplicationRepositoryPort applicationRepositoryPort;
    private final ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort;

    public ApplicationService(ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort) {
        this.applicationRepositoryPort = applicationRepositoryPort;
        this.apiKeyCryptographyRepositoryPort = apiKeyCryptographyRepositoryPort;
    }

    @Override
    public CreateApplicationOutput create(Application application) {
        String plainKey = apiKeyCryptographyRepositoryPort.generatePlainApiKey("aud")
                .orElseThrow(() -> new FailedCryptographyException("Failed to generate plain API key"));
        String hashedKey = apiKeyCryptographyRepositoryPort.hashApiKey(plainKey)
                .orElseThrow(() -> new FailedCryptographyException("Failed to hash API key"));

        application.setCreatedAt(Instant.now());
        application.setUpdatedAt(Instant.now());
        application.setStatus(ApplicationStatusEnum.ACTIVE);
        application.setApiKeyHash(hashedKey);

        Application createdApplication = applicationRepositoryPort.save(application);

        return new CreateApplicationOutput(createdApplication.getId(), plainKey);
    }

    @Override
    public PageResult<Application> findAll(ApplicationInputQuery queryInput) {
        return applicationRepositoryPort.findAll(queryInput);
    }

    @Override
    public Application findById(UUID id) {
        return applicationRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    @Override
    public Application update(UUID id, Application application) {
        Application existingApplication = applicationRepositoryPort.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Application not found with id: " + id));

        existingApplication.setName(application.getName());
        existingApplication.setDescription(application.getDescription());
        existingApplication.setStatus(application.getStatus());
        existingApplication.setUpdatedAt(Instant.now());

        return applicationRepositoryPort.save(existingApplication);
    }

    @Override
    public String rotateKey(UUID id, String apiKey) {
        Application existingApplication = applicationRepositoryPort.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!existingApplication.getApiKeyHash().equals(apiKeyCryptographyRepositoryPort.hashApiKey(apiKey).orElse(null))) {
            throw new ResourceNotFoundException("Invalid API key for application: " + id);
        }

        String plainKey = apiKeyCryptographyRepositoryPort.generatePlainApiKey("aud")
                .orElseThrow(() -> new FailedCryptographyException("Failed to generate plain API key"));
        String hashedKey = apiKeyCryptographyRepositoryPort.hashApiKey(plainKey)
                .orElseThrow(() -> new FailedCryptographyException("Failed to hash API key"));

        existingApplication.setApiKeyHash(hashedKey);
        existingApplication.setUpdatedAt(Instant.now());

        applicationRepositoryPort.save(existingApplication);

        return plainKey;
    }
}

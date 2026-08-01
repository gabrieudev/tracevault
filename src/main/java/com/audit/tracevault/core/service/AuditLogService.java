package com.audit.tracevault.core.service;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.ports.in.AuditLogInputQuery;
import com.audit.tracevault.core.ports.in.AuditLogUseCase;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.out.ApiKeyCryptographyPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;
import com.audit.tracevault.core.ports.out.AuditLogEventPublisher;
import com.audit.tracevault.core.ports.out.AuditLogRepositoryPort;

public class AuditLogService implements AuditLogUseCase {
    private final AuditLogRepositoryPort auditLogRepositoryPort;
    private final ApplicationRepositoryPort applicationRepositoryPort;
    private final ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort;
    private final AuditLogEventPublisher publisher;

    public AuditLogService(AuditLogRepositoryPort auditLogRepositoryPort,
            ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort, AuditLogEventPublisher publisher) {
        this.auditLogRepositoryPort = auditLogRepositoryPort;
        this.applicationRepositoryPort = applicationRepositoryPort;
        this.apiKeyCryptographyRepositoryPort = apiKeyCryptographyRepositoryPort;
        this.publisher = publisher;
    }

    @Override
    public AuditLog create(String headerApiKey, AuditLog auditLog) {
        Application application = applicationRepositoryPort.findById(auditLog.getApplication().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + auditLog.getApplication().getId()));
        String appHashedKey = application.getApiKeyHash();

        if (!apiKeyCryptographyRepositoryPort.verifyApiKey(headerApiKey, appHashedKey)) {
            throw new ResourceNotFoundException("Invalid API key for application with id: " + application.getId());
        }

        auditLog.setCreatedAt(Instant.now());

        AuditLog savedAuditLog = auditLogRepositoryPort.save(auditLog);

        publisher.publish(savedAuditLog);

        return savedAuditLog;
    }

    @Override
    public PageResult<AuditLog> findAll(AuditLogInputQuery queryInput) {
        return auditLogRepositoryPort.findAll(queryInput);
    }

    @Override
    public AuditLog findById(UUID id) {
        return auditLogRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit log not found with id: " + id));
    }
}

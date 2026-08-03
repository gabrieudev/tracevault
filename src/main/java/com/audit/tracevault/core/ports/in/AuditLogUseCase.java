package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.AuditLog;

public interface AuditLogUseCase {
    PageResult<AuditLog> findAll(AuditLogInputQuery queryInput);

    AuditLog findById(UUID id);

    AuditLog create(String headerApiKey, AuditLog auditLog);

    void createAll(String headerApiKey, Iterable<AuditLog> auditLogs);
}

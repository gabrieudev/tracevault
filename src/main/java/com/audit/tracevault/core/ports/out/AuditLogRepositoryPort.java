package com.audit.tracevault.core.ports.out;

import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.ports.in.AuditLogInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;

public interface AuditLogRepositoryPort {
    AuditLog save(AuditLog auditLog);

    Optional<AuditLog> findById(UUID id);

    PageResult<AuditLog> findAll(AuditLogInputQuery queryInput);

    void saveAll(Iterable<AuditLog> auditLogs);
}

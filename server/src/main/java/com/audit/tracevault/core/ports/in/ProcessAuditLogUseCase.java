package com.audit.tracevault.core.ports.in;

import com.audit.tracevault.core.domain.AuditLog;

public interface ProcessAuditLogUseCase {
    void process(AuditLog auditLog);
}

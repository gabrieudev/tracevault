package com.audit.tracevault.core.ports.out;

import com.audit.tracevault.core.domain.AuditLog;

public interface AuditLogEventPublisher {
    void publish(AuditLog auditLog);
}

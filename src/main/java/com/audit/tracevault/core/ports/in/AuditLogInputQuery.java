package com.audit.tracevault.core.ports.in;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.AuditLogActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

public record AuditLogInputQuery(
        String search,
        UUID id,
        UUID applicationId,
        String actorId,
        String actorName,
        String actorIp,
        String actorUserAgent,
        AuditLogActionEnum action,
        String resourceType,
        String resourceId,
        SeverityEnum severity,
        Instant occurredAtFrom,
        Instant occurredAtTo,
        Instant createdFrom,
        Instant createdTo,
        int page,
        int size,
        String sortBy,
        SortDirection sortDirection) {
}

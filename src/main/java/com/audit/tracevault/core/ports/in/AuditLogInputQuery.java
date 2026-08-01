package com.audit.tracevault.core.ports.in;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

public record AuditLogInputQuery(
        String search,
        UUID id,
        UUID applicationId,
        String actorId,
        String actorName,
        String actorIp,
        String actorUserAgent,
        ActionEnum action,
        String resourceType,
        String resourceId,
        SeverityEnum severity,
        Instant occurredAtFrom,
        Instant occurredAtTo,
        Instant createdFrom,
        Instant createdTo,
        Integer page,
        Integer size,
        String sortBy,
        SortDirection sortDirection) {
}

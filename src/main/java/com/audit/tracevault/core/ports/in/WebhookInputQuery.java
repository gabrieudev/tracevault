package com.audit.tracevault.core.ports.in;

import java.time.Instant;
import java.util.UUID;

public record WebhookInputQuery(
        UUID id,
        String search,
        UUID applicationId,
        String endpointUrl,
        String[] triggerEvents,
        String minSeverity,
        Boolean isActive,
        Instant createdFrom,
        Instant createdTo,
        Instant updatedFrom,
        Instant updatedTo,
        Integer page,
        Integer size,
        String sortBy,
        SortDirection sortDirection) {
}

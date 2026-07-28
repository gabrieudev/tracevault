package com.audit.tracevault.core.ports.in;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.audit.tracevault.core.domain.ApplicationStatusEnum;

public record ApplicationInputQuery(
        UUID id,
        String search,
        String name,
        String description,
        List<ApplicationStatusEnum> status,
        Instant createdFrom,
        Instant createdTo,
        Instant updatedFrom,
        Instant updatedTo,
        int page,
        int size,
        String sortBy,
        SortDirection sortDirection) {
}
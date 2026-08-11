package com.audit.tracevault.core.ports.in;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

public record AlertRulesInputQuery(
        UUID id,
        String search,
        UUID applicationId,
        String messageTemplate,
        ChannelTypeEnum channelType,
        String[] triggerEvents,
        SeverityEnum minSeverity,
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

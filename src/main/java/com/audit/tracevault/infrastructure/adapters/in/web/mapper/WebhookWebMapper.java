package com.audit.tracevault.infrastructure.adapters.in.web.mapper;

import java.time.Instant;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.Webhook;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.core.ports.in.WebhookInputQuery;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook.UpdateWebhookDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook.WebhookRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook.WebhookResponseDTO;

@Mapper(componentModel = "spring")
public interface WebhookWebMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Webhook toDomain(WebhookRequestDTO webhookRequestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Webhook toDomain(UpdateWebhookDTO updateWebhookDTO);

    WebhookResponseDTO toResponseDTO(Webhook webhook);

    default WebhookInputQuery toInput(
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
            Pageable pageable) {
        String sortBy = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty()
                : null;

        SortDirection sortDirection = pageable.getSort().isSorted()
                ? (pageable.getSort().iterator().next().isAscending() ? SortDirection.ASC
                        : SortDirection.DESC)
                : null;

        return new WebhookInputQuery(
                id,
                search,
                applicationId,
                endpointUrl,
                triggerEvents,
                minSeverity,
                isActive,
                createdFrom,
                createdTo,
                updatedFrom,
                updatedTo,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortBy,
                sortDirection);
    }

    default PageResponse<WebhookResponseDTO> toPageResponse(PageResult<Webhook> page) {
        return new PageResponse<>(
                page.content().stream().map(this::toResponseDTO).toList(),
                page.page(),
                page.size(),
                page.totalElements(),
                page.totalPages(),
                page.first(),
                page.last());
    }
}

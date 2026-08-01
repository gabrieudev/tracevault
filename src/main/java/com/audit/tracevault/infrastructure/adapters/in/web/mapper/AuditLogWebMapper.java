package com.audit.tracevault.infrastructure.adapters.in.web.mapper;

import java.time.Instant;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.core.ports.in.AuditLogInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog.AuditLogRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog.AuditLogResponseDTO;

@Mapper(componentModel = "spring")
public interface AuditLogWebMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    AuditLog toDomain(AuditLogRequestDTO auditLogRequestDTO);

    AuditLogResponseDTO toResponseDTO(AuditLog auditLog);

    default AuditLogInputQuery toInput(String search,
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
            Pageable pageable) {
        String sortBy = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty()
                : null;

        SortDirection sortDirection = pageable.getSort().isSorted()
                ? (pageable.getSort().iterator().next().isAscending() ? SortDirection.ASC
                        : SortDirection.DESC)
                : null;

        return new AuditLogInputQuery(
                search,
                id,
                applicationId,
                actorId,
                actorName,
                actorIp,
                actorUserAgent,
                action,
                resourceType,
                resourceId,
                severity,
                occurredAtFrom,
                occurredAtTo,
                createdFrom,
                createdTo,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortBy,
                sortDirection);
    }

    default PageResponse<AuditLogResponseDTO> toPageResponse(PageResult<AuditLog> page) {
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

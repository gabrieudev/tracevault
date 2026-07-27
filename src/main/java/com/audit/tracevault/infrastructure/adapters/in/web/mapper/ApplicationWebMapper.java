package com.audit.tracevault.infrastructure.adapters.in.web.mapper;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.ports.in.ApplicationQueryInput;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;

@Mapper(componentModel = "spring")
public interface ApplicationWebMapper {
    Application toDomain(ApplicationRequestDTO requestDTO);

    ApplicationResponseDTO toResponseDTO(Application application);

    default ApplicationQueryInput toInput(UUID id, String search, String name, String description,
            List<ApplicationStatusEnum> status,
            String createdFrom, String createdTo, String updatedFrom, String updatedTo, Pageable pageable) {

        String sortBy = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : null;

        SortDirection sortDirection = pageable.getSort().isSorted()
                ? (pageable.getSort().iterator().next().isAscending() ? SortDirection.ASC : SortDirection.DESC)
                : null;

        return new ApplicationQueryInput(
                id,
                search,
                name,
                description,
                status,
                createdFrom != null ? Instant.parse(createdFrom) : null,
                createdTo != null ? Instant.parse(createdTo) : null,
                updatedFrom != null ? Instant.parse(updatedFrom) : null,
                updatedTo != null ? Instant.parse(updatedTo) : null,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortBy,
                sortDirection);
    }

    default PageResponse<ApplicationResponseDTO> toPageResponse(PageResult<Application> page) {
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

package com.audit.tracevault.infrastructure.adapters.in.web.mapper;

import java.time.Instant;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.AlertRulesRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.AlertRulesResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.UpdateAlertRulesDTO;

@Mapper(componentModel = "spring")
public interface AlertRulesWebMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    AlertRules toDomain(AlertRulesRequestDTO alertRulesRequestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    AlertRules toDomain(UpdateAlertRulesDTO updateAlertRulesDTO);

    AlertRulesResponseDTO toResponseDTO(AlertRules alertRules);

    default AlertRulesInputQuery toInput(
            UUID id,
            String search,
            UUID applicationId,
            String messageTemplate,
            ChannelTypeEnum channelType,
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

        return new AlertRulesInputQuery(
                id,
                search,
                applicationId,
                messageTemplate,
                channelType,
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

    default PageResponse<AlertRulesResponseDTO> toPageResponse(PageResult<AlertRules> page) {
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

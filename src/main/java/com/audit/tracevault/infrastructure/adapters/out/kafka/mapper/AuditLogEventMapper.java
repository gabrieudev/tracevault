package com.audit.tracevault.infrastructure.adapters.out.kafka.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.infrastructure.adapters.out.kafka.model.AuditLogEvent;

@Mapper(componentModel = "spring")
public interface AuditLogEventMapper {
    @Mapping(target = "applicationId", source = "application.id")
    AuditLogEvent toEvent(AuditLog auditLog);

    @Mapping(target = "application.id", source = "applicationId")
    AuditLog toDomain(AuditLogEvent event);
}
package com.audit.tracevault.infrastructure.adapters.out.persistence.mapper;

import org.mapstruct.Mapper;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AuditLogEntity;

@Mapper(componentModel = "spring")
public interface AuditLogPersistenceMapper {
    AuditLogEntity toEntity(AuditLog auditLog);
    
    AuditLog toDomain(AuditLogEntity auditLogEntity);
}

package com.audit.tracevault.infrastructure.adapters.out.persistence.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AuditLogEntity;

public interface SpringDataAuditLogRepository
        extends JpaRepository<AuditLogEntity, UUID>, JpaSpecificationExecutor<AuditLogEntity> {

}

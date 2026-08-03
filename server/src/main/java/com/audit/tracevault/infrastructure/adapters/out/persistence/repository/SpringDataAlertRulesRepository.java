package com.audit.tracevault.infrastructure.adapters.out.persistence.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AlertRulesEntity;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.ApplicationEntity;

public interface SpringDataAlertRulesRepository
                extends JpaRepository<AlertRulesEntity, UUID>, JpaSpecificationExecutor<AlertRulesEntity> {
        List<AlertRulesEntity> findByIsActiveAndApplication(Boolean isActive, ApplicationEntity application);
}

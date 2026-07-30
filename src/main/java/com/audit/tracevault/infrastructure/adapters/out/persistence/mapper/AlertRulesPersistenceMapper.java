package com.audit.tracevault.infrastructure.adapters.out.persistence.mapper;

import org.mapstruct.Mapper;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AlertRulesEntity;

@Mapper(componentModel = "spring")
public interface AlertRulesPersistenceMapper {
    AlertRulesEntity toEntity(AlertRules webhook);

    AlertRules toDomain(AlertRulesEntity webhookEntity);
}

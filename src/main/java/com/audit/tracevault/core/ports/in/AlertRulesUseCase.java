package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.AlertRules;

public interface AlertRulesUseCase {
    AlertRules create(AlertRules webhook);

    PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput);

    AlertRules findById(UUID id);

    AlertRules update(UUID id, AlertRules webhook);
}

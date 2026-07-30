package com.audit.tracevault.core.ports.out;

import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;

public interface AlertRulesRepositoryPort {
    AlertRules save(AlertRules webhook);

    Optional<AlertRules> findById(UUID id);

    PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput);
}

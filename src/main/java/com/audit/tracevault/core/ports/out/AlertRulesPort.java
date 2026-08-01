package com.audit.tracevault.core.ports.out;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;

public interface AlertRulesPort {
    AlertRules save(AlertRules webhook);

    Optional<AlertRules> findById(UUID id);

    PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput);

    List<AlertRules> findActiveByApplication(Application application);
}

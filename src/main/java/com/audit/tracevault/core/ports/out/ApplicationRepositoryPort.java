package com.audit.tracevault.core.ports.out;

import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.ports.in.ApplicationInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;

public interface ApplicationRepositoryPort {
    Application save(Application application);

    Optional<Application> findById(UUID id);

    Optional<Application> findByApiKeyHash(String apiKeyHash);

    PageResult<Application> findAll(ApplicationInputQuery queryInput);
}

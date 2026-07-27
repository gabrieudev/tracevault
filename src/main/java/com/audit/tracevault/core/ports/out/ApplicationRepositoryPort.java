package com.audit.tracevault.core.ports.out;

import java.util.Optional;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.ports.in.ApplicationQueryInput;
import com.audit.tracevault.core.ports.in.PageResult;

public interface ApplicationRepositoryPort {
    Application create(Application application);

    Optional<Application> findById(UUID id);

    PageResult<Application> findAll(ApplicationQueryInput queryInput);
}

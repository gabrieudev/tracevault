package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.Application;

public interface ApplicationUseCase {
    String create(Application application);

    Application findById(UUID id);

    PageResult<Application> findAll(ApplicationQueryInput queryInput);
}

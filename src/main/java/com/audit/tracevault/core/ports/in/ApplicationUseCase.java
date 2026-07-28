package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.Application;

public interface ApplicationUseCase {
    CreateApplicationOutput create(Application application);

    Application findById(UUID id);

    PageResult<Application> findAll(ApplicationInputQuery queryInput);

    Application update(UUID id, Application application);

    String rotateKey(UUID id);
}

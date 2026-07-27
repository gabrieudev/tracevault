package com.audit.tracevault.infrastructure.adapters.out.persistence.mapper;

import org.mapstruct.Mapper;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.ApplicationEntity;

@Mapper(componentModel = "spring")
public interface ApplicationPersistenceMapper {
    ApplicationEntity toEntity(Application application);

    Application toDomain(ApplicationEntity applicationEntity);
}

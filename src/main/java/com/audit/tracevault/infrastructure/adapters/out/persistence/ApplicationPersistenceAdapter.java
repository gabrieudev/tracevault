package com.audit.tracevault.infrastructure.adapters.out.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.ports.in.ApplicationInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.ApplicationEntity;
import com.audit.tracevault.infrastructure.adapters.out.persistence.mapper.ApplicationPersistenceMapper;
import com.audit.tracevault.infrastructure.adapters.out.persistence.repository.SpringDataApplicationRepository;
import com.audit.tracevault.infrastructure.adapters.out.persistence.specification.ApplicationSpecification;

@Component
public class ApplicationPersistenceAdapter implements ApplicationRepositoryPort {
        private final SpringDataApplicationRepository applicationRepositoryPort;
        private final ApplicationPersistenceMapper applicationPersistenceMapper;

        public ApplicationPersistenceAdapter(SpringDataApplicationRepository applicationRepositoryPort,
                        ApplicationPersistenceMapper applicationPersistenceMapper) {
                this.applicationRepositoryPort = applicationRepositoryPort;
                this.applicationPersistenceMapper = applicationPersistenceMapper;
        }

        @Override
        @Transactional
        public Application save(Application application) {
                ApplicationEntity entity = applicationPersistenceMapper.toEntity(application);
                ApplicationEntity savedEntity = applicationRepositoryPort.save(entity);
                return applicationPersistenceMapper.toDomain(savedEntity);
        }

        @Override
        @Transactional(readOnly = true)
        public PageResult<Application> findAll(ApplicationInputQuery queryInput) {
                boolean isPaged = queryInput.page() != null && queryInput.size() != null;

                String sortBy = Optional.ofNullable(queryInput.sortBy())
                                .filter(s -> !s.isBlank())
                                .orElse("createdAt");

                SortDirection direction = Optional.ofNullable(queryInput.sortDirection())
                                .orElse(SortDirection.DESC);

                Sort sort = Sort.by(sortBy);

                sort = direction == SortDirection.ASC
                                ? sort.ascending()
                                : sort.descending();

                Pageable pageable = isPaged
                                ? PageRequest.of(queryInput.page(), queryInput.size(), sort)
                                : Pageable.unpaged(sort);

                var spec = ApplicationSpecification.hasId(queryInput.id())
                                .and(ApplicationSpecification.search(queryInput.search()))
                                .and(ApplicationSpecification.hasName(queryInput.name()))
                                .and(ApplicationSpecification.hasDescription(queryInput.description()))
                                .and(ApplicationSpecification.hasStatusIn(queryInput.status()))
                                .and(ApplicationSpecification.createdFrom(queryInput.createdFrom()))
                                .and(ApplicationSpecification.createdTo(queryInput.createdTo()))
                                .and(ApplicationSpecification.updatedFrom(queryInput.updatedFrom()))
                                .and(ApplicationSpecification.updatedTo(queryInput.updatedTo()));

                Page<ApplicationEntity> page = applicationRepositoryPort.findAll(spec, pageable);

                return new PageResult<>(
                                page.getContent().stream()
                                                .map(applicationPersistenceMapper::toDomain)
                                                .toList(),
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages(),
                                page.isFirst(),
                                page.isLast());
        }

        @Override
        @Transactional(readOnly = true)
        public Optional<Application> findById(UUID id) {
                return applicationRepositoryPort.findById(id)
                                .map(applicationPersistenceMapper::toDomain);
        }

        @Override
        @Transactional(readOnly = true)
        public Optional<Application> findByApiKeyHash(String apiKeyHash) {
                return applicationRepositoryPort.findByApiKeyHash(apiKeyHash)
                                .map(applicationPersistenceMapper::toDomain);
        }
}

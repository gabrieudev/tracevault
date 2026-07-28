package com.audit.tracevault.infrastructure.adapters.out.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.ports.in.AuditLogInputQuery;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.core.ports.out.AuditLogRepositoryPort;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AuditLogEntity;
import com.audit.tracevault.infrastructure.adapters.out.persistence.mapper.AuditLogPersistenceMapper;
import com.audit.tracevault.infrastructure.adapters.out.persistence.repository.SpringDataAuditLogRepository;
import com.audit.tracevault.infrastructure.adapters.out.persistence.specification.AuditLogSpecification;

@Component
public class AuditLogPersistenceAdapter implements AuditLogRepositoryPort {
        private final SpringDataAuditLogRepository auditLogRepository;
        private final AuditLogPersistenceMapper auditLogPersistenceMapper;

        public AuditLogPersistenceAdapter(SpringDataAuditLogRepository auditLogRepository,
                        AuditLogPersistenceMapper auditLogPersistenceMapper) {
                this.auditLogRepository = auditLogRepository;
                this.auditLogPersistenceMapper = auditLogPersistenceMapper;
        }

        @Override
        public PageResult<AuditLog> findAll(AuditLogInputQuery queryInput) {
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

                var spec = AuditLogSpecification.hasId(queryInput.id())
                                .and(AuditLogSpecification.hasApplicationId(queryInput.applicationId()))
                                .and(AuditLogSpecification.hasActorId(queryInput.actorId()))
                                .and(AuditLogSpecification.hasActorName(queryInput.actorName()))
                                .and(AuditLogSpecification.hasActorIp(queryInput.actorIp()))
                                .and(AuditLogSpecification.hasActorUserAgent(queryInput.actorUserAgent()))
                                .and(AuditLogSpecification.hasAction(queryInput.action()))
                                .and(AuditLogSpecification.hasResourceType(queryInput.resourceType()))
                                .and(AuditLogSpecification.hasResourceId(queryInput.resourceId()))
                                .and(AuditLogSpecification.createdFrom(queryInput.createdFrom()))
                                .and(AuditLogSpecification.createdTo(queryInput.createdTo()));

                Page<AuditLogEntity> page = auditLogRepository.findAll(spec, pageable);

                return new PageResult<>(
                                page.getContent().stream()
                                                .map(auditLogPersistenceMapper::toDomain)
                                                .toList(),
                                page.getNumber(),
                                page.getSize(),
                                page.getTotalElements(),
                                page.getTotalPages(),
                                page.isFirst(),
                                page.isLast());
        }

        @Override
        public Optional<AuditLog> findById(UUID id) {
                return auditLogRepository.findById(id)
                                .map(auditLogPersistenceMapper::toDomain);
        }

        @Override
        public AuditLog save(AuditLog auditLog) {
                AuditLogEntity entity = auditLogPersistenceMapper.toEntity(auditLog);
                AuditLogEntity savedEntity = auditLogRepository.save(entity);
                return auditLogPersistenceMapper.toDomain(savedEntity);
        }
}

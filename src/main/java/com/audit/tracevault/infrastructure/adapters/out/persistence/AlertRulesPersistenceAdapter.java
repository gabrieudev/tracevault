package com.audit.tracevault.infrastructure.adapters.out.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.out.AlertRulesRepositoryPort;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AlertRulesEntity;
import com.audit.tracevault.infrastructure.adapters.out.persistence.mapper.AlertRulesPersistenceMapper;
import com.audit.tracevault.infrastructure.adapters.out.persistence.repository.SpringDataAlertRulesRepository;
import com.audit.tracevault.infrastructure.adapters.out.persistence.specification.AlertRulesSpecification;

@Component
public class AlertRulesPersistenceAdapter implements AlertRulesRepositoryPort {
    private final SpringDataAlertRulesRepository springDataWebhookRepository;
    private final AlertRulesPersistenceMapper webhookPersistenceMapper;

    public AlertRulesPersistenceAdapter(SpringDataAlertRulesRepository springDataWebhookRepository,
            AlertRulesPersistenceMapper webhookPersistenceMapper) {
        this.springDataWebhookRepository = springDataWebhookRepository;
        this.webhookPersistenceMapper = webhookPersistenceMapper;
    }

    @Override
    public PageResult<AlertRules> findAll(AlertRulesInputQuery queryInput) {
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

        var spec = AlertRulesSpecification.hasId(queryInput.id())
                .and(AlertRulesSpecification.search(queryInput.search()))
                .and(AlertRulesSpecification.hasApplicationId(queryInput.applicationId()))
                .and(AlertRulesSpecification.hasMessageTemplate(queryInput.messageTemplate()))
                .and(AlertRulesSpecification.hasChannelType(queryInput.channelType()))
                .and(AlertRulesSpecification.hasTriggerEvents(queryInput.triggerEvents()))
                .and(AlertRulesSpecification.hasMinSeverity(queryInput.minSeverity()))
                .and(AlertRulesSpecification.hasIsActive(queryInput.isActive()))
                .and(AlertRulesSpecification.createdFrom(queryInput.createdFrom()))
                .and(AlertRulesSpecification.createdTo(queryInput.createdTo()))
                .and(AlertRulesSpecification.updatedFrom(queryInput.updatedFrom()))
                .and(AlertRulesSpecification.updatedTo(queryInput.updatedTo()));

        Page<AlertRulesEntity> page = springDataWebhookRepository.findAll(spec, pageable);

        return new PageResult<>(
                page.getContent().stream()
                        .map(webhookPersistenceMapper::toDomain)
                        .toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @Override
    public Optional<AlertRules> findById(UUID id) {
        return springDataWebhookRepository.findById(id).map(webhookPersistenceMapper::toDomain);
    }

    @Override
    public AlertRules save(AlertRules webhook) {
        AlertRulesEntity webhookEntity = webhookPersistenceMapper.toEntity(webhook);
        AlertRulesEntity savedEntity = springDataWebhookRepository.save(webhookEntity);
        return webhookPersistenceMapper.toDomain(savedEntity);
    }
}

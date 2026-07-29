package com.audit.tracevault.infrastructure.adapters.out.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.Webhook;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.core.ports.in.SortDirection;
import com.audit.tracevault.core.ports.in.WebhookInputQuery;
import com.audit.tracevault.core.ports.out.WebhookRepositoryPort;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.WebhookEntity;
import com.audit.tracevault.infrastructure.adapters.out.persistence.mapper.WebhookPersistenceMapper;
import com.audit.tracevault.infrastructure.adapters.out.persistence.repository.SpringDataWebhookRepository;
import com.audit.tracevault.infrastructure.adapters.out.persistence.specification.WebhookSpecification;

@Component
public class WebhookPersistenceAdapter implements WebhookRepositoryPort {
    private final SpringDataWebhookRepository springDataWebhookRepository;
    private final WebhookPersistenceMapper webhookPersistenceMapper;

    public WebhookPersistenceAdapter(SpringDataWebhookRepository springDataWebhookRepository,
            WebhookPersistenceMapper webhookPersistenceMapper) {
        this.springDataWebhookRepository = springDataWebhookRepository;
        this.webhookPersistenceMapper = webhookPersistenceMapper;
    }

    @Override
    public PageResult<Webhook> findAll(WebhookInputQuery queryInput) {
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

        var spec = WebhookSpecification.hasId(queryInput.id())
                .and(WebhookSpecification.search(queryInput.search()))
                .and(WebhookSpecification.hasApplicationId(queryInput.applicationId()))
                .and(WebhookSpecification.hasEndpointUrl(queryInput.endpointUrl()))
                .and(WebhookSpecification.hasTriggerEvents(queryInput.triggerEvents()))
                .and(WebhookSpecification.hasMinSeverity(queryInput.minSeverity()))
                .and(WebhookSpecification.hasIsActive(queryInput.isActive()))
                .and(WebhookSpecification.createdFrom(queryInput.createdFrom()))
                .and(WebhookSpecification.createdTo(queryInput.createdTo()))
                .and(WebhookSpecification.updatedFrom(queryInput.updatedFrom()))
                .and(WebhookSpecification.updatedTo(queryInput.updatedTo()));

        Page<WebhookEntity> page = springDataWebhookRepository.findAll(spec, pageable);

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
    public Optional<Webhook> findById(UUID id) {
        return springDataWebhookRepository.findById(id).map(webhookPersistenceMapper::toDomain);
    }

    @Override
    public Webhook save(Webhook webhook) {
        WebhookEntity webhookEntity = webhookPersistenceMapper.toEntity(webhook);
        WebhookEntity savedEntity = springDataWebhookRepository.save(webhookEntity);
        return webhookPersistenceMapper.toDomain(savedEntity);
    }
}

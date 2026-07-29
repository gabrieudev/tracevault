package com.audit.tracevault.infrastructure.adapters.out.persistence.specification;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.WebhookEntity;

public class WebhookSpecification {
    private WebhookSpecification() {
    }

    public static Specification<WebhookEntity> search(String search) {
        return (root, query, cb) -> search == null || search.isBlank()
                ? cb.conjunction()
                : cb.or(
                        cb.like(cb.lower(root.get("endpointUrl")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("triggerEvents").as(String.class)), "%" + search.toLowerCase() + "%"));
    }

    public static Specification<WebhookEntity> hasId(UUID id) {
        return (root, query, cb) -> id == null
                ? cb.conjunction()
                : cb.equal(root.get("id"), id);
    }

    public static Specification<WebhookEntity> hasApplicationId(UUID applicationId) {
        return (root, query, cb) -> applicationId == null
                ? cb.conjunction()
                : cb.equal(root.get("application").get("id"), applicationId);
    }

    public static Specification<WebhookEntity> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> isActive == null
                ? cb.conjunction()
                : cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<WebhookEntity> hasEndpointUrl(String endpointUrl) {
        return (root, query, cb) -> endpointUrl == null
                ? cb.conjunction()
                : cb.equal(root.get("endpointUrl"), endpointUrl);
    }

    public static Specification<WebhookEntity> hasTriggerEvents(String[] triggerEvents) {
        return (root, query, cb) -> triggerEvents == null
                ? cb.conjunction()
                : cb.isTrue(root.get("triggerEvents").in((Object[]) triggerEvents));
    }

    public static Specification<WebhookEntity> hasMinSeverity(String minSeverity) {
        return (root, query, cb) -> minSeverity == null
                ? cb.conjunction()
                : cb.equal(root.get("minSeverity"), minSeverity);
    }

    public static Specification<WebhookEntity> createdFrom(Instant createdFrom) {
        return (root, query, cb) -> createdFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom);
    }

    public static Specification<WebhookEntity> createdTo(Instant createdTo) {
        return (root, query, cb) -> createdTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("createdAt"), createdTo);
    }

    public static Specification<WebhookEntity> updatedFrom(Instant updatedFrom) {
        return (root, query, cb) -> updatedFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("updatedAt"), updatedFrom);
    }

    public static Specification<WebhookEntity> updatedTo(Instant updatedTo) {
        return (root, query, cb) -> updatedTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("updatedAt"), updatedTo);
    }
}

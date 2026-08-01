package com.audit.tracevault.infrastructure.adapters.out.persistence.specification;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AuditLogEntity;

public class AuditLogSpecification {
    private AuditLogSpecification() {
    }

    public static Specification<AuditLogEntity> search(String search) {
        return (root, query, cb) -> search == null || search.isBlank()
                ? cb.conjunction()
                : cb.or(
                        cb.like(cb.lower(root.get("actorId")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("actorName")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("actorIp")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("actorUserAgent")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("resourceType")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("resourceId")), "%" + search.toLowerCase() + "%"));
    }

    public static Specification<AuditLogEntity> hasId(UUID id) {
        return (root, query, cb) -> id == null
                ? cb.conjunction()
                : cb.equal(root.get("id"), id);
    }

    public static Specification<AuditLogEntity> hasApplicationId(UUID applicationId) {
        return (root, query, cb) -> applicationId == null
                ? cb.conjunction()
                : cb.equal(root.get("application").get("id"), applicationId);
    }

    public static Specification<AuditLogEntity> hasActorId(String actorId) {
        return (root, query, cb) -> actorId == null || actorId.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("actorId")), actorId.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasResourceType(String resourceType) {
        return (root, query, cb) -> resourceType == null || resourceType.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("resourceType")), resourceType.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasResourceId(String resourceId) {
        return (root, query, cb) -> resourceId == null || resourceId.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("resourceId")), resourceId.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasActorName(String actorName) {
        return (root, query, cb) -> actorName == null || actorName.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("actorName")), actorName.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasActorIp(String actorIp) {
        return (root, query, cb) -> actorIp == null || actorIp.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("actorIp")), actorIp.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasActorUserAgent(String actorUserAgent) {
        return (root, query, cb) -> actorUserAgent == null || actorUserAgent.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("actorUserAgent")), actorUserAgent.toLowerCase());
    }

    public static Specification<AuditLogEntity> hasAction(ActionEnum action) {
        return (root, query, cb) -> action == null
                ? cb.conjunction()
                : cb.equal(root.get("action"), action);
    }

    public static Specification<AuditLogEntity> createdFrom(Instant createdFrom) {
        return (root, query, cb) -> createdFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom);
    }

    public static Specification<AuditLogEntity> createdTo(Instant createdTo) {
        return (root, query, cb) -> createdTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("createdAt"), createdTo);
    }

    public static Specification<AuditLogEntity> occurredFrom(Instant occurredFrom) {
        return (root, query, cb) -> occurredFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("occurredAt"), occurredFrom);
    }

    public static Specification<AuditLogEntity> occurredTo(Instant occurredTo) {
        return (root, query, cb) -> occurredTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("occurredAt"), occurredTo);
    }
}

package com.audit.tracevault.infrastructure.adapters.out.persistence.specification;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.ApplicationEntity;

public final class ApplicationSpecification {
    private ApplicationSpecification() {
    }

    public static Specification<ApplicationEntity> hasId(UUID id) {
        return (root, query, cb) -> id == null
                ? cb.conjunction()
                : cb.equal(root.get("id"), id);
    }

    public static Specification<ApplicationEntity> search(String search) {
        return (root, query, cb) -> search == null || search.isBlank()
                ? cb.conjunction()
                : cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%"));
    }

    public static Specification<ApplicationEntity> hasName(String name) {
        return (root, query, cb) -> name == null || name.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("name")), name.toLowerCase());
    }

    public static Specification<ApplicationEntity> hasDescription(String description) {
        return (root, query, cb) -> description == null || description.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("description")), description.toLowerCase());
    }

    public static Specification<ApplicationEntity> hasStatusIn(Iterable<String> status) {
        return (root, query, cb) -> status == null
                ? cb.conjunction()
                : root.get("status").in(status);
    }

    public static Specification<ApplicationEntity> createdFrom(Instant createdFrom) {
        return (root, query, cb) -> createdFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom);
    }

    public static Specification<ApplicationEntity> createdTo(Instant createdTo) {
        return (root, query, cb) -> createdTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("createdAt"), createdTo);
    }

    public static Specification<ApplicationEntity> updatedFrom(Instant updatedFrom) {
        return (root, query, cb) -> updatedFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("updatedAt"), updatedFrom);
    }

    public static Specification<ApplicationEntity> updatedTo(Instant updatedTo) {
        return (root, query, cb) -> updatedTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("updatedAt"), updatedTo);
    }
}

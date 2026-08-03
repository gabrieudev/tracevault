package com.audit.tracevault.infrastructure.adapters.out.persistence.specification;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.infrastructure.adapters.out.persistence.entity.AlertRulesEntity;

public class AlertRulesSpecification {
    private AlertRulesSpecification() {
    }

    public static Specification<AlertRulesEntity> search(String search) {
        return (root, query, cb) -> search == null || search.isBlank()
                ? cb.conjunction()
                : cb.or(
                        cb.like(cb.lower(root.get("triggerEvents").as(String.class)), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("messageTemplate")), "%" + search.toLowerCase() + "%")
                    );
    }

    public static Specification<AlertRulesEntity> hasId(UUID id) {
        return (root, query, cb) -> id == null
                ? cb.conjunction()
                : cb.equal(root.get("id"), id);
    }

    public static Specification<AlertRulesEntity> hasApplicationId(UUID applicationId) {
        return (root, query, cb) -> applicationId == null
                ? cb.conjunction()
                : cb.equal(root.get("application").get("id"), applicationId);
    }

    public static Specification<AlertRulesEntity> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> isActive == null
                ? cb.conjunction()
                : cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<AlertRulesEntity> hasTriggerEvents(String[] triggerEvents) {
        return (root, query, cb) -> triggerEvents == null
                ? cb.conjunction()
                : cb.isTrue(root.get("triggerEvents").in((Object[]) triggerEvents));
    }

    public static Specification<AlertRulesEntity> hasMinSeverity(String minSeverity) {
        return (root, query, cb) -> minSeverity == null
                ? cb.conjunction()
                : cb.equal(root.get("minSeverity"), minSeverity);
    }

    public static Specification<AlertRulesEntity> hasMessageTemplate(String messageTemplate) {
        return (root, query, cb) -> messageTemplate == null || messageTemplate.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("messageTemplate")), "%" + messageTemplate.toLowerCase() + "%");
    }

    public static Specification<AlertRulesEntity> hasChannelType(ChannelTypeEnum channelType) {
        return (root, query, cb) -> channelType == null
                ? cb.conjunction()
                : cb.equal(root.get("channelType"), channelType);
    }

    public static Specification<AlertRulesEntity> createdFrom(Instant createdFrom) {
        return (root, query, cb) -> createdFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom);
    }

    public static Specification<AlertRulesEntity> createdTo(Instant createdTo) {
        return (root, query, cb) -> createdTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("createdAt"), createdTo);
    }

    public static Specification<AlertRulesEntity> updatedFrom(Instant updatedFrom) {
        return (root, query, cb) -> updatedFrom == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("updatedAt"), updatedFrom);
    }

    public static Specification<AlertRulesEntity> updatedTo(Instant updatedTo) {
        return (root, query, cb) -> updatedTo == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("updatedAt"), updatedTo);
    }
}

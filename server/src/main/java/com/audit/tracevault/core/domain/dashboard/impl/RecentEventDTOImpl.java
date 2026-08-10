package com.audit.tracevault.core.domain.dashboard.impl;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;

public class RecentEventDTOImpl implements RecentEventDTO {
    private final UUID id;
    private final ActionEnum action;
    private final String resourceType;
    private final String resourceId;
    private final String actorName;
    private final SeverityEnum severity;
    private final Instant occurredAt;

    public RecentEventDTOImpl(UUID id, ActionEnum action, String resourceType, String resourceId,
            String actorName, SeverityEnum severity, Instant occurredAt) {
        this.id = id;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.actorName = actorName;
        this.severity = severity;
        this.occurredAt = occurredAt;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public ActionEnum getAction() {
        return action;
    }

    @Override
    public String getResourceType() {
        return resourceType;
    }

    @Override
    public String getResourceId() {
        return resourceId;
    }

    @Override
    public String getActorName() {
        return actorName;
    }

    @Override
    public SeverityEnum getSeverity() {
        return severity;
    }

    @Override
    public Instant getOccurredAt() {
        return occurredAt;
    }
}
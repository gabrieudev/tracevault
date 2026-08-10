package com.audit.tracevault.core.domain.dashboard.interfaces;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

public interface RecentEventDTO {
    UUID getId();
    ActionEnum getAction();
    String getResourceType();
    String getResourceId();
    String getActorName();
    SeverityEnum getSeverity();
    Instant getOccurredAt();
}
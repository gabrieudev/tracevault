package com.audit.tracevault.infrastructure.adapters.out.kafka.model;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogEvent {
    private UUID id;
    private UUID applicationId;
    private ActionEnum action;
    private SeverityEnum severity;
    private String actorId;
    private String actorName;
    private String actorIp;
    private String resourceType;
    private String resourceId;
    private Instant occurredAt;
    private Instant createdAt;
    private Map<String, Object> metadata;
}
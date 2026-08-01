package com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponseDTO {
    private UUID id;
    private ApplicationResponseDTO application;
    private String actorId;
    private String actorName;
    private String actorIp;
    private String actorUserAgent;
    private ActionEnum action;
    private String resourceType;
    private String resourceId;
    private Map<String, Object> oldValues;
    private Map<String, Object> newValues;
    private Map<String, Object> metadata;
    private SeverityEnum severity;
    private Instant occurredAt;
    private Instant createdAt;
}

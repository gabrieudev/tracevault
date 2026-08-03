package com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogInputQueryDTO {
    private String search;
    private UUID id;
    private UUID applicationId;
    private String actorId;
    private String actorName;
    private String actorIp;
    private String actorUserAgent;
    private ActionEnum action;
    private String resourceType;
    private String resourceId;
    private SeverityEnum severity;
    private Instant occurredAtFrom;
    private Instant occurredAtTo;
    private Instant createdFrom;
    private Instant createdTo;
    private Pageable pageable;
}

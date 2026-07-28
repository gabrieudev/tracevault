package com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog;

import java.time.Instant;
import java.util.Map;

import org.hibernate.validator.constraints.IpAddress;

import com.audit.tracevault.core.domain.AuditLogActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequestDTO {
    @NotNull(message = "Application is required")
    private ApplicationResponseDTO application;
    @NotNull(message = "Actor ID is required")
    @NotBlank(message = "Actor ID cannot be blank")
    private String actorId;
    private String actorName;
    @IpAddress(message = "Actor IP must be a valid IP address")
    private String actorIp;
    private String actorUserAgent;
    @NotNull(message = "Action is required")
    private AuditLogActionEnum action;
    @NotNull(message = "Resource type is required")
    @NotBlank(message = "Resource type cannot be blank")
    private String resourceType;
    @NotNull(message = "Resource ID is required")
    @NotBlank(message = "Resource ID cannot be blank")
    private String resourceId;
    private Map<String, Object> oldValues;
    private Map<String, Object> newValues;
    private Map<String, Object> metadata;
    @NotNull(message = "Severity is required")
    private SeverityEnum severity;
    @NotNull(message = "Occurred at is required")
    private Instant occurredAt;
}

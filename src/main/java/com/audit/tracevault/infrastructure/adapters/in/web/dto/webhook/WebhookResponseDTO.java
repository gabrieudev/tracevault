package com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.SeverityEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebhookResponseDTO {
    private UUID id;
    private Application application;
    private String endpointUrl;
    private String[] triggerEvents;
    private SeverityEnum minSeverity;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}

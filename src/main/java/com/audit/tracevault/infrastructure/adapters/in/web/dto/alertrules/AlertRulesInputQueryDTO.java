package com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertRulesInputQueryDTO {
    private UUID id;
    private String search;
    private UUID applicationId;
    private String endpointUrl;
    private String[] triggerEvents;
    private String minSeverity;
    private Boolean isActive;
    private Instant createdFrom;
    private Instant createdTo;
    private Instant updatedFrom;
    private Instant updatedTo;
    private Pageable pageable;
}

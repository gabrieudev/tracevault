package com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertRulesResponseDTO {
    private UUID id;
    private Application application;
    private String[] triggerEvents;
    private SeverityEnum minSeverity;
    private ChannelTypeEnum channelType;
    private Map<String, Object> channelConfig;
    private String messageTemplate;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}

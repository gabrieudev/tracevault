package com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules;

import java.util.Map;

import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertRulesRequestDTO {
    @NotNull(message = "Application cannot be null")
    private ApplicationResponseDTO application;
    @NotNull(message = "Trigger events cannot be null")
    private String[] triggerEvents;
    @NotNull(message = "Minimum severity cannot be null")
    private SeverityEnum minSeverity;
    @NotNull(message = "Channel type cannot be null")
    private ChannelTypeEnum channelType;
    @NotNull(message = "Channel config cannot be null")
    private Map<String, Object> channelConfig;
    private String messageTemplate;
}

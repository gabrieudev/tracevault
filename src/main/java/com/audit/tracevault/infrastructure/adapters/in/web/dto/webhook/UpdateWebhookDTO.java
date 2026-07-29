package com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook;

import com.audit.tracevault.core.domain.SeverityEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateWebhookDTO {
    private String endpointUrl;
    private String[] triggerEvents;
    private SeverityEnum minSeverity;
    private Boolean isActive;
}

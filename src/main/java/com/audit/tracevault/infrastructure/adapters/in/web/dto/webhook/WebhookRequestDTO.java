package com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook;

import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebhookRequestDTO {
    @NotNull(message = "Application cannot be null")
    private ApplicationResponseDTO application;
    @NotNull(message = "Endpoint URL cannot be null")
    @NotBlank(message = "Endpoint URL cannot be blank")
    private String endpointUrl;
    @NotNull(message = "Trigger events cannot be null")
    private String[] triggerEvents;
    @NotNull(message = "Minimum severity cannot be null")
    private SeverityEnum minSeverity;
}

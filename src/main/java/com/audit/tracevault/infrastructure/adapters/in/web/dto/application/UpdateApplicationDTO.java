package com.audit.tracevault.infrastructure.adapters.in.web.dto.application;

import com.audit.tracevault.core.domain.ApplicationStatusEnum;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateApplicationDTO {
    private String name;
    private String description;
    @NotNull(message = "Status cannot be null")
    private ApplicationStatusEnum status;
}

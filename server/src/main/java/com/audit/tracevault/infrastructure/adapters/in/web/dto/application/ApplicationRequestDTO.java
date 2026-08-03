package com.audit.tracevault.infrastructure.adapters.in.web.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationRequestDTO {
    @NotNull(message = "Name is required")
    @NotBlank(message = "Name cannot be blank")
    private String name;

    private String description;
}

package com.audit.tracevault.infrastructure.adapters.in.web.dto.application;

import java.time.Instant;
import java.util.UUID;

import com.audit.tracevault.core.domain.ApplicationStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponseDTO {
    private UUID id;
    private String name;
    private String description;
    private String apiKeyHash;
    private ApplicationStatusEnum status;
    private Instant createdAt;
    private Instant updatedAt;
}

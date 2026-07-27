package com.audit.tracevault.infrastructure.adapters.in.web.dto.application;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.audit.tracevault.core.domain.ApplicationStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationQueryInputDTO {
    private UUID id;
    private String search;
    private String name;
    private String description;
    private List<ApplicationStatusEnum> status;
    private Instant createdFrom;
    private Instant createdTo;
    private Instant updatedFrom;
    private Instant updatedTo;
    private Pageable pageable;
}

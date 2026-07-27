package com.audit.tracevault.infrastructure.adapters.in.web.dto.application;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlainKeyResponseDTO {
    private UUID id;
    private String plainKey;
}

package com.audit.tracevault.infrastructure.adapters.in.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.ports.in.ApplicationQueryInput;
import com.audit.tracevault.core.ports.in.ApplicationUseCase;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationPlainKeyResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.ApplicationWebMapper;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/applications")
public class ApplicationController {
    private final ApplicationUseCase applicationUseCase;
    private final ApplicationWebMapper applicationWebMapper;

    public ApplicationController(ApplicationUseCase applicationUseCase, ApplicationWebMapper applicationWebMapper) {
        this.applicationUseCase = applicationUseCase;
        this.applicationWebMapper = applicationWebMapper;
    }

    @GetMapping()
    public ResponseEntity<PageResponse<ApplicationResponseDTO>> getAll(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) List<ApplicationStatusEnum> status,
            @RequestParam(required = false) String createdFrom,
            @RequestParam(required = false) String createdTo,
            @RequestParam(required = false) String updatedFrom,
            @RequestParam(required = false) String updatedTo,
            Pageable pageable) {
        UUID uuid = id != null ? UUID.fromString(id) : null;

        ApplicationQueryInput input = applicationWebMapper.toInput(uuid, search, name, description,
                status, createdFrom, createdTo,
                updatedFrom, updatedTo, pageable);

        PageResult<Application> pageResult = applicationUseCase.findAll(input);

        return ResponseEntity.status(200).body(applicationWebMapper.toPageResponse(pageResult));
    }

    @PostMapping()
    public ResponseEntity<ApplicationPlainKeyResponseDTO> create(@RequestBody ApplicationRequestDTO requestDTO) {
        Application application = applicationWebMapper.toDomain(requestDTO);
        String plainKey = applicationUseCase.create(application);

        return ResponseEntity.status(201).body(new ApplicationPlainKeyResponseDTO(plainKey));
    }
    
}

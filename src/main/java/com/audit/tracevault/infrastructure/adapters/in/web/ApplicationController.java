package com.audit.tracevault.infrastructure.adapters.in.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.ports.in.ApplicationQueryInput;
import com.audit.tracevault.core.ports.in.ApplicationUseCase;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.ApplicationWebMapper;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
            @RequestParam String id,
            @RequestParam String search,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam List<ApplicationStatusEnum> status,
            @RequestParam String createdFrom,
            @RequestParam String createdTo,
            @RequestParam String updatedFrom,
            @RequestParam String updatedTo,
            Pageable pageable) {
        ApplicationQueryInput input = applicationWebMapper.toInput(UUID.fromString(id), search, name, description,
                status, createdFrom, createdTo,
                updatedFrom, updatedTo, pageable);

        PageResult<Application> pageResult = applicationUseCase.findAll(input);

        return ResponseEntity.ok(applicationWebMapper.toPageResponse(pageResult));
    }

}

package com.audit.tracevault.infrastructure.adapters.in.web;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.domain.AuditLogActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;
import com.audit.tracevault.core.ports.in.AuditLogInputQuery;
import com.audit.tracevault.core.ports.in.AuditLogUseCase;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog.AuditLogRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.auditlog.AuditLogResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.AuditLogWebMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@Tag(name = "Audit Logs", description = """
        Endpoints responsible for managing audit logs. Audit logs are immutable records that capture user actions, system events and resource changes. Logs can be created by authenticated client applications using their API Key and later queried for auditing purposes.
        """)
@RestController
@RequestMapping("/audit-logs")
public class AuditLogController {

    private final AuditLogUseCase auditLogUseCase;
    private final AuditLogWebMapper auditLogWebMapper;

    public AuditLogController(
            AuditLogUseCase auditLogUseCase,
            AuditLogWebMapper auditLogWebMapper) {

        this.auditLogUseCase = auditLogUseCase;
        this.auditLogWebMapper = auditLogWebMapper;
    }

    @Operation(summary = "Create audit log", description = """
            Creates a new immutable audit log.

            Authentication is performed using the X-API-Key header.

            The generated audit log cannot be modified or deleted.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Audit log created successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid API Key", content = @Content),
            @ApiResponse(responseCode = "422", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping
    public ResponseEntity<AuditLogResponseDTO> create(

            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = """
                    Audit log information.

                    The request body contains all information describing
                    the audited event.
                    """) @RequestBody @Valid AuditLogRequestDTO auditLogRequestDTO,

            @Parameter(name = "X-API-Key", description = "Application API Key used for authentication.", required = true, example = "tv_live_8N4mVq2P7eQzX...") @RequestHeader("X-API-Key") String apiKey) {

        AuditLog createdAuditLog = auditLogUseCase.create(
                apiKey,
                auditLogWebMapper.toDomain(auditLogRequestDTO));

        return ResponseEntity
                .status(201)
                .body(auditLogWebMapper.toResponseDTO(createdAuditLog));
    }

    @Operation(summary = "Get audit log by ID", description = """
            Retrieves a single audit log using its unique identifier.

            Audit logs are immutable and represent historical events.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Audit log found"),
            @ApiResponse(responseCode = "404", description = "Audit log not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid identifier", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponseDTO> getById(

            @Parameter(description = "Audit Log UUID.", example = "8c2c0930-74d7-4d48-9f2f-f25f1df37d1c") @PathVariable String id) {

        UUID uuid = id != null ? UUID.fromString(id) : null;

        AuditLog auditLog = auditLogUseCase.findById(uuid);

        return ResponseEntity
                .status(200)
                .body(auditLogWebMapper.toResponseDTO(auditLog));
    }

    @Operation(summary = "Search audit logs", description = """
            Returns a paginated list of audit logs.

            All filters are optional and may be combined to narrow the
            search results.

            The 'search' parameter performs a full-text search across
            multiple indexed fields.

            Results support pagination and sorting using Spring Data
            Pageable parameters.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid query parameters", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    public ResponseEntity<PageResponse<AuditLogResponseDTO>> getAll(

            @Parameter(description = "Full-text search across indexed fields.", example = "payment", in = ParameterIn.QUERY) @RequestParam(required = false) String search,

            @Parameter(description = "Audit Log UUID.", example = "8c2c0930-74d7-4d48-9f2f-f25f1df37d1c", in = ParameterIn.QUERY) @RequestParam(required = false) String id,

            @Parameter(description = "Application UUID.", example = "91dc09c2-fec7-432d-bad9-f0a8bd0cb0c1", in = ParameterIn.QUERY) @RequestParam(required = false) String applicationId,

            @Parameter(description = "Identifier of the actor who performed the action.", example = "user-123", in = ParameterIn.QUERY) @RequestParam(required = false) String actorId,

            @Parameter(description = "Actor display name.", example = "John Doe", in = ParameterIn.QUERY) @RequestParam(required = false) String actorName,

            @Parameter(description = "Actor IP address.", example = "192.168.1.100", in = ParameterIn.QUERY) @RequestParam(required = false) String actorIp,

            @Parameter(description = "Actor User-Agent header.", example = "Mozilla/5.0", in = ParameterIn.QUERY) @RequestParam(required = false) String actorUserAgent,

            @Parameter(description = "Audit action performed.", example = "CREATE", in = ParameterIn.QUERY) @RequestParam(required = false) AuditLogActionEnum action,

            @Parameter(description = "Affected resource type.", example = "USER", in = ParameterIn.QUERY) @RequestParam(required = false) String resourceType,

            @Parameter(description = "Affected resource identifier.", example = "user-42", in = ParameterIn.QUERY) @RequestParam(required = false) String resourceId,

            @Parameter(description = "Audit log severity level.", example = "INFO", in = ParameterIn.QUERY) @RequestParam(required = false) SeverityEnum severity,

            @Parameter(description = "Minimum occurrence timestamp (ISO-8601).", example = "2026-01-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String occurredAtFrom,

            @Parameter(description = "Maximum occurrence timestamp (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String occurredAtTo,

            @Parameter(description = "Minimum creation timestamp (ISO-8601).", example = "2026-01-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdFrom,

            @Parameter(description = "Maximum creation timestamp (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdTo,

            @Parameter(description = """
                    Pagination parameters.

                    page = zero-based page index

                    size = number of records per page

                    sort = property,direction

                    Example:

                    page=0&size=20&sort=occurredAt,desc
                    """) Pageable pageable) {

        AuditLogInputQuery queryInput = auditLogWebMapper.toInput(
                search,
                id != null ? UUID.fromString(id) : null,
                applicationId != null ? UUID.fromString(applicationId) : null,
                actorId,
                actorName,
                actorIp,
                actorUserAgent,
                action,
                resourceType,
                resourceId,
                severity,
                occurredAtFrom != null ? Instant.parse(occurredAtFrom) : null,
                occurredAtTo != null ? Instant.parse(occurredAtTo) : null,
                createdFrom != null ? Instant.parse(createdFrom) : null,
                createdTo != null ? Instant.parse(createdTo) : null,
                pageable);

        PageResponse<AuditLogResponseDTO> response = auditLogWebMapper.toPageResponse(
                auditLogUseCase.findAll(queryInput));

        return ResponseEntity
                .status(200)
                .body(response);
    }
}
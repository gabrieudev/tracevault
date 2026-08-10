package com.audit.tracevault.infrastructure.adapters.in.web;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audit.tracevault.core.domain.AlertRules;
import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.ports.in.AlertRulesInputQuery;
import com.audit.tracevault.core.ports.in.AlertRulesUseCase;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.AlertRulesRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.AlertRulesResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.alertrules.UpdateAlertRulesDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.AlertRulesWebMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

@Tag(name = "Alert Rules", description = """
                Endpoints responsible for managing alert rules. Alert rules allow you to define conditions under which alerts are triggered. Each alert rule belongs to an application and can be configured to listen for specific event types and severity levels.
                """)
@RestController
@RequestMapping("/alert-rules")
public class AlertRulesController {

        private final AlertRulesUseCase alertRuleUseCase;
        private final AlertRulesWebMapper alertRulesWebMapper;

        public AlertRulesController(
                        AlertRulesUseCase alertRuleUseCase,
                        AlertRulesWebMapper alertRulesWebMapper) {

                this.alertRuleUseCase = alertRuleUseCase;
                this.alertRulesWebMapper = alertRulesWebMapper;
        }

        @Operation(summary = "Create alert rule", description = """
                        Creates a new alert rule.

                        Once created, the alert rule will trigger alerts
                        whenever matching audit events occur.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Alert rule created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
                        @ApiResponse(responseCode = "404", description = "Application not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PostMapping
        public ResponseEntity<AlertRulesResponseDTO> create(

                        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = """
                                        Alert rule configuration.

                                        Contains the message template, channel type,
                                        trigger events, channel configuration,
                                        severity filters and activation status.
                                        """) @RequestBody @Valid AlertRulesRequestDTO alertRulesRequestDTO) {

                var alertRule = alertRulesWebMapper.toDomain(alertRulesRequestDTO);
                var createdAlertRule = alertRuleUseCase.create(alertRule);
                var responseDTO = alertRulesWebMapper.toResponseDTO(createdAlertRule);

                return ResponseEntity.status(201).body(responseDTO);
        }

        @Operation(summary = "Get an alert rule by ID", description = """
                        Retrieves a alert rule using its unique identifier.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Alert rule found"),
                        @ApiResponse(responseCode = "404", description = "Alert rule not found", content = @Content),
                        @ApiResponse(responseCode = "400", description = "Invalid identifier", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @GetMapping("/{id}")
        public ResponseEntity<AlertRulesResponseDTO> getById(

                        @Parameter(description = "Alert rule UUID.", example = "90eb5651-0a9c-4d52-a1ea-fd7a75606c5e") @PathVariable String id) {

                UUID uuid = id != null ? UUID.fromString(id) : null;

                var alertRule = alertRuleUseCase.findById(uuid);
                var responseDTO = alertRulesWebMapper.toResponseDTO(alertRule);

                return ResponseEntity.status(200).body(responseDTO);
        }

        @Operation(summary = "Search alert rules", description = """
                        Returns a paginated list of alert rules.

                        All filters are optional and may be combined.

                        Supports pagination and sorting using Spring Data
                        pagination parameters.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Alert rules retrieved successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid query parameters", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @GetMapping
        public ResponseEntity<PageResponse<AlertRulesResponseDTO>> getAll(

                        @Parameter(description = "Alert rule UUID.", example = "90eb5651-0a9c-4d52-a1ea-fd7a75606c5e", in = ParameterIn.QUERY) @RequestParam(required = false) String id,

                        @Parameter(description = "Full-text search.", example = "payment", in = ParameterIn.QUERY) @RequestParam(required = false) String search,

                        @Parameter(description = "Application UUID.", example = "9f8de7ea-f483-4c73-86ba-1dcdb07ca5cf", in = ParameterIn.QUERY) @RequestParam(required = false) String applicationId,

                        @Parameter(description = "Alert rule message template.", example = "A new user has been created: {username}", in = ParameterIn.QUERY) @RequestParam(required = false) String messageTemplate,

                        @Parameter(description = "Alert rule channel type.", example = "EMAIL", in = ParameterIn.QUERY) @RequestParam(required = false) ChannelTypeEnum channelType,

                        @Parameter(description = "Subscribed trigger events.", example = "USER_CREATED", in = ParameterIn.QUERY) @RequestParam(required = false) String[] triggerEvents,

                        @Parameter(description = "Minimum severity level required to trigger notifications.", example = "WARNING", in = ParameterIn.QUERY) @RequestParam(required = false) String minSeverity,

                        @Parameter(description = "Whether the alert rule is active.", example = "true", in = ParameterIn.QUERY) @RequestParam(required = false) Boolean isActive,

                        @Parameter(description = "Minimum creation timestamp (ISO-8601).", example = "2026-01-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdFrom,

                        @Parameter(description = "Maximum creation timestamp (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdTo,

                        @Parameter(description = "Minimum update timestamp (ISO-8601).", example = "2026-01-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String updatedFrom,

                        @Parameter(description = "Maximum update timestamp (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String updatedTo,

                        @Parameter(description = """
                                        Zero-based page index.

                                        Optional.
                                        """, example = "0", in = ParameterIn.QUERY) @RequestParam(required = false) String page,

                        @Parameter(description = """
                                        Number of records per page.

                                        Optional.
                                        """, example = "20", in = ParameterIn.QUERY) @RequestParam(required = false) String size,

                        @Parameter(description = """
                                        Sorting criteria.

                                        Format:
                                        property,direction

                                        Example:
                                        createdAt,desc
                                        """, example = "createdAt,desc", in = ParameterIn.QUERY) @RequestParam(required = false) List<String> sort,

                        @Parameter(hidden = true) Pageable pageable) {

                AlertRulesInputQuery query = alertRulesWebMapper.toInput(
                                id != null ? UUID.fromString(id) : null,
                                search,
                                applicationId != null ? UUID.fromString(applicationId) : null,
                                messageTemplate,
                                channelType,
                                triggerEvents,
                                minSeverity,
                                isActive,
                                createdFrom != null ? Instant.parse(createdFrom) : null,
                                createdTo != null ? Instant.parse(createdTo) : null,
                                updatedFrom != null ? Instant.parse(updatedFrom) : null,
                                updatedTo != null ? Instant.parse(updatedTo) : null,
                                pageable.isPaged() ? pageable : Pageable.unpaged());

                PageResponse<AlertRulesResponseDTO> response = alertRulesWebMapper.toPageResponse(
                                alertRuleUseCase.findAll(query));

                return ResponseEntity.status(200).body(response);
        }

        @Operation(summary = "Update an alert rule", description = """
                        Updates an existing alert rule.

                        Only the provided fields will be updated.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Alert rule updated successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
                        @ApiResponse(responseCode = "404", description = "Alert rule not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PutMapping("/{id}")
        public ResponseEntity<AlertRulesResponseDTO> update(
                        @Parameter(description = "The ID of the alert rule to update") @PathVariable String id,
                        @Valid @RequestBody UpdateAlertRulesDTO updateAlertRulesDTO) {
                UUID uuid = id != null ? UUID.fromString(id) : null;

                AlertRules updatedAlertRules = alertRuleUseCase.update(
                                uuid,
                                alertRulesWebMapper.toDomain(updateAlertRulesDTO));

                return ResponseEntity
                                .status(200)
                                .body(alertRulesWebMapper.toResponseDTO(updatedAlertRules));
        }
}
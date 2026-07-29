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

import com.audit.tracevault.core.ports.in.WebhookInputQuery;
import com.audit.tracevault.core.ports.in.WebhookUseCase;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook.WebhookRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.webhook.WebhookResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.WebhookWebMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Webhooks", description = """
        Endpoints responsible for managing webhook integrations. Webhooks allow external systems to receive real-time notifications whenever configured audit events occur. Each webhook belongs to an application and can be configured to listen for specific event types and severity levels.
        """)
@RestController
@RequestMapping("/webhooks")
public class WebhookController {

    private final WebhookUseCase webhookUseCase;
    private final WebhookWebMapper webhookWebMapper;

    public WebhookController(
            WebhookUseCase webhookUseCase,
            WebhookWebMapper webhookWebMapper) {

        this.webhookUseCase = webhookUseCase;
        this.webhookWebMapper = webhookWebMapper;
    }

    @Operation(summary = "Create webhook", description = """
            Creates a new webhook subscription.

            Once created, the webhook will receive HTTP requests
            whenever matching audit events occur.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Webhook created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "404", description = "Application not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping
    public ResponseEntity<WebhookResponseDTO> create(

            @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = """
                    Webhook configuration.

                    Contains the destination URL, subscribed events,
                    severity filters and activation status.
                    """) @RequestBody @Valid WebhookRequestDTO webhookRequestDTO) {

        var webhook = webhookWebMapper.toDomain(webhookRequestDTO);
        var createdWebhook = webhookUseCase.create(webhook);
        var responseDTO = webhookWebMapper.toResponseDTO(createdWebhook);

        return ResponseEntity.status(201).body(responseDTO);
    }

    @Operation(summary = "Get webhook by ID", description = """
            Retrieves a webhook using its unique identifier.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Webhook found"),
            @ApiResponse(responseCode = "404", description = "Webhook not found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid identifier", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<WebhookResponseDTO> getById(

            @Parameter(description = "Webhook UUID.", example = "90eb5651-0a9c-4d52-a1ea-fd7a75606c5e") @PathVariable String id) {

        UUID uuid = id != null ? UUID.fromString(id) : null;

        var webhook = webhookUseCase.findById(uuid);
        var responseDTO = webhookWebMapper.toResponseDTO(webhook);

        return ResponseEntity.status(200).body(responseDTO);
    }

    @Operation(summary = "Search webhooks", description = """
            Returns a paginated list of webhooks.

            All filters are optional and may be combined.

            Supports pagination and sorting using Spring Data
            pagination parameters.
            """)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Webhooks retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid query parameters", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    public ResponseEntity<PageResponse<WebhookResponseDTO>> getAll(

            @Parameter(description = "Webhook UUID.", example = "90eb5651-0a9c-4d52-a1ea-fd7a75606c5e", in = ParameterIn.QUERY) @RequestParam(required = false) String id,

            @Parameter(description = "Full-text search.", example = "payment", in = ParameterIn.QUERY) @RequestParam(required = false) String search,

            @Parameter(description = "Application UUID.", example = "9f8de7ea-f483-4c73-86ba-1dcdb07ca5cf", in = ParameterIn.QUERY) @RequestParam(required = false) String applicationId,

            @Parameter(description = "Webhook endpoint URL.", example = "https://example.com/webhooks/audit", in = ParameterIn.QUERY) @RequestParam(required = false) String endpointUrl,

            @Parameter(description = "Subscribed trigger events.", example = "USER_CREATED", in = ParameterIn.QUERY) @RequestParam(required = false) String[] triggerEvents,

            @Parameter(description = "Minimum severity level required to trigger notifications.", example = "WARNING", in = ParameterIn.QUERY) @RequestParam(required = false) String minSeverity,

            @Parameter(description = "Whether the webhook is active.", example = "true", in = ParameterIn.QUERY) @RequestParam(required = false) Boolean isActive,

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

        WebhookInputQuery query = webhookWebMapper.toInput(
                id != null ? UUID.fromString(id) : null,
                search,
                applicationId != null ? UUID.fromString(applicationId) : null,
                endpointUrl,
                triggerEvents,
                minSeverity,
                isActive,
                createdFrom != null ? Instant.parse(createdFrom) : null,
                createdTo != null ? Instant.parse(createdTo) : null,
                updatedFrom != null ? Instant.parse(updatedFrom) : null,
                updatedTo != null ? Instant.parse(updatedTo) : null,
                pageable.isPaged() ? pageable : Pageable.unpaged());

        PageResponse<WebhookResponseDTO> response = webhookWebMapper.toPageResponse(
                webhookUseCase.findAll(query));

        return ResponseEntity.status(200).body(response);
    }
}
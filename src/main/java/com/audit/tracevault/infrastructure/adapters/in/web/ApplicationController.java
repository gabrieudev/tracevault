package com.audit.tracevault.infrastructure.adapters.in.web;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audit.tracevault.core.domain.Application;
import com.audit.tracevault.core.domain.ApplicationStatusEnum;
import com.audit.tracevault.core.ports.in.ApplicationInputQuery;
import com.audit.tracevault.core.ports.in.ApplicationUseCase;
import com.audit.tracevault.core.ports.in.CreateApplicationOutput;
import com.audit.tracevault.core.ports.in.PageResult;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.PageResponse;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationRequestDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.ApplicationResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.PlainKeyResponseDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.application.UpdateApplicationDTO;
import com.audit.tracevault.infrastructure.adapters.in.web.mapper.ApplicationWebMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@Tag(name = "Applications", description = """
                Endpoints responsible for managing the applications registered in TraceVault. Each application represents a system authorized to send audit logs to the platform. It is also responsible for managing the API Key used to authenticate requests.
                """)
@RestController
@RequestMapping("/applications")
public class ApplicationController {

        private final ApplicationUseCase applicationUseCase;
        private final ApplicationWebMapper applicationWebMapper;

        public ApplicationController(
                        ApplicationUseCase applicationUseCase,
                        ApplicationWebMapper applicationWebMapper) {

                this.applicationUseCase = applicationUseCase;
                this.applicationWebMapper = applicationWebMapper;
        }

        @Operation(summary = "List applications", description = """
                        Returns a paginated list of applications.

                        All filters are optional and can be used
                        simultaneously.

                        The 'search' parameter performs a text search across
                        multiple fields of the application.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "List returned successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid parameters", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @GetMapping
        public ResponseEntity<PageResponse<ApplicationResponseDTO>> getAll(

                        @Parameter(name = "id", description = "UUID of the application.", example = "5b3eb0f5-c1d8-44d7-9d8f-6220d52c0d12", in = ParameterIn.QUERY) @RequestParam(required = false) String id,

                        @Parameter(name = "search", description = "Text search by name and description.", example = "Payment", in = ParameterIn.QUERY) @RequestParam(required = false) String search,

                        @Parameter(name = "name", description = "Exact name of the application.", example = "Payment API", in = ParameterIn.QUERY) @RequestParam(required = false) String name,

                        @Parameter(name = "description", description = "Description of the application.", example = "API responsible for payment processing.", in = ParameterIn.QUERY) @RequestParam(required = false) String description,

                        @Parameter(name = "status", description = "Application status.", example = "ACTIVE", in = ParameterIn.QUERY) @RequestParam(required = false) List<ApplicationStatusEnum> status,

                        @Parameter(name = "createdFrom", description = "Creation start date (ISO-8601).", example = "2026-01-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdFrom,

                        @Parameter(name = "createdTo", description = "Creation end date (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String createdTo,

                        @Parameter(name = "updatedFrom", description = "Update start date (ISO-8601).", example = "2026-06-01T00:00:00Z", in = ParameterIn.QUERY) @RequestParam(required = false) String updatedFrom,

                        @Parameter(name = "updatedTo", description = "Update end date (ISO-8601).", example = "2026-12-31T23:59:59Z", in = ParameterIn.QUERY) @RequestParam(required = false) String updatedTo,

                        @Parameter(description = """
                                        Pagination information.

                                        page = page number (starts at 0)

                                        size = number of records

                                        sort = field,direction

                                        Example:

                                        page=0&size=20&sort=name,asc
                                        """) Pageable pageable) {

                UUID uuid = id != null ? UUID.fromString(id) : null;

                ApplicationInputQuery input = applicationWebMapper.toInput(
                                uuid,
                                search,
                                name,
                                description,
                                status,
                                createdFrom,
                                createdTo,
                                updatedFrom,
                                updatedTo,
                                pageable);

                PageResult<Application> pageResult = applicationUseCase.findAll(input);

                return ResponseEntity
                                .status(200)
                                .body(applicationWebMapper.toPageResponse(pageResult));
        }

        @Operation(summary = "Register application", description = """
                        Creates a new application in TraceVault.

                        During creation, a new API Key is generated automatically.

                        The plain-text key is returned only in this operation.
                        After this point it can no longer be recovered.
                        Keep it in a safe place.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Application created successfully"),
                        @ApiResponse(responseCode = "422", description = "Invalid data", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PostMapping
        public ResponseEntity<PlainKeyResponseDTO> create(

                        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = """
                                        Data required to register the application.

                                        The API Key will be generated automatically by the system.
                                        """) @RequestBody @Valid ApplicationRequestDTO requestDTO) {

                Application application = applicationWebMapper.toDomain(requestDTO);

                CreateApplicationOutput output = applicationUseCase.create(application);

                return ResponseEntity
                                .status(201)
                                .body(applicationWebMapper.toCreateResponse(output));
        }

        @Operation(summary = "Update application", description = """
                        Updates the data of an existing application.

                        Only registration information is changed.

                        The API Key remains unchanged.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Application updated successfully"),
                        @ApiResponse(responseCode = "404", description = "Application not found", content = @Content),
                        @ApiResponse(responseCode = "422", description = "Invalid request", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PutMapping("/{id}")
        public ResponseEntity<ApplicationResponseDTO> update(

                        @Parameter(description = "UUID of the application.", example = "5b3eb0f5-c1d8-44d7-9d8f-6220d52c0d12") @PathVariable String id,

                        @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = """
                                        Updated application data.

                                        Only the allowed fields will be modified.
                                        """) @RequestBody @Valid UpdateApplicationDTO entity) {

                UUID uuid = id != null ? UUID.fromString(id) : null;

                Application updatedApplication = applicationUseCase.update(
                                uuid,
                                applicationWebMapper.toDomain(entity));

                return ResponseEntity
                                .status(200)
                                .body(applicationWebMapper.toResponseDTO(updatedApplication));
        }

        @Operation(summary = "Rotate API Key", description = """
                        Generates a new API Key for an application.

                        The previous key becomes invalid immediately.

                        The new plain-text key will be displayed only in this response.
                        After that it can no longer be recovered.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "API Key rotated successfully"),
                        @ApiResponse(responseCode = "404", description = "Application not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @PostMapping("/{id}/rotate-key")
        public ResponseEntity<PlainKeyResponseDTO> rotateKey(

                        @Parameter(description = "UUID of the application.", example = "5b3eb0f5-c1d8-44d7-9d8f-6220d52c0d12") @PathVariable String id) {

                UUID uuid = id != null ? UUID.fromString(id) : null;

                String newPlainKey = applicationUseCase.rotateKey(uuid);

                return ResponseEntity
                                .status(200)
                                .body(new PlainKeyResponseDTO(uuid, newPlainKey));
        }

        @Operation(summary = "Get application by ID", description = """
                        Retrieves the details of a specific application by its UUID.
                        """)
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Application retrieved successfully"),
                        @ApiResponse(responseCode = "404", description = "Application not found", content = @Content),
                        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
        })
        @GetMapping("/{id}")
        public ResponseEntity<ApplicationResponseDTO> getById(
                        @Parameter(description = "UUID of the application.", example = "5b3eb0f5-c1d8-44d7-9d8f-6220d52c0d12") @PathVariable String id) {
                UUID uuid = id != null ? UUID.fromString(id) : null;

                Application application = applicationUseCase.findById(uuid);

                return ResponseEntity
                                .status(200)
                                .body(applicationWebMapper.toResponseDTO(application));
        }
}
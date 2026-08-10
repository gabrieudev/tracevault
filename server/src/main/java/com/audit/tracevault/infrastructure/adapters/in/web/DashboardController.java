package com.audit.tracevault.infrastructure.adapters.in.web;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.audit.tracevault.core.domain.dashboard.impl.DashboardSummaryResponseDTOImpl;
import com.audit.tracevault.core.ports.in.DashboardUseCase;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Dashboard", description = """
            Endpoints responsible for providing dashboard-related data and metrics for the application.
        """)
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardUseCase dashboardUseCase;

    public DashboardController(DashboardUseCase dashboardUseCase) {
        this.dashboardUseCase = dashboardUseCase;
    }

    @Operation(summary = "Get Dashboard Summary", description = """
            Retrieves a summary of dashboard metrics and data for the specified application.
            If no applicationId is provided, it returns a summary for all applications.
            """)
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard summary"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Application not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponseDTOImpl> getSummary(
            @Parameter(description = "The ID of the application for which to retrieve the dashboard summary") @RequestParam(required = false) UUID applicationId,
            @Parameter(description = "The window of time (in minutes) for which to retrieve the audit pulse data") @RequestParam(required = false) Integer pulseWindowMinutes) {
        DashboardSummaryResponseDTOImpl summary = (DashboardSummaryResponseDTOImpl) dashboardUseCase
                .getDashboardSummary(applicationId, pulseWindowMinutes);

        return ResponseEntity.status(200).body(summary);
    }
}

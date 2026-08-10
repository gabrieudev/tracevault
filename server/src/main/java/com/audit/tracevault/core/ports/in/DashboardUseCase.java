package com.audit.tracevault.core.ports.in;

import java.util.UUID;

import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardSummaryResponseDTO;

public interface DashboardUseCase {
    DashboardSummaryResponseDTO getDashboardSummary(UUID applicationId, Integer pulseWindowMinutes);
}

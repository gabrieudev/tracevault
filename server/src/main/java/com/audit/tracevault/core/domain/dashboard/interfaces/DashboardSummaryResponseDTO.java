package com.audit.tracevault.core.domain.dashboard.interfaces;

import java.time.Instant;

public interface DashboardSummaryResponseDTO {
    AuditPulseDTO getAuditPulse();
    DashboardStatsDTO getStats();
    ApplicationVolumeDTO[] getApplicationsVolume();
    RecentEventDTO[] getRecentEvents();
    Instant getLastLogTimestamp();
}
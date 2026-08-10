package com.audit.tracevault.core.domain.dashboard.interfaces;

public interface DashboardSummaryResponseDTO {
    AuditPulseDTO getAuditPulse();
    DashboardStatsDTO getStats();
    ApplicationVolumeDTO[] getApplicationsVolume();
    RecentEventDTO[] getRecentEvents();
}
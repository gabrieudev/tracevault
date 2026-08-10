package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardStatsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardSummaryResponseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;

public class DashboardSummaryResponseDTOImpl implements DashboardSummaryResponseDTO {
    private final AuditPulseDTO auditPulse;
    private final DashboardStatsDTO stats;
    private final ApplicationVolumeDTO[] applicationsVolume;
    private final RecentEventDTO[] recentEvents;

    public DashboardSummaryResponseDTOImpl(AuditPulseDTO auditPulse, DashboardStatsDTO stats,
            ApplicationVolumeDTO[] applicationsVolume, RecentEventDTO[] recentEvents) {
        this.auditPulse = auditPulse;
        this.stats = stats;
        this.applicationsVolume = applicationsVolume;
        this.recentEvents = recentEvents;
    }

    @Override
    public AuditPulseDTO getAuditPulse() {
        return auditPulse;
    }

    @Override
    public DashboardStatsDTO getStats() {
        return stats;
    }

    @Override
    public ApplicationVolumeDTO[] getApplicationsVolume() {
        return applicationsVolume;
    }

    @Override
    public RecentEventDTO[] getRecentEvents() {
        return recentEvents;
    }
}
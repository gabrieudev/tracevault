package com.audit.tracevault.core.domain.dashboard.impl;

import java.time.Instant;

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
    private final Instant lastLogTimestamp;

    public DashboardSummaryResponseDTOImpl(AuditPulseDTO auditPulse, DashboardStatsDTO stats,
            ApplicationVolumeDTO[] applicationsVolume, RecentEventDTO[] recentEvents, Instant lastLogTimestamp) {
        this.auditPulse = auditPulse;
        this.stats = stats;
        this.applicationsVolume = applicationsVolume;
        this.recentEvents = recentEvents;
        this.lastLogTimestamp = lastLogTimestamp;
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

    @Override
    public Instant getLastLogTimestamp() {
        return lastLogTimestamp;
    }
}
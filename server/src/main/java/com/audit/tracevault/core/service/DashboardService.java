package com.audit.tracevault.core.service;

import java.util.List;
import java.util.UUID;

import com.audit.tracevault.core.domain.dashboard.impl.DashboardStatsDTOImpl;
import com.audit.tracevault.core.domain.dashboard.impl.DashboardSummaryResponseDTOImpl;
import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardStatsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardSummaryResponseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;
import com.audit.tracevault.core.ports.in.DashboardUseCase;
import com.audit.tracevault.core.ports.out.DashboardRepositoryPort;

public class DashboardService implements DashboardUseCase {
    private final DashboardRepositoryPort dashboardRepositoryPort;

    public DashboardService(DashboardRepositoryPort dashboardRepositoryPort) {
        this.dashboardRepositoryPort = dashboardRepositoryPort;
    }

    @Override
    public DashboardSummaryResponseDTO getDashboardSummary(UUID applicationId, Integer pulseWindowMinutes) {
        int windowMinutes = pulseWindowMinutes != null ? pulseWindowMinutes : 1440;
        int recentEventsLimit = 10;

        AuditPulseDTO auditPulse = dashboardRepositoryPort.getAuditPulse(applicationId, windowMinutes);

        StatMetricDTO eventsToday = dashboardRepositoryPort.getEventsToday(applicationId);
        ActiveApplicationsDTO activeApplications = dashboardRepositoryPort.getActiveApplications(applicationId);
        StatMetricDTO criticalAlerts24h = dashboardRepositoryPort.getCriticalAlerts24h(applicationId, windowMinutes);
        StatMetricDTO loginFailures24h = dashboardRepositoryPort.getLoginFailures24h(applicationId, windowMinutes);

        DashboardStatsDTO stats = new DashboardStatsDTOImpl(
                eventsToday,
                activeApplications,
                criticalAlerts24h,
                loginFailures24h
        );

        List<ApplicationVolumeDTO> volumeList = dashboardRepositoryPort.getApplicationsVolume(applicationId);
        ApplicationVolumeDTO[] applicationsVolume = volumeList.toArray(new ApplicationVolumeDTO[0]);

        List<RecentEventDTO> eventsList = dashboardRepositoryPort.getRecentEvents(applicationId, recentEventsLimit);
        RecentEventDTO[] recentEvents = eventsList.toArray(new RecentEventDTO[0]);

        return new DashboardSummaryResponseDTOImpl(
                auditPulse,
                stats,
                applicationsVolume,
                recentEvents
        );
    }
}
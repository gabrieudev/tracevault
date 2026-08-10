package com.audit.tracevault.infrastructure.adapters.out.persistence;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;
import com.audit.tracevault.core.ports.out.DashboardRepositoryPort;
import com.audit.tracevault.infrastructure.adapters.out.persistence.repository.SpringDataDashboardRepository;

@Component
public class DashboardPersistenceAdapter implements DashboardRepositoryPort {
    private final SpringDataDashboardRepository dashboardRepository;

    public DashboardPersistenceAdapter(SpringDataDashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @Override
    public ActiveApplicationsDTO getActiveApplications(UUID applicationId) {
        return dashboardRepository.getActiveApplications(applicationId);
    }

    @Override
    public List<ApplicationVolumeDTO> getApplicationsVolume(UUID applicationId) {
        return dashboardRepository.getApplicationsVolume(applicationId);
    }

    @Override
    public AuditPulseDTO getAuditPulse(UUID applicationId, int pulseWindowMinutes) {
        return dashboardRepository.getAuditPulse(applicationId, pulseWindowMinutes);
    }

    @Override
    public StatMetricDTO getCriticalAlerts24h(UUID applicationId, int pulseWindowMinutes) {
        return dashboardRepository.getCriticalAlerts24h(applicationId, pulseWindowMinutes);
    }

    @Override
    public StatMetricDTO getEventsToday(UUID applicationId) {
        return dashboardRepository.getEventsToday(applicationId);
    }

    @Override
    public StatMetricDTO getLoginFailures24h(UUID applicationId, int pulseWindowMinutes) {
        return dashboardRepository.getLoginFailures24h(applicationId, pulseWindowMinutes);
    }

    @Override
    public List<RecentEventDTO> getRecentEvents(UUID applicationId, int limit) {
        return dashboardRepository.getRecentEvents(applicationId, limit);
    }

}

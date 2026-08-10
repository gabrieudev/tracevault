package com.audit.tracevault.core.ports.out;

import java.util.List;
import java.util.UUID;

import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.RecentEventDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;

public interface DashboardRepositoryPort {
    List<ApplicationVolumeDTO> getApplicationsVolume(UUID applicationId);

    List<RecentEventDTO> getRecentEvents(UUID applicationId, int limit);

    ActiveApplicationsDTO getActiveApplications(UUID applicationId);

    StatMetricDTO getEventsToday(UUID applicationId);

    StatMetricDTO getCriticalAlerts24h(UUID applicationId, int pulseWindowMinutes);

    StatMetricDTO getLoginFailures24h(UUID applicationId, int pulseWindowMinutes);

    AuditPulseDTO getAuditPulse(UUID applicationId, int pulseWindowMinutes);
}
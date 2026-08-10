package com.audit.tracevault.core.domain.dashboard.interfaces;

public interface DashboardStatsDTO {
    StatMetricDTO getEventsToday();
    ActiveApplicationsDTO getActiveApplications();
    StatMetricDTO getCriticalAlerts24h();
    StatMetricDTO getLoginFailures24h();
}
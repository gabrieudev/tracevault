package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardStatsDTO;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;

public class DashboardStatsDTOImpl implements DashboardStatsDTO {
    private final StatMetricDTO eventsToday;
    private final ActiveApplicationsDTO activeApplications;
    private final StatMetricDTO criticalAlerts24h;
    private final StatMetricDTO loginFailures24h;

    public DashboardStatsDTOImpl(StatMetricDTO eventsToday, ActiveApplicationsDTO activeApplications,
            StatMetricDTO criticalAlerts24h, StatMetricDTO loginFailures24h) {
        this.eventsToday = eventsToday;
        this.activeApplications = activeApplications;
        this.criticalAlerts24h = criticalAlerts24h;
        this.loginFailures24h = loginFailures24h;
    }

    @Override
    public StatMetricDTO getEventsToday() {
        return eventsToday;
    }

    @Override
    public ActiveApplicationsDTO getActiveApplications() {
        return activeApplications;
    }

    @Override
    public StatMetricDTO getCriticalAlerts24h() {
        return criticalAlerts24h;
    }

    @Override
    public StatMetricDTO getLoginFailures24h() {
        return loginFailures24h;
    }
}
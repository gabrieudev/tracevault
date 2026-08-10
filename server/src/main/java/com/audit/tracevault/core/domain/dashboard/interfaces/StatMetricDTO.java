package com.audit.tracevault.core.domain.dashboard.interfaces;

public interface StatMetricDTO {
    Integer getValue();
    String getDelta();
    DashboardTrendEnum getTrend();
}
package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.DashboardTrendEnum;
import com.audit.tracevault.core.domain.dashboard.interfaces.StatMetricDTO;

public class StatMetricDTOImpl implements StatMetricDTO {
    private final Integer value;
    private final String delta;
    private final DashboardTrendEnum trend;

    public StatMetricDTOImpl(Integer value, String delta, DashboardTrendEnum trend) {
        this.value = value;
        this.delta = delta;
        this.trend = trend;
    }

    @Override
    public Integer getValue() {
        return value;
    }

    @Override
    public String getDelta() {
        return delta;
    }

    @Override
    public DashboardTrendEnum getTrend() {
        return trend;
    }
}
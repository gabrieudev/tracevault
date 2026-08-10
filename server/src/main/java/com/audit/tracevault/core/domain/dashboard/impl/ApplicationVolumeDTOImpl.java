package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.ApplicationVolumeDTO;

public class ApplicationVolumeDTOImpl implements ApplicationVolumeDTO {
    private final String name;
    private final Integer eventsCount;
    private final Integer percentage;

    public ApplicationVolumeDTOImpl(String name, Integer eventsCount, Integer percentage) {
        this.name = name;
        this.eventsCount = eventsCount;
        this.percentage = percentage;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Integer getEventsCount() {
        return eventsCount;
    }

    @Override
    public Integer getPercentage() {
        return percentage;
    }
}
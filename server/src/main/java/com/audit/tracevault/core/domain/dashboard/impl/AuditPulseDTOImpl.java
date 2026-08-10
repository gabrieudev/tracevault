package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.AuditPulseDTO;

public class AuditPulseDTOImpl implements AuditPulseDTO {
    private final String[] timestamps;
    private final Integer[] data;

    public AuditPulseDTOImpl(String[] timestamps, Integer[] data) {
        this.timestamps = timestamps;
        this.data = data;
    }

    @Override
    public String[] getTimestamps() {
        return timestamps;
    }

    @Override
    public Integer[] getData() {
        return data;
    }
}
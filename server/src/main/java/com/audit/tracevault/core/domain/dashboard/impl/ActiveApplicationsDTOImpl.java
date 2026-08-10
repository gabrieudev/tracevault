package com.audit.tracevault.core.domain.dashboard.impl;

import com.audit.tracevault.core.domain.dashboard.interfaces.ActiveApplicationsDTO;

public class ActiveApplicationsDTOImpl implements ActiveApplicationsDTO {
    private final Integer active;
    private final Integer total;

    public ActiveApplicationsDTOImpl(Integer active, Integer total) {
        this.active = active;
        this.total = total;
    }

    @Override
    public Integer getActive() {
        return active;
    }

    @Override
    public Integer getTotal() {
        return total;
    }
}
package com.audit.tracevault.core.domain;

import java.util.UUID;

public class WebHook {
    private UUID id;
    private Application application;
    private String endpointUrl;
    private String[] triggerEvents;
    private SeverityEnum minSeverity;
    private Boolean isActive;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public String getEndpointUrl() {
        return endpointUrl;
    }

    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }

    public String[] getTriggerEvents() {
        return triggerEvents;
    }

    public void setTriggerEvents(String[] triggerEvents) {
        this.triggerEvents = triggerEvents;
    }

    public SeverityEnum getMinSeverity() {
        return minSeverity;
    }

    public void setMinSeverity(SeverityEnum minSeverity) {
        this.minSeverity = minSeverity;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public WebHook(UUID id, Application application, String endpointUrl, String[] triggerEvents,
            SeverityEnum minSeverity, Boolean isActive) {
        this.id = id;
        this.application = application;
        this.endpointUrl = endpointUrl;
        this.triggerEvents = triggerEvents;
        this.minSeverity = minSeverity;
        this.isActive = isActive;
    }

    public WebHook() {
    }
}

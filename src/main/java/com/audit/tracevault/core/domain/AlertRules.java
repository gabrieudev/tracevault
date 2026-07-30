package com.audit.tracevault.core.domain;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class AlertRules {
    private UUID id;
    private Application application;
    private String[] triggerEvents;
    private SeverityEnum minSeverity;
    private ChannelTypeEnum channelType;
    private Map<String, Object> channelConfig;
    private String messageTemplate;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public ChannelTypeEnum getChannelType() {
        return channelType;
    }

    public void setChannelType(ChannelTypeEnum channelType) {
        this.channelType = channelType;
    }

    public Map<String, Object> getChannelConfig() {
        return channelConfig;
    }

    public void setChannelConfig(Map<String, Object> channelConfig) {
        this.channelConfig = channelConfig;
    }

    public String getMessageTemplate() {
        return messageTemplate;
    }

    public void setMessageTemplate(String messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    public AlertRules(UUID id, Application application, String[] triggerEvents,
                   SeverityEnum minSeverity, ChannelTypeEnum channelType, Map<String, Object> channelConfig,
                   String messageTemplate, Boolean isActive, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.application = application;
        this.triggerEvents = triggerEvents;
        this.minSeverity = minSeverity;
        this.channelType = channelType;
        this.channelConfig = channelConfig;
        this.messageTemplate = messageTemplate;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public AlertRules() {
    }
}

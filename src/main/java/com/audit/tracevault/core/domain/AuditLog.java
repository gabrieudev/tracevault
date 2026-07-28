package com.audit.tracevault.core.domain;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class AuditLog {
    private UUID id;
    private Application application;
    private String actorId;
    private String actorName;
    private String actorIp;
    private String actorUserAgent;
    private AuditLogActionEnum action;
    private String resourceType;
    private String resourceId;
    private Map<String, Object> oldValues;
    private Map<String, Object> newValues;
    private Map<String, Object> metadata;
    private SeverityEnum severity;
    private Instant occurredAt;
    private Instant createdAt;

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

    public String getActorId() {
        return actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorIp() {
        return actorIp;
    }

    public void setActorIp(String actorIp) {
        this.actorIp = actorIp;
    }

    public String getActorUserAgent() {
        return actorUserAgent;
    }

    public void setActorUserAgent(String actorUserAgent) {
        this.actorUserAgent = actorUserAgent;
    }

    public AuditLogActionEnum getAction() {
        return action;
    }

    public void setAction(AuditLogActionEnum action) {
        this.action = action;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public Map<String, Object> getOldValues() {
        return oldValues;
    }

    public void setOldValues(Map<String, Object> oldValues) {
        this.oldValues = oldValues;
    }

    public Map<String, Object> getNewValues() {
        return newValues;
    }

    public void setNewValues(Map<String, Object> newValues) {
        this.newValues = newValues;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public SeverityEnum getSeverity() {
        return severity;
    }

    public void setSeverity(SeverityEnum severity) {
        this.severity = severity;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(Instant occurredAt) {
        this.occurredAt = occurredAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public AuditLog(UUID id, Application application, String actorId, String actorName, String actorIp,
            String actorUserAgent, AuditLogActionEnum action, String resourceType, String resourceId,
            Map<String, Object> oldValues, Map<String, Object> newValues, Map<String, Object> metadata,
            SeverityEnum severity, Instant occurredAt, Instant createdAt) {
        this.id = id;
        this.application = application;
        this.actorId = actorId;
        this.actorName = actorName;
        this.actorIp = actorIp;
        this.actorUserAgent = actorUserAgent;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.oldValues = oldValues;
        this.newValues = newValues;
        this.metadata = metadata;
        this.severity = severity;
        this.occurredAt = occurredAt;
        this.createdAt = createdAt;
    }

    public AuditLog() {
    }
}

package com.audit.tracevault.core.domain;

public class AlertNotification {
    private AlertRules alertRules;
    private AuditLog auditLog;
    private String message;

    public AlertRules getAlertRules() {
        return alertRules;
    }

    public void setAlertRules(AlertRules alertRules) {
        this.alertRules = alertRules;
    }

    public AuditLog getAuditLog() {
        return auditLog;
    }

    public void setAuditLog(AuditLog auditLog) {
        this.auditLog = auditLog;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AlertNotification(AlertRules alertRules, AuditLog auditLog, String message) {
        this.alertRules = alertRules;
        this.auditLog = auditLog;
        this.message = message;
    }

    public AlertNotification() {
    }
}

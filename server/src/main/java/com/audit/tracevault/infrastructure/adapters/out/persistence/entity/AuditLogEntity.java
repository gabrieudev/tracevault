package com.audit.tracevault.infrastructure.adapters.out.persistence.entity;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.audit.tracevault.core.domain.ActionEnum;
import com.audit.tracevault.core.domain.SeverityEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_log")
public class AuditLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private ApplicationEntity application;
    
    @Column(name = "actor_id", nullable = false)
    private String actorId;
    
    @Column(name = "actor_name")
    private String actorName;
    
    @Column(name = "actor_ip")
    private String actorIp;
    
    @Column(name = "actor_user_agent")
    private String actorUserAgent;
    
    @Column(name = "action", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ActionEnum action;
    
    @Column(name = "resource_type", nullable = false)
    private String resourceType;
    
    @Column(name = "resource_id", nullable = false)
    private String resourceId;
    
    @Column(name = "old_values", columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> oldValues;
    
    @Column(name = "new_values", columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> newValues;
    
    @Column(name = "metadata", columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> metadata;
    
    @Column(name = "severity", nullable = false, columnDefinition = "audit_severity")
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SeverityEnum severity;
    
    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}

package com.audit.tracevault.infrastructure.adapters.out.persistence.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.audit.tracevault.core.domain.SeverityEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "webhook")
public class WebhookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private ApplicationEntity application;
    
    @Column(name = "endpoint_url", nullable = false)
    private String endpointUrl;
    
    @Column(name = "trigger_events", nullable = false)
    private String[] triggerEvents;
    
    @Column(name = "min_severity", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SeverityEnum minSeverity;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
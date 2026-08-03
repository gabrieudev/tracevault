package com.audit.tracevault.infrastructure.adapters.out.persistence.entity;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.audit.tracevault.core.domain.ChannelTypeEnum;
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
@Table(name = "alert_rules")
public class AlertRulesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private ApplicationEntity application;
    
    @Column(name = "trigger_events", nullable = false)
    private String[] triggerEvents;
    
    @Column(name = "min_severity", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private SeverityEnum minSeverity;

    @Column(name = "channel_type", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ChannelTypeEnum channelType;

    @Column(name = "channel_config", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> channelConfig;

    @Column(name = "message_template")
    private String messageTemplate;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
package com.audit.tracevault.infrastructure.adapters.out.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.ports.out.AuditLogEventPublisher;
import com.audit.tracevault.infrastructure.adapters.out.kafka.mapper.AuditLogEventMapper;
import com.audit.tracevault.infrastructure.adapters.out.kafka.model.AuditLogEvent;

@Component
public class AuditLogProducer implements AuditLogEventPublisher {
    public static final String TOPIC = "audit-log-created";

    private final KafkaTemplate<String, AuditLogEvent> kafkaTemplate;
    private final AuditLogEventMapper mapper;

    public AuditLogProducer(
            KafkaTemplate<String, AuditLogEvent> kafkaTemplate,
            AuditLogEventMapper mapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.mapper = mapper;
    }

    @Override
    public void publish(AuditLog auditLog) {
        AuditLogEvent event = mapper.toEvent(auditLog);

        kafkaTemplate.send(
                TOPIC,
                event.getId().toString(),
                event);

    }

}
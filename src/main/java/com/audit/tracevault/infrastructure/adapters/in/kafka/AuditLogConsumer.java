package com.audit.tracevault.infrastructure.adapters.in.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AuditLog;
import com.audit.tracevault.core.ports.in.ProcessAuditLogUseCase;
import com.audit.tracevault.infrastructure.adapters.out.kafka.AuditLogProducer;
import com.audit.tracevault.infrastructure.adapters.out.kafka.mapper.AuditLogEventMapper;
import com.audit.tracevault.infrastructure.adapters.out.kafka.model.AuditLogEvent;

@Component
public class AuditLogConsumer {
    private final ProcessAuditLogUseCase processAuditLogUseCase;
    private final AuditLogEventMapper mapper;

    public AuditLogConsumer(
            ProcessAuditLogUseCase processAuditLogUseCase,
            AuditLogEventMapper mapper) {
        this.processAuditLogUseCase = processAuditLogUseCase;
        this.mapper = mapper;

    }

    @KafkaListener(topics = AuditLogProducer.TOPIC, groupId = "alert-engine")
    public void consume(AuditLogEvent event) {
        AuditLog auditLog = mapper.toDomain(event);
        processAuditLogUseCase.process(auditLog);
    }

}
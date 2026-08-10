package com.audit.tracevault.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.audit.tracevault.core.ports.out.AlertRulesPort;
import com.audit.tracevault.core.ports.out.AlertSender;
import com.audit.tracevault.core.ports.out.ApiKeyCryptographyPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;
import com.audit.tracevault.core.ports.out.AuditLogEventPublisher;
import com.audit.tracevault.core.ports.out.AuditLogRepositoryPort;
import com.audit.tracevault.core.service.AlertRulesService;
import com.audit.tracevault.core.service.ApiKeyCryptographyService;
import com.audit.tracevault.core.service.ApplicationService;
import com.audit.tracevault.core.service.AuditLogService;
import com.audit.tracevault.core.service.ProcessAuditLogService;

@Configuration
public class DomainConfig {
    @Bean
    ApplicationService applicationDomainService(ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort) {
        return new ApplicationService(applicationRepositoryPort, apiKeyCryptographyRepositoryPort);
    }

    @Bean
    AlertRulesService webhookService(AlertRulesPort webhookRepositoryPort,
            ApplicationRepositoryPort applicationRepositoryPort) {
        return new AlertRulesService(webhookRepositoryPort, applicationRepositoryPort);
    }

    @Bean
    AuditLogService auditLogService(AuditLogRepositoryPort auditLogRepositoryPort,
            ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort, AuditLogEventPublisher publisher) {
        return new AuditLogService(auditLogRepositoryPort, applicationRepositoryPort, apiKeyCryptographyRepositoryPort,
                publisher);
    }

    @Bean
    ProcessAuditLogService processAuditLogService(AlertRulesPort repository, AlertSender sender,
            ApplicationRepositoryPort applicationRepository) {
        return new ProcessAuditLogService(repository, sender, applicationRepository);
    }

    @Bean
    ApiKeyCryptographyService apiKeyCryptographyService(
            ApiKeyCryptographyPort apiKeyCryptographyRepositoryPort) {
        return new ApiKeyCryptographyService(apiKeyCryptographyRepositoryPort);
    }
}

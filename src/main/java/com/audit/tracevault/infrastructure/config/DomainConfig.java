package com.audit.tracevault.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.audit.tracevault.core.ports.out.ApiKeyCryptographyRepositoryPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;
import com.audit.tracevault.core.ports.out.AuditLogRepositoryPort;
import com.audit.tracevault.core.ports.out.AlertRulesRepositoryPort;
import com.audit.tracevault.core.service.ApiKeyCryptographyDomainService;
import com.audit.tracevault.core.service.ApplicationDomainService;
import com.audit.tracevault.core.service.AuditLogService;
import com.audit.tracevault.core.service.AlertRulesService;

@Configuration
public class DomainConfig {
    @Bean
    ApplicationDomainService applicationDomainService(ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        return new ApplicationDomainService(applicationRepositoryPort, apiKeyCryptographyRepositoryPort);
    }

    @Bean
    AlertRulesService webhookService(AlertRulesRepositoryPort webhookRepositoryPort) {
        return new AlertRulesService(webhookRepositoryPort);
    }

    @Bean
    AuditLogService auditLogService(AuditLogRepositoryPort auditLogRepositoryPort,
            ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        return new AuditLogService(auditLogRepositoryPort, applicationRepositoryPort, apiKeyCryptographyRepositoryPort);
    }

    @Bean
    ApiKeyCryptographyDomainService apiKeyCryptographyService(
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        return new ApiKeyCryptographyDomainService(apiKeyCryptographyRepositoryPort);
    }
}

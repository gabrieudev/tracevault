package com.audit.tracevault.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.audit.tracevault.core.ports.out.ApiKeyCryptographyRepositoryPort;
import com.audit.tracevault.core.ports.out.ApplicationRepositoryPort;
import com.audit.tracevault.core.service.ApiKeyCryptographyDomainService;
import com.audit.tracevault.core.service.ApplicationDomainService;

@Configuration
public class DomainConfig {
    @Bean
    ApplicationDomainService applicationDomainService(ApplicationRepositoryPort applicationRepositoryPort,
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        return new ApplicationDomainService(applicationRepositoryPort, apiKeyCryptographyRepositoryPort);
    }

    @Bean
    ApiKeyCryptographyDomainService apiKeyCryptographyService(
            ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        return new ApiKeyCryptographyDomainService(apiKeyCryptographyRepositoryPort);
    }
}

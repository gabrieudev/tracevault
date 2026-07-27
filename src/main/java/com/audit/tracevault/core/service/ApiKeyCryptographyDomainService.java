package com.audit.tracevault.core.service;

import com.audit.tracevault.core.exception.FailedCryptographyException;
import com.audit.tracevault.core.ports.in.ApiKeyCryptographyUseCase;
import com.audit.tracevault.core.ports.out.ApiKeyCryptographyRepositoryPort;

public class ApiKeyCryptographyDomainService implements ApiKeyCryptographyUseCase {
    private final ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort;

    public ApiKeyCryptographyDomainService(ApiKeyCryptographyRepositoryPort apiKeyCryptographyRepositoryPort) {
        this.apiKeyCryptographyRepositoryPort = apiKeyCryptographyRepositoryPort;
    }

    @Override
    public String generatePlainApiKey(String prefix) {
        return apiKeyCryptographyRepositoryPort.generatePlainApiKey(prefix)
                .orElseThrow(() -> new FailedCryptographyException("Failed to generate plain API key"));
    }

    @Override
    public String hashApiKey(String plainApiKey) {
        return apiKeyCryptographyRepositoryPort.hashApiKey(plainApiKey)
                .orElseThrow(() -> new FailedCryptographyException("Failed to hash API key"));
    }

    @Override
    public boolean verifyApiKey(String plainApiKey, String hashedApiKey) {
        return apiKeyCryptographyRepositoryPort.verifyApiKey(plainApiKey, hashedApiKey);
    }
}

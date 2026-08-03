package com.audit.tracevault.core.ports.in;

public interface ApiKeyCryptographyUseCase {
    String generatePlainApiKey(String prefix);

    String hashApiKey(String plainApiKey);

    boolean verifyApiKey(String plainApiKey, String hashedApiKey);
}

package com.audit.tracevault.core.ports.out;

import java.util.Optional;

public interface ApiKeyCryptographyRepositoryPort {
    Optional<String> generatePlainApiKey(String prefix);

    Optional<String> hashApiKey(String plainApiKey);

    boolean verifyApiKey(String plainApiKey, String hashedApiKey);
}

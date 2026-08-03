package com.audit.tracevault.infrastructure.adapters;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.audit.tracevault.core.ports.out.ApiKeyCryptographyPort;

@Component
public class ApiKeyCryptographyAdapter implements ApiKeyCryptographyPort {
    private static final int KEY_LENGTH_BYTES = 32;

    @Override
    public Optional<String> generatePlainApiKey(String prefix) {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[KEY_LENGTH_BYTES];
        secureRandom.nextBytes(randomBytes);

        String encodedKey = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        return Optional.of(prefix + "_" + encodedKey);
    }

    @Override
    public Optional<String> hashApiKey(String plainApiKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(plainApiKey.getBytes(StandardCharsets.UTF_8));
            return Optional.of(Base64.getUrlEncoder().withoutPadding().encodeToString(hashBytes));
        } catch (NoSuchAlgorithmException e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean verifyApiKey(String plainApiKey, String hashedApiKey) {
        if (plainApiKey == null || hashedApiKey == null) {
            return false;
        }

        String hashedInput = hashApiKey(plainApiKey).get();

        if (hashedInput == null) {
            return false;
        }

        return MessageDigest.isEqual(
                hashedInput.getBytes(StandardCharsets.UTF_8),
                hashedApiKey.getBytes(StandardCharsets.UTF_8));
    }
}

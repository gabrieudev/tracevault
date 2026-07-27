package com.audit.tracevault.core.ports.in;

import java.util.UUID;

public record CreateApplicationOutput(UUID id, String plainKey) {
}

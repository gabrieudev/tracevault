package com.audit.tracevault.core.ports.out;

import com.audit.tracevault.core.domain.AlertNotification;

public interface AlertSender {
    void send(AlertNotification alertNotification);
}

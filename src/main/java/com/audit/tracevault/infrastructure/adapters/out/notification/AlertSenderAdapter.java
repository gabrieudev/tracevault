package com.audit.tracevault.infrastructure.adapters.out.notification;

import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.ports.out.AlertSender;

@Component
public class AlertSenderAdapter implements AlertSender {
    private final NotificationChannelRegistry registry;

    public AlertSenderAdapter(
            NotificationChannelRegistry registry) {
        this.registry = registry;
    }

    @Override
    public void send(AlertNotification notification) {
        registry.get(
                notification.getAlertRules().getChannelType())
                .send(notification);

    }

}

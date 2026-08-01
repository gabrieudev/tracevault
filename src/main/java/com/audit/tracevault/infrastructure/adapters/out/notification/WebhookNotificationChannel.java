package com.audit.tracevault.infrastructure.adapters.out.notification;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.ChannelTypeEnum;

@Component
public class WebhookNotificationChannel
        implements NotificationChannel {
    private final RestClient restClient;

    public WebhookNotificationChannel() {
        this.restClient = RestClient.create();
    }

    @Override
    public ChannelTypeEnum supports() {
        return ChannelTypeEnum.WEBHOOK;
    }

    @Override
    public void send(AlertNotification notification) {
        Map<String, Object> config = notification.getAlertRules().getChannelConfig();

        String url = (String) config.get("url");

        restClient.post()
                .uri(url)
                .body(notification)
                .retrieve()
                .toBodilessEntity();

    }

}
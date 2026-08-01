package com.audit.tracevault.infrastructure.adapters.out.notification;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.ChannelTypeEnum;

@Component
public class DiscordNotificationChannel
                implements NotificationChannel {
        private final RestClient restClient;

        public DiscordNotificationChannel() {
                this.restClient = RestClient.create();
        }

        @Override
        public ChannelTypeEnum supports() {
                return ChannelTypeEnum.DISCORD;
        }

        @Override
        public void send(AlertNotification notification) {
                Map<String, Object> config = notification.getAlertRules().getChannelConfig();

                String webhook = (String) config.get("webhook");

                restClient.post()
                                .uri(webhook)
                                .body(Map.of(
                                                "content",
                                                notification.getMessage()))
                                .retrieve()
                                .toBodilessEntity();

        }

}
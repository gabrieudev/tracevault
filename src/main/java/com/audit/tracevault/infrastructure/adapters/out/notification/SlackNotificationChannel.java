package com.audit.tracevault.infrastructure.adapters.out.notification;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.ChannelTypeEnum;

@Component
public class SlackNotificationChannel
                implements NotificationChannel {
        private final RestClient restClient;

        public SlackNotificationChannel() {
                this.restClient = RestClient.create();
        }

        @Override
        public ChannelTypeEnum supports() {
                return ChannelTypeEnum.SLACK;
        }

        @Override
        public void send(AlertNotification notification) {
                Map<String, Object> config = notification.getAlertRules().getChannelConfig();

                String webhook = (String) config.get("webhook");

                restClient.post()
                                .uri(webhook)
                                .body(Map.of(
                                                "text",
                                                notification.getMessage()))
                                .retrieve()
                                .toBodilessEntity();

        }

}
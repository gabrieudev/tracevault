package com.audit.tracevault.infrastructure.adapters.out.notification;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.ChannelTypeEnum;
import com.audit.tracevault.core.exception.UnsupportedNotificationChannelException;

@Component
public class NotificationChannelRegistry {
    private final Map<ChannelTypeEnum, NotificationChannel> channels;

    public NotificationChannelRegistry(
            List<NotificationChannel> strategies) {
        this.channels = strategies.stream()
                .collect(Collectors.toMap(
                        channel -> channel.supports(),
                        Function.identity()));
    }

    public NotificationChannel get(ChannelTypeEnum channelType) {
        NotificationChannel channel = channels.get(channelType);

        if (channel == null) {
            throw new UnsupportedNotificationChannelException(
                    "No NotificationChannel found for " + channelType);
        }

        return channel;

    }

}
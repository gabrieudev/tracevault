package com.audit.tracevault.infrastructure.adapters.out.notification;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.ChannelTypeEnum;

public interface NotificationChannel {
    ChannelTypeEnum supports();

    void send(AlertNotification notification);
}
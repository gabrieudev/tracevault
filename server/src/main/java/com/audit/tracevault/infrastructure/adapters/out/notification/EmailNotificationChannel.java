package com.audit.tracevault.infrastructure.adapters.out.notification;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.audit.tracevault.core.domain.AlertNotification;
import com.audit.tracevault.core.domain.ChannelTypeEnum;

@Component
public class EmailNotificationChannel
        implements NotificationChannel {
    private final JavaMailSender mailSender;

    @Value("${tracevault.mail.from}")
    private String from;

    public EmailNotificationChannel(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public ChannelTypeEnum supports() {
        return ChannelTypeEnum.EMAIL;
    }

    @Override
    public void send(AlertNotification notification) {
        Map<String, Object> config = notification.getAlertRules().getChannelConfig();

        String to = (String) config.get("to");

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Audit Alert");
        mail.setText(notification.getMessage());

        mailSender.send(mail);

    }

}
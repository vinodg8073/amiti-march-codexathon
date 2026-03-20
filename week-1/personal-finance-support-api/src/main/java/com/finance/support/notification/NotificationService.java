package com.finance.support.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void queueNotification(NotificationRequest request) {
        log.info("Queued notification for userId={} channel={} title={}", request.userId(), request.channel(), request.title());
    }
}

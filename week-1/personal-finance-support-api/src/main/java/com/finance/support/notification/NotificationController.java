package com.finance.support.notification;

import com.finance.support.common.ApiMessageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ApiMessageResponse sendNotification(@Valid @RequestBody NotificationRequest request) {
        notificationService.queueNotification(request);
        return new ApiMessageResponse("Notification accepted for processing.");
    }
}

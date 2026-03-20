package com.finance.support.notification;

import jakarta.validation.constraints.NotBlank;

public record NotificationRequest(
    @NotBlank String userId,
    @NotBlank String channel,
    @NotBlank String title,
    @NotBlank String message
) {
}

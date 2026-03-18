package com.finance.tracker.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthModels {
    private AuthModels() {
    }

    public record SignupRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record UserView(Long id, String email) {
    }

    public record AuthResponse(String token, UserView user) {
    }
}

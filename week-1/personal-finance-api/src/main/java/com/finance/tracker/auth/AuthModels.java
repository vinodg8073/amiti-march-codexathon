package com.finance.tracker.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthModels {
    private AuthModels() {
    }

    public record SignupRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 8) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "must include upper, lower, and number") String password,
            @NotBlank @Size(max = 120) String displayName
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record RefreshTokenRequest(@NotBlank String refreshToken) {
    }

    public record UserView(Long id, String email, String displayName) {
    }

    public record AuthResponse(String token, String refreshToken, UserView user) {
    }
}

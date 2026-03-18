package com.finance.tracker.auth;

import com.finance.tracker.finance.FinanceWorkspaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.finance.tracker.auth.AuthModels.AuthResponse;
import static com.finance.tracker.auth.AuthModels.LoginRequest;
import static com.finance.tracker.auth.AuthModels.SignupRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public AuthController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return financeWorkspaceService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return financeWorkspaceService.login(request);
    }

    @GetMapping("/me")
    public AuthResponse me(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return financeWorkspaceService.getSession(authorizationHeader);
    }
}

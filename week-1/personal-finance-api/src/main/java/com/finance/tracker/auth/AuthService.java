package com.finance.tracker.auth;

import com.finance.tracker.finance.FinanceWorkspaceService;
import org.springframework.stereotype.Service;

import static com.finance.tracker.auth.AuthModels.AuthResponse;
import static com.finance.tracker.auth.AuthModels.LoginRequest;
import static com.finance.tracker.auth.AuthModels.SignupRequest;

@Service
public class AuthService {
    private final FinanceWorkspaceService financeWorkspaceService;

    public AuthService(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    public AuthResponse signup(SignupRequest request) {
        return financeWorkspaceService.signup(request);
    }

    public AuthResponse login(LoginRequest request) {
        return financeWorkspaceService.login(request);
    }

    public AuthResponse getSession(String authorizationHeader) {
        return financeWorkspaceService.getSession(authorizationHeader);
    }
}

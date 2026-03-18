package com.finance.tracker.account;

import com.finance.tracker.finance.FinanceWorkspaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public AccountController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public List<Account> getAccounts(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return financeWorkspaceService.getAccounts(authorizationHeader);
    }

    @PostMapping
    public Account createAccount(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody CreateAccountRequest request
    ) {
        return financeWorkspaceService.createAccount(authorizationHeader, request);
    }
}

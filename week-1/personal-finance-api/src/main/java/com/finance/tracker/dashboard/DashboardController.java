package com.finance.tracker.dashboard;

import com.finance.tracker.finance.FinanceWorkspaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public DashboardController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public DashboardSummary getDashboard(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return financeWorkspaceService.getDashboard(authorizationHeader);
    }
}

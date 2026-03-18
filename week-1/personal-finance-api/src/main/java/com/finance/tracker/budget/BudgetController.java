package com.finance.tracker.budget;

import com.finance.tracker.finance.FinanceWorkspaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public BudgetController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public List<BudgetStatus> getBudgets(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam(required = false) String month
    ) {
        return financeWorkspaceService.getBudgets(authorizationHeader, month);
    }

    @PostMapping
    public BudgetStatus upsertBudget(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody UpsertBudgetRequest request
    ) {
        return financeWorkspaceService.upsertBudget(authorizationHeader, request);
    }
}

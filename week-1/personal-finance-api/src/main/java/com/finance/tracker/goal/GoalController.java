package com.finance.tracker.goal;

import com.finance.tracker.finance.FinanceWorkspaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public GoalController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public List<SavingsGoal> getGoals(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return financeWorkspaceService.getGoals(authorizationHeader);
    }

    @PostMapping
    public SavingsGoal createGoal(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody CreateSavingsGoalRequest request
    ) {
        return financeWorkspaceService.createGoal(authorizationHeader, request);
    }

    @PatchMapping("/{goalId}/progress")
    public SavingsGoal addContribution(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long goalId,
            @Valid @RequestBody UpdateGoalProgressRequest request
    ) {
        return financeWorkspaceService.addGoalContribution(authorizationHeader, goalId, request);
    }
}

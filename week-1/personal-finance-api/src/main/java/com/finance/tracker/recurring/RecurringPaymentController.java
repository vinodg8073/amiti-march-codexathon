package com.finance.tracker.recurring;

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
@RequestMapping("/api/recurring-payments")
public class RecurringPaymentController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public RecurringPaymentController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public List<RecurringPayment> getRecurringPayments(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return financeWorkspaceService.getRecurringPayments(authorizationHeader);
    }

    @PostMapping
    public RecurringPayment createRecurringPayment(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody CreateRecurringPaymentRequest request
    ) {
        return financeWorkspaceService.createRecurringPayment(authorizationHeader, request);
    }
}

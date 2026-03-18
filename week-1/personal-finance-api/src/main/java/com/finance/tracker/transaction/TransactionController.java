package com.finance.tracker.transaction;

import com.finance.tracker.finance.FinanceWorkspaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final FinanceWorkspaceService financeWorkspaceService;

    public TransactionController(FinanceWorkspaceService financeWorkspaceService) {
        this.financeWorkspaceService = financeWorkspaceService;
    }

    @GetMapping
    public List<Transaction> getTransactions(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return financeWorkspaceService.getTransactions(authorizationHeader);
    }

    @PostMapping
    public Transaction createTransaction(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody CreateTransactionRequest request
    ) {
        return financeWorkspaceService.createTransaction(authorizationHeader, request);
    }

    @PutMapping("/{transactionId}")
    public Transaction updateTransaction(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long transactionId,
            @Valid @RequestBody UpdateTransactionRequest request
    ) {
        return financeWorkspaceService.updateTransaction(authorizationHeader, transactionId, request);
    }

    @DeleteMapping("/{transactionId}")
    public void deleteTransaction(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @PathVariable Long transactionId
    ) {
        financeWorkspaceService.deleteTransaction(authorizationHeader, transactionId);
    }
}

package com.finance.tracker.transaction;

import com.finance.tracker.dashboard.DashboardSummary;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        return transactionService.findAll();
    }

    @PostMapping("/transactions")
    public Transaction createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return transactionService.create(request);
    }

    @GetMapping("/dashboard")
    public DashboardSummary getDashboard() {
        return transactionService.buildDashboardSummary();
    }
}

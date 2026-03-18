package com.finance.tracker.account;

public record Account(
        Long id,
        String name,
        AccountType type
) {
}

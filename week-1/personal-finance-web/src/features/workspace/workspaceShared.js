export const defaultCategories = [
  "HOUSING",
  "FOOD",
  "TRANSPORT",
  "UTILITIES",
  "ENTERTAINMENT",
  "HEALTH",
  "SAVINGS",
  "SALARY",
  "FREELANCE",
  "OTHER"
];

export const accountTypes = ["CHECKING", "SAVINGS", "CREDIT_CARD", "CASH", "INVESTMENT"];
export const recurringFrequencies = ["WEEKLY", "MONTHLY", "YEARLY"];

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function buildTransactionForm(accountId = "") {
  return {
    type: "EXPENSE",
    amount: "",
    transactionDate: today(),
    accountId,
    category: "FOOD",
    merchant: "",
    note: "",
    tags: ""
  };
}

export function buildRecurringForm(accountId = "") {
  return {
    name: "",
    amount: "",
    category: "UTILITIES",
    accountId,
    frequency: "MONTHLY",
    nextDueDate: today()
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value ?? 0));
}

export function formatShortDate(value) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function formatMonthYear(value) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function getInitials(name) {
  return String(name || "PF")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatCategoryLabel(value) {
  return String(value || "")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function percent(current, total) {
  if (!total) {
    return 0;
  }

  return Math.min(100, Math.round((Number(current) / Number(total)) * 100));
}

export function budgetProgressValue(actualAmount, limitAmount) {
  if (!Number(limitAmount)) {
    return 0;
  }

  return Math.round((Number(actualAmount) / Number(limitAmount)) * 100);
}

export function buildTransactionPayload(form) {
  return {
    description: form.merchant || form.note || "Transaction",
    amount: Number(form.amount),
    type: form.type,
    category: form.type === "TRANSFER" ? "OTHER" : form.category,
    accountId: Number(form.accountId),
    transactionDate: form.transactionDate,
    recurring: false
  };
}

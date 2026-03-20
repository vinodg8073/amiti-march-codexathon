const AUTH_TOKEN_KEY = "personal-finance-token";

async function request(path, { token, method = "GET", body } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function signup(payload) {
  return request("/api/auth/signup", { method: "POST", body: payload });
}

export function login(payload) {
  return request("/api/auth/login", { method: "POST", body: payload });
}

export function fetchSession(token) {
  return request("/api/auth/me", { token });
}

export function fetchDashboard(token) {
  return request("/api/dashboard", { token });
}

export function fetchTransactions(token) {
  return request("/api/transactions", { token });
}

export function createTransaction(token, payload) {
  return request("/api/transactions", { token, method: "POST", body: payload });
}

export function updateTransaction(token, transactionId, payload) {
  return request(`/api/transactions/${transactionId}`, {
    token,
    method: "PUT",
    body: payload
  });
}

export function deleteTransaction(token, transactionId) {
  return request(`/api/transactions/${transactionId}`, {
    token,
    method: "DELETE"
  });
}

export function createAccount(token, payload) {
  return request("/api/accounts", { token, method: "POST", body: payload });
}

export function upsertBudget(token, payload) {
  return request("/api/budgets", { token, method: "POST", body: payload });
}

export function createGoal(token, payload) {
  return request("/api/goals", { token, method: "POST", body: payload });
}

export function addGoalContribution(token, goalId, payload) {
  return request(`/api/goals/${goalId}/progress`, {
    token,
    method: "PATCH",
    body: payload
  });
}

export function createRecurringPayment(token, payload) {
  return request("/api/recurring-payments", {
    token,
    method: "POST",
    body: payload
  });
}

const AUTH_TOKEN_KEY = "personal-finance-token";
const REFRESH_TOKEN_KEY = "personal-finance-refresh-token";

let refreshInFlight = null;

async function request(path, { token, method = "GET", body, retryOnUnauthorized = true } = {}) {
  const headers = {};
  const effectiveToken = getStoredToken() || token;

  if (effectiveToken) {
    headers.Authorization = `Bearer ${effectiveToken}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (response.status === 401 && retryOnUnauthorized && path !== "/api/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, { token: refreshed, method, body, retryOnUnauthorized: false });
    }
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    clearStoredToken();
    return null;
  }

  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Session refresh failed");
        }
        storeSessionTokens(payload);
        return payload.token;
      })
      .catch(() => {
        clearStoredToken();
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeSessionTokens(authResponse) {
  if (authResponse?.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
  }

  if (authResponse?.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
  }
}

export function storeToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function signup(payload) {
  return request("/api/auth/signup", { method: "POST", body: payload, retryOnUnauthorized: false });
}

export function login(payload) {
  return request("/api/auth/login", { method: "POST", body: payload, retryOnUnauthorized: false });
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

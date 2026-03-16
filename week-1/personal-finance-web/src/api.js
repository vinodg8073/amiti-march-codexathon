export async function fetchDashboard() {
  const response = await fetch("/api/dashboard");
  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }
  return response.json();
}

export async function fetchTransactions() {
  const response = await fetch("/api/transactions");
  if (!response.ok) {
    throw new Error("Failed to load transactions");
  }
  return response.json();
}

export async function createTransaction(payload) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }

  return response.json();
}

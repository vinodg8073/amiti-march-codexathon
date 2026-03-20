async function request(path, { method = "GET", body } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    let message = "Support service request failed";
    try {
      const payload = await response.json();
      message = payload?.message || message;
    } catch {
      // Ignore non-json fallback.
    }
    throw new Error(message);
  }

  return response;
}

export async function exportReportPdf(payload) {
  const response = await request("/api/support/documents/reports/pdf", {
    method: "POST",
    body: payload
  });

  return response.blob();
}

export async function sendInAppNotification(payload) {
  const response = await request("/api/support/notifications", {
    method: "POST",
    body: payload
  });

  return response.json();
}

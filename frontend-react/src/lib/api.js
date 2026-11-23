/* Talks to the Spring Boot backend. Returns the JSON reply, or throws an Error carrying the server's message. */
/* The backend runs on port 8081 (see backend/src/main/resources/application.properties).
   To use another address, copy .env.example to .env and change VITE_API_URL. */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export async function api(method, path, body, token) {
  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Start the backend, then reload this page.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

/* localStorage helpers: the browser only remembers who is logged in. */
export const store = {
  get: (k, d) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
  },
  set: (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; }
  },
  del: (k) => {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  },
};

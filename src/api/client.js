// Small wrapper around fetch for talking to the BookBase backend.
// The backend URL comes from VITE_API_URL (see .env.example).
const API_URL = (
  import.meta.env.VITE_API_URL || "https://bookbase-backend.onrender.com"
).replace(/\/$/, "");

const TOKEN_KEY = "bookbase_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // some error pages are not JSON
  }

  if (!response.ok) {
    // Expired token or blocked account: sign the user out everywhere
    const blocked = response.status === 403 && /blocked/i.test(data.message || "");
    if (token && (response.status === 401 || blocked)) {
      clearToken();
      window.dispatchEvent(new CustomEvent("auth:logout", { detail: data.message }));
    }
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

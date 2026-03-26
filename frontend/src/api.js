const API = "https://door-maestro-backend.vercel.app";

function getToken() {
  return localStorage.getItem("admin_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("admin_token");
}

export async function login(username, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Login failed");
  }
  const data = await res.json();
  localStorage.setItem("admin_token", data.token);
  return data;
}

export async function verifyAuth() {
  const res = await fetch(`${API}/api/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API}/api/auth/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed");
  }
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API}/api/products`);
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API}/api/products/${id}`);
  return res.json();
}

export async function createProduct(formData) {
  const res = await fetch(`${API}/api/products`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return res.json();
}

export async function updateProduct(id, formData) {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateStock(id, stock) {
  const res = await fetch(`${API}/api/products/${id}/stock`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ stock }),
  });
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API}/api/orders`, { headers: authHeaders() });
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API}/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API}/api/stats`, { headers: authHeaders() });
  return res.json();
}

export async function fetchEmailSettings() {
  const res = await fetch(`${API}/api/settings/email`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function saveEmailSettings(data) {
  const res = await fetch(`${API}/api/settings/email`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function testEmail(data) {
  const res = await fetch(`${API}/api/settings/email/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.error || "Failed to send test email");
  }
  return res.json();
}

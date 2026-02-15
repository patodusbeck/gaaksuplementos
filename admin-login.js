const API_BASE = "/api";
const AUTH_TOKEN_KEY = "gaak_admin_token";

const LOGIN_ENDPOINTS = [
  `${API_BASE}/admin-auth/login`,
  `${API_BASE}/auth/login`,
  `${API_BASE}/login`,
];

const ME_ENDPOINTS = [
  `${API_BASE}/admin-auth/me`,
  `${API_BASE}/auth/me`,
  `${API_BASE}/me`,
];

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("login-username");
const passwordInput = document.getElementById("login-password");
const statusEl = document.getElementById("login-status");

const setStatus = (text, isError = false) => {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#f43f5e" : "#22c55e";
};

const goAdmin = () => {
  window.location.href = "admin.html";
};

const requestFirstOk = async (endpoints, options) => {
  let lastData = {};

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, options);
      const data = await response.json().catch(() => ({}));

      if (response.ok) return { ok: true, data, endpoint };

      lastData = data;
      if (![404, 405].includes(response.status)) {
        return { ok: false, data, endpoint, status: response.status };
      }
    } catch (err) {
      // Tenta o proximo endpoint
    }
  }

  return { ok: false, data: lastData };
};

const trySession = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return;

  const result = await requestFirstOk(ME_ENDPOINTS, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (result.ok) goAdmin();
};

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = String(usernameInput?.value || "").trim().toLowerCase();
    const password = String(passwordInput?.value || "");

    if (!username || !password) {
      setStatus("Informe usuario e senha.", true);
      return;
    }

    setStatus("Entrando...");

    const result = await requestFirstOk(LOGIN_ENDPOINTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!result.ok) {
      setStatus(result.data?.error || "Falha no login.", true);
      return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
    goAdmin();
  });
}

trySession();

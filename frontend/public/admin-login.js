const API_BASE = "/api";
const AUTH_TOKEN_KEY = "gaak_admin_token";
const LOGIN_ENDPOINT = `${API_BASE}/admin-auth/login`;
const ME_ENDPOINT = `${API_BASE}/admin-auth/me`;

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("login-username");
const passwordInput = document.getElementById("login-password");
const togglePasswordBtn = document.getElementById("toggle-password");
const statusEl = document.getElementById("login-status");

const setStatus = (text, isError = false) => {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#f43f5e" : "#22c55e";
};

const goAdmin = () => {
  window.location.href = "/admin";
};

const trySession = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return;

  const response = await fetch(ME_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) goAdmin();
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

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(data.error || "Falha no login.", true);
        return;
      }

      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      goAdmin();
    } catch (err) {
      setStatus("Erro de conexao ao autenticar.", true);
    }
  });
}

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const nextType = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = nextType;
    const showing = nextType === "text";
    togglePasswordBtn.textContent = showing ? "Ocultar" : "Mostrar";
    togglePasswordBtn.setAttribute("aria-label", showing ? "Ocultar senha" : "Mostrar senha");
  });
}

trySession();

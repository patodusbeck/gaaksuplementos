const API_BASE = "/api";
const AUTH_TOKEN_KEY = "gaak_admin_token";
const ME_ENDPOINTS = [`${API_BASE}/admin-auth/me`, `${API_BASE}/auth/me`, `${API_BASE}/me`];

const productList = document.getElementById("product-list");
const ordersList = document.getElementById("orders-list");
const ordersStatus = document.getElementById("orders-status");
const ordersTotals = document.getElementById("orders-totals");
const orderSearch = document.getElementById("order-search");
const orderFrom = document.getElementById("order-from");
const orderTo = document.getElementById("order-to");
const clearFiltersBtn = document.getElementById("clear-filters");
const exportCsvBtn = document.getElementById("export-csv");
const customersList = document.getElementById("customers-list");
const customersSearch = document.getElementById("customers-search");
const logoutBtn = document.getElementById("logout-admin");
const sessionUser = document.getElementById("session-user");

const sidebarLinks = document.querySelectorAll(".sidebar-link");
const sectionPanels = document.querySelectorAll(".section-panel");

const metricClients = document.getElementById("metric-clients");
const metricProducts = document.getElementById("metric-products");
const metricSalesToday = document.getElementById("metric-sales-today");
const metricRevenueToday = document.getElementById("metric-revenue-today");

const salesRange = document.getElementById("sales-range");
const salesChartCanvas = document.getElementById("sales-chart");
const topProductsCanvas = document.getElementById("top-products-chart");

const couponForm = document.getElementById("coupon-form");
const couponFormTitle = document.getElementById("coupon-form-title");
const couponStatus = document.getElementById("coupon-status");
const couponList = document.getElementById("coupon-list");
const resetCouponBtn = document.getElementById("reset-coupon");

const modal = {
  overlay: document.getElementById("admin-modal"),
  title: document.getElementById("admin-modal-title"),
  body: document.getElementById("admin-modal-body"),
  icon: document.querySelector("#admin-modal-icon ion-icon"),
  ok: document.getElementById("admin-modal-ok"),
  cancel: document.getElementById("admin-modal-cancel"),
  close: document.getElementById("admin-modal-close"),
};

const couponFields = {
  id: document.getElementById("coupon-id"),
  code: document.getElementById("coupon-code-input"),
  percent: document.getElementById("coupon-percent"),
  expiresAt: document.getElementById("coupon-expires"),
  usageLimit: document.getElementById("coupon-limit"),
  active: document.getElementById("coupon-active"),
};

let currentUser = null;
let cachedOrders = [];
let cachedProducts = [];
let cachedCoupons = [];
let cachedCustomers = [];
let salesChart = null;
let topProductsChart = null;

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || "";

const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = "login.html";
};

const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const setCouponStatus = (text, isError = false) => {
  if (!couponStatus) return;
  couponStatus.textContent = text;
  couponStatus.style.color = isError ? "#f43f5e" : "var(--accent)";
};

const openModal = ({ title, message, icon = "information-circle", showCancel = true }) => {
  if (!modal.overlay) return Promise.resolve(false);

  modal.title.textContent = title;
  modal.body.textContent = message;
  if (modal.icon) modal.icon.setAttribute("name", icon);
  modal.cancel.style.display = showCancel ? "inline-flex" : "none";

  modal.overlay.classList.add("active");
  modal.overlay.setAttribute("aria-hidden", "false");

  return new Promise((resolve) => {
    const cleanup = () => {
      modal.overlay.classList.remove("active");
      modal.overlay.setAttribute("aria-hidden", "true");
      modal.ok.removeEventListener("click", onOk);
      modal.cancel.removeEventListener("click", onCancel);
      modal.close.removeEventListener("click", onCancel);
      modal.overlay.removeEventListener("click", onOverlay);
      document.removeEventListener("keydown", onEsc);
    };

    const onOk = () => {
      cleanup();
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onOverlay = (event) => {
      if (event.target === modal.overlay) onCancel();
    };

    const onEsc = (event) => {
      if (event.key === "Escape") onCancel();
    };

    modal.ok.addEventListener("click", onOk);
    modal.cancel.addEventListener("click", onCancel);
    modal.close.addEventListener("click", onCancel);
    modal.overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onEsc);
  });
};

const clearCouponForm = () => {
  couponFields.id.value = "";
  couponFields.code.value = "";
  couponFields.percent.value = "";
  couponFields.expiresAt.value = "";
  couponFields.usageLimit.value = "";
  couponFields.active.checked = true;
  if (couponFormTitle) couponFormTitle.textContent = "Criar cupom";
  setCouponStatus("");
};

const fillCouponForm = (coupon) => {
  couponFields.id.value = coupon._id || "";
  couponFields.code.value = coupon.code || "";
  couponFields.percent.value = coupon.percent || "";
  couponFields.expiresAt.value = coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "";
  couponFields.usageLimit.value = coupon.usageLimit || 0;
  couponFields.active.checked = coupon.active !== false;
  if (couponFormTitle) couponFormTitle.textContent = "Editar cupom";
  setCouponStatus("");
};

const fetchJson = async (url, options = {}) => {
  const headers = authHeaders(options.headers || {});
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    logout();
    throw new Error("Sessao expirada");
  }

  if (!response.ok) {
    throw new Error(data.error || "Erro na requisicao");
  }
  return data;
};

const fetchAuthMe = async () => {
  const headers = authHeaders({});
  let lastError = null;

  for (const endpoint of ME_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { headers });
      const data = await response.json().catch(() => ({}));

      if (response.ok) return data;
      if (![404, 405].includes(response.status)) {
        if (response.status === 401) logout();
        throw new Error(data.error || "Erro na validacao de sessao");
      }
      lastError = new Error("Rota nao encontrada");
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Falha ao validar sessao");
};

const fetchProducts = () => fetchJson(`${API_BASE}/products`);
const fetchCoupons = () => fetchJson(`${API_BASE}/coupons`);
const fetchOrders = () => fetchJson(`${API_BASE}/orders`);
const fetchCustomers = () => fetchJson(`${API_BASE}/customers`);

const formatAddress = (entry) => {
  const street = String(entry.customerStreet || entry.street || "").trim();
  const number = String(entry.customerNumber || entry.number || "").trim();
  const neighborhood = String(entry.customerNeighborhood || entry.neighborhood || "").trim();
  const city = String(entry.customerCity || entry.city || "").trim();
  const complement = String(entry.customerComplement || entry.complement || "").trim();

  const parts = [];
  if (street) parts.push(number ? `${street}, ${number}` : street);
  if (neighborhood) parts.push(`Bairro: ${neighborhood}`);
  if (city) parts.push(`Cidade: ${city}`);
  if (complement) parts.push(`Comp.: ${complement}`);
  return parts.join(" | ") || "Endereco nao informado";
};

const renderProducts = (items) => {
  cachedProducts = items;
  if (!productList) return;

  if (!items.length) {
    productList.innerHTML = '<p class="admin-muted">Nenhum produto cadastrado.</p>';
    return;
  }

  productList.innerHTML = items
    .map(
      (item) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <strong>${item.name}</strong>
        </div>
        <div class="admin-chip">${item.collection || "best-sellers"}</div>
        <div class="admin-chip">${item.category || "Sem categoria"}</div>
        <div class="admin-chip">${item.active ? "Ativo" : "Inativo"}</div>
        <div class="admin-chip">${Number(item.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
      </div>
    `
    )
    .join("");
};

const renderCoupons = (items) => {
  cachedCoupons = items;
  if (!couponList) return;

  if (!items.length) {
    couponList.innerHTML = '<p class="admin-muted">Nenhum cupom cadastrado.</p>';
    return;
  }

  couponList.innerHTML = items
    .map((coupon) => {
      const now = new Date();
      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
      const isLimitReached = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
      const warning = isExpired ? "Expirado" : isLimitReached ? "Limite atingido" : coupon.active ? "Ativo" : "Inativo";

      return `
      <div class="admin-card">
        <div class="admin-card-header">
          <strong>${coupon.code}</strong>
          <div class="admin-card-actions">
            <button class="icon-btn" data-coupon-edit="${coupon._id}"><ion-icon name="create-outline"></ion-icon></button>
            <button class="icon-btn" data-coupon-delete="${coupon._id}"><ion-icon name="trash-outline"></ion-icon></button>
          </div>
        </div>
        <div class="admin-chip">${coupon.percent}%</div>
        <div class="admin-chip ${warning !== "Ativo" ? "alert" : ""}">${warning}</div>
        <div class="admin-chip">Usos: ${coupon.usedCount || 0}</div>
        <div class="admin-chip">Limite: ${coupon.usageLimit || 0}</div>
        <div class="admin-chip">Validade: ${coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "Sem validade"}</div>
      </div>
    `;
    })
    .join("");
};

const renderOrders = (items) => {
  if (!ordersList) return;

  if (!items.length) {
    ordersList.innerHTML = '<p class="admin-muted">Nenhuma venda registrada.</p>';
    return;
  }

  ordersList.innerHTML = items
    .map((order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "";
      const itemsHtml = (order.items || []).map((item) => `- ${item.name} x${item.quantity}`).join("<br>");
      return `
      <div class="admin-card">
        <div class="admin-card-header">
          <h4>${order.customerName || "Cliente"}</h4>
          <span class="admin-chip">${createdAt}</span>
        </div>
        <div class="order-meta">
          <span>${order.customerPhone || "Sem telefone"}</span>
          <span>${formatAddress(order)}</span>
        </div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-total">Total: ${Number(order.total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
      </div>
      `;
    })
    .join("");
};

const renderCustomers = (items) => {
  cachedCustomers = Array.isArray(items) ? items : [];
  if (!customersList) return;

  const query = String(customersSearch?.value || "").trim().toLowerCase();
  const filtered = query
    ? cachedCustomers.filter((customer) => {
        const address = formatAddress(customer).toLowerCase();
        return (
          String(customer.name || "").toLowerCase().includes(query) ||
          String(customer.phone || "").toLowerCase().includes(query) ||
          address.includes(query)
        );
      })
    : cachedCustomers;

  if (!filtered.length) {
    customersList.innerHTML = '<p class="admin-muted">Nenhum cliente cadastrado.</p>';
    return;
  }

  customersList.innerHTML = filtered
    .map(
      (customer) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <h4>${customer.name || "Cliente"}</h4>
          <span class="admin-chip">${customer.ordersCount || 0} pedidos</span>
        </div>
        <div class="order-meta">
          <span>${customer.phone || "Sem telefone"}</span>
          <span>${formatAddress(customer)}</span>
        </div>
      </div>
      `
    )
    .join("");
};

const renderMetrics = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const ordersToday = cachedOrders.filter((order) => order.createdAt && new Date(order.createdAt) >= startOfDay);
  const revenueToday = ordersToday.reduce((acc, order) => acc + Number(order.total || 0), 0);

  if (metricClients) metricClients.textContent = cachedCustomers.length || 0;
  if (metricProducts) metricProducts.textContent = cachedProducts.length || 0;
  if (metricSalesToday) metricSalesToday.textContent = ordersToday.length || 0;
  if (metricRevenueToday) {
    metricRevenueToday.textContent = revenueToday.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
};

const buildSalesSeries = (days) => {
  const now = new Date();
  const labels = [];
  const totals = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    labels.push(date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));

    const total = cachedOrders
      .filter((order) => order.createdAt && new Date(order.createdAt).toDateString() === date.toDateString())
      .reduce((acc, order) => acc + Number(order.total || 0), 0);

    totals.push(Number(total.toFixed(2)));
  }

  return { labels, totals };
};

const buildTopProducts = () => {
  const counts = new Map();
  cachedOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item.name || "Produto";
      counts.set(key, (counts.get(key) || 0) + Number(item.quantity || 0));
    });
  });

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return {
    labels: sorted.map(([name]) => name),
    data: sorted.map(([, qty]) => qty),
  };
};

const renderCharts = () => {
  if (!salesChartCanvas || !topProductsCanvas || typeof Chart === "undefined") return;
  if (currentUser?.role !== "owner") return;

  const days = Number(salesRange?.value || 30);
  const salesData = buildSalesSeries(days);
  const productsData = buildTopProducts();

  if (salesChart) salesChart.destroy();
  if (topProductsChart) topProductsChart.destroy();

  salesChart = new Chart(salesChartCanvas, {
    type: "line",
    data: {
      labels: salesData.labels,
      datasets: [
        {
          label: "Faturamento",
          data: salesData.totals,
          borderColor: "#f43f5e",
          backgroundColor: "rgba(244, 63, 94, 0.25)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#b7bcc8" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#b7bcc8" }, grid: { color: "rgba(255,255,255,0.06)" } },
      },
    },
  });

  topProductsChart = new Chart(topProductsCanvas, {
    type: "doughnut",
    data: {
      labels: productsData.labels,
      datasets: [
        {
          data: productsData.data,
          backgroundColor: ["#f43f5e", "#fb7185", "#f97316", "#facc15", "#22c55e", "#38bdf8"],
          borderColor: "#10131a",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#b7bcc8" } } },
    },
  });
};

const renderTotals = (items) => {
  if (!ordersTotals) return;
  if (currentUser?.role !== "owner") return;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - dayOfWeek);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sumBetween = (startDate) =>
    items.filter((order) => order.createdAt && new Date(order.createdAt) >= startDate)
      .reduce((acc, order) => acc + Number(order.total || 0), 0);

  const countBetween = (startDate) =>
    items.filter((order) => order.createdAt && new Date(order.createdAt) >= startDate).length;

  const formatCurrency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  ordersTotals.innerHTML = `
    <div class="total-card">
      <span>Hoje</span>
      <strong>${formatCurrency(sumBetween(startOfDay))}</strong>
      <small>${countBetween(startOfDay)} vendas</small>
    </div>
    <div class="total-card">
      <span>Semana</span>
      <strong>${formatCurrency(sumBetween(startOfWeek))}</strong>
      <small>${countBetween(startOfWeek)} vendas</small>
    </div>
    <div class="total-card">
      <span>Mes</span>
      <strong>${formatCurrency(sumBetween(startOfMonth))}</strong>
      <small>${countBetween(startOfMonth)} vendas</small>
    </div>
  `;
};

const applyFilters = () => {
  let filtered = [...cachedOrders];

  const query = (orderSearch?.value || "").trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((order) => {
      const inName = String(order.customerName || "").toLowerCase().includes(query);
      const inItems = (order.items || []).some((item) => String(item.name || "").toLowerCase().includes(query));
      return inName || inItems;
    });
  }

  if (orderFrom?.value) {
    const fromDate = new Date(orderFrom.value);
    filtered = filtered.filter((order) => order.createdAt && new Date(order.createdAt) >= fromDate);
  }

  if (orderTo?.value) {
    const toDate = new Date(orderTo.value);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((order) => order.createdAt && new Date(order.createdAt) <= toDate);
  }

  renderOrders(filtered);
  renderTotals(filtered);
  renderMetrics();
  renderCharts();

  if (ordersStatus) {
    ordersStatus.textContent = `Atualizado agora (${filtered.length} vendas)`;
  }
};

const loadProducts = async () => {
  if (currentUser?.role !== "owner") return;
  try {
    const items = await fetchProducts();
    renderProducts(items);
    renderMetrics();
  } catch (err) {
    renderProducts([]);
  }
};

const loadCoupons = async () => {
  if (currentUser?.role !== "owner") return;
  try {
    const items = await fetchCoupons();
    renderCoupons(items);
  } catch (err) {
    renderCoupons([]);
    setCouponStatus("Falha ao carregar cupons.", true);
  }
};

const loadCustomers = async () => {
  try {
    const items = await fetchCustomers();
    renderCustomers(items);
    renderMetrics();
  } catch (err) {
    renderCustomers([]);
  }
};

const loadOrders = async () => {
  if (!ordersStatus) return;

  ordersStatus.textContent = "Atualizando...";
  try {
    const items = await fetchOrders();
    cachedOrders = Array.isArray(items) ? items : [];
    applyFilters();
    ordersStatus.dataset.lastOk = Date.now();
  } catch (err) {
    ordersStatus.textContent = "Falha ao atualizar.";
  }
};

const startSmartPolling = () => {
  let interval = 5000;
  const maxInterval = 30000;

  const poll = async () => {
    const tasks = [loadOrders(), loadCustomers()];
    if (currentUser?.role === "owner") tasks.push(loadProducts());
    await Promise.all(tasks);

    const lastOk = Number(ordersStatus?.dataset.lastOk || 0);
    interval = lastOk ? 5000 : Math.min(interval + 5000, maxInterval);
    setTimeout(poll, interval);
  };

  poll();
};

const applyRoleAccess = () => {
  const role = currentUser?.role || "";
  if (sessionUser) {
    sessionUser.textContent = `${currentUser?.username || ""} (${role})`;
  }

  document.querySelectorAll("[data-role]").forEach((el) => {
    const allowed = String(el.dataset.role || "").split(/\s+/).filter(Boolean);
    const permitted = allowed.length === 0 || allowed.includes(role);
    el.style.display = permitted ? "" : "none";
  });

  const firstAllowedNav = Array.from(sidebarLinks).find((btn) => btn.style.display !== "none");
  if (firstAllowedNav) {
    sidebarLinks.forEach((btn) => btn.classList.remove("active"));
    sectionPanels.forEach((panel) => panel.classList.remove("active"));
    firstAllowedNav.classList.add("active");
    const target = document.getElementById(firstAllowedNav.dataset.section);
    if (target) target.classList.add("active");
  }
};

if (couponForm) {
  couponForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (currentUser?.role !== "owner") return;

    setCouponStatus("Salvando...");

    const payload = {
      code: couponFields.code.value.trim().toUpperCase(),
      percent: Number(couponFields.percent.value || 0),
      expiresAt: couponFields.expiresAt.value || null,
      usageLimit: Number(couponFields.usageLimit.value || 0),
      active: couponFields.active.checked,
    };

    const id = couponFields.id.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/coupons/${id}` : `${API_BASE}/coupons`;

    try {
      await fetchJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCouponStatus("Cupom salvo com sucesso.");
      clearCouponForm();
      await loadCoupons();
    } catch (err) {
      setCouponStatus(err.message || "Erro ao salvar cupom.", true);
    }
  });
}

if (couponList) {
  couponList.addEventListener("click", async (event) => {
    if (currentUser?.role !== "owner") return;

    const editBtn = event.target.closest("[data-coupon-edit]");
    const deleteBtn = event.target.closest("[data-coupon-delete]");

    if (editBtn) {
      const id = editBtn.dataset.couponEdit;
      const coupon = cachedCoupons.find((item) => item._id === id);
      if (coupon) fillCouponForm(coupon);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.couponDelete;
      const confirmed = await openModal({
        title: "Remover cupom",
        message: "Tem certeza que deseja remover este cupom?",
        icon: "trash-outline",
      });

      if (!confirmed) return;

      try {
        await fetchJson(`${API_BASE}/coupons/${id}`, { method: "DELETE" });
        setCouponStatus("Cupom removido.");
        await loadCoupons();
      } catch (err) {
        setCouponStatus(err.message || "Erro ao remover cupom.", true);
      }
    }
  });
}

const exportCsv = () => {
  const rows = [["Cliente", "Telefone", "Endereco", "Total", "Data", "Itens"]];

  const query = (orderSearch?.value || "").trim().toLowerCase();
  const fromValue = orderFrom?.value;
  const toValue = orderTo?.value;
  let data = [...cachedOrders];

  if (query) {
    data = data.filter((order) => {
      const inName = String(order.customerName || "").toLowerCase().includes(query);
      const inItems = (order.items || []).some((item) => String(item.name || "").toLowerCase().includes(query));
      return inName || inItems;
    });
  }

  if (fromValue) {
    const fromDate = new Date(fromValue);
    data = data.filter((order) => order.createdAt && new Date(order.createdAt) >= fromDate);
  }

  if (toValue) {
    const toDate = new Date(toValue);
    toDate.setHours(23, 59, 59, 999);
    data = data.filter((order) => order.createdAt && new Date(order.createdAt) <= toDate);
  }

  data.forEach((order) => {
    const itemsText = (order.items || []).map((item) => `${item.name} x${item.quantity}`).join("; ");
    rows.push([
      order.customerName || "",
      order.customerPhone || "",
      formatAddress(order),
      Number(order.total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "",
      itemsText,
    ]);
  });

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vendas-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

if (resetCouponBtn) resetCouponBtn.addEventListener("click", clearCouponForm);
if (orderSearch) orderSearch.addEventListener("input", applyFilters);
if (orderFrom) orderFrom.addEventListener("change", applyFilters);
if (orderTo) orderTo.addEventListener("change", applyFilters);
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    if (orderSearch) orderSearch.value = "";
    if (orderFrom) orderFrom.value = "";
    if (orderTo) orderTo.value = "";
    applyFilters();
  });
}
if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);
if (customersSearch) {
  customersSearch.addEventListener("input", () => {
    renderCustomers(cachedCustomers);
  });
}
if (salesRange) salesRange.addEventListener("change", renderCharts);
if (logoutBtn) logoutBtn.addEventListener("click", logout);

sidebarLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.style.display === "none") return;
    sidebarLinks.forEach((link) => link.classList.remove("active"));
    sectionPanels.forEach((panel) => panel.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.section);
    if (target && target.style.display !== "none") target.classList.add("active");
  });
});

const init = async () => {
  const token = getToken();
  if (!token) return logout();

  try {
    const me = await fetchAuthMe();
    currentUser = me.user;
  } catch (err) {
    return logout();
  }

  applyRoleAccess();

  const tasks = [loadCustomers(), loadOrders()];
  if (currentUser?.role === "owner") {
    tasks.push(loadProducts(), loadCoupons());
  }

  await Promise.all(tasks);
  startSmartPolling();
};

init();


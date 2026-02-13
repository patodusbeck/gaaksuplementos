const API_BASE = "/api";

const form = document.getElementById("product-form");
const formTitle = document.getElementById("form-title");
const formStatus = document.getElementById("form-status");
const productList = document.getElementById("product-list");
const newProductBtn = document.getElementById("new-product");
const ordersList = document.getElementById("orders-list");
const ordersStatus = document.getElementById("orders-status");
const ordersTotals = document.getElementById("orders-totals");
const orderSearch = document.getElementById("order-search");
const orderFrom = document.getElementById("order-from");
const orderTo = document.getElementById("order-to");
const clearFiltersBtn = document.getElementById("clear-filters");
const exportCsvBtn = document.getElementById("export-csv");
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
const couponFields = {
  id: document.getElementById("coupon-id"),
  code: document.getElementById("coupon-code-input"),
  percent: document.getElementById("coupon-percent"),
  expiresAt: document.getElementById("coupon-expires"),
  usageLimit: document.getElementById("coupon-limit"),
  active: document.getElementById("coupon-active"),
};

const modal = {
  overlay: document.getElementById("admin-modal"),
  title: document.getElementById("admin-modal-title"),
  body: document.getElementById("admin-modal-body"),
  icon: document.querySelector("#admin-modal-icon ion-icon"),
  ok: document.getElementById("admin-modal-ok"),
  cancel: document.getElementById("admin-modal-cancel"),
  close: document.getElementById("admin-modal-close"),
};

const fields = {
  id: document.getElementById("product-id"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  price: document.getElementById("price"),
  original: document.getElementById("original"),
  category: document.getElementById("category"),
  badge: document.getElementById("badge"),
  imageUrl: document.getElementById("imageUrl"),
  imageFile: document.getElementById("imageFile"),
  collection: document.getElementById("collection"),
  active: document.getElementById("active"),
};

const imagePreview = document.getElementById("imagePreview");
let cachedOrders = [];
let cachedProducts = [];
let cachedCoupons = [];
let salesChart = null;
let topProductsChart = null;

const setStatus = (text, isError = false) => {
  formStatus.textContent = text;
  formStatus.style.color = isError ? "#f43f5e" : "var(--accent)";
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
      document.removeEventListener("keydown", onKey);
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

    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };

    modal.ok.addEventListener("click", onOk);
    modal.cancel.addEventListener("click", onCancel);
    modal.close.addEventListener("click", onCancel);
    modal.overlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onKey);
  });
};

const clearForm = () => {
  fields.id.value = "";
  fields.name.value = "";
  fields.description.value = "";
  fields.price.value = "";
  fields.original.value = "";
  fields.category.value = "";
  fields.badge.value = "";
  fields.imageUrl.value = "";
  if (fields.imageFile) fields.imageFile.value = "";
  if (imagePreview) {
    imagePreview.src = "";
    imagePreview.classList.remove("active");
  }
  fields.collection.value = "best-sellers";
  fields.active.checked = true;
  formTitle.textContent = "Catalogo de Produtos";
  setStatus("");
};

const clearCouponForm = () => {
  if (!couponFields.id) return;
  couponFields.id.value = "";
  couponFields.code.value = "";
  couponFields.percent.value = "";
  if (couponFields.expiresAt) couponFields.expiresAt.value = "";
  if (couponFields.usageLimit) couponFields.usageLimit.value = "";
  couponFields.active.checked = true;
  if (couponFormTitle) couponFormTitle.textContent = "Criar cupom";
  setCouponStatus("");
};

const fillCouponForm = (coupon) => {
  if (!couponFields.id) return;
  couponFields.id.value = coupon._id || coupon.id || "";
  couponFields.code.value = coupon.code || "";
  couponFields.percent.value = coupon.percent || "";
  if (couponFields.expiresAt) {
    couponFields.expiresAt.value = coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "";
  }
  if (couponFields.usageLimit) couponFields.usageLimit.value = coupon.usageLimit || 0;
  couponFields.active.checked = coupon.active !== false;
  if (couponFormTitle) couponFormTitle.textContent = "Editar cupom";
  setCouponStatus("");
};

const fillForm = (product) => {
  fields.id.value = product._id || product.id || "";
  fields.name.value = product.name || "";
  fields.description.value = product.description || "";
  fields.price.value = product.price || "";
  fields.original.value = product.original || "";
  fields.category.value = product.category || "";
  fields.badge.value = product.badge || "";
  fields.imageUrl.value = product.imageUrl || "";
  if (fields.imageFile) fields.imageFile.value = "";
  if (imagePreview && product.imageUrl) {
    imagePreview.src = product.imageUrl;
    imagePreview.classList.add("active");
  } else if (imagePreview) {
    imagePreview.src = "";
    imagePreview.classList.remove("active");
  }
  fields.collection.value = product.collection || "best-sellers";
  fields.active.checked = product.active !== false;
  formTitle.textContent = "Editar produto";
  setStatus("");
};

const fetchProducts = async () => {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) throw new Error("Erro ao carregar produtos");
  return response.json();
};

const fetchCoupons = async () => {
  const response = await fetch(`${API_BASE}/coupons`);
  if (!response.ok) throw new Error("Erro ao carregar cupons");
  return response.json();
};

const fetchOrders = async () => {
  const response = await fetch(`${API_BASE}/orders`);
  if (!response.ok) throw new Error("Erro ao carregar pedidos");
  return response.json();
};

const renderProducts = (items) => {
  cachedProducts = items;
  if (!items.length) {
    productList.innerHTML = "<p class=\"admin-muted\">Nenhum produto cadastrado.</p>";
    return;
  }

  productList.innerHTML = items
    .map(
      (item) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <strong>${item.name}</strong>
          <div class="admin-card-actions">
            <button class="icon-btn" data-edit="${item._id}"><ion-icon name="create-outline"></ion-icon></button>
            <button class="icon-btn" data-delete="${item._id}"><ion-icon name="trash-outline"></ion-icon></button>
          </div>
        </div>
        <div class="admin-chip">${item.collection || "best-sellers"}</div>
        <div class="admin-chip">${item.category || "Sem categoria"}</div>
        <div class="admin-chip">${item.active ? "Ativo" : "Inativo"}</div>
        <div class="admin-chip">${item.price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
      </div>
    `
    )
    .join("");
};

const renderCoupons = (items) => {
  if (!couponList) return;
  if (!items.length) {
    couponList.innerHTML = "<p class=\"admin-muted\">Nenhum cupom cadastrado.</p>";
    return;
  }

  couponList.innerHTML = items
    .map(
      (coupon) => {
        const now = new Date();
        const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
        const isLimitReached = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
        const status = coupon.active ? "Ativo" : "Inativo";
        const warning = isExpired ? "Expirado" : isLimitReached ? "Limite atingido" : "";

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
        <div class="admin-chip ${warning ? "alert" : ""}">${warning || status}</div>
        <div class="admin-chip">Usos: ${coupon.usedCount || 0}</div>
        <div class="admin-chip">Limite: ${coupon.usageLimit || 0}</div>
        <div class="admin-chip">Validade: ${coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "Sem validade"}</div>
      </div>
    `;
      }
    )
    .join("");
};

const renderOrders = (items) => {
  if (!ordersList) return;
  if (!items.length) {
    ordersList.innerHTML = "<p class=\"admin-muted\">Nenhuma venda registrada.</p>";
    return;
  }

  ordersList.innerHTML = items
    .map((order) => {
      const itemsHtml = order.items
        .map((item) => `- ${item.name} x${item.quantity}`)
        .join("<br>");
      const createdAt = order.createdAt
        ? new Date(order.createdAt).toLocaleString("pt-BR")
        : "";

      return `
        <div class="admin-card">
          <div class="admin-card-header">
            <h4>${order.customerName}</h4>
            <span class="admin-chip">${createdAt}</span>
          </div>
          <div class="order-meta">
            <span>${order.customerPhone || "Sem telefone"}</span>
            <span>${order.notes || "Sem observacoes"}</span>
          </div>
          <div class="order-items">${itemsHtml}</div>
          <div class="order-total">Total: ${order.total?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        </div>
      `;
    })
    .join("");
};

const renderMetrics = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ordersToday = cachedOrders.filter(
    (order) => order.createdAt && new Date(order.createdAt) >= startOfDay
  );
  const revenueToday = ordersToday.reduce((acc, order) => acc + (order.total || 0), 0);
  const uniqueClients = new Set(cachedOrders.map((order) => order.customerName || ""));

  if (metricClients) metricClients.textContent = uniqueClients.size || 0;
  if (metricProducts) metricProducts.textContent = cachedProducts.length || 0;
  if (metricSalesToday) metricSalesToday.textContent = ordersToday.length || 0;
  if (metricRevenueToday) {
    metricRevenueToday.textContent = revenueToday.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
};

const buildSalesSeries = (days) => {
  const now = new Date();
  const labels = [];
  const totals = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const label = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    labels.push(label);
    const total = cachedOrders
      .filter((order) => order.createdAt && new Date(order.createdAt).toDateString() === date.toDateString())
      .reduce((acc, order) => acc + (order.total || 0), 0);
    totals.push(Number(total.toFixed(2)));
  }

  return { labels, totals };
};

const buildTopProducts = () => {
  const counts = new Map();
  cachedOrders.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.name || "Produto";
      counts.set(key, (counts.get(key) || 0) + item.quantity);
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
      plugins: {
        legend: { display: false },
      },
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
      plugins: {
        legend: { labels: { color: "#b7bcc8" } },
      },
    },
  });
};

const renderTotals = (items) => {
  if (!ordersTotals) return;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - dayOfWeek);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sumBetween = (startDate) =>
    items
      .filter((order) => order.createdAt && new Date(order.createdAt) >= startDate)
      .reduce((acc, order) => acc + (order.total || 0), 0);

  const countBetween = (startDate) =>
    items.filter((order) => order.createdAt && new Date(order.createdAt) >= startDate).length;

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
  const query = orderSearch?.value.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((order) => {
      const inName = order.customerName?.toLowerCase().includes(query);
      const inItems = order.items?.some((item) => item.name?.toLowerCase().includes(query));
      return inName || inItems;
    });
  }

  const fromValue = orderFrom?.value;
  const toValue = orderTo?.value;
  if (fromValue) {
    const fromDate = new Date(fromValue);
    filtered = filtered.filter((order) => order.createdAt && new Date(order.createdAt) >= fromDate);
  }
  if (toValue) {
    const toDate = new Date(toValue);
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
  try {
    const items = await fetchProducts();
    renderProducts(items);
    renderMetrics();
  } catch (err) {
    renderProducts([]);
    setStatus("Falha ao carregar produtos.", true);
  }
};

const loadCoupons = async () => {
  try {
    const items = await fetchCoupons();
    cachedCoupons = items;
    renderCoupons(items);
  } catch (err) {
    renderCoupons([]);
    setCouponStatus("Falha ao carregar cupons.", true);
  }
};

const loadOrders = async () => {
  if (!ordersStatus) return;
  ordersStatus.textContent = "Atualizando...";
  try {
    const items = await fetchOrders();
    cachedOrders = items;
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
    await loadOrders();
    const lastOk = Number(ordersStatus?.dataset.lastOk || 0);
    if (lastOk) {
      interval = 5000;
    } else {
      interval = Math.min(interval + 5000, maxInterval);
    }
    setTimeout(poll, interval);
  };

  poll();
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Falha no upload");
  return response.json();
};

if (fields.imageFile) {
  fields.imageFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) {
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.classList.add("active");
    }
    setStatus("Enviando imagem...");
    try {
      const result = await uploadImage(file);
      fields.imageUrl.value = result.url || "";
      setStatus("Imagem enviada com sucesso.");
    } catch (err) {
      setStatus("Erro ao enviar imagem.", true);
    }
  });
}

if (fields.imageUrl) {
  fields.imageUrl.addEventListener("input", () => {
    const value = fields.imageUrl.value.trim();
    if (!imagePreview) return;
    if (value) {
      imagePreview.src = value;
      imagePreview.classList.add("active");
    } else {
      imagePreview.src = "";
      imagePreview.classList.remove("active");
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Salvando...");

  const payload = {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    price: Number(fields.price.value || 0),
    original: Number(fields.original.value || 0),
    category: fields.category.value.trim(),
    badge: fields.badge.value.trim(),
    imageUrl: fields.imageUrl.value.trim(),
    collection: fields.collection.value,
    active: fields.active.checked,
  };

  const id = fields.id.value;
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Erro ao salvar");
    setStatus("Produto salvo com sucesso.");
    clearForm();
    await loadProducts();
  } catch (err) {
    setStatus("Erro ao salvar produto.", true);
  }
});

productList.addEventListener("click", async (event) => {
  const editBtn = event.target.closest("[data-edit]");
  const deleteBtn = event.target.closest("[data-delete]");

  if (editBtn) {
    const id = editBtn.dataset.edit;
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (response.ok) {
      const product = await response.json();
      fillForm(product);
    }
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.delete;
    const confirmed = await openModal({
      title: "Remover produto",
      message: "Tem certeza que deseja remover este produto?",
      icon: "trash-outline",
    });
    if (!confirmed) return;
    const response = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setStatus("Produto removido.");
      await loadProducts();
    } else {
      setStatus("Erro ao remover produto.", true);
    }
  }
});

newProductBtn.addEventListener("click", clearForm);

document.getElementById("reset-form").addEventListener("click", clearForm);

loadProducts();
loadOrders();
startSmartPolling();

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

const exportCsv = () => {
  const rows = [["Cliente", "Telefone", "Total", "Data", "Itens", "Observacoes"]];
  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const query = orderSearch?.value.trim().toLowerCase();
  const fromValue = orderFrom?.value;
  const toValue = orderTo?.value;
  let data = [...cachedOrders];

  if (query) {
    data = data.filter((order) => {
      const inName = order.customerName?.toLowerCase().includes(query);
      const inItems = order.items?.some((item) => item.name?.toLowerCase().includes(query));
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
    const itemsText = order.items?.map((item) => `${item.name} x${item.quantity}`).join("; ") || "";
    rows.push([
      order.customerName || "",
      order.customerPhone || "",
      formatCurrency(order.total || 0),
      order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "",
      itemsText,
      order.notes || "",
    ]);
  });

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/\"/g, '""')}"`)
        .join(",")
    )
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

if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);

if (salesRange) salesRange.addEventListener("change", renderCharts);

sidebarLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebarLinks.forEach((link) => link.classList.remove("active"));
    sectionPanels.forEach((panel) => panel.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.section);
    if (target) target.classList.add("active");
  });
});

if (couponForm) {
  couponForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setCouponStatus("Salvando...");
    const payload = {
      code: couponFields.code.value.trim().toUpperCase(),
      percent: Number(couponFields.percent.value || 0),
      expiresAt: couponFields.expiresAt ? couponFields.expiresAt.value || null : null,
      usageLimit: Number(couponFields.usageLimit?.value || 0),
      active: couponFields.active.checked,
    };
    const id = couponFields.id.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/coupons/${id}` : `${API_BASE}/coupons`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Erro ao salvar");
      setCouponStatus("Cupom salvo com sucesso.");
      clearCouponForm();
      await loadCoupons();
    } catch (err) {
      setCouponStatus("Erro ao salvar cupom.", true);
    }
  });
}

if (couponList) {
  couponList.addEventListener("click", async (event) => {
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
      const response = await fetch(`${API_BASE}/coupons/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCouponStatus("Cupom removido.");
        await loadCoupons();
      } else {
        setCouponStatus("Erro ao remover cupom.", true);
      }
    }
  });
}

if (resetCouponBtn) resetCouponBtn.addEventListener("click", clearCouponForm);

loadCoupons();

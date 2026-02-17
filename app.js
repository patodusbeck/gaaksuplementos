const fallbackProducts = [
  {
    id: "creatina-monohidratada-500g",
    name: "Creatina Monohidratada 500g",
    price: 47.9,
    original: 59.9,
    category: "Creatina",
    badge: "Destaque",
  },
  {
    id: "whey-protein-isolado-900g",
    name: "Whey Protein Isolado 900g",
    price: 139.9,
    original: 179.9,
    category: "Proteína",
    badge: "Mais vendido",
  },
  {
    id: "pre-treino-dark-force-300g",
    name: "Pre-Treino Dark Force 300g",
    price: 89.9,
    original: 109.9,
    category: "Pre-treino",
    badge: "Energia",
  },
  {
    id: "kit-performance-whey-creatina",
    name: "Kit Performance (Whey + Creatina)",
    price: 179.9,
    original: 219.9,
    category: "Kits",
    badge: "Combo",
  },
  {
    id: "bcaa-211-200-caps",
    name: "BCAA 2:1:1 200 caps",
    price: 69.9,
    original: 89.9,
    category: "Recuperação",
    badge: "Recuperação",
  },
  {
    id: "termogenico-burn-60-caps",
    name: "Termogenico Burn 60 caps",
    price: 49.9,
    original: 69.9,
    category: "Emagrecimento",
    badge: "Top",
  },
];

const fallbackLaunches = [
  {
    id: "creatina-creapure-250g",
    name: "Creatina Creapure 250g",
    price: 79.9,
    original: 95.9,
    category: "Creatina",
    badge: "Novo",
  },
  {
    id: "pre-treino-nitro-pump-300g",
    name: "Pre-Treino Nitro Pump 300g",
    price: 99.9,
    original: 119.9,
    category: "Pre-treino",
    badge: "Lançamento",
  },
  {
    id: "whey-3w-blend-900g",
    name: "Whey 3W Blend 900g",
    price: 129.9,
    original: 149.9,
    category: "Proteína",
    badge: "Novo",
  },
  {
    id: "kit-definicao-burn-bcaa",
    name: "Kit Definição (Burn + BCAA)",
    price: 109.9,
    original: 139.9,
    category: "Kits",
    badge: "Combo",
  },
];

const fallbackKits = [
  {
    id: "kit-performance-whey-creatina",
    name: "Kit Performance (Whey + Creatina)",
    price: 179.9,
    original: 219.9,
    category: "Kits",
    badge: "Kit",
  },
  {
    id: "kit-definicao-burn-bcaa",
    name: "Kit Definicao (Burn + BCAA)",
    price: 109.9,
    original: 139.9,
    category: "Kits",
    badge: "Kit",
  },
];

const fallbackAccessories = [];

const instagramPosts = [
  {
    title: "Novidades e ofertas",
    url: "https://www.instagram.com/p/DSX9dDYDV0Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embed: "https://www.instagram.com/p/DSX9dDYDV0Q/embed",
  },
  {
    title: "Produtos em destaque",
    url: "https://www.instagram.com/p/DTBRZOklLwn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embed: "https://www.instagram.com/p/DTBRZOklLwn/embed",
  },
  {
    title: "Resultados de verdade",
    url: "https://www.instagram.com/p/DUtBWAGjWm4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    embed: "https://www.instagram.com/p/DUtBWAGjWm4/embed",
  },
];

let products = [...fallbackProducts];
let launches = [...fallbackLaunches];
let kits = [...fallbackKits];
let accessories = [...fallbackAccessories];
const cart = new Map();

const API_BASE = "/api";
let appliedCoupon = null;
let appliedDiscount = 0;

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeDigits = (value) => String(value || "").replace(/\D/g, "");

const formatPhoneInput = (value) => {
  const digits = normalizeDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const openWhatsAppDirect = (payload) => {
  if (!payload) return;
  const deepLink = payload.whatsappDeepLink;
  const webLink = payload.whatsappUrl;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  if (isMobile && deepLink) {
    window.location.href = deepLink;
    return;
  }

  if (webLink) {
    window.location.href = webLink;
  }
};

const renderProducts = (items, targetId) => {
  const container = document.getElementById(targetId);
  if (!container) return;
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<p class="admin-muted">Em breve, novos produtos nesta secao.</p>';
    return;
  }
  container.innerHTML = items
    .map((item) => {
      const imageUrl = String(item.imageUrl || "").trim() || "/data/images/gaaklogo.png";
      return `
      <article class="product-card">        <div class="product-image has-image" style="background-image:url('${imageUrl}')"></div>
        <h3>${item.name}</h3>
        <div class="price">
          <strong>${formatCurrency(item.price)}</strong>
        </div>
        <div class="installments">3x de ${formatCurrency(item.price / 3)} sem juros</div>
        <button class="primary" data-add="${item.id}">Adicionar ao carrinho</button>
      </article>
    `;
    })
    .join("");
};

const renderInstagram = () => {
  const container = document.getElementById("instagram-feed");
  if (!container) return;

  container.innerHTML = instagramPosts
    .map(
      (post) => `
      <article class="instagram-card">
        <strong>${post.title}</strong>
        <iframe
          class="instagram-embed"
          src="${post.embed}"
          title="${post.title}"
          loading="lazy"
          allowtransparency="true"
          frameborder="0"
          scrolling="no"
        ></iframe>
        <a class="link" href="${post.url}" target="_blank" rel="noopener noreferrer">Ver post no Instagram</a>
      </article>
    `
    )
    .join("");
};

const updateCartUI = () => {
  const cartBody = document.getElementById("cart-body");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartCouponEl = document.getElementById("cart-coupon");
  const cartTotalFinalEl = document.getElementById("cart-total-final");

  let subtotal = 0;
  let count = 0;

  cartBody.innerHTML = "";

  if (cart.size === 0) {
    cartBody.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }

  cart.forEach((entry) => {
    subtotal += entry.item.price * entry.qty;
    count += entry.qty;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-thumb"></div>
      <div>
        <strong>${entry.item.name}</strong>
        <div>${formatCurrency(entry.item.price)}</div>
        <div class="quantity">
          <button data-qty="dec" data-id="${entry.item.id}">-</button>
          <span>${entry.qty}</span>
          <button data-qty="inc" data-id="${entry.item.id}">+</button>
        </div>
      </div>
      <button class="link" data-remove="${entry.item.id}">Remover</button>
    `;
    cartBody.appendChild(row);
  });

  cartTotalEl.textContent = subtotal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
  cartCountEl.textContent = count;
  if (appliedCoupon) {
    appliedDiscount = subtotal * (appliedCoupon.percent / 100);
  }
  cartSubtotalEl.textContent = formatCurrency(subtotal);
  cartCouponEl.textContent = formatCurrency(appliedDiscount);
  cartTotalFinalEl.textContent = formatCurrency(subtotal - appliedDiscount);
};

const addToCart = (id) => {
  const item = getAllDisplayItems().find((product) => String(product.id) === String(id));
  if (!item) return;
  const key = String(id);
  const current = cart.get(key) || { item, qty: 0 };
  cart.set(key, { item, qty: current.qty + 1 });
  updateCartUI();
};

const updateQuantity = (id, delta) => {
  const key = String(id);
  const entry = cart.get(key);
  if (!entry) return;
  const next = entry.qty + delta;
  if (next <= 0) {
    cart.delete(key);
  } else {
    cart.set(key, { ...entry, qty: next });
  }
  updateCartUI();
};

const getAllDisplayItems = () => [...products, ...launches, ...kits, ...accessories];

const handleSearch = (query) => {
  const results = document.getElementById("search-results");
  if (!query) {
    results.innerHTML = "<span>Digite para buscar produtos.</span>";
    return;
  }
  const matches = getAllDisplayItems().filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    results.innerHTML = "<span>Nenhum produto encontrado.</span>";
    return;
  }

  results.innerHTML = matches
    .map(
      (item) => `
      <div class="search-result">
        <div>
          <strong>${item.name}</strong>
          <div>${formatCurrency(item.price)}</div>
        </div>
        <button class="primary" data-add="${item.id}">Adicionar</button>
      </div>
    `
    )
    .join("");
};

const lockBodyScroll = () => {
  if (document.body.classList.contains("cart-open")) return;
  scrollLockTop = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add("cart-open");
  document.body.style.top = `-${scrollLockTop}px`;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.left = "0";
  document.body.style.right = "0";
};

const unlockBodyScroll = () => {
  if (!document.body.classList.contains("cart-open")) return;
  document.body.classList.remove("cart-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.left = "";
  document.body.style.right = "";
  window.scrollTo(0, scrollLockTop);
};

const toggleDrawer = (open) => {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  if (!drawer) return;

  drawer.classList.toggle("active", open);
  drawer.setAttribute("aria-hidden", String(!open));

  if (backdrop) {
    backdrop.classList.toggle("active", open);
    backdrop.setAttribute("aria-hidden", String(!open));
  }

  if (open) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
};

const toggleSearch = (open) => {
  const overlay = document.getElementById("search-overlay");
  overlay.classList.toggle("active", open);
  overlay.setAttribute("aria-hidden", String(!open));
  if (open) {
    document.getElementById("search-input").focus();
  }
};

const applyCoupon = async (code) => {
  const cleanCode = String(code || "").trim().toUpperCase();
  if (!cleanCode) {
    appliedCoupon = null;
    appliedDiscount = 0;
    updateCartUI();
    return { ok: false, message: "Informe um cupom válido." };
  }

  try {
    const response = await fetch(`${API_BASE}/coupons/validate?code=${encodeURIComponent(cleanCode)}`);
    if (!response.ok) throw new Error("Erro ao buscar cupom");
    const data = await response.json();
    const coupon = data;
    if (!coupon) {
      appliedCoupon = null;
      appliedDiscount = 0;
      updateCartUI();
      return { ok: false, message: "Cupom inválido ou inativo." };
    }
    if (coupon.expiresAt) {
      const expiry = new Date(coupon.expiresAt);
      if (expiry < new Date()) {
        appliedCoupon = null;
        appliedDiscount = 0;
        updateCartUI();
        return { ok: false, message: "Cupom expirado." };
      }
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      appliedCoupon = null;
      appliedDiscount = 0;
      updateCartUI();
      return { ok: false, message: "Cupom atingiu o limite de uso." };
    }
    appliedCoupon = coupon;
    const subtotal = Array.from(cart.values()).reduce(
      (acc, entry) => acc + entry.item.price * entry.qty,
      0
    );
    appliedDiscount = subtotal * (coupon.percent / 100);
    updateCartUI();
    return { ok: true, message: `Cupom aplicado: ${coupon.percent}%` };
  } catch (err) {
    return { ok: false, message: "Não foi possível validar o cupom." };
  }
};

const loadProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/products?active=true`);
    if (!response.ok) throw new Error("Falha ao carregar produtos");
    const data = await response.json();
    const normalized = data.map((item) => ({
      ...item,
      id: item._id || item.id,
      original: item.original || item.price,
    }));

    products = normalized.filter((item) => item.collection === "best-sellers" || !item.collection);
    launches = normalized.filter((item) => item.collection === "launches");
    kits = normalized.filter(
      (item) => item.collection === "kits" || String(item.category || "").toLowerCase() === "kits"
    );
    accessories = normalized.filter((item) => {
      const collection = String(item.collection || "").toLowerCase();
      const category = String(item.category || "").toLowerCase();
      return collection === "accessories" || collection === "acessorios" || category === "acessorios";
    });

    if (products.length === 0) products = [...fallbackProducts];
    if (launches.length === 0) launches = [...fallbackLaunches];
    if (kits.length === 0) kits = [...fallbackKits];
  } catch (err) {
    products = [...fallbackProducts];
    launches = [...fallbackLaunches];
    kits = [...fallbackKits];
    accessories = [...fallbackAccessories];
  }
};

const scrollToId = (id) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const showInfo = (title, message, icon = "information-circle") => {
  const overlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalIcon = document.querySelector("#modal-icon ion-icon");

  if (!overlay || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.textContent = message;
  if (modalIcon) modalIcon.setAttribute("name", icon);
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
};

const getCheckoutErrorMessage = async (response) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  const backendMessage = String(
    (payload && (payload.error || payload.message || payload.detail || payload.details)) || ""
  ).trim();
  const requestId = String(response.headers.get("x-request-id") || "").trim();
  const suffix = requestId ? ` (ref: ${requestId})` : "";

  if (response.status === 400) {
    return backendMessage ? `${backendMessage}${suffix}` : `Dados do pedido inválidos.${suffix}`;
  }
  if (response.status === 401 || response.status === 403) {
    return `Ação não autorizada para finalizar o pedido.${suffix}`;
  }
  if (response.status === 404) {
    return `Serviço de pedidos indisponível no momento.${suffix}`;
  }
  if (response.status === 429) {
    return `Muitas tentativas. Aguarde alguns segundos e tente novamente.${suffix}`;
  }
  if (response.status >= 500) {
    return backendMessage ? `${backendMessage}${suffix}` : `Instabilidade no servidor ao criar o pedido.${suffix}`;
  }

  return backendMessage ? `${backendMessage}${suffix}` : `Não foi possível finalizar o pedido agora.${suffix}`;
};

const closeModal = () => {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
};

const menuMap = {
  categorias: "best-sellers-section",
  proteinas: "best-sellers-section",
  pretreino: "launches-section",
  kits: "kits-section",
};

document.addEventListener("click", (event) => {
  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    addToCart(addBtn.dataset.add);
    return;
  }

  const qtyBtn = event.target.closest("[data-qty]");
  if (qtyBtn) {
    const id = qtyBtn.dataset.id;
    updateQuantity(id, qtyBtn.dataset.qty === "inc" ? 1 : -1);
  }

  const removeBtn = event.target.closest("[data-remove]");
  if (removeBtn) {
    cart.delete(String(removeBtn.dataset.remove));
    updateCartUI();
  }

  const scrollBtn = event.target.closest("[data-scroll]");
  if (scrollBtn) {
    scrollToId(scrollBtn.dataset.scroll);
  }

  const menuBtn = event.target.closest("[data-menu]");
  if (menuBtn) {
    const targetId = menuMap[menuBtn.dataset.menu];
    if (targetId) {
      scrollToId(targetId);
    }
  }
});

const init = async () => {
  await loadProducts();
  renderProducts(products, "best-sellers");
  renderProducts(launches, "launches");
  renderProducts(kits, "kits");
  renderProducts(accessories, "accessories");
  renderInstagram();
  updateCartUI();

  const openCart = document.getElementById("open-cart");
  const closeCart = document.getElementById("close-cart");
  const continueShopping = document.getElementById("continue-shopping");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const openSearch = document.getElementById("open-search");
  const closeSearch = document.getElementById("close-search");
  const searchInput = document.getElementById("search-input");
  const searchOverlay = document.getElementById("search-overlay");
  const openTracking = document.getElementById("open-tracking");
  const openSupport = document.getElementById("open-support");
  const openAccount = document.getElementById("open-account");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutOverlay = document.getElementById("checkout-overlay");
  const closeCheckout = document.getElementById("close-checkout");
  const cancelCheckout = document.getElementById("cancel-checkout");
  const confirmCheckout = document.getElementById("confirm-checkout");
  const newsletterForm = document.getElementById("newsletter-form");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModalBtn = document.getElementById("close-modal");
  const modalOk = document.getElementById("modal-ok");
  const customerName = document.getElementById("customer-name");
  const customerPhone = document.getElementById("customer-phone");
  const customerStreet = document.getElementById("customer-street");
  const customerNumber = document.getElementById("customer-number");
  const customerNeighborhood = document.getElementById("customer-neighborhood");
  const customerCity = document.getElementById("customer-city");
  const customerComplement = document.getElementById("customer-complement");
  const checkoutFeedback = document.getElementById("checkout-feedback");
  const couponInput = document.getElementById("coupon-code");
  const applyCouponBtn = document.getElementById("apply-coupon");
  const confirmCheckoutDefaultText = confirmCheckout ? confirmCheckout.textContent : "Finalizar compra";

  const setCheckoutFeedback = (message = "") => {
    if (!checkoutFeedback) return;
    checkoutFeedback.textContent = String(message || "");
  };

  const setCheckoutSubmitting = (isSubmitting) => {
    if (!confirmCheckout) return;
    confirmCheckout.disabled = Boolean(isSubmitting);
    confirmCheckout.textContent = isSubmitting ? "Enviando..." : confirmCheckoutDefaultText;
  };

  const closeCheckoutModal = () => {
    if (!checkoutOverlay) return;
    setCheckoutFeedback("");
    setCheckoutSubmitting(false);
    checkoutOverlay.classList.remove("active");
    checkoutOverlay.setAttribute("aria-hidden", "true");
  };

  const openCheckoutModal = () => {
    if (!checkoutOverlay) return;
    setCheckoutFeedback("");
    setCheckoutSubmitting(false);
    checkoutOverlay.classList.add("active");
    checkoutOverlay.setAttribute("aria-hidden", "false");
    if (customerName) customerName.focus();
  };

  const submitCheckout = async () => {
    if (cart.size === 0) {
      setCheckoutFeedback("Adicione produtos antes de finalizar o pedido.");
      showInfo("Carrinho vazio", "Adicione produtos antes de finalizar o pedido.", "alert-circle-outline");
      closeCheckoutModal();
      return;
    }

    setCheckoutFeedback("");

    const nameValue = customerName ? customerName.value.trim() : "";
    const phoneValue = customerPhone ? customerPhone.value.trim() : "";
    const streetValue = customerStreet ? customerStreet.value.trim() : "";
    const numberValue = customerNumber ? customerNumber.value.trim() : "";
    const neighborhoodValue = customerNeighborhood ? customerNeighborhood.value.trim() : "";
    const cityValue = customerCity ? customerCity.value.trim() : "";
    const complementValue = customerComplement ? customerComplement.value.trim() : "";

    if (!nameValue) {
      setCheckoutFeedback("Informe seu nome para concluir o pedido.");
      if (customerName) customerName.focus();
      showInfo("Seu nome", "Informe seu nome para concluir o pedido.", "person-outline");
      return;
    }

    if (!streetValue || !neighborhoodValue || !cityValue) {
      setCheckoutFeedback("Preencha Rua, Bairro e Cidade para finalizar.");
      if (!streetValue && customerStreet) customerStreet.focus();
      else if (!neighborhoodValue && customerNeighborhood) customerNeighborhood.focus();
      else if (!cityValue && customerCity) customerCity.focus();
      showInfo("Endereço", "Preencha Rua, Bairro e Cidade para finalizar.", "location-outline");
      return;
    }

    const items = Array.from(cart.values()).map((entry) => {
      const payload = {
        productId: String(entry.item.id || ""),
        quantity: entry.qty,
      };
      return payload;
    });

    setCheckoutSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: nameValue,
          customerPhone: phoneValue,
          customerStreet: streetValue,
          customerNumber: numberValue,
          customerNeighborhood: neighborhoodValue,
          customerCity: cityValue,
          customerComplement: complementValue,
          items,
          couponCode: appliedCoupon ? appliedCoupon.code : "",
        }),
      });

      if (!response.ok) {
        const message = await getCheckoutErrorMessage(response);
        throw new Error(message);
      }
      const data = await response.json();
      setCheckoutFeedback("");
      cart.clear();
      appliedCoupon = null;
      appliedDiscount = 0;
      if (couponInput) couponInput.value = "";
      updateCartUI();
      closeCheckoutModal();
      toggleDrawer(false);
      openWhatsAppDirect(data);
    } catch (err) {
      const fallback = "Não foi possível enviar o pedido agora. Verifique sua conexão e tente novamente.";
      setCheckoutFeedback(err?.message || fallback);
      showInfo("Erro no pedido", err?.message || fallback, "alert-circle-outline");
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  if (customerPhone) {
    customerPhone.addEventListener("input", (event) => {
      event.target.value = formatPhoneInput(event.target.value);
    });
  }

  if (couponInput) {
    couponInput.addEventListener("input", (event) => {
      event.target.value = String(event.target.value || "").toUpperCase();
    });
  }

  if (openCart) openCart.addEventListener("click", () => toggleDrawer(true));
  if (closeCart) closeCart.addEventListener("click", () => toggleDrawer(false));
  if (continueShopping) continueShopping.addEventListener("click", () => toggleDrawer(false));
  if (cartBackdrop) cartBackdrop.addEventListener("click", () => toggleDrawer(false));

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.size === 0) {
        showInfo("Carrinho vazio", "Adicione produtos antes de finalizar o pedido.", "alert-circle-outline");
        return;
      }
      openCheckoutModal();
    });
  }

  if (confirmCheckout) confirmCheckout.addEventListener("click", submitCheckout);
  if (closeCheckout) closeCheckout.addEventListener("click", closeCheckoutModal);
  if (cancelCheckout) cancelCheckout.addEventListener("click", closeCheckoutModal);
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", (event) => {
      if (event.target === checkoutOverlay) closeCheckoutModal();
    });
  }

  if (openSearch) openSearch.addEventListener("click", () => toggleSearch(true));
  if (closeSearch) closeSearch.addEventListener("click", () => toggleSearch(false));
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      handleSearch(event.target.value);
    });
  }
  if (searchOverlay) {
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        toggleSearch(false);
      }
    });
  }

  if (openTracking) {
    openTracking.addEventListener("click", () => {
      showInfo(
        "Rastrear pedido",
        "Envie o numero do pedido no WhatsApp para acompanhar a entrega.",
        "location-outline"
      );
    });
  }
  if (openSupport) {
    openSupport.addEventListener("click", () => {
      showInfo("Atendimento", "Atendimento de segunda a sexta, 07h30 às 18h.", "headset-outline");
    });
  }
  if (openAccount) {
    openAccount.addEventListener("click", () => {
      showInfo("Minha conta", "Área de login em breve. Entre em contato para suporte.", "person-outline");
    });
  }

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", async () => {
      const result = await applyCoupon(couponInput ? couponInput.value : "");
      if (result.ok) {
        showInfo("Cupom aplicado", result.message, "ticket-outline");
      } else {
        showInfo("Cupom", result.message, "alert-circle-outline");
      }
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.target.reset();
      showInfo("Cadastro realizado", "Em breve você recebe novidades.", "mail-outline");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const checkoutOverlay = document.getElementById("checkout-overlay");
      if (checkoutOverlay && checkoutOverlay.classList.contains("active")) {
        checkoutOverlay.classList.remove("active");
        checkoutOverlay.setAttribute("aria-hidden", "true");
        return;
      }

      toggleDrawer(false);
      toggleSearch(false);
      closeModal();
    }
  });

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modalOk) modalOk.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }
};

init();






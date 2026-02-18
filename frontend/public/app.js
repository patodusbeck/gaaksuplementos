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

const fallbackAccessories = [
  {
    id: "camisa-dark-lab",
    name: "Camisa Dark Lab",
    description: "Camisa performance Dry Fit com modelagem esportiva para treino e uso casual.",
    price: 59.9,
    original: 79.9,
    category: "Acessorios",
    badge: "Destaque",
    imageUrl: "/data/products/moda/camdark.png",
  },
];

const fallbackStorefront = {
  alert: {
    primary: "15% OFF no Pix em suplementos selecionados",
    secondary: "Frete gratis acima de R$ 199,00",
  },
  mainBanner: {
    badge: "Oferta da semana",
    title: "Stack de forca e volume com desconto progressivo",
    description: "Creatina + Whey + Pre-treino com preco especial e entrega rapida.",
    priceFrom: "de R$ 289,90 por",
    priceTo: "R$ 219,90",
    imageUrl: "/data/images/image.png",
    primaryAction: { label: "Comprar agora", type: "scroll", target: "best-sellers-section" },
    secondaryAction: { label: "Ver kits", type: "scroll", target: "kits-section" },
  },
  sideBanners: [
    {
      eyebrow: "Pre-treino em alta",
      title: "Mais energia no treino",
      actionLabel: "Ver lancamentos",
      actionType: "scroll",
      actionTarget: "launches-section",
      imageUrl: "/data/images/banner.png",
      theme: "pump",
    },
    {
      eyebrow: "Destaque da loja",
      title: "Camisa Dark Lab",
      actionLabel: "Ver produto",
      actionType: "product",
      actionTarget: "camisa-dark-lab",
      imageUrl: "/data/products/moda/camdark.png",
      theme: "whey",
    },
  ],
  benefits: [
    { icon: "flash-outline", label: "Entrega rapida" },
    { icon: "shield-checkmark-outline", label: "Produtos originais" },
    { icon: "card-outline", label: "Pix e cartao" },
    { icon: "pricetag-outline", label: "Cupons exclusivos" },
  ],
  featuredProduct: {
    badge: "Destaque",
    title: "Camisa Dark Lab",
    priceText: "R$ 59,90",
    imageUrl: "/data/products/moda/camdark.png",
    productId: "camisa-dark-lab",
  },
};

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
let storefront = fallbackStorefront;
const cart = new Map();
let scrollLockTop = 0;
let bodyLockCount = 0;

const API_BASE = "/api";
let appliedCoupon = null;
let appliedDiscount = 0;
const DEFAULT_PRODUCT_IMAGE = "/data/images/gaaklogo.png";

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const sanitizeImageList = (images, limit = 3) =>
  (Array.isArray(images) ? images : [])
    .map((image) => String(image || "").trim())
    .filter(Boolean)
    .slice(0, limit);

const resolveProductImages = (product) => {
  const fromImages = sanitizeImageList(product?.images);
  const fromMain = String(product?.imageUrl || "").trim();
  const merged = sanitizeImageList(fromMain ? [fromMain, ...fromImages] : fromImages);
  if (merged.length > 0) return merged;
  return [DEFAULT_PRODUCT_IMAGE];
};

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
      const imageUrl = resolveProductImages(item)[0];
      const description = String(item.description || "Produto selecionado da GAAK SUPLEMENTOS.");
      const cardId = `product-${toDomSafeId(item.id)}`;
      return `
      <article class="product-card" id="${cardId}" data-open-product="${item.id}">
        <button class="product-image has-image product-image-link" type="button" data-open-product="${item.id}" style="background-image:url('${imageUrl}')"></button>
        <h3>${item.name}</h3>
        <p class="product-desc">${description}</p>
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

const toDomSafeId = (value) => String(value || "").replace(/[^a-zA-Z0-9_-]/g, "-");

const getProductById = (productId) =>
  getAllDisplayItems().find((item) => String(item.id) === String(productId));

const runStorefrontAction = (type, target) => {
  if (type === "product") {
    openProductModalById(target);
    return;
  }
  if (type === "scroll") {
    scrollToId(target);
  }
};

const renderStorefront = () => {
  const alertPrimary = document.getElementById("store-alert-primary");
  const alertSecondary = document.getElementById("store-alert-secondary");
  const storefrontGrid = document.getElementById("storefront-grid");
  const benefitsEl = document.getElementById("store-benefits");
  const heroFeaturedBadge = document.getElementById("hero-featured-badge");
  const heroFeaturedTitle = document.getElementById("hero-featured-title");
  const heroFeaturedPrice = document.getElementById("hero-featured-price");
  const heroFeaturedImage = document.getElementById("hero-featured-image");
  const heroFeaturedLink = document.getElementById("hero-featured-link");

  if (alertPrimary) alertPrimary.textContent = storefront.alert?.primary || fallbackStorefront.alert.primary;
  if (alertSecondary) {
    alertSecondary.textContent = storefront.alert?.secondary || fallbackStorefront.alert.secondary;
  }

  const main = storefront.mainBanner || fallbackStorefront.mainBanner;
  const side = (Array.isArray(storefront.sideBanners) ? storefront.sideBanners : fallbackStorefront.sideBanners)
    .slice(0, 2);

  if (storefrontGrid) {
    const bannerImage = String(main.imageUrl || "").trim();
    const bannerStyle = bannerImage
      ? `style="background-image: linear-gradient(150deg, rgba(23,28,42,0.92) 0%, rgba(15,19,32,0.95) 62%, rgba(10,13,20,0.96) 100%), url('${bannerImage}')"`
      : "";
    storefrontGrid.innerHTML = `
      <article class="storefront-banner-main" ${bannerStyle}>
        <div class="storefront-badge">${main.badge || "Oferta"}</div>
        <h2>${main.title || ""}</h2>
        <p>${main.description || ""}</p>
        <div class="storefront-actions">
          <button class="primary" data-storefront-action="${main.primaryAction?.type || "scroll"}" data-storefront-target="${main.primaryAction?.target || "best-sellers-section"}">
            ${main.primaryAction?.label || "Comprar"}
          </button>
          <button class="ghost" data-storefront-action="${main.secondaryAction?.type || "scroll"}" data-storefront-target="${main.secondaryAction?.target || "kits-section"}">
            ${main.secondaryAction?.label || "Ver mais"}
          </button>
        </div>
        <div class="storefront-price">
          <span>${main.priceFrom || ""}</span>
          <strong>${main.priceTo || ""}</strong>
        </div>
      </article>
      <div class="storefront-side">
        ${side
          .map(
            (item) => `
          <article class="storefront-mini banner-${item.theme || "pump"}">
            ${
              String(item.imageUrl || "").trim()
                ? `<img class="storefront-mini-image" src="${String(item.imageUrl).trim()}" alt="${item.title || "Banner"}" loading="lazy" />`
                : ""
            }
            <small>${item.eyebrow || ""}</small>
            <strong>${item.title || ""}</strong>
            <button
              class="link"
              data-storefront-action="${item.actionType || "scroll"}"
              data-storefront-target="${item.actionTarget || "best-sellers-section"}"
            >
              ${item.actionLabel || "Ver"}
            </button>
          </article>
        `
          )
          .join("")}
      </div>
    `;
  }

  const benefits = Array.isArray(storefront.benefits) ? storefront.benefits : fallbackStorefront.benefits;
  if (benefitsEl) {
    benefitsEl.innerHTML = benefits
      .map(
        (item) => `
        <div class="benefit-item">
          <ion-icon name="${item.icon || "flash-outline"}"></ion-icon>
          <span>${item.label || ""}</span>
        </div>
      `
      )
      .join("");
  }

  const featured = storefront.featuredProduct || fallbackStorefront.featuredProduct;
  if (heroFeaturedBadge) heroFeaturedBadge.textContent = featured.badge || "Destaque";
  if (heroFeaturedTitle) heroFeaturedTitle.textContent = featured.title || "";
  if (heroFeaturedPrice) heroFeaturedPrice.textContent = featured.priceText || "";
  if (heroFeaturedImage) {
    heroFeaturedImage.src = String(featured.imageUrl || "/data/products/moda/camdark.png");
    heroFeaturedImage.alt = featured.title || "Produto em destaque";
  }
  if (heroFeaturedLink) {
    heroFeaturedLink.setAttribute("data-featured-product", String(featured.productId || ""));
  }
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

const addToCart = (id, quantity = 1) => {
  const item = getAllDisplayItems().find((product) => String(product.id) === String(id));
  if (!item) return;
  const key = String(id);
  const current = cart.get(key) || { item, qty: 0 };
  const qty = Math.max(1, Number(quantity || 1));
  cart.set(key, { item, qty: current.qty + qty });
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
  if (bodyLockCount > 0) {
    bodyLockCount += 1;
    return;
  }
  scrollLockTop = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add("cart-open");
  document.body.style.top = `-${scrollLockTop}px`;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.left = "0";
  document.body.style.right = "0";
  bodyLockCount = 1;
};

const unlockBodyScroll = () => {
  if (bodyLockCount === 0) return;
  bodyLockCount -= 1;
  if (bodyLockCount > 0) return;
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

const normalizeCatalogItems = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => {
      if (!item || typeof item !== "object") return false;
      if (!item.id || !item.name) return false;
      const price = Number(item.price);
      if (!Number.isFinite(price)) return false;
      return item.active !== false;
    })
    .map((item) => ({
      ...item,
      id: item._id || item.id,
      original: item.original || item.price,
      description: String(item.description || "").trim(),
    }));

const loadImageMap = async () => {
  try {
    const response = await fetch("/data/images.json");
    if (!response.ok) throw new Error("Falha ao carregar imagens");
    const data = await response.json();
    const map = new Map();
    (Array.isArray(data) ? data : []).forEach((entry) => {
      const id = String(entry?.id || "").trim();
      if (!id) return;
      const legacyImage = String(entry?.imageUrl || "").trim();
      const images = sanitizeImageList(entry?.images);
      const merged = sanitizeImageList(legacyImage ? [legacyImage, ...images] : images);
      if (merged.length > 0) {
        map.set(id, merged);
      }
    });
    return map;
  } catch (err) {
    return new Map();
  }
};

const applyImageMapToCatalog = (items, imageMap) =>
  items.map((item) => {
    const productId = String(item.id || "");
    const imagesFromMap = sanitizeImageList(imageMap.get(productId));
    const existingImages = resolveProductImages(item);
    const images = imagesFromMap.length > 0 ? imagesFromMap : existingImages;
    return {
      ...item,
      imageUrl: images[0] || DEFAULT_PRODUCT_IMAGE,
      images,
    };
  });

const loadProducts = async () => {
  const imageMap = await loadImageMap();

  try {
    const response = await fetch(`${API_BASE}/products?active=true`);
    if (!response.ok) throw new Error("Falha ao carregar produtos");
    const data = await response.json();
    const normalized = applyImageMapToCatalog(normalizeCatalogItems(data), imageMap);

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

    if (products.length === 0) products = applyImageMapToCatalog([...fallbackProducts], imageMap);
    if (launches.length === 0) launches = applyImageMapToCatalog([...fallbackLaunches], imageMap);
    if (kits.length === 0) kits = applyImageMapToCatalog([...fallbackKits], imageMap);
    if (accessories.length === 0) accessories = applyImageMapToCatalog([...fallbackAccessories], imageMap);
  } catch (apiErr) {
    try {
      const staticResponse = await fetch("/data/products.json");
      if (!staticResponse.ok) throw new Error("Falha ao carregar products.json");
      const staticData = await staticResponse.json();
      const normalized = applyImageMapToCatalog(normalizeCatalogItems(staticData), imageMap);

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

      if (products.length === 0) products = applyImageMapToCatalog([...fallbackProducts], imageMap);
      if (launches.length === 0) launches = applyImageMapToCatalog([...fallbackLaunches], imageMap);
      if (kits.length === 0) kits = applyImageMapToCatalog([...fallbackKits], imageMap);
      if (accessories.length === 0) accessories = applyImageMapToCatalog([...fallbackAccessories], imageMap);
    } catch (err) {
      products = applyImageMapToCatalog([...fallbackProducts], imageMap);
      launches = applyImageMapToCatalog([...fallbackLaunches], imageMap);
      kits = applyImageMapToCatalog([...fallbackKits], imageMap);
      accessories = applyImageMapToCatalog([...fallbackAccessories], imageMap);
    }
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

const postJsonWithTimeout = async (url, body, timeoutMs = 25000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const loadStorefront = async () => {
  try {
    const response = await fetch("/data/banners.json");
    if (!response.ok) throw new Error("Falha ao carregar banners");
    const data = await response.json();
    storefront = data && typeof data === "object" ? data : fallbackStorefront;
  } catch (err) {
    storefront = fallbackStorefront;
  }
};

const closeModal = () => {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
};

let productModalState = { productId: "", quantity: 1, images: [DEFAULT_PRODUCT_IMAGE], currentImageIndex: 0 };

const setProductModalQuantity = (value) => {
  const qtyEl = document.getElementById("product-qty-value");
  const next = Math.max(1, Number(value || 1));
  productModalState.quantity = next;
  if (qtyEl) qtyEl.textContent = String(next);
};

const renderProductModalCarousel = () => {
  const image = document.getElementById("product-modal-image");
  const dots = document.getElementById("product-carousel-dots");
  const prevBtn = document.getElementById("product-image-prev");
  const nextBtn = document.getElementById("product-image-next");
  if (!image || !dots || !prevBtn || !nextBtn) return;

  const images = sanitizeImageList(productModalState.images);
  const total = images.length > 0 ? images.length : 1;
  if (productModalState.currentImageIndex >= total) productModalState.currentImageIndex = 0;

  const currentImage = images[productModalState.currentImageIndex] || DEFAULT_PRODUCT_IMAGE;
  image.src = currentImage;
  image.alt = `${document.getElementById("product-modal-title")?.textContent || "Produto"} (${productModalState.currentImageIndex + 1}/${total})`;

  dots.innerHTML = Array.from({ length: total }, (_, index) => {
    const activeClass = index === productModalState.currentImageIndex ? "active" : "";
    return `<button class="product-carousel-dot ${activeClass}" type="button" data-product-dot="${index}" aria-label="Ver imagem ${index + 1}"></button>`;
  }).join("");

  const oneImage = total <= 1;
  prevBtn.disabled = oneImage;
  nextBtn.disabled = oneImage;
};

const setProductModalImages = (images) => {
  const normalized = sanitizeImageList(images);
  productModalState.images = normalized.length > 0 ? normalized : [DEFAULT_PRODUCT_IMAGE];
  productModalState.currentImageIndex = 0;
  renderProductModalCarousel();
};

const changeProductModalImage = (delta) => {
  const images = sanitizeImageList(productModalState.images);
  const total = images.length;
  if (total <= 1) return;
  productModalState.currentImageIndex = (productModalState.currentImageIndex + delta + total) % total;
  renderProductModalCarousel();
};

const closeProductModal = () => {
  const overlay = document.getElementById("product-overlay");
  if (!overlay) return;
  if (!overlay.classList.contains("active")) return;
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  unlockBodyScroll();
};

const openProductModalById = (productId) => {
  const product = getProductById(productId);
  if (!product) return;

  const overlay = document.getElementById("product-overlay");
  const title = document.getElementById("product-modal-title");
  const image = document.getElementById("product-modal-image");
  const description = document.getElementById("product-modal-description");
  const price = document.getElementById("product-modal-price");
  const installments = document.getElementById("product-modal-installments");
  const addBtn = document.getElementById("product-modal-add");

  if (!overlay || !title || !image || !description || !price || !installments || !addBtn) return;
  if (overlay.classList.contains("active")) return;

  productModalState.productId = String(product.id);
  setProductModalQuantity(1);

  title.textContent = product.name || "Produto";
  description.textContent = product.description || "Produto selecionado da GAAK SUPLEMENTOS.";
  price.textContent = formatCurrency(Number(product.price || 0));
  installments.textContent = `3x de ${formatCurrency(Number(product.price || 0) / 3)} sem juros`;
  setProductModalImages(resolveProductImages(product));
  image.src = productModalState.images[0] || DEFAULT_PRODUCT_IMAGE;
  image.alt = product.name || "Produto";
  addBtn.textContent = `Adicionar ${formatCurrency(Number(product.price || 0))}`;

  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  lockBodyScroll();
};

const goToProductById = (productId, openModalAfterScroll = true) => {
  const anchorId = `product-${toDomSafeId(productId)}`;
  const target = document.getElementById(anchorId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("product-focus");
    setTimeout(() => target.classList.remove("product-focus"), 1400);
  } else {
    scrollToId("accessories-section");
  }
  if (openModalAfterScroll) {
    setTimeout(() => openProductModalById(productId), 280);
  }
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

  const storefrontBtn = event.target.closest("[data-storefront-action]");
  if (storefrontBtn) {
    runStorefrontAction(
      storefrontBtn.getAttribute("data-storefront-action"),
      storefrontBtn.getAttribute("data-storefront-target")
    );
    return;
  }

  const featuredBtn = event.target.closest("[data-featured-product]");
  if (featuredBtn) {
    const productId = featuredBtn.getAttribute("data-featured-product");
    if (productId) goToProductById(productId, true);
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
    return;
  }

  const openProductBtn = event.target.closest("[data-open-product]");
  if (openProductBtn) {
    const isAddButton = event.target.closest("[data-add]");
    if (isAddButton) return;
    openProductModalById(openProductBtn.getAttribute("data-open-product"));
  }
});

const init = async () => {
  await loadStorefront();
  await loadProducts();
  renderStorefront();
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
  const productOverlay = document.getElementById("product-overlay");
  const closeProductModalBtn = document.getElementById("close-product-modal");
  const productImagePrev = document.getElementById("product-image-prev");
  const productImageNext = document.getElementById("product-image-next");
  const productCarouselDots = document.getElementById("product-carousel-dots");
  const productQtyDec = document.getElementById("product-qty-dec");
  const productQtyInc = document.getElementById("product-qty-inc");
  const productModalAdd = document.getElementById("product-modal-add");
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
      const response = await postJsonWithTimeout(`${API_BASE}/orders`, {
          customerName: nameValue,
          customerPhone: phoneValue,
          customerStreet: streetValue,
          customerNumber: numberValue,
          customerNeighborhood: neighborhoodValue,
          customerCity: cityValue,
          customerComplement: complementValue,
          items,
          couponCode: appliedCoupon ? appliedCoupon.code : "",
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
      const timeoutMessage =
        "Tempo limite para finalizar pedido. Tente novamente em instantes.";
      const fallback = "Não foi possível enviar o pedido agora. Verifique sua conexão e tente novamente.";
      const message = err?.name === "AbortError" ? timeoutMessage : err?.message || fallback;
      setCheckoutFeedback(message);
      showInfo("Erro no pedido", message, "alert-circle-outline");
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

  if (productQtyDec) {
    productQtyDec.addEventListener("click", () => {
      setProductModalQuantity(productModalState.quantity - 1);
    });
  }
  if (productQtyInc) {
    productQtyInc.addEventListener("click", () => {
      setProductModalQuantity(productModalState.quantity + 1);
    });
  }
  if (productModalAdd) {
    productModalAdd.addEventListener("click", () => {
      if (!productModalState.productId) return;
      addToCart(productModalState.productId, productModalState.quantity);
      closeProductModal();
      toggleDrawer(true);
    });
  }
  if (productImagePrev) {
    productImagePrev.addEventListener("click", () => {
      changeProductModalImage(-1);
    });
  }
  if (productImageNext) {
    productImageNext.addEventListener("click", () => {
      changeProductModalImage(1);
    });
  }
  if (productCarouselDots) {
    productCarouselDots.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-product-dot]");
      if (!dot) return;
      const index = Number(dot.getAttribute("data-product-dot"));
      if (!Number.isFinite(index)) return;
      productModalState.currentImageIndex = Math.max(0, index);
      renderProductModalCarousel();
    });
  }
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener("click", closeProductModal);
  }
  if (productOverlay) {
    productOverlay.addEventListener("click", (event) => {
      if (event.target === productOverlay) closeProductModal();
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

      const productOverlay = document.getElementById("product-overlay");
      if (productOverlay && productOverlay.classList.contains("active")) {
        closeProductModal();
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






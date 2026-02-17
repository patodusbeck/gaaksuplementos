const { test, expect } = require("@playwright/test");

const catalog = [
  {
    id: "creatina-monohidratada-500g",
    name: "Creatina Monohidratada 500g",
    price: 47.9,
    original: 59.9,
    category: "Creatina",
    collection: "best-sellers",
    active: true,
  },
];

const fillAddress = async (page) => {
  await page.fill("#customer-name", "Cliente Teste");
  await page.fill("#customer-phone", "99999999999");
  await page.fill("#customer-street", "Rua A");
  await page.fill("#customer-number", "123");
  await page.fill("#customer-neighborhood", "Centro");
  await page.fill("#customer-city", "Cidade");
};

const openCheckoutWithOneItem = async (page) => {
  await page.goto("/");
  await expect(page.locator('[data-add="creatina-monohidratada-500g"]').first()).toBeVisible();

  await page.evaluate(() => {
    const addBtn = document.querySelector('[data-add="creatina-monohidratada-500g"]');
    if (addBtn) addBtn.click();
  });
  await page.click("#open-cart");
};

const openCheckoutModal = async (page) => {
  await page.click("#checkout-btn");
  await expect(page.locator("#checkout-overlay")).toHaveClass(/active/);
};

const mockCommonApi = async (page) => {
  await page.route("**/api/products?active=true", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(catalog),
    });
  });

  await page.route("**/api/coupons/validate?**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const code = requestUrl.searchParams.get("code");

    if (String(code || "").toUpperCase() === "GAAK") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: "GAAK",
          percent: 10,
          active: true,
          usageLimit: 0,
          usedCount: 0,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "null",
    });
  });
};

test.beforeEach(async ({ page }) => {
  await mockCommonApi(page);
});

test("checkout valida nome e endereco obrigatorios", async ({ page }) => {
  await openCheckoutWithOneItem(page);
  await openCheckoutModal(page);

  await page.click("#confirm-checkout");
  await expect(page.locator("#modal-overlay")).toHaveClass(/active/);
  await expect(page.locator("#modal-title")).toHaveText("Seu nome");
  await page.click("#modal-ok");

  await page.fill("#customer-name", "Cliente Teste");
  await page.click("#confirm-checkout");
  await expect(page.locator("#modal-title")).toHaveText("Endereço");
});

test("checkout aplica cupom, cria pedido e redireciona para WhatsApp", async ({ page }) => {
  let orderPayload = null;

  await page.route("**/api/orders", async (route) => {
    orderPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        orderId: "order-e2e-1",
        customerId: "customer-e2e-1",
        whatsappUrl: "https://wa.me/5599984065730?text=pedido-e2e",
      }),
    });
  });

  await page.route("https://wa.me/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>ok</body></html>",
    });
  });

  await openCheckoutWithOneItem(page);

  await page.fill("#coupon-code", "gaak");
  await page.click("#apply-coupon");
  await expect(page.locator("#modal-title")).toHaveText("Cupom aplicado");
  await page.click("#modal-ok");

  await openCheckoutModal(page);
  await fillAddress(page);
  await page.click("#confirm-checkout");

  await expect.poll(() => orderPayload).not.toBeNull();
  expect(orderPayload.customerName).toBe("Cliente Teste");
  expect(orderPayload.customerStreet).toBe("Rua A");
  expect(orderPayload.customerNeighborhood).toBe("Centro");
  expect(orderPayload.customerCity).toBe("Cidade");
  expect(orderPayload.couponCode).toBe("GAAK");
  expect(orderPayload.items).toEqual([{ productId: "creatina-monohidratada-500g", quantity: 1 }]);

  await page.waitForURL(/wa\.me\/5599984065730/);
});

test("checkout mostra mensagem detalhada para erro 4xx", async ({ page }) => {
  await page.route("**/api/orders", async (route) => {
    await route.fulfill({
      status: 400,
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-e2e-400",
      },
      body: JSON.stringify({ error: "Dados do pedido invalidos" }),
    });
  });

  await openCheckoutWithOneItem(page);
  await openCheckoutModal(page);
  await fillAddress(page);
  await page.click("#confirm-checkout");

  await expect(page.locator("#modal-title")).toHaveText("Erro no pedido");
  await expect(page.locator("#modal-body")).toContainText("Dados do pedido invalidos");
  await expect(page.locator("#modal-body")).toContainText("req-e2e-400");
});

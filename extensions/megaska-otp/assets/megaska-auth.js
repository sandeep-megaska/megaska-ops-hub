(function () {
  const API_BASE = "https://megaska-ops-hub-exs1.vercel.app/api";
  const SESSION_KEY = "megaska_session_token";
  const ACCOUNT_ENTRY_SELECTORS = [
    "[data-megaska-open-login]",
    "a[href='/account']",
    "a[href^='/account?']",
    "a[href$='/account']",
    "a[href='/account/login']",
    "a[href^='/account/login?']",
    "a[href*='/account/login']",
    "a[href*='/account/register']",
    "[data-account-link]",
    "[data-customer-login]",
    ".header__icon--account",
    ".header__account",
    ".site-nav__link--account",
    ".js_link_acc",
    ".kalles-account-icon",
    ".iccl-user",
    ".icon-user",
    ".site-header__account",
    ".customer-account-link",
    "[aria-label*='account' i]",
    "[title*='account' i]",
  ];

  function getSessionToken() {
    return localStorage.getItem(SESSION_KEY) || "";
  }

  function setSessionToken(token) {
    if (!token) return;
    localStorage.setItem(SESSION_KEY, token);
  }

  function clearSessionToken() {
    localStorage.removeItem(SESSION_KEY);
  }

  function buildHeaders(extraHeaders) {
    const token = getSessionToken();
    const headers = Object.assign(
      {
        "Content-Type": "application/json",
      },
      extraHeaders || {}
    );

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function apiFetch(path, options) {
    const opts = Object.assign(
      {
        method: "GET",
        headers: buildHeaders(),
      },
      options || {}
    );

    opts.headers = buildHeaders(opts.headers);

    const response = await fetch(`${API_BASE}${path}`, opts);

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message =
        (data && (data.error || data.message)) ||
        `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  function extractCustomer(sessionPayload) {
    return (
      sessionPayload?.customer ||
      sessionPayload?.user ||
      sessionPayload?.data?.customer ||
      null
    );
  }

  function extractSessionToken(payload) {
    return (
      payload?.sessionToken ||
      payload?.token ||
      payload?.data?.sessionToken ||
      payload?.data?.token ||
      ""
    );
  }

  async function requestOtp(phone) {
    return apiFetch("/otp/request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async function verifyOtp(phone, otp) {
    const data = await apiFetch("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    const token = extractSessionToken(data);
    if (token) {
      setSessionToken(token);
    }

    return data;
  }

  async function fetchSession() {
    const token = getSessionToken();

    if (!token) {
      return {
        authenticated: false,
        customer: null,
      };
    }

    try {
      const data = await apiFetch("/auth/session", {
        method: "GET",
      });

      if (!data?.authenticated) {
        clearSessionToken();
        return {
          authenticated: false,
          customer: null,
        };
      }

      return {
        authenticated: true,
        customer: extractCustomer(data),
        raw: data,
      };
    } catch (error) {
      console.warn("[Megaska Auth] Session check failed, clearing token", error);
      clearSessionToken();
      return {
        authenticated: false,
        customer: null,
      };
    }
  }

  async function fetchDashboardSummary() {
    return apiFetch("/dashboard/summary", {
      method: "GET",
    });
  }

  async function completeProfile(payload) {
    return apiFetch("/profile/complete", {
      method: "POST",
      body: JSON.stringify({
        firstName: payload?.firstName || "",
        lastName: payload?.lastName || "",
        email: payload?.email || "",
        addressLine1: payload?.addressLine1 || "",
        addressLine2: payload?.addressLine2 || "",
        city: payload?.city || "",
        stateProvince: payload?.stateProvince || "",
        postalCode: payload?.postalCode || "",
        countryRegion: payload?.countryRegion || "",
      }),
    });
  }

  async function logout() {
    const token = getSessionToken();

    if (!token) {
      return { success: true, revoked: false };
    }

    try {
      const data = await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      clearSessionToken();
      return data;
    } catch (error) {
      clearSessionToken();
      throw error;
    }
  }

  function splitName(fullNameRaw) {
    const normalized = String(fullNameRaw || "").replace(/\s+/g, " ").trim();
    if (!normalized) return { firstName: "", lastName: "" };

    const parts = normalized.split(" ");
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ").trim(),
    };
  }

  function buildCheckoutPrefillParams(customer) {
    const source = customer || {};
    const fullName = source.fullName || source.firstName || "";
    const nameParts = splitName(fullName);
    const firstName = String(source.firstName || nameParts.firstName || "").trim();
    const lastName = String(source.lastName || nameParts.lastName || "").trim();
    const email = String(source.email || "").trim();
    const phone = String(source.phoneE164 || source.phone || "").trim();
    const addressLine1 = String(source.addressLine1 || "").trim();
    const addressLine2 = String(source.addressLine2 || "").trim();
    const city = String(source.city || "").trim();
    const stateProvince = String(source.stateProvince || "").trim();
    const postalCode = String(source.postalCode || "").trim();
    const countryRegion = String(source.countryRegion || "").trim();
    const params = {};

    // Keep Shopify checkout prefill aligned with Megaska flow:
    // - Contact section: email only
    // - Shipping section: phone
    // Do not populate contact phone fields (e.g. checkout[phone]).
    if (email) params["checkout[email]"] = email;
    if (phone) params["checkout[shipping_address][phone]"] = phone;
    if (firstName) {
      params["checkout[shipping_address][first_name]"] = firstName;
    }
    if (lastName) {
      params["checkout[shipping_address][last_name]"] = lastName;
    }
    if (addressLine1) {
      params["checkout[shipping_address][address1]"] = addressLine1;
    }
    if (addressLine2) {
      params["checkout[shipping_address][address2]"] = addressLine2;
    }
    if (city) {
      params["checkout[shipping_address][city]"] = city;
    }
    if (stateProvince) {
      params["checkout[shipping_address][province]"] = stateProvince;
    }
    if (postalCode) {
      params["checkout[shipping_address][zip]"] = postalCode;
    }
    if (countryRegion) {
      params["checkout[shipping_address][country]"] = countryRegion;
    }

    return params;
  }

  function applyCheckoutPrefillToUrl(rawUrl, customer) {
    if (!rawUrl) return rawUrl;
    const params = buildCheckoutPrefillParams(customer);
    if (!Object.keys(params).length) return rawUrl;

    const url = new URL(rawUrl, window.location.origin);
    // Remove any legacy contact phone query params to avoid forcing phone
    // into checkout contact fields.
    url.searchParams.delete("checkout[phone]");
    url.searchParams.delete("checkout[contact][phone]");

    Object.entries(params).forEach(([key, value]) => {
      if (!url.searchParams.get(key)) {
        url.searchParams.set(key, value);
      }
    });
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function applyCheckoutPrefillToForm(form, customer) {
    if (!form || typeof form.querySelector !== "function") return false;
    const params = buildCheckoutPrefillParams(customer);
    const entries = Object.entries(params);
    if (!entries.length) return false;

    // Remove legacy hidden contact phone inputs if they exist.
    form
      .querySelectorAll(
        "input[type='hidden'][name='checkout[phone]'], input[type='hidden'][name='checkout[contact][phone]']"
      )
      .forEach((legacyInput) => legacyInput.remove());

    entries.forEach(([name, value]) => {
      let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.setAttribute("data-megaska-prefill", "1");
        form.appendChild(input);
      }
      input.value = value;
    });

    return true;
  }

  async function fetchActiveCartContext() {
    const response = await fetch("/cart.js", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to read /cart.js (${response.status})`);
    }

    const cart = await response.json();
    return {
      cartToken: String(cart?.token || "").trim(),
      checkoutUrl: String(cart?.checkout_url || "").trim(),
      itemCount: Number(cart?.item_count || 0),
    };
  }

  async function writeMegaskaCartAttributes(attributes) {
    const sanitized = {};
    Object.entries(attributes || {}).forEach(([key, value]) => {
      const normalizedKey = String(key || "").trim();
      const normalizedValue = String(value || "").trim();
      if (!normalizedKey || !normalizedValue) return;
      sanitized[normalizedKey] = normalizedValue;
    });

    const response = await fetch("/cart/update.js", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        attributes: sanitized,
      }),
    });

    if (!response.ok) {
      throw new Error(`Unable to write cart attributes (${response.status})`);
    }

    return response.json();
  }

  async function applyBuyerIdentityToActiveCart(customer, options) {
    const opts = options || {};
    const source = customer || {};
    const email = String(source.email || "").trim();
    const phone = String(source.phoneE164 || source.phone || "").trim();
    const customerProfileId = String(source.id || "").trim();
    const shopifyCustomerId = String(source.shopifyCustomerId || "").trim();
    const verifiedAt = String(source.phoneVerifiedAt || "").trim();
    const hasContactInfo = Boolean(email || phone);

    if (!hasContactInfo) {
      console.log("[Megaska Buyer Identity] skipped - missing customer contact");
      return {
        ok: false,
        skipped: true,
        reason: "missing-customer-contact",
      };
    }

    const sessionToken = getSessionToken();
    if (!sessionToken) {
      console.log("[Megaska Buyer Identity] skipped - missing session token");
      return {
        ok: false,
        skipped: true,
        reason: "missing-session-token",
      };
    }

    const cartContext = await fetchActiveCartContext();
    const payload = {
      cartToken: cartContext.cartToken || undefined,
      checkoutUrl: opts.checkoutUrl || cartContext.checkoutUrl || undefined,
    };

    console.log("[Megaska Checkout Prefill] active cart detected", {
      cartToken: payload.cartToken || null,
      cartTokenSource: "cart.js.token",
      checkoutUrl: payload.checkoutUrl || null,
      checkoutUrlSource: opts.checkoutUrl ? "caller.checkoutUrl" : "cart.js.checkout_url",
      itemCount: cartContext.itemCount,
    });

    console.log("[Megaska Buyer Identity] update request", {
      cartToken: payload.cartToken || null,
      email: email || null,
      phone: phone || null,
    });

    console.log("[Megaska Verified Phone] active cart annotation started", {
      cartTokenPresent: Boolean(payload.cartToken),
      cartToken: payload.cartToken || null,
      hasVerifiedPhone: Boolean(phone),
    });

    if (!phone) {
      return {
        ok: false,
        skipped: false,
        reason: "missing-verified-phone",
        checkoutUrl: payload.checkoutUrl || null,
      };
    }

    try {
      const cartUpdateResult = await writeMegaskaCartAttributes({
        megaska_phone_verified: "true",
        megaska_verified_phone: phone,
        megaska_customer_profile_id: customerProfileId,
        megaska_shopify_customer_id: shopifyCustomerId,
        megaska_auth_source: "otp",
        megaska_auth_verified_at: verifiedAt,
      });
      console.log("[Megaska Verified Phone] active cart annotation complete", {
        cartToken: cartUpdateResult?.token || payload.cartToken || null,
        itemCount: Number(cartUpdateResult?.item_count || 0),
      });
    } catch (error) {
      console.error("[Megaska Verified Phone] active cart annotation failed", error);
    }

    const response = await fetch(`${API_BASE}/checkout/prefill`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || `Buyer identity update failed (${response.status})`);
    }

    return {
      ok: Boolean(data?.ok),
      skipped: Boolean(data?.skipped),
      reason: data?.reason || "",
      blocked: Boolean(data?.blocked),
      cartId: data?.cartId || null,
      checkoutUrl: data?.checkoutUrl || payload.checkoutUrl || null,
      buyerIdentity: data?.buyerIdentity || null,
      userErrors: Array.isArray(data?.userErrors) ? data.userErrors : [],
      apiErrors: Array.isArray(data?.apiErrors) ? data.apiErrors : [],
    };
  }

  function updateAuthUILoggedOut() {
    document.documentElement.classList.remove("megaska-authenticated");
    document.documentElement.classList.add("megaska-logged-out");

    document.querySelectorAll("[data-megaska-auth-guest]").forEach((el) => {
      el.hidden = false;
    });

    document.querySelectorAll("[data-megaska-auth-user]").forEach((el) => {
      const hasAccountEntry = Boolean(
        (typeof el.matches === "function" && el.matches(ACCOUNT_ENTRY_SELECTORS.join(","))) ||
          (typeof el.querySelector === "function" &&
            el.querySelector(ACCOUNT_ENTRY_SELECTORS.join(",")))
      );
      el.hidden = !hasAccountEntry;
    });
  }

  function updateAuthUILoggedIn(sessionData) {
    const customer = sessionData?.customer || sessionData || {};

    document.documentElement.classList.add("megaska-authenticated");
    document.documentElement.classList.remove("megaska-logged-out");

    document.querySelectorAll("[data-megaska-auth-guest]").forEach((el) => {
      el.hidden = true;
    });

    document.querySelectorAll("[data-megaska-auth-user]").forEach((el) => {
      el.hidden = false;
    });

    document.querySelectorAll("[data-megaska-customer-phone]").forEach((el) => {
      el.textContent = customer.phoneE164 || customer.phone || "";
    });

    document.querySelectorAll("[data-megaska-customer-name]").forEach((el) => {
      el.textContent =
        customer.fullName || customer.firstName || customer.name || "Account";
    });
  }

  async function refreshAuthState() {
    const session = await fetchSession();

    if (session.authenticated) {
      updateAuthUILoggedIn(session.customer);
    } else {
      updateAuthUILoggedOut();
    }

    document.dispatchEvent(
      new CustomEvent("megaska:auth-state-changed", {
        detail: { authenticated: session.authenticated, customer: session.customer || null },
      })
    );

    return session;
  }


  const DASHBOARD_ORDER_ACTIONS = [
    { key: "cancel", label: "Cancel Order", hint: "Cancellation module will be available soon." },
    { key: "return", label: "Return", hint: "Return requests will be enabled in the next phase." },
    { key: "exchange", label: "Exchange", hint: "Exchange workflow is coming soon." },
    { key: "defect", label: "Defect Report", hint: "Defect report flow will be connected soon." },
    { key: "refund", label: "Refund Status", hint: "Refund status tracking will be enabled soon." },
  ];

  function escHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatAddress(address) {
    if (!address) return "";
    return [
      address.line1 || address.address1,
      address.line2 || address.address2,
      [address.city, address.state || address.province].filter(Boolean).join(", "),
      [address.country, address.postalCode || address.zip].filter(Boolean).join(" "),
    ]
      .filter(Boolean)
      .join("<br/>");
  }

  function formatOrderTotal(order) {
    if (!order?.totalAmount || !order?.currencyCode) return "-";
    return `${escHtml(order.currencyCode)} ${escHtml(order.totalAmount)}`;
  }

  function renderOrderActions() {
    return DASHBOARD_ORDER_ACTIONS.map(
      (action) =>
        `<button type="button" class="megaska-dashboard-action-btn" data-megaska-order-action="${escHtml(
          action.key
        )}">${escHtml(action.label)}</button>`
    ).join("");
  }

  function renderOrderDetailsPanel() {
    return `
      <div class="megaska-order-detail-layer" data-megaska-order-layer hidden>
        <button type="button" class="megaska-order-detail-overlay" data-megaska-close-order-detail aria-label="Close order detail panel"></button>
        <aside class="megaska-order-detail-panel" role="dialog" aria-modal="true" aria-labelledby="megaska-order-detail-title">
          <div class="megaska-order-detail-header">
            <div>
              <p class="megaska-order-detail-kicker">Order details</p>
              <h3 id="megaska-order-detail-title">Order</h3>
            </div>
            <button type="button" class="megaska-order-detail-close" data-megaska-close-order-detail aria-label="Close">×</button>
          </div>
          <div class="megaska-order-detail-body">
            <div class="megaska-order-detail-top">
              <img data-megaska-order-image alt="" class="megaska-order-detail-image" />
              <div>
                <p class="megaska-order-detail-product" data-megaska-order-product>-</p>
                <p class="megaska-dashboard-subtle" data-megaska-order-date>-</p>
              </div>
            </div>
            <dl class="megaska-order-detail-meta">
              <div><dt>Order number</dt><dd data-megaska-order-number>-</dd></div>
              <div><dt>Total amount</dt><dd data-megaska-order-total>-</dd></div>
              <div><dt>Payment status</dt><dd data-megaska-order-payment>-</dd></div>
              <div><dt>Fulfillment status</dt><dd data-megaska-order-fulfillment>-</dd></div>
            </dl>
            <section class="megaska-order-detail-actions">
              <h4>Actions</h4>
              <div class="megaska-order-detail-actions-grid">
                ${renderOrderActions()}
              </div>
              <p class="megaska-order-action-hint" data-megaska-order-action-hint>Choose an action to continue.</p>
            </section>
          </div>
        </aside>
      </div>
    `;
  }

  function bindOrderDetailInteractions(container, orders) {
    const layer = container.querySelector("[data-megaska-order-layer]");
    if (!layer) return;

    const closeButtons = layer.querySelectorAll("[data-megaska-close-order-detail]");
    const titleEl = layer.querySelector("#megaska-order-detail-title");
    const numberEl = layer.querySelector("[data-megaska-order-number]");
    const dateEl = layer.querySelector("[data-megaska-order-date]");
    const productEl = layer.querySelector("[data-megaska-order-product]");
    const imageEl = layer.querySelector("[data-megaska-order-image]");
    const totalEl = layer.querySelector("[data-megaska-order-total]");
    const paymentEl = layer.querySelector("[data-megaska-order-payment]");
    const fulfillmentEl = layer.querySelector("[data-megaska-order-fulfillment]");
    const actionHint = layer.querySelector("[data-megaska-order-action-hint]");

    function closePanel() {
      layer.setAttribute("hidden", "hidden");
      document.body.classList.remove("megaska-order-detail-open");
    }

    function openPanel(order) {
      if (!order) return;
      const displayName = escHtml(order?.name || "Order");
      const productTitle = escHtml(order?.displayTitle || "Product details unavailable");
      const orderDate = escHtml(formatDate(order?.processedAt) || "-");
      const orderImage = String(order?.displayImage || "").trim();

      if (titleEl) titleEl.textContent = order?.name || "Order";
      if (numberEl) numberEl.textContent = order?.name || "-";
      if (dateEl) dateEl.textContent = orderDate;
      if (productEl) productEl.textContent = order?.displayTitle || "Product details unavailable";
      if (totalEl) totalEl.innerHTML = formatOrderTotal(order);
      if (paymentEl) paymentEl.textContent = order?.financialStatus || "Pending";
      if (fulfillmentEl) fulfillmentEl.textContent = order?.fulfillmentStatus || "Unfulfilled";
      if (actionHint) actionHint.textContent = `Choose an action for ${order?.name || "this order"}.`;

      if (imageEl) {
        if (orderImage) {
          imageEl.src = orderImage;
          imageEl.alt = `${displayName} ${productTitle}`;
          imageEl.removeAttribute("hidden");
        } else {
          imageEl.src = "";
          imageEl.alt = "";
          imageEl.setAttribute("hidden", "hidden");
        }
      }

      layer.removeAttribute("hidden");
      document.body.classList.add("megaska-order-detail-open");
    }

    closeButtons.forEach((button) => {
      button.addEventListener("click", closePanel);
    });

    container.querySelectorAll("[data-megaska-order-index]").forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-megaska-order-index") || "-1", 10);
        openPanel(orders[index]);
      });
    });

    layer.querySelectorAll("[data-megaska-order-action]").forEach((button) => {
      button.addEventListener("click", function () {
        const actionKey = this.getAttribute("data-megaska-order-action");
        const action = DASHBOARD_ORDER_ACTIONS.find((item) => item.key === actionKey);
        if (actionHint) actionHint.textContent = action?.hint || "This action will be available soon.";
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !layer.hasAttribute("hidden")) {
        closePanel();
      }
    });
  }

  function renderDashboardSummary(container, summary) {
    const profileName =
      [summary?.customer?.firstName, summary?.customer?.lastName].filter(Boolean).join(" ") ||
      "Megaska Customer";
    const verifiedPhone = summary?.customer?.phone || "-";
    const email = summary?.customer?.email || "-";
    const verified = Boolean(summary?.customer?.verified);
    const totalOrders = Number(summary?.stats?.totalOrders || 0);
    const openRequests = Number(summary?.stats?.openRequests || 0);
    const savedAddresses = Number(summary?.stats?.savedAddresses || 0);
    const storeCredit = Number(summary?.wallet?.balance || 0);
    const currency = summary?.wallet?.currency || "INR";
    const addressHtml = formatAddress(summary?.address);
    const orders = Array.isArray(summary?.orders) ? summary.orders : [];

    const ordersHtml = orders.length
      ? orders
          .map((order, index) => {
            const orderTotal = formatOrderTotal(order);

            return `<li class="megaska-dashboard-list-item">
              <button type="button" class="megaska-dashboard-order-card" data-megaska-order-index="${index}">
                <div>
                  <strong>${escHtml(order?.name || "Order")}</strong>
                  <div class="megaska-dashboard-subtle">${escHtml(formatDate(order?.processedAt) || "")}</div>
                </div>
                <div class="megaska-dashboard-order-right">
                  <div>${orderTotal}</div>
                  <div class="megaska-dashboard-subtle">${escHtml(order?.financialStatus || "")}</div>
                  <span class="megaska-dashboard-order-link">View details</span>
                </div>
              </button>
            </li>`;
          })
          .join("")
      : '<li class="megaska-dashboard-empty">No recent orders yet.</li>';

    container.innerHTML = `
      <section class="megaska-dashboard-card">
        <h2>${escHtml(profileName)}</h2>
        <p class="megaska-dashboard-subtle">Verified phone: ${escHtml(verifiedPhone)}</p>
        <p class="megaska-dashboard-subtle">Email: ${escHtml(email)}</p>
        <p class="megaska-dashboard-subtle">Verification status: ${verified ? "Verified" : "Pending"}</p>
      </section>
      <section class="megaska-dashboard-grid">
        <article class="megaska-dashboard-card"><h3>Total orders</h3><p>${totalOrders}</p></article>
        <article class="megaska-dashboard-card"><h3>Open requests</h3><p>${openRequests}</p></article>
        <article class="megaska-dashboard-card"><h3>Saved addresses</h3><p>${savedAddresses}</p></article>
        <article class="megaska-dashboard-card"><h3>Store credit</h3><p>${escHtml(currency)} ${storeCredit.toFixed(
      2
    )}</p></article>
      </section>
      <section class="megaska-dashboard-card">
        <h3>Recent orders</h3>
        <ul class="megaska-dashboard-list">${ordersHtml}</ul>
      </section>
      <section class="megaska-dashboard-card">
        <h3>Saved address</h3>
        ${
          addressHtml
            ? `<p class="megaska-dashboard-address">${addressHtml}</p>`
            : '<p class="megaska-dashboard-empty">No default address saved yet.</p>'
        }
      </section>
      <section class="megaska-dashboard-card">
        <h3>Quick actions</h3>
        <div class="megaska-dashboard-actions">
          <a href="/collections/all" class="megaska-dashboard-btn">Continue Shopping</a>
          <a href="/pages/contact" class="megaska-dashboard-btn megaska-dashboard-btn--secondary">Contact Support</a>
          <button type="button" data-megaska-logout class="megaska-dashboard-btn megaska-dashboard-btn--danger">Logout</button>
        </div>
      </section>
      ${renderOrderDetailsPanel()}
    `;

    bindOrderDetailInteractions(container, orders);
  }

  async function initDashboardPage() {
    const pathname = String(window?.location?.pathname || "");
    if (!pathname.includes("/pages/megaska-account")) return;

    const mountEl =
      document.querySelector("[data-megaska-account-dashboard]") ||
      document.getElementById("megaska-account-dashboard") ||
      document.querySelector("main") ||
      document.body;

    if (!mountEl) return;

    mountEl.classList.add("megaska-dashboard-root");
    mountEl.innerHTML = '<div class="megaska-dashboard-loading">Loading account dashboard...</div>';

    try {
      const summary = await fetchDashboardSummary();
      renderDashboardSummary(mountEl, summary);
      bindLogoutButtons();
    } catch (error) {
      console.error("[Megaska Dashboard] summary fetch failed", error);
      mountEl.innerHTML =
        '<div class="megaska-dashboard-error">Unable to load dashboard. Please login again.</div>';
    }
  }

  async function bootstrapAuth() {
    return refreshAuthState();
  }

  function bindLogoutButtons() {
    document.querySelectorAll("[data-megaska-logout]").forEach((button) => {
      if (button.dataset.megaskaBound === "1") return;
      button.dataset.megaskaBound = "1";

      button.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
          await logout();
        } catch (error) {
          console.error("[Megaska Auth] logout failed", error);
          alert("Logout failed. Please try again.");
        }

        updateAuthUILoggedOut();
      });
    });
  }

  async function init() {
    bindLogoutButtons();
    await bootstrapAuth();
    await initDashboardPage();
  }

  window.MegaskaAuth = {
    API_BASE,
    getSessionToken,
    setSessionToken,
    clearSessionToken,
    // Backward compatible aliases
    saveSessionToken: setSessionToken,
    fetchSession,
    fetchDashboardSummary,
    refreshAuthState,
    bootstrapAuth,
    requestOtp,
    verifyOtp,
    completeProfile,
    logout,
    buildCheckoutPrefillParams,
    applyCheckoutPrefillToUrl,
    applyCheckoutPrefillToForm,
    applyBuyerIdentityToActiveCart,
    fetchActiveCartContext,
    updateAuthUILoggedOut,
    updateAuthUILoggedIn,
    init,
  };

  document.addEventListener("DOMContentLoaded", init);
})();

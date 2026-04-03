(function () {
  const API_BASE = "https://megaska-ops-hub-exs1.vercel.app/api";
  const SESSION_KEY = "megaska_session_token";

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

  async function completeProfile(payload) {
    return apiFetch("/profile/complete", {
      method: "POST",
      body: JSON.stringify({
        fullName: payload?.fullName || "",
        email: payload?.email || "",
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
    const email = String(source.email || "").trim();
    const phone = String(source.phoneE164 || source.phone || "").trim();
    const params = {};

    if (email) params["checkout[email]"] = email;
    if (phone) params["checkout[shipping_address][phone]"] = phone;
    if (nameParts.firstName) {
      params["checkout[shipping_address][first_name]"] = nameParts.firstName;
    }
    if (nameParts.lastName) {
      params["checkout[shipping_address][last_name]"] = nameParts.lastName;
    }

    return params;
  }

  function applyCheckoutPrefillToUrl(rawUrl, customer) {
    if (!rawUrl) return rawUrl;
    const params = buildCheckoutPrefillParams(customer);
    if (!Object.keys(params).length) return rawUrl;

    const url = new URL(rawUrl, window.location.origin);
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

  async function applyBuyerIdentityToActiveCart(customer, options) {
    const opts = options || {};
    const source = customer || {};
    const email = String(source.email || "").trim();
    const phone = String(source.phoneE164 || source.phone || "").trim();
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
      cartTokenPresent: Boolean(payload.cartToken),
      checkoutUrlPresent: Boolean(payload.checkoutUrl),
      itemCount: cartContext.itemCount,
    });

    console.log("[Megaska Buyer Identity] update request", {
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
    });

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
      cartId: data?.cartId || null,
      checkoutUrl: data?.checkoutUrl || payload.checkoutUrl || null,
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
      el.hidden = true;
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
  }

  window.MegaskaAuth = {
    API_BASE,
    getSessionToken,
    setSessionToken,
    clearSessionToken,
    // Backward compatible aliases
    saveSessionToken: setSessionToken,
    fetchSession,
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

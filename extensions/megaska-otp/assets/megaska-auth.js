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
    } catch (error) {
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
      el.textContent = customer.firstName || customer.name || "Account";
    });
  }

  async function refreshAuthState() {
    const session = await fetchSession();

    if (session.authenticated) {
      updateAuthUILoggedIn(session.customer);
    } else {
      updateAuthUILoggedOut();
    }

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
    logout,
    updateAuthUILoggedOut,
    updateAuthUILoggedIn,
    init,
  };

  document.addEventListener("DOMContentLoaded", init);
})();

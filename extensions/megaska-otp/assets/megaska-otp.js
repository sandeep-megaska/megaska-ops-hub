(function () {
  const config = window.MEGASKA_OTP_CONFIG || {};
  const appProxyBase = config.appProxyBase || "/apps/megaska-otp";

  const defaultCountryCode = config.defaultCountryCode || "+91";
  const resendSeconds = Number(config.resendSeconds || 30) || 30;

  const AUTH_TOKEN_STORAGE_KEY = "megaska_customer_auth_token";

  const state = {
    intent: "page",
    afterLoginRedirect: window.location.pathname + window.location.search,
    phoneDigits: "",
    authToken: "",
    resendLeft: resendSeconds,
    resendTimer: null,
    isSending: false,
    isVerifying: false,
    isCompleting: false,
    sessionCheckPromise: null,
  };

  function apiUrl(path) {
    return `${appProxyBase}${path}`;
  }

  function jsonHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  // 🔐 TOKEN STORAGE (NEW SYSTEM)
  function getStoredAuthToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function setStoredAuthToken(token) {
    if (!token) return;
    try {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } catch {}
  }

  function clearStoredAuthToken() {
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {}
  }

  async function apiFetch(path, body, method = "POST") {
    const response = await fetch(apiUrl(path), {
      method,
      headers: jsonHeaders(),
      body: method === "GET" ? undefined : JSON.stringify(body || {}),
      credentials: "same-origin",
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.error || `Request failed`);
    }

    return data;
  }

  function getPhoneE164() {
    return `${defaultCountryCode}${state.phoneDigits}`;
  }

  // 🔐 SESSION CHECK (NEW SYSTEM)
  async function isLoggedIn(options = {}) {
    const authToken = getStoredAuthToken();
    if (!authToken) return false;

    try {
      const response = await fetch(apiUrl("/session"), {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ authToken }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data.authenticated === true) {
        return true;
      }

      clearStoredAuthToken();
      return false;
    } catch {
      return false;
    }
  }

  // ---------------- OTP FLOW ----------------

  async function verifyOtpCode() {
    if (state.isVerifying) return;

    const otp = getOtpValue();
    if (otp.length !== 4) return;

    try {
      state.isVerifying = true;

      const data = await apiFetch("/verify-otp", {
        otp,
        phoneE164: getPhoneE164(),
      });

      state.isVerifying = false;

      // 🔥 CRITICAL: STORE TOKEN
      if (!data.authToken) {
        throw new Error("Authentication failed");
      }

      setStoredAuthToken(data.authToken);

      // Returning user
      if (data.hasProfile && data.profileCompleted) {
        if (state.intent === "account") {
          closeModal();
          return;
        }

        window.location.href = state.afterLoginRedirect || "/checkout";
        return;
      }

      // First-time user
      renderProfileStep();
    } catch (error) {
      state.isVerifying = false;
      setError(error.message || "Invalid OTP");
    }
  }

  // ---------------- PROFILE ----------------

  function renderProfileStep() {
    const submitBtn = document.querySelector("#megaska-profile-submit");

    submitBtn.addEventListener("click", async () => {
      try {
        const firstName = document.querySelector("#megaska-first-name").value.trim();
        const email = document.querySelector("#megaska-email").value.trim();

        if (!firstName || !email) {
          setError("Please enter required details");
          return;
        }

        const authToken = getStoredAuthToken();

        await apiFetch("/complete-profile", {
          authToken,
          firstName,
          email,
        });

        if (state.intent === "account") {
          closeModal();
          return;
        }

        window.location.href = state.afterLoginRedirect || "/checkout";
      } catch (error) {
        setError(error.message || "Profile failed");
      }
    });
  }

  // ---------------- CHECKOUT INTERCEPT ----------------

  async function interceptCheckout(event) {
    event.preventDefault();

    const loggedIn = await isLoggedIn();

    if (loggedIn) {
      window.location.href = "/checkout";
      return;
    }

    openModal("checkout", "/checkout");
  }

  // ---------------- INIT ----------------

  function init() {
    bindCheckoutTargets();
    bindAccountLinks();
  }

  init();
})();
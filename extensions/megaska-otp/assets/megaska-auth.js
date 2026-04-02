(function () {
  const SESSION_KEY = "megaska_session_token";
  //const API_BASE = "http://localhost:3000/api";
const API_BASE = "https://refrigerative-strengtheningly-gerty.ngrok-free.dev/api";
console.log("[MegaskaAuth] API_BASE =", API_BASE);
  function saveSessionToken(token) {
    if (!token) return;
    localStorage.setItem(SESSION_KEY, token);
  }

  function getSessionToken() {
    return localStorage.getItem(SESSION_KEY) || "";
  }

  function clearSessionToken() {
    localStorage.removeItem(SESSION_KEY);
  }

  async function apiFetch(path, options) {
    const opts = Object.assign(
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      options || {}
    );

    const res = await fetch(`${API_BASE}${path}`, opts);

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message =
        data && typeof data.error === "string" ? data.error : "Request failed";
      throw new Error(message);
    }

    return data;
  }

  async function fetchSession() {
    const token = getSessionToken();

    if (!token) {
      return {
        authenticated: false,
        customer: null,
        session: null,
      };
    }

    try {
      const res = await fetch(
        `${API_BASE}/auth/session?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (!res.ok || !json.authenticated) {
        clearSessionToken();
        return {
          authenticated: false,
          customer: null,
          session: null,
        };
      }

      return json;
    } catch (error) {
      console.error("[Megaska Auth] fetchSession failed", error);
      return {
        authenticated: false,
        customer: null,
        session: null,
      };
    }
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

    if (data && data.sessionToken) {
      saveSessionToken(data.sessionToken);
    }

    return data;
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

  function setLoggedOutUI() {
    document.documentElement.classList.remove("megaska-authenticated");
    document.documentElement.classList.add("megaska-logged-out");

    document.querySelectorAll("[data-megaska-auth-guest]").forEach((el) => {
      el.hidden = false;
    });

    document.querySelectorAll("[data-megaska-auth-user]").forEach((el) => {
      el.hidden = true;
    });
  }

  function setLoggedInUI(customer) {
    document.documentElement.classList.add("megaska-authenticated");
    document.documentElement.classList.remove("megaska-logged-out");

    document.querySelectorAll("[data-megaska-auth-guest]").forEach((el) => {
      el.hidden = true;
    });

    document.querySelectorAll("[data-megaska-auth-user]").forEach((el) => {
      el.hidden = false;
    });

    document.querySelectorAll("[data-megaska-customer-phone]").forEach((el) => {
      el.textContent = customer?.phoneE164 || "";
    });

    document.querySelectorAll("[data-megaska-customer-name]").forEach((el) => {
      el.textContent = customer?.firstName || "Account";
    });
  }

  async function refreshAuthState() {
    const session = await fetchSession();

    if (session.authenticated) {
      setLoggedInUI(session.customer);
    } else {
      setLoggedOutUI();
    }

    return session;
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
        }

        setLoggedOutUI();
        window.location.reload();
      });
    });
  }

  async function init() {
    bindLogoutButtons();
    await refreshAuthState();
  }

  window.MegaskaAuth = {
    saveSessionToken,
    getSessionToken,
    clearSessionToken,
    fetchSession,
    refreshAuthState,
    requestOtp,
    verifyOtp,
    logout,
    init,
  };

  document.addEventListener("DOMContentLoaded", init);
})();
(function () {
  const config = window.MEGASKA_OTP_CONFIG || {};
  const appProxyBase = config.appProxyBase || "/apps/megaska-otp";
  const defaultCountryCode = config.defaultCountryCode || "+91";
  const AUTH_TOKEN_STORAGE_KEY = "megaska_customer_auth_token";

  const state = {
    intent: "page",
    afterLoginRedirect: window.location.pathname + window.location.search,
    phoneE164: "",
    authToken: "",
  };

  function apiUrl(path) {
    return `${appProxyBase}${path}`;
  }

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
    } catch {
      // no-op
    }
  }

  function clearStoredAuthToken() {
    state.authToken = "";
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      // no-op
    }
  }

  async function apiFetch(path, body, method = "POST") {
    const response = await fetch(apiUrl(path), {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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

    if (!response.ok || data.ok === false || data.success === false) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  function createModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "megaska-otp-backdrop";
    backdrop.innerHTML = `
      <div class="megaska-otp-modal" role="dialog" aria-modal="true" aria-label="Megaska login">
        <div class="megaska-otp-body" id="megaska-otp-root"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    return backdrop;
  }

  const backdrop = createModal();
  const root = backdrop.querySelector("#megaska-otp-root");

  function openModal(intent, redirectUrl) {
    state.intent = intent || "page";
    state.afterLoginRedirect =
      redirectUrl || (intent === "checkout" ? "/checkout" : window.location.pathname + window.location.search);
    renderPhoneStep();
    backdrop.classList.add("is-open");
  }

  function closeModal() {
    backdrop.classList.remove("is-open");
  }

  function setError(message) {
    const el = root.querySelector("[data-error]");
    if (el) el.textContent = message || "";
  }

  function renderShell(title, subtitle, contentHtml) {
    root.innerHTML = `
      <button class="megaska-otp-close" type="button" aria-label="Close">&times;</button>
      <h2 class="megaska-otp-title">${title}</h2>
      <p class="megaska-otp-subtitle">${subtitle}</p>
      <div data-error class="megaska-otp-error"></div>
      ${contentHtml}
    `;

    root.querySelector(".megaska-otp-close").addEventListener("click", closeModal);
  }

  function renderPhoneStep() {
    renderShell(
      "Login or Sign up",
      "Use your mobile number for secure access",
      `
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-phone" type="tel" inputmode="tel" placeholder="${defaultCountryCode} 9539180257" />
        </div>
        <button class="megaska-otp-btn" id="megaska-phone-submit" type="button">Continue</button>
        <div class="megaska-otp-note">We’ll send a one-time OTP for secure login.</div>
      `
    );

    root.querySelector("#megaska-phone-submit").addEventListener("click", async () => {
      try {
        setError("");
        const raw = root.querySelector("#megaska-phone").value.trim();
        const phoneE164 = normalizePhone(raw);
        state.phoneE164 = phoneE164;

        await apiFetch("/request-otp", {
          phoneE164,
          intent: state.intent,
          returnUrl: state.afterLoginRedirect,
        });

        renderOtpStep();
      } catch (error) {
        setError(error.message || "Failed to send OTP");
      }
    });
  }

  function renderOtpStep() {
    renderShell(
      "Enter OTP",
      `We sent an OTP to ${escapeHtml(state.phoneE164)}`,
      `
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-otp" type="text" inputmode="numeric" maxlength="10" placeholder="Enter OTP" />
        </div>
        <button class="megaska-otp-btn" id="megaska-otp-submit" type="button">Verify</button>
        <button class="megaska-otp-link" id="megaska-change-phone" type="button">Change number</button>
      `
    );

    root.querySelector("#megaska-change-phone").addEventListener("click", renderPhoneStep);

    root.querySelector("#megaska-otp-submit").addEventListener("click", async () => {
      try {
        setError("");
        const otp = root.querySelector("#megaska-otp").value.trim();

        const data = await apiFetch("/verify-otp", {
          otp,
          phoneE164: state.phoneE164,
        });

        if (!data.authToken) {
          throw new Error("Authentication token missing");
        }

        state.authToken = data.authToken;
        setStoredAuthToken(data.authToken);

        if (data.hasProfile && data.profileCompleted) {
          if (state.intent === "account") {
            closeModal();
            return;
          }

          window.location.href = state.afterLoginRedirect || "/checkout";
          return;
        }

        renderProfileStep();
      } catch (error) {
        setError(error.message || "OTP verification failed");
      }
    });
  }

  function renderProfileStep() {
    renderShell(
      "Complete your profile",
      "Just a couple of details to finish setup",
      `
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-first-name" type="text" placeholder="First name" />
        </div>
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-email" type="email" placeholder="Email address" />
        </div>
        <div class="megaska-otp-field">
          <label style="display:flex; gap:8px; align-items:flex-start; font-size:14px; color:#374151;">
            <input id="megaska-marketing-optin" type="checkbox" />
            <span>Send me updates on offers and new arrivals</span>
          </label>
        </div>
        <button class="megaska-otp-btn" id="megaska-profile-submit" type="button">Continue</button>
      `
    );

    root.querySelector("#megaska-profile-submit").addEventListener("click", async () => {
      try {
        setError("");
        const firstName = root.querySelector("#megaska-first-name").value.trim();
        const email = root.querySelector("#megaska-email").value.trim();
        const marketingOptIn = root.querySelector("#megaska-marketing-optin").checked;

        await apiFetch("/complete-profile", {
          authToken: state.authToken || getStoredAuthToken(),
          firstName,
          email,
          marketingOptIn,
        });

        if (state.intent === "account") {
          closeModal();
          return;
        }

        window.location.href = state.afterLoginRedirect || "/checkout";
      } catch (error) {
        setError(error.message || "Failed to complete profile");
      }
    });
  }

  function normalizePhone(raw) {
    const cleaned = raw.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) return cleaned;
    if (/^\d{10}$/.test(cleaned)) return `${defaultCountryCode}${cleaned}`;
    throw new Error("Please enter a valid mobile number");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function isLoggedIn() {
    const authToken = getStoredAuthToken();
    if (!authToken) return false;

    try {
      const response = await fetch(apiUrl("/session"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ authToken }),
        credentials: "same-origin",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data && data.authenticated === true) {
        return true;
      }

      clearStoredAuthToken();
      return false;
    } catch {
      return false;
    }
  }

  async function interceptCheckoutNow(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      window.location.href = "/checkout";
      return false;
    }

    openModal("checkout", "/checkout");
    return false;
  }

  function bindExactCheckoutTargets() {
    const checkoutButton = document.getElementById("CartDrawer-Checkout");
    if (checkoutButton && checkoutButton.dataset.megaskaOtpBound !== "true") {
      checkoutButton.dataset.megaskaOtpBound = "true";

      const clickHandler = async (event) => {
        await interceptCheckoutNow(event);
      };

      checkoutButton.addEventListener("pointerdown", clickHandler, true);
      checkoutButton.addEventListener("mousedown", clickHandler, true);
      checkoutButton.addEventListener("click", clickHandler, true);
    }

    const checkoutForm = document.getElementById("CartDrawer-Form");
    if (checkoutForm && checkoutForm.dataset.megaskaOtpBound !== "true") {
      checkoutForm.dataset.megaskaOtpBound = "true";

      checkoutForm.addEventListener(
        "submit",
        async (event) => {
          await interceptCheckoutNow(event);
        },
        true
      );
    }
  }

  function bindAccountLinksHard() {
    const selectors = [
      'a[href*="/customer_authentication/redirect"]',
      'a[href="/account"]',
      'a[href*="/account/login"]',
      'a[href*="/account"]',
      ".header__icon--account",
      ".customer-login-link"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      if (el.dataset.megaskaOtpAccountBound === "true") return;
      el.dataset.megaskaOtpAccountBound = "true";

      const originalHref = el.getAttribute("href") || "";
      el.dataset.megaskaOriginalHref = originalHref;

      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("href", "#");
      }

      const openAccountOtp = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }

        const loggedIn = await isLoggedIn();
        if (loggedIn) {
          closeModal();
          return false;
        }

        openModal("account", window.location.pathname + window.location.search);
        return false;
      };

      el.addEventListener("pointerdown", openAccountOtp, true);
      el.addEventListener("mousedown", openAccountOtp, true);
      el.addEventListener("click", openAccountOtp, true);
    });
  }

  function initMegaskaOtpBindings() {
    bindExactCheckoutTargets();
    bindAccountLinksHard();
  }

  initMegaskaOtpBindings();

  const otpObserver = new MutationObserver(() => {
    bindExactCheckoutTargets();
    bindAccountLinksHard();
  });

  otpObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

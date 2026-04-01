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
    lastSessionAuthenticated: false,
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

    if (!response.ok || data.ok === false || data.success === false) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  function getPhoneE164() {
    return `${defaultCountryCode}${state.phoneDigits}`;
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
    state.authToken = token;
    try {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } catch {}
  }

  function clearStoredAuthToken() {
    state.authToken = "";
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {}
  }

  function clearResendTimer() {
    if (state.resendTimer) {
      clearInterval(state.resendTimer);
      state.resendTimer = null;
    }
  }

  function startResendTimer() {
    clearResendTimer();
    state.resendLeft = resendSeconds;
    updateResendUi();

    state.resendTimer = setInterval(() => {
      state.resendLeft -= 1;
      updateResendUi();

      if (state.resendLeft <= 0) {
        clearResendTimer();
      }
    }, 1000);
  }

  function updateResendUi() {
    const timerEl = document.querySelector("[data-megaska-resend-timer]");
    const resendBtn = document.querySelector("[data-megaska-resend-btn]");

    if (timerEl) {
      timerEl.textContent =
        state.resendLeft > 0
          ? `Resend OTP in ${state.resendLeft}s`
          : "Didn't receive the OTP?";
    }

    if (resendBtn) {
      resendBtn.disabled = state.resendLeft > 0 || state.isSending || state.isVerifying;
    }
  }

  function maskPhone(digits) {
    if (!digits || digits.length !== 10) return `${defaultCountryCode}`;
    return `${defaultCountryCode} ••••••${digits.slice(-4)}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "megaska-otp-backdrop";
    backdrop.innerHTML = `
      <div class="megaska-otp-modal" role="dialog" aria-modal="true" aria-label="Megaska login">
        <button class="megaska-otp-close" type="button" aria-label="Close">&times;</button>
        <aside class="megaska-otp-branding" id="megaska-otp-branding"></aside>
        <section class="megaska-otp-panel">
          <div id="megaska-otp-root"></div>
        </section>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

    backdrop.querySelector(".megaska-otp-close").addEventListener("click", closeModal);
    return backdrop;
  }

  const backdrop = createModal();
  const root = backdrop.querySelector("#megaska-otp-root");
  const brandingRoot = backdrop.querySelector("#megaska-otp-branding");

  function renderBranding() {
    const bg = config.brandingBg || "#0f172a";
    const text = config.brandingText || "#ffffff";
    const heading = config.brandingHeading || "Welcome to Megaska";
    const subheading =
      config.brandingSubheading ||
      "Secure mobile login for faster checkout, easier order tracking, and seamless support.";
    const image = config.brandingImage || "";

    brandingRoot.style.setProperty("--megaska-branding-bg", bg);
    brandingRoot.style.setProperty("--megaska-branding-text", text);

    brandingRoot.innerHTML = `
      ${image ? `<div class="megaska-otp-branding-media" style="background-image:url('${image}')"></div>` : ""}
      <div class="megaska-otp-branding-inner">
        <div class="megaska-otp-badge">India Store</div>
        <h2 class="megaska-otp-branding-title">${escapeHtml(heading)}</h2>
        <p class="megaska-otp-branding-copy">${escapeHtml(subheading)}</p>
      </div>
      <div class="megaska-otp-branding-points">
        <div class="megaska-otp-point">• Faster checkout with mobile OTP</div>
        <div class="megaska-otp-point">• Easier order tracking and support</div>
        <div class="megaska-otp-point">• Seamless exchanges and future wallet access</div>
      </div>
    `;
  }

  function openModal(intent, redirectUrl) {
    state.intent = intent || "page";
    state.afterLoginRedirect =
      redirectUrl || (intent === "checkout" ? "/checkout" : window.location.pathname + window.location.search);
    state.isSending = false;
    state.isVerifying = false;
    state.isCompleting = false;
    setError("");
    renderBranding();
    renderPhoneStep();
    backdrop.classList.add("is-open");
  }

  function closeModal() {
    clearResendTimer();
    backdrop.classList.remove("is-open");
  }

  function setError(message) {
    const el = root.querySelector("[data-error]");
    if (el) el.textContent = message || "";
  }

  function renderShell(title, subtitle, contentHtml) {
    root.innerHTML = `
      <h2 class="megaska-otp-title">${title}</h2>
      <p class="megaska-otp-subtitle">${subtitle}</p>
      <div data-error class="megaska-otp-error"></div>
      ${contentHtml}
    `;
  }

  async function fetchSessionStatus() {
    const authToken = getStoredAuthToken();
    if (!authToken) {
      return {
        authenticated: false,
        profileCompleted: false,
        profile: null,
      };
    }

    const response = await fetch(apiUrl("/session"), {
      method: "POST",
      headers: jsonHeaders(),
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ authToken }),
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid session response");
    }

    return {
      authenticated: Boolean(data && data.authenticated),
      profileCompleted: Boolean(data && data.profileCompleted),
      profile: data && data.profile ? data.profile : null,
      reason: data && data.reason ? data.reason : null,
    };
  }

  async function isLoggedIn(options = {}) {
    const forceFresh = Boolean(options.forceFresh);

    if (!forceFresh && state.sessionCheckPromise) {
      try {
        const result = await state.sessionCheckPromise;
        return result.authenticated;
      } catch {
        return Boolean(getStoredAuthToken());
      }
    }

    state.sessionCheckPromise = (async () => {
      try {
        const result = await fetchSessionStatus();
        state.lastSessionAuthenticated = result.authenticated;

        if (!result.authenticated) {
          clearStoredAuthToken();
        }

        return result;
      } catch {
        return {
          authenticated: false,
          profileCompleted: false,
          profile: null,
          reason: "request_failed",
        };
      } finally {
        setTimeout(() => {
          state.sessionCheckPromise = null;
        }, 250);
      }
    })();

    const result = await state.sessionCheckPromise;
    return result.authenticated;
  }

  function renderPhoneStep() {
    clearResendTimer();

    renderShell(
      `<span class="megaska-trust-strip">
        Secure mobile login • Faster checkout • India only
      </span>
      Login or Sign up`,
      "Use your mobile number for secure access",
      `
        <div class="megaska-otp-field">
          <div class="megaska-otp-phone-wrap">
            <div class="megaska-otp-phone-code">
              <img
                src="https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/in.svg"
                class="megaska-flag"
                alt="India"
              />
              <span>+91</span>
            </div>
            <input
              class="megaska-otp-phone-only"
              id="megaska-phone"
              type="tel"
              inputmode="numeric"
              maxlength="10"
              placeholder="Enter 10-digit mobile number"
              autocomplete="tel-national"
            />
          </div>
          <p class="megaska-otp-helper">We currently support mobile login for India only.</p>
        </div>

        <button class="megaska-otp-btn" id="megaska-phone-submit" type="button">
          Continue
        </button>

        <div class="megaska-otp-note">We’ll send a 4-digit OTP for secure login.</div>
      `
    );

    const phoneInput = root.querySelector("#megaska-phone");
    const submitBtn = root.querySelector("#megaska-phone-submit");

    phoneInput.value = state.phoneDigits || "";
    phoneInput.focus();

    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });

    phoneInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    });

    submitBtn.addEventListener("click", async () => {
      try {
        setError("");

        const digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);

        if (digits.length !== 10) {
          setError("Please enter a valid 10-digit mobile number.");
          return;
        }

        state.phoneDigits = digits;
        state.isSending = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="megaska-otp-loading"><span class="megaska-otp-spinner"></span>Sending OTP...</span>`;

        await apiFetch("/request-otp", {
          phoneE164: getPhoneE164(),
          intent: state.intent,
          returnUrl: state.afterLoginRedirect,
        });

        state.isSending = false;
        renderOtpStep();
      } catch (error) {
        state.isSending = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue";
        setError(error.message || "Failed to send OTP.");
      }
    });
  }

  function renderOtpBoxes() {
    return `
      <div class="megaska-otp-otp-wrap" id="megaska-otp-wrap">
        <input class="megaska-otp-otp-box" inputmode="numeric" maxlength="1" data-otp-index="0" />
        <input class="megaska-otp-otp-box" inputmode="numeric" maxlength="1" data-otp-index="1" />
        <input class="megaska-otp-otp-box" inputmode="numeric" maxlength="1" data-otp-index="2" />
        <input class="megaska-otp-otp-box" inputmode="numeric" maxlength="1" data-otp-index="3" />
      </div>
    `;
  }

  function getOtpValue() {
    const boxes = Array.from(root.querySelectorAll("[data-otp-index]"));
    return boxes.map((box) => box.value || "").join("");
  }

  async function verifyOtpCode() {
    if (state.isVerifying) return;

    const otp = getOtpValue();
    if (otp.length !== 4) return;

    try {
      setError("");
      state.isVerifying = true;

      const statusEl = root.querySelector("[data-megaska-status]");
      if (statusEl) {
        statusEl.innerHTML = `<span class="megaska-otp-loading"><span class="megaska-otp-spinner"></span>Verifying OTP...</span>`;
      }

      const data = await apiFetch("/verify-otp", {
        otp,
        phoneE164: getPhoneE164(),
      });

      state.isVerifying = false;

      if (!data.authToken) {
        throw new Error("Authentication token missing");
      }

      setStoredAuthToken(data.authToken);

      if (data.hasProfile && data.profileCompleted) {
        if (state.intent === "account") {
          closeModal();
          return;
        }

        closeModal();
window.location.href = state.afterLoginRedirect || "/checkout";
return;
      }

      renderProfileStep();
    } catch (error) {
      state.isVerifying = false;

      const statusEl = root.querySelector("[data-megaska-status]");
      if (statusEl) {
        statusEl.innerHTML = "";
      }

      setError(error.message || "Invalid OTP. Please try again.");

      root.querySelectorAll("[data-otp-index]").forEach((box) => {
        box.value = "";
      });

      const firstBox = root.querySelector('[data-otp-index="0"]');
      if (firstBox) firstBox.focus();
    }
  }

  function bindOtpInputs() {
    const boxes = Array.from(root.querySelectorAll("[data-otp-index]"));
    if (!boxes.length) return;

    boxes[0].focus();

    boxes.forEach((box, index) => {
      box.addEventListener("input", () => {
        box.value = box.value.replace(/\D/g, "").slice(0, 1);

        if (box.value && index < boxes.length - 1) {
          boxes[index + 1].focus();
        }

        if (getOtpValue().length === 4) {
          verifyOtpCode();
        }
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && index > 0) {
          boxes[index - 1].focus();
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();

        const pasted = (e.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, 4);

        if (!pasted) return;

        pasted.split("").forEach((digit, i) => {
          if (boxes[i]) boxes[i].value = digit;
        });

        const nextIndex = Math.min(pasted.length, 3);
        const nextBox = boxes[nextIndex];
        if (nextBox) nextBox.focus();

        if (getOtpValue().length === 4) {
          verifyOtpCode();
        }
      });
    });
  }

  function renderOtpStep() {
    startResendTimer();

    renderShell(
      "Enter OTP",
      `We sent a 4-digit OTP to ${escapeHtml(maskPhone(state.phoneDigits))}`,
      `
        <p class="megaska-otp-meta">Enter the 4 digits below. Verification will continue automatically.</p>
        ${renderOtpBoxes()}
        <div class="megaska-otp-row">
          <button class="megaska-otp-link" id="megaska-change-phone" type="button">Change number</button>
          <div class="megaska-otp-helper" data-megaska-status></div>
        </div>
        <div class="megaska-otp-row" style="margin-top:14px;">
          <div class="megaska-otp-helper" data-megaska-resend-timer></div>
          <button class="megaska-otp-link" data-megaska-resend-btn type="button" disabled>Resend OTP</button>
        </div>
      `
    );

    bindOtpInputs();
    updateResendUi();

    root.querySelector("#megaska-change-phone").addEventListener("click", renderPhoneStep);

    root.querySelector("[data-megaska-resend-btn]").addEventListener("click", async () => {
      if (state.resendLeft > 0 || state.isSending || state.isVerifying) return;

      try {
        setError("");
        state.isSending = true;

        await apiFetch("/request-otp", {
          phoneE164: getPhoneE164(),
          intent: state.intent,
          returnUrl: state.afterLoginRedirect,
        });

        state.isSending = false;

        const statusEl = root.querySelector("[data-megaska-status]");
        if (statusEl) {
          statusEl.innerHTML = `<span class="megaska-otp-helper megaska-otp-success">A new OTP has been sent.</span>`;
        }

        startResendTimer();

        root.querySelectorAll("[data-otp-index]").forEach((box) => {
          box.value = "";
        });

        const firstBox = root.querySelector('[data-otp-index="0"]');
        if (firstBox) firstBox.focus();
      } catch (error) {
        state.isSending = false;
        setError(error.message || "Failed to resend OTP.");
      }
    });
  }

  function renderProfileStep() {
    clearResendTimer();

    renderShell(
      "Complete your profile",
      "Just two quick details to finish setup",
      `
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-first-name" type="text" placeholder="First name" autocomplete="given-name" />
        </div>
        <div class="megaska-otp-field">
          <input class="megaska-otp-input" id="megaska-email" type="email" placeholder="Email address" autocomplete="email" />
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

    const firstNameInput = root.querySelector("#megaska-first-name");
    const emailInput = root.querySelector("#megaska-email");
    const submitBtn = root.querySelector("#megaska-profile-submit");

    firstNameInput.focus();

    submitBtn.addEventListener("click", async () => {
      try {
        setError("");

        const firstName = firstNameInput.value.trim();
        const email = emailInput.value.trim();
        const marketingOptIn = root.querySelector("#megaska-marketing-optin").checked;

        if (!firstName) {
          setError("Please enter your first name.");
          return;
        }

        if (!email) {
          setError("Please enter your email address.");
          return;
        }

        state.isCompleting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";

        await apiFetch("/complete-profile", {
          authToken: state.authToken || getStoredAuthToken(),
          firstName,
          email,
          marketingOptIn,
        });

        state.isCompleting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue";

        if (state.intent === "account") {
          closeModal();
          return;
        }

       closeModal();
window.location.href = state.afterLoginRedirect || "/checkout";
      } catch (error) {
        state.isCompleting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue";
        setError(error.message || "Failed to complete profile.");
      }
    });
  }

  async function interceptCheckout(event) {
    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    const loggedIn = await isLoggedIn({ forceFresh: true });
    if (loggedIn) {
  closeModal();
  window.location.href = "/checkout";
  return false;
}

    openModal("checkout", "/checkout");
    return false;
  }

  function bindCheckoutTargets() {
    const checkoutButton = document.getElementById("CartDrawer-Checkout");
    if (checkoutButton && checkoutButton.dataset.megaskaOtpBound !== "true") {
      checkoutButton.dataset.megaskaOtpBound = "true";

      const handler = async (event) => {
        await interceptCheckout(event);
      };

      checkoutButton.addEventListener("pointerdown", handler, true);
      checkoutButton.addEventListener("mousedown", handler, true);
      checkoutButton.addEventListener("click", handler, true);
    }

    const checkoutForm = document.getElementById("CartDrawer-Form");
    if (checkoutForm && checkoutForm.dataset.megaskaOtpBound !== "true") {
      checkoutForm.dataset.megaskaOtpBound = "true";
      checkoutForm.addEventListener(
        "submit",
        async (event) => {
          await interceptCheckout(event);
        },
        true
      );
    }

    document
      .querySelectorAll('a[href*="/checkout"], button[name="checkout"], .cart__checkout-button')
      .forEach((el) => {
        if (el.dataset.megaskaOtpBound === "true") return;
        el.dataset.megaskaOtpBound = "true";

        const handler = async (event) => {
          await interceptCheckout(event);
        };

        el.addEventListener("pointerdown", handler, true);
        el.addEventListener("mousedown", handler, true);
        el.addEventListener("click", handler, true);
      });
  }

  function bindAccountLinks() {
    const selectors = [
      'a[href*="/customer_authentication/redirect"]',
      'a[href="/account"]',
      'a[href*="/account/login"]',
      'a[href*="/account"]',
      ".header__icon--account",
      ".customer-login-link",
    ];

    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      if (el.dataset.megaskaOtpAccountBound === "true") return;
      el.dataset.megaskaOtpAccountBound = "true";

      if (el.tagName.toLowerCase() === "a") {
        el.dataset.megaskaOriginalHref = el.getAttribute("href") || "/account";
        el.setAttribute("href", "#");
      }

      const handler = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }

        const loggedIn = await isLoggedIn({ forceFresh: true });
       if (loggedIn) {
  closeModal();
  alert("Megaska account login is successful. Account destination page will be connected next.");
  return false;
}

        openModal("account", window.location.pathname + window.location.search);
        return false;
      };

      el.addEventListener("pointerdown", handler, true);
      el.addEventListener("mousedown", handler, true);
      el.addEventListener("click", handler, true);
    });
  }

  function bindStorageSync() {
    window.addEventListener("storage", (event) => {
      if (event.key !== AUTH_TOKEN_STORAGE_KEY) return;

      if (!getStoredAuthToken()) {
        state.lastSessionAuthenticated = false;
      }
    });
  }

  async function bootstrapSessionState() {
    try {
      await isLoggedIn({ forceFresh: true });
    } catch {
      // no-op
    }
  }

  function init() {
    renderBranding();
    bindCheckoutTargets();
    bindAccountLinks();
    bindStorageSync();
    bootstrapSessionState();
  }

  init();

  const observer = new MutationObserver(() => {
    bindCheckoutTargets();
    bindAccountLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
(function () {
  const OTP_LENGTH = 4;
  const RESEND_SECONDS = 30;
  const SUCCESS_CLOSE_DELAY_MS = 1400;

  const state = {
    isOpen: false,
    step: "phone",
    phoneDigits: "",
    normalizedPhone: "",
    otpDigits: ["", "", "", ""],
    requesting: false,
    verifying: false,
    resendSeconds: 0,
    resendTimerId: null,
    errorMessage: "",
    successMessage: "Welcome back to Megaska",
  };
  let globalClickBound = false;
  let checkoutSubmitBound = false;
  let pendingContinuation = null;
  let checkoutInterceptionEnabled = false;

  const ACCOUNT_TRIGGER_SELECTORS = [
    "[data-megaska-open-login]",
    "a[href='/account']",
    "a[href$='/account']",
    "a[href*='/account/login']",
    "a[href*='/account/register']",
    "[data-account-link]",
    "[data-customer-login]",
    ".header__icon--account",
    ".site-header__account",
    ".customer-account-link",
  ];

  const CHECKOUT_TRIGGER_SELECTORS = [
    "a[href='/checkout']",
    "a[href*='/checkout']",
    "button[name='checkout']",
    "input[name='checkout']",
    "button[data-action='checkout']",
    "[data-checkout-button]",
  ];

  function sanitizeDigits(value, maxLength) {
    return String(value || "")
      .replace(/\D/g, "")
      .slice(0, maxLength);
  }

  function normalizeIndianPhone(phoneDigits) {
    if (!/^\d{10}$/.test(phoneDigits)) return "";
    return `+91${phoneDigits}`;
  }

  function maskPhone(phoneDigits) {
    if (!phoneDigits) return "+91 ••••• •••••";
    const first = phoneDigits.slice(0, 5);
    const second = phoneDigits.slice(5, 10);
    return `+91 ${first} ${second}`;
  }

  function isBusy() {
    return state.requesting || state.verifying;
  }

  function isModalOpen() {
    return state.isOpen;
  }

  function clearResendTimer() {
    if (state.resendTimerId) {
      clearInterval(state.resendTimerId);
      state.resendTimerId = null;
    }
  }

  function startResendTimer() {
    clearResendTimer();
    state.resendSeconds = RESEND_SECONDS;

    state.resendTimerId = setInterval(() => {
      state.resendSeconds = Math.max(0, state.resendSeconds - 1);
      updateResendUi();

      if (state.resendSeconds <= 0) {
        clearResendTimer();
      }
    }, 1000);

    updateResendUi();
  }

  function resetModalState(options) {
    const opts = options || {};
    const preservePhone = Boolean(opts.preservePhone);
    const savedPhone = preservePhone ? state.phoneDigits : "";
    const savedNormalizedPhone = preservePhone ? state.normalizedPhone : "";

    clearResendTimer();
    state.step = preservePhone && savedPhone ? "otp" : "phone";
    state.phoneDigits = savedPhone;
    state.normalizedPhone = savedNormalizedPhone;
    state.otpDigits = ["", "", "", ""];
    state.requesting = false;
    state.verifying = false;
    state.resendSeconds = 0;
    state.errorMessage = "";
    state.successMessage = "Welcome back to Megaska";
  }

  function ensureModal() {
    let modal = document.querySelector("[data-megaska-otp-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.setAttribute("data-megaska-otp-modal", "1");
    modal.setAttribute("aria-hidden", "true");
    modal.className = "megaska-otp-modal";
    modal.hidden = true;

    modal.innerHTML = `
      <div class="megaska-otp-backdrop" data-megaska-otp-backdrop></div>
      <div class="megaska-otp-dialog" role="dialog" aria-modal="true" aria-labelledby="megaska-otp-title">
        <section class="megaska-otp-brand" aria-hidden="true">
          <div class="megaska-otp-brand-badge">MEGASKA</div>
          <h3>Secure sign in for a smoother shopping experience</h3>
          <ul>
            <li>Faster checkout</li>
            <li>Easy order tracking</li>
            <li>Quick access to your account</li>
          </ul>
        </section>
        <section class="megaska-otp-flow">
          <button type="button" class="megaska-otp-close" data-megaska-otp-close aria-label="Close login modal">×</button>

          <div data-megaska-step-phone>
            <p class="megaska-otp-kicker">Welcome to Megaska</p>
            <h2 id="megaska-otp-title">Login or create your account</h2>
            <p class="megaska-otp-subtitle">Enter your mobile number to continue.</p>

            <label class="megaska-otp-label" for="megaska-phone-input">Mobile number</label>
            <div class="megaska-otp-phone-wrap" role="group" aria-label="Indian mobile number">
              <span class="megaska-otp-country" aria-hidden="true">🇮🇳 +91</span>
              <input
                id="megaska-phone-input"
                data-megaska-phone-input
                class="megaska-otp-phone-input"
                type="tel"
                inputmode="numeric"
                maxlength="10"
                autocomplete="tel-national"
                placeholder="98765 43210"
                aria-label="Enter 10 digit mobile number"
              />
            </div>
            <p class="megaska-otp-hint" data-megaska-phone-hint>We'll auto-send a 4-digit OTP when 10 digits are entered.</p>
          </div>

          <div data-megaska-step-otp hidden>
            <p class="megaska-otp-kicker">OTP Verification</p>
            <h2>Enter your 4-digit code</h2>
            <p class="megaska-otp-subtitle">
              Sent to <span data-megaska-phone-display></span>
              <button type="button" class="megaska-otp-link" data-megaska-edit-phone>Edit</button>
            </p>

            <div class="megaska-otp-inputs" data-megaska-otp-inputs>
              ${Array.from({ length: OTP_LENGTH })
                .map(
                  (_, index) => `
                <input
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="1"
                  class="megaska-otp-digit"
                  data-megaska-otp-digit
                  data-index="${index}"
                  aria-label="OTP digit ${index + 1}"
                />`
                )
                .join("")}
            </div>

            <div class="megaska-otp-resend-row">
              <span data-megaska-resend-text>Resend available in 30s</span>
              <button type="button" class="megaska-otp-link" data-megaska-resend disabled>Resend OTP</button>
            </div>
          </div>

          <div data-megaska-step-success hidden class="megaska-otp-success">
            <div class="megaska-otp-success-icon" aria-hidden="true">✓</div>
            <h2>You’re in</h2>
            <p data-megaska-success-message>Welcome back to Megaska</p>
          </div>

          <p class="megaska-otp-error" data-megaska-otp-error role="alert" aria-live="polite"></p>
        </section>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("[data-megaska-otp-close]").addEventListener("click", () => {
      closeModal("close-button");
    });

    modal.querySelector("[data-megaska-otp-backdrop]").addEventListener("click", () => {
      closeModal("backdrop");
    });

    const phoneInput = modal.querySelector("[data-megaska-phone-input]");
    phoneInput.addEventListener("input", handlePhoneInput);

    modal
      .querySelector("[data-megaska-edit-phone]")
      .addEventListener("click", handleEditPhone);
    modal.querySelector("[data-megaska-resend]").addEventListener("click", handleResend);

    modal.querySelectorAll("[data-megaska-otp-digit]").forEach((input) => {
      input.addEventListener("input", handleOtpInput);
      input.addEventListener("keydown", handleOtpKeyDown);
      input.addEventListener("paste", handleOtpPaste);
      input.addEventListener("focus", () => {
        input.select();
      });
    });

    document.addEventListener("keydown", handleEscClose);

    return modal;
  }

  function getModalParts() {
    const modal = ensureModal();
    return {
      modal,
      stepPhone: modal.querySelector("[data-megaska-step-phone]"),
      stepOtp: modal.querySelector("[data-megaska-step-otp]"),
      stepSuccess: modal.querySelector("[data-megaska-step-success]"),
      phoneInput: modal.querySelector("[data-megaska-phone-input]"),
      phoneHint: modal.querySelector("[data-megaska-phone-hint]"),
      phoneDisplay: modal.querySelector("[data-megaska-phone-display]"),
      otpInputs: Array.from(modal.querySelectorAll("[data-megaska-otp-digit]")),
      resendText: modal.querySelector("[data-megaska-resend-text]"),
      resendBtn: modal.querySelector("[data-megaska-resend]"),
      errorEl: modal.querySelector("[data-megaska-otp-error]"),
      successMessage: modal.querySelector("[data-megaska-success-message]"),
    };
  }

  function renderStep() {
    const {
      stepPhone,
      stepOtp,
      stepSuccess,
      phoneInput,
      phoneHint,
      phoneDisplay,
      otpInputs,
      errorEl,
      successMessage,
    } = getModalParts();

    stepPhone.hidden = state.step !== "phone";
    stepOtp.hidden = state.step !== "otp";
    stepSuccess.hidden = state.step !== "success";

    phoneInput.value = state.phoneDigits;
    phoneDisplay.textContent = maskPhone(state.phoneDigits);
    successMessage.textContent = state.successMessage;

    otpInputs.forEach((input, index) => {
      input.value = state.otpDigits[index] || "";
      input.disabled = state.verifying;
    });

    if (state.step === "phone") {
      if (state.requesting) {
        phoneHint.textContent = "Sending OTP...";
      } else if (state.phoneDigits.length < 10) {
        phoneHint.textContent = "We'll auto-send a 4-digit OTP when 10 digits are entered.";
      } else {
        phoneHint.textContent = "Valid number detected. Sending OTP...";
      }
    }

    errorEl.textContent = state.errorMessage;
    updateResendUi();
  }

  function updateResendUi() {
    const { resendBtn, resendText } = getModalParts();

    if (state.step !== "otp") {
      resendBtn.disabled = true;
      resendText.textContent = "";
      return;
    }

    if (state.requesting) {
      resendText.textContent = "Sending new OTP...";
      resendBtn.disabled = true;
      return;
    }

    if (state.resendSeconds > 0) {
      resendText.textContent = `Resend available in ${state.resendSeconds}s`;
      resendBtn.disabled = true;
      return;
    }

    resendText.textContent = "Didn't get the code?";
    resendBtn.disabled = false;
  }

  function focusPhoneInput() {
    const { phoneInput } = getModalParts();
    setTimeout(() => phoneInput.focus(), 0);
  }

  function focusOtpInput(index) {
    const { otpInputs } = getModalParts();
    const safeIndex = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    setTimeout(() => otpInputs[safeIndex].focus(), 0);
  }

  function openModal(triggerSource) {
    const { modal } = getModalParts();
    state.isOpen = true;
    resetModalState();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("megaska-otp-open");
    renderStep();
    focusPhoneInput();

    if (triggerSource) {
      console.log("[Megaska OTP] modal opened", { triggerSource });
    }
  }

  function closeModal(reason, options) {
    const opts = options || {};
    const force = Boolean(opts.force);

    if (!force && isBusy()) return false;

    const { modal } = getModalParts();
    state.isOpen = false;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("megaska-otp-open");
    resetModalState();
    renderStep();

    if (reason) {
      console.log("[Megaska OTP] modal closed", { reason });
    }

    return true;
  }

  function renderPhoneStep() {
    state.step = "phone";
    state.errorMessage = "";
    state.otpDigits = ["", "", "", ""];
    renderStep();
    focusPhoneInput();
  }

  function renderOtpStep() {
    state.step = "otp";
    state.errorMessage = "";
    state.otpDigits = ["", "", "", ""];
    renderStep();
    focusOtpInput(0);
  }

  function renderSuccessStep(message) {
    state.step = "success";
    state.errorMessage = "";
    state.successMessage = message || "Welcome back to Megaska";
    renderStep();
  }

  async function submitPhoneIfReady() {
    if (!isModalOpen()) return;
    if (state.requesting || state.verifying) return;
    if (state.phoneDigits.length !== 10) return;

    const normalizedPhone = normalizeIndianPhone(state.phoneDigits);
    if (!normalizedPhone) {
      state.errorMessage = "Please enter a valid 10-digit mobile number.";
      renderStep();
      return;
    }

    state.requesting = true;
    state.errorMessage = "";
    renderStep();

    try {
      await window.MegaskaAuth.requestOtp(normalizedPhone);
      if (!isModalOpen()) return;
      state.normalizedPhone = normalizedPhone;
      state.requesting = false;
      renderOtpStep();
      startResendTimer();
    } catch (error) {
      state.requesting = false;
      state.errorMessage = error.message || "Unable to send OTP. Please try again.";
      renderStep();
    }
  }

  function handlePhoneInput(event) {
    if (!isModalOpen()) return;

    state.phoneDigits = sanitizeDigits(event.target.value, 10);
    event.target.value = state.phoneDigits;
    state.errorMessage = "";
    renderStep();

    if (state.phoneDigits.length === 10) {
      submitPhoneIfReady();
    }
  }

  function collectOtpDigits() {
    return state.otpDigits.join("");
  }

  async function submitOtpIfReady() {
    const otp = collectOtpDigits();

    if (!isModalOpen()) return;
    if (state.verifying || state.requesting) return;
    if (otp.length !== OTP_LENGTH || !state.normalizedPhone) return;

    state.verifying = true;
    state.errorMessage = "Verifying OTP...";
    renderStep();

    try {
      await window.MegaskaAuth.verifyOtp(state.normalizedPhone, otp);
      await window.MegaskaAuth.refreshAuthState();
      resumePendingContinuation();
      state.verifying = false;
      renderSuccessStep("Login successful. Welcome to Megaska");
      setTimeout(() => closeModal("success", { force: true }), SUCCESS_CLOSE_DELAY_MS);
    } catch (error) {
      state.verifying = false;
      state.errorMessage = error.message || "Invalid or expired OTP. Please try again.";
      state.otpDigits = ["", "", "", ""];
      renderStep();
      focusOtpInput(0);
    }
  }

  function handleOtpInput(event) {
    if (!isModalOpen()) return;

    const input = event.target;
    const index = Number(input.dataset.index);
    const digit = sanitizeDigits(input.value, 1);

    state.otpDigits[index] = digit;
    input.value = digit;
    state.errorMessage = "";
    renderStep();

    if (digit && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }

    if (collectOtpDigits().length === OTP_LENGTH) {
      submitOtpIfReady();
    }
  }

  function handleOtpKeyDown(event) {
    if (!isModalOpen()) return;

    const index = Number(event.target.dataset.index);

    if (event.key === "Backspace") {
      if (state.otpDigits[index]) {
        state.otpDigits[index] = "";
        event.target.value = "";
        renderStep();
        return;
      }

      if (index > 0) {
        state.otpDigits[index - 1] = "";
        renderStep();
        focusOtpInput(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtpInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  }

  function handleOtpPaste(event) {
    if (!isModalOpen()) return;

    event.preventDefault();
    const pasted = sanitizeDigits(event.clipboardData.getData("text"), OTP_LENGTH);

    if (!pasted) return;

    const values = pasted.split("");
    state.otpDigits = Array.from({ length: OTP_LENGTH }, (_, i) => values[i] || "");
    state.errorMessage = "";
    renderStep();

    if (pasted.length === OTP_LENGTH) {
      submitOtpIfReady();
    } else {
      focusOtpInput(Math.min(pasted.length, OTP_LENGTH - 1));
    }
  }

  async function handleResend() {
    if (!isModalOpen()) return;
    if (state.requesting || state.resendSeconds > 0 || !state.normalizedPhone) return;

    state.requesting = true;
    state.errorMessage = "";
    renderStep();

    try {
      await window.MegaskaAuth.requestOtp(state.normalizedPhone);
      state.requesting = false;
      state.otpDigits = ["", "", "", ""];
      renderStep();
      focusOtpInput(0);
      startResendTimer();
    } catch (error) {
      state.requesting = false;
      state.errorMessage = error.message || "Unable to resend OTP right now.";
      renderStep();
    }
  }

  function handleEditPhone() {
    if (!isModalOpen()) return;
    if (isBusy()) return;
    renderPhoneStep();
  }

  function handleEscClose(event) {
    if (event.key !== "Escape") return;
    if (!isModalOpen()) return;
    closeModal("escape");
  }

  async function handlePromptFallback() {
    const phone = prompt("Enter your 10-digit mobile number:");
    if (!phone) return;

    const phoneDigits = sanitizeDigits(phone, 10);
    const normalizedPhone = normalizeIndianPhone(phoneDigits);

    if (!normalizedPhone) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await window.MegaskaAuth.requestOtp(normalizedPhone);
      const otp = prompt("Enter the 4-digit OTP:");
      if (!otp) return;

      await window.MegaskaAuth.verifyOtp(normalizedPhone, sanitizeDigits(otp, OTP_LENGTH));
      await window.MegaskaAuth.refreshAuthState();
      alert("Login successful.");
    } catch (error) {
      alert(error.message || "Login failed. Please try again.");
    }
  }

  function findClosestMatchingElement(event, selectorList) {
    const target = event.target;
    if (!target || typeof target.closest !== "function") return null;
    const selector = selectorList.join(", ");
    return target.closest(selector);
  }

  function isCheckoutTarget(element) {
    if (!element) return false;

    if (
      element.matches("a[href='/checkout'], a[href*='/checkout']") ||
      element.matches("button[name='checkout'], input[name='checkout'], button[data-action='checkout'], [data-checkout-button]")
    ) {
      return true;
    }

    const form = element.closest("form");
    if (!form) return false;

    const action = form.getAttribute("action") || "";
    return action.includes("/checkout");
  }

  function clearPendingContinuation() {
    pendingContinuation = null;
  }

  function setPendingContinuation(action) {
    pendingContinuation = action;
  }

  function resumePendingContinuation() {
    if (!pendingContinuation) return;

    const action = pendingContinuation;
    clearPendingContinuation();
    console.log("[Megaska OTP] continuation resumed", { type: action.type });

    if (action.type === "navigate" && action.url) {
      window.location.assign(action.url);
      return;
    }

    if (action.type === "callback" && typeof action.callback === "function") {
      action.callback();
    }
  }

  async function isMegaskaAuthenticated() {
    try {
      if (window.MegaskaAuth && typeof window.MegaskaAuth.fetchSession === "function") {
        const session = await window.MegaskaAuth.fetchSession();
        return Boolean(session?.authenticated);
      }
    } catch (error) {
      console.warn("[Megaska OTP] Session check failed", error);
    }
    return false;
  }

  async function requireAuthenticationOrOpenModal(options) {
    const opts = options || {};
    const authenticated = await isMegaskaAuthenticated();
    if (authenticated) return true;

    if (opts.event && typeof opts.event.preventDefault === "function") {
      opts.event.preventDefault();
    }

    if (opts.continuation) {
      setPendingContinuation(opts.continuation);
    }

    try {
      openModal(opts.triggerSource || "auth-required");
    } catch {
      await handlePromptFallback();
    }

    return false;
  }

  async function handleAccountTriggerClick(event, triggerEl) {
    const authenticated = await requireAuthenticationOrOpenModal({
      event,
      triggerSource: "header-account-click",
    });

    if (!authenticated) {
      console.log("[Megaska OTP] account click intercepted", { selector: triggerEl?.tagName });
    }
  }

  async function ensureMegaskaAuthenticatedBeforeCheckout(options) {
    const opts = options || {};
    const continuation =
      opts.continuation ||
      (opts.targetUrl ? { type: "navigate", url: opts.targetUrl } : null);

    return requireAuthenticationOrOpenModal({
      event: opts.event,
      continuation,
      triggerSource: "checkout-intercept",
    });
  }

  async function handleCheckoutTriggerClick(event, triggerEl) {
    if (!checkoutInterceptionEnabled) return;

    const targetUrl =
      triggerEl?.tagName === "A" ? triggerEl.getAttribute("href") : "/checkout";
    const allowed = await ensureMegaskaAuthenticatedBeforeCheckout({
      event,
      targetUrl,
    });

    if (!allowed) {
      console.log("[Megaska OTP] checkout click intercepted", { targetUrl });
    }
  }

  function bindGlobalClickInterceptor() {
    if (globalClickBound) return;
    globalClickBound = true;

    console.log("[Megaska OTP] binding account triggers", ACCOUNT_TRIGGER_SELECTORS);

    document.addEventListener("click", (event) => {
      const accountTrigger = findClosestMatchingElement(event, ACCOUNT_TRIGGER_SELECTORS);
      if (accountTrigger) {
        handleAccountTriggerClick(event, accountTrigger);
        return;
      }

      const checkoutTrigger = findClosestMatchingElement(event, CHECKOUT_TRIGGER_SELECTORS);
      if (checkoutTrigger && isCheckoutTarget(checkoutTrigger)) {
        handleCheckoutTriggerClick(event, checkoutTrigger);
      }
    });
  }

  function bindCheckoutSubmitInterceptor() {
    if (checkoutSubmitBound) return;
    checkoutSubmitBound = true;

    document.addEventListener("submit", async (event) => {
      if (!checkoutInterceptionEnabled) return;
      const form = event.target;
      if (!form || !form.matches || !form.matches("form")) return;

      const action = form.getAttribute("action") || "";
      if (!action.includes("/checkout")) return;

      const allowed = await ensureMegaskaAuthenticatedBeforeCheckout({
        event,
        continuation: {
          type: "callback",
          callback: () => form.submit(),
        },
      });

      if (!allowed) {
        console.log("[Megaska OTP] checkout submit intercepted");
      }
    });
  }

  function interceptCheckoutClicks(options) {
    const opts = options || {};
    checkoutInterceptionEnabled = opts.enabled !== false;
    bindCheckoutSubmitInterceptor();
    return checkoutInterceptionEnabled;
  }

  function init() {
    bindGlobalClickInterceptor();
    ensureModal();
  }

  window.MegaskaOtp = {
    init,
    openModal,
    closeModal,
    isModalOpen,
    resetModalState,
    interceptCheckoutClicks,
    ensureMegaskaAuthenticatedBeforeCheckout,
    clearPendingContinuation,
  };

  document.addEventListener("DOMContentLoaded", init);
})();

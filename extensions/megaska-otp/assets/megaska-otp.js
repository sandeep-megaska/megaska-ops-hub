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
    savingProfile: false,
    resendSeconds: 0,
    resendTimerId: null,
    errorMessage: "",
    successMessage: "Welcome back to Megaska",
    profileFullName: "",
    profileEmail: "",
  };
  let globalClickBound = false;
  let checkoutSubmitBound = false;
  let pendingAction = null;
  let checkoutInterceptionEnabled = true;
  let accountMenuContainer = null;
  let accountMenuTrigger = null;

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

  const LOGOUT_TRIGGER_SELECTORS = [
    "[data-megaska-logout]",
    "a[href='/account/logout']",
    "a[href*='/account/logout']",
    "button[data-action='logout']",
    "[data-customer-logout]",
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
    return state.requesting || state.verifying || state.savingProfile;
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
    state.savingProfile = false;
    state.resendSeconds = 0;
    state.errorMessage = "";
    state.successMessage = "Welcome back to Megaska";
    state.profileFullName = "";
    state.profileEmail = "";
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

          <div data-megaska-step-profile hidden>
            <p class="megaska-otp-kicker">Complete your profile</p>
            <h2>Just one more step</h2>
            <p class="megaska-otp-subtitle">Add a few details to finish setting up your Megaska account.</p>

            <label class="megaska-otp-label" for="megaska-fullname-input">Full Name</label>
            <input
              id="megaska-fullname-input"
              data-megaska-profile-fullname
              class="megaska-otp-text-input"
              type="text"
              autocomplete="name"
              placeholder="Enter your full name"
              aria-label="Enter your full name"
            />

            <label class="megaska-otp-label megaska-otp-label-top-gap" for="megaska-email-input">Email Address</label>
            <input
              id="megaska-email-input"
              data-megaska-profile-email
              class="megaska-otp-text-input"
              type="email"
              autocomplete="email"
              placeholder="name@example.com"
              aria-label="Enter your email address"
            />

            <button type="button" class="megaska-otp-primary-btn" data-megaska-profile-submit>
              Save and Continue
            </button>
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

    modal
      .querySelector("[data-megaska-profile-submit]")
      .addEventListener("click", handleProfileSubmit);

    modal
      .querySelector("[data-megaska-profile-fullname]")
      .addEventListener("input", (event) => {
        state.profileFullName = String(event.target.value || "");
        if (state.errorMessage) {
          state.errorMessage = "";
          renderStep();
        }
      });

    modal
      .querySelector("[data-megaska-profile-email]")
      .addEventListener("input", (event) => {
        state.profileEmail = String(event.target.value || "");
        if (state.errorMessage) {
          state.errorMessage = "";
          renderStep();
        }
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
      stepProfile: modal.querySelector("[data-megaska-step-profile]"),
      stepSuccess: modal.querySelector("[data-megaska-step-success]"),
      phoneInput: modal.querySelector("[data-megaska-phone-input]"),
      phoneHint: modal.querySelector("[data-megaska-phone-hint]"),
      phoneDisplay: modal.querySelector("[data-megaska-phone-display]"),
      otpInputs: Array.from(modal.querySelectorAll("[data-megaska-otp-digit]")),
      resendText: modal.querySelector("[data-megaska-resend-text]"),
      resendBtn: modal.querySelector("[data-megaska-resend]"),
      profileFullNameInput: modal.querySelector("[data-megaska-profile-fullname]"),
      profileEmailInput: modal.querySelector("[data-megaska-profile-email]"),
      profileSubmitBtn: modal.querySelector("[data-megaska-profile-submit]"),
      errorEl: modal.querySelector("[data-megaska-otp-error]"),
      successMessage: modal.querySelector("[data-megaska-success-message]"),
    };
  }

  function renderStep() {
    const {
      stepPhone,
      stepOtp,
      stepProfile,
      stepSuccess,
      phoneInput,
      phoneHint,
      phoneDisplay,
      otpInputs,
      profileFullNameInput,
      profileEmailInput,
      profileSubmitBtn,
      errorEl,
      successMessage,
    } = getModalParts();

    stepPhone.hidden = state.step !== "phone";
    stepOtp.hidden = state.step !== "otp";
    stepProfile.hidden = state.step !== "profile";
    stepSuccess.hidden = state.step !== "success";

    phoneInput.value = state.phoneDigits;
    phoneDisplay.textContent = maskPhone(state.phoneDigits);
    successMessage.textContent = state.successMessage;
    profileFullNameInput.value = state.profileFullName;
    profileEmailInput.value = state.profileEmail;
    profileFullNameInput.disabled = state.savingProfile;
    profileEmailInput.disabled = state.savingProfile;
    profileSubmitBtn.disabled = state.savingProfile;
    profileSubmitBtn.textContent = state.savingProfile ? "Saving..." : "Save and Continue";

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

  function focusProfileInput() {
    const { profileFullNameInput } = getModalParts();
    setTimeout(() => profileFullNameInput.focus(), 0);
  }

  function openModal(triggerSource) {
    closeAccountMenu();
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

  function normalizeFullName(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function needsProfileCompletion(customer) {
    const fullName = normalizeFullName(customer?.fullName || customer?.firstName || "");
    const email = normalizeEmail(customer?.email || "");
    return !(fullName && email);
  }

  function renderProfileStep(customer) {
    state.step = "profile";
    state.errorMessage = "";
    state.profileFullName = normalizeFullName(customer?.fullName || customer?.firstName || "");
    state.profileEmail = normalizeEmail(customer?.email || "");
    renderStep();
    focusProfileInput();
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
      const refreshedSession = await window.MegaskaAuth.refreshAuthState();
      state.verifying = false;

      if (needsProfileCompletion(refreshedSession?.customer)) {
        renderProfileStep(refreshedSession?.customer);
        return;
      }

      hideAccountMenu();
      await resumePendingAction();
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

  async function handleProfileSubmit() {
    if (!isModalOpen()) return;
    if (state.step !== "profile") return;
    if (state.savingProfile) return;

    const fullName = normalizeFullName(state.profileFullName);
    const email = normalizeEmail(state.profileEmail);

    if (!fullName) {
      state.errorMessage = "Please enter your full name.";
      renderStep();
      focusProfileInput();
      return;
    }

    if (!email || !isValidEmail(email)) {
      state.errorMessage = "Please enter a valid email address.";
      renderStep();
      const { profileEmailInput } = getModalParts();
      setTimeout(() => profileEmailInput.focus(), 0);
      return;
    }

    state.savingProfile = true;
    state.errorMessage = "";
    renderStep();

    try {
      await window.MegaskaAuth.completeProfile({ fullName, email });
      await window.MegaskaAuth.refreshAuthState();
      state.savingProfile = false;
      hideAccountMenu();
      await resumePendingAction();
      renderSuccessStep("Profile saved. Welcome to Megaska");
      setTimeout(() => closeModal("success", { force: true }), SUCCESS_CLOSE_DELAY_MS);
    } catch (error) {
      state.savingProfile = false;
      state.errorMessage = error.message || "Unable to save your profile right now.";
      renderStep();
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
      await resumePendingAction();
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

  function clearPendingAction() {
    pendingAction = null;
  }

  function setPendingAction(action) {
    pendingAction = action;
  }

  async function getCurrentMegaskaCustomer() {
    try {
      if (window.MegaskaAuth && typeof window.MegaskaAuth.fetchSession === "function") {
        const session = await window.MegaskaAuth.fetchSession();
        return session?.customer || null;
      }
    } catch (error) {
      console.warn("[Megaska OTP] unable to fetch session for checkout prefill", error);
    }
    return null;
  }

  async function buildPrefilledCheckoutUrl(rawUrl) {
    if (!rawUrl || !rawUrl.includes("/checkout")) return rawUrl;
    const customer = await getCurrentMegaskaCustomer();
    if (!customer) return rawUrl;

    if (
      window.MegaskaAuth &&
      typeof window.MegaskaAuth.applyCheckoutPrefillToUrl === "function"
    ) {
      const prefilledUrl = window.MegaskaAuth.applyCheckoutPrefillToUrl(rawUrl, customer);
      if (prefilledUrl !== rawUrl) {
        console.log("[Megaska OTP] checkout prefill handoff executed", { targetUrl: prefilledUrl });
      }
      return prefilledUrl;
    }

    return rawUrl;
  }

  async function runBuyerIdentityHandoff(rawCheckoutUrl) {
    const customer = await getCurrentMegaskaCustomer();
    if (!customer) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-customer",
        checkoutUrl: rawCheckoutUrl,
      };
    }

    if (
      !window.MegaskaAuth ||
      typeof window.MegaskaAuth.applyBuyerIdentityToActiveCart !== "function"
    ) {
      return {
        ok: false,
        skipped: true,
        reason: "missing-auth-bridge",
        checkoutUrl: rawCheckoutUrl,
      };
    }

    console.log("[Megaska Checkout Prefill] waiting for buyer identity update");
    const startedAt = Date.now();

    try {
      const result = await window.MegaskaAuth.applyBuyerIdentityToActiveCart(customer, {
        checkoutUrl: rawCheckoutUrl,
      });
      console.log("[Megaska Checkout Prefill] buyer identity update finished", {
        waitedMs: Date.now() - startedAt,
        ok: Boolean(result?.ok),
        skipped: Boolean(result?.skipped),
        reason: result?.reason || "",
        cartId: result?.cartId || null,
        userErrors: result?.userErrors || [],
        apiErrors: (result?.apiErrors || []).map((err) => err?.message || err),
      });
      return result;
    } catch (error) {
      console.error("[Megaska Checkout Prefill] buyer identity update failed", error);
      return {
        ok: false,
        skipped: false,
        reason: "request-failed",
        checkoutUrl: rawCheckoutUrl,
      };
    }
  }

  async function applyCheckoutPrefillToForm(form) {
    const customer = await getCurrentMegaskaCustomer();
    if (!customer) return false;
    if (
      window.MegaskaAuth &&
      typeof window.MegaskaAuth.applyCheckoutPrefillToForm === "function"
    ) {
      const applied = window.MegaskaAuth.applyCheckoutPrefillToForm(form, customer);
      if (applied) {
        console.log("[Megaska OTP] checkout prefill handoff executed", { target: "form" });
      }
      return applied;
    }
    return false;
  }

  async function resumePendingAction() {
    if (!pendingAction) return;

    const action = pendingAction;
    clearPendingAction();
    console.log("[Megaska OTP] pending intent resumed", { type: action.type });

    if (action.type === "navigate" && action.url) {
      const prefilledUrl = await buildPrefilledCheckoutUrl(action.url);
      const handoff = await runBuyerIdentityHandoff(prefilledUrl);
      const targetUrl = handoff?.checkoutUrl || prefilledUrl;
      console.log("[Megaska Checkout Prefill] checkout continuation", {
        mode: "navigate",
        targetUrl,
      });
      window.location.assign(targetUrl);
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

    if (opts.pendingAction) {
      setPendingAction(opts.pendingAction);
    }

    try {
      openModal(opts.triggerSource || "auth-required");
    } catch {
      await handlePromptFallback();
    }

    return false;
  }

  function removeAccountMenu() {
    if (!accountMenuContainer) return;
    accountMenuContainer.remove();
    accountMenuContainer = null;
    if (accountMenuTrigger) {
      accountMenuTrigger.setAttribute("aria-expanded", "false");
    }
    accountMenuTrigger = null;
  }

  function closeAccountMenu() {
    removeAccountMenu();
  }

  function hideAccountMenu() {
    closeAccountMenu();
  }

  function buildAccountMenu() {
    const menu = document.createElement("div");
    menu.className = "megaska-account-menu-popover";
    menu.setAttribute("data-megaska-account-menu", "1");
    menu.innerHTML = `
      <div class="megaska-account-menu-card">
        <p class="megaska-account-menu-title">You are signed in</p>
        <a href="/account" class="megaska-account-menu-link" data-megaska-menu-account>My Account</a>
        <button type="button" class="megaska-account-menu-logout" data-megaska-menu-logout>Logout</button>
      </div>
    `;
    return menu;
  }

  async function handleLogoutClick(event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    console.log("[Megaska OTP] logout intercepted");

    try {
      if (window.MegaskaAuth && typeof window.MegaskaAuth.logout === "function") {
        await window.MegaskaAuth.logout();
      }
    } catch (error) {
      console.error("[Megaska OTP] logout failed", error);
    }

    if (window.MegaskaAuth && typeof window.MegaskaAuth.refreshAuthState === "function") {
      await window.MegaskaAuth.refreshAuthState();
    }

    syncAccountUiState();
    closeAccountMenu();
  }

  function openAccountMenu(triggerEl) {
    closeAccountMenu();
    const menu = buildAccountMenu();
    const rect = triggerEl.getBoundingClientRect();
    menu.style.top = `${window.scrollY + rect.bottom + 8}px`;
    menu.style.left = `${window.scrollX + Math.max(8, rect.right - 180)}px`;
    menu.querySelector("[data-megaska-menu-account]").addEventListener("click", (event) => {
      event.preventDefault();
    });
    menu.querySelector("[data-megaska-menu-logout]").addEventListener("click", handleLogoutClick);
    document.body.appendChild(menu);
    accountMenuContainer = menu;
    accountMenuTrigger = triggerEl;
    accountMenuTrigger.setAttribute("aria-expanded", "true");
    console.log("[Megaska OTP] authenticated menu opened");
  }

  function isAccountMenuOpen() {
    return Boolean(accountMenuContainer);
  }

  function toggleAccountMenu(triggerEl) {
    if (isAccountMenuOpen()) {
      closeAccountMenu();
      return;
    }
    openAccountMenu(triggerEl);
  }

  async function syncAccountUiState() {
    const authenticated = await isMegaskaAuthenticated();
    document.documentElement.classList.toggle("megaska-account-authenticated", authenticated);
    document.documentElement.classList.toggle("megaska-account-guest", !authenticated);
    if (!authenticated) {
      closeAccountMenu();
    }
    console.log("[Megaska OTP] header sync updated", { authenticated });
    return authenticated;
  }

  async function handleAccountTriggerClick(event, triggerEl) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (event && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }

    const authenticated = await isMegaskaAuthenticated();

    if (!authenticated) {
      try {
        openModal("account-intercept");
      } catch {
        await handlePromptFallback();
      }
      console.log("[Megaska OTP] account trigger intercepted", { authenticated: false });
      return;
    }

    toggleAccountMenu(triggerEl);
    console.log("[Megaska OTP] account trigger intercepted", { authenticated: true });
  }

  async function ensureMegaskaAuthenticatedBeforeCheckout(options) {
    const opts = options || {};
    const pending =
      opts.pendingAction ||
      (opts.targetUrl ? { type: "navigate", url: opts.targetUrl } : null);

    return requireAuthenticationOrOpenModal({
      event: opts.event,
      pendingAction: pending,
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
      return;
    }

    const isAnchorCheckoutTrigger = triggerEl?.tagName === "A" && Boolean(targetUrl);
    if (isAnchorCheckoutTrigger) {
      event.preventDefault();
      const prefilledUrl = await buildPrefilledCheckoutUrl(targetUrl);
      const handoff = await runBuyerIdentityHandoff(prefilledUrl);
      const finalTargetUrl = handoff?.checkoutUrl || prefilledUrl;
      console.log("[Megaska Checkout Prefill] checkout continuation", {
        mode: "click",
        targetUrl: finalTargetUrl,
      });
      window.location.assign(finalTargetUrl);
    }
  }

  function bindGlobalClickInterceptor() {
    if (globalClickBound) return;
    globalClickBound = true;

    console.log("[Megaska OTP] binding account triggers", ACCOUNT_TRIGGER_SELECTORS);

    document.addEventListener("click", (event) => {
      const logoutTrigger = findClosestMatchingElement(event, LOGOUT_TRIGGER_SELECTORS);
      if (logoutTrigger) {
        handleLogoutClick(event);
        return;
      }

      const accountTrigger = findClosestMatchingElement(event, ACCOUNT_TRIGGER_SELECTORS);
      if (accountTrigger) {
        handleAccountTriggerClick(event, accountTrigger);
        return;
      }

      const checkoutTrigger = findClosestMatchingElement(event, CHECKOUT_TRIGGER_SELECTORS);
      if (checkoutTrigger && isCheckoutTarget(checkoutTrigger)) {
        handleCheckoutTriggerClick(event, checkoutTrigger);
        return;
      }

      const clickedInsideMenu =
        accountMenuContainer && event.target && accountMenuContainer.contains(event.target);
      if (!clickedInsideMenu) {
        closeAccountMenu();
      }
    });
  }

  function bindAuthStateSync() {
    document.addEventListener("megaska:auth-state-changed", () => {
      syncAccountUiState();
    });

    window.addEventListener("storage", (event) => {
      if (event.key === "megaska_session_token") {
        syncAccountUiState();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!isAccountMenuOpen()) return;
      closeAccountMenu();
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
        pendingAction: {
          type: "callback",
          callback: () => form.submit(),
        },
      });

      if (!allowed) {
        console.log("[Megaska OTP] checkout submit intercepted");
        return;
      }

      event.preventDefault();
      await applyCheckoutPrefillToForm(form);
      await runBuyerIdentityHandoff(form.getAttribute("action") || "/checkout");
      console.log("[Megaska Checkout Prefill] checkout continuation", {
        mode: "form-submit",
        action: form.getAttribute("action") || "/checkout",
      });
      form.submit();
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
    interceptCheckoutClicks({ enabled: true });
    bindAuthStateSync();
    ensureModal();
    syncAccountUiState();
  }

  window.MegaskaOtp = {
    init,
    openModal,
    closeModal,
    isModalOpen,
    resetModalState,
    interceptCheckoutClicks,
    ensureMegaskaAuthenticatedBeforeCheckout,
    clearPendingAction,
    hideAccountMenu,
    handleLogoutClick,
  };

  document.addEventListener("DOMContentLoaded", init);
})();

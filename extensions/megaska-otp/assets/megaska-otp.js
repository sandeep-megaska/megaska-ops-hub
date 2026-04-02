(function () {
  const state = {
    phone: "",
    requesting: false,
    verifying: false,
  };

  function normalizeIndianPhone(rawPhone) {
    const digitsOnly = String(rawPhone || "").replace(/\D/g, "");

    if (digitsOnly.length === 10) {
      return `+91${digitsOnly}`;
    }

    if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
      return `+${digitsOnly}`;
    }

    if (String(rawPhone || "").startsWith("+91") && digitsOnly.length === 12) {
      return `+${digitsOnly}`;
    }

    return rawPhone;
  }

  function ensureModal() {
    let modal = document.querySelector("[data-megaska-otp-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.setAttribute("data-megaska-otp-modal", "1");
    modal.style.cssText = [
      "position:fixed",
      "inset:0",
      "background:rgba(0,0,0,.45)",
      "z-index:9999",
      "display:none",
      "align-items:flex-end",
      "justify-content:center",
    ].join(";");

    modal.innerHTML = `
      <div style="background:#fff;width:100%;max-width:420px;border-radius:16px 16px 0 0;padding:16px;font-family:inherit;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Login / Signup</strong>
          <button type="button" data-megaska-otp-close style="border:0;background:none;font-size:20px;line-height:1;">&times;</button>
        </div>
        <form data-megaska-phone-form>
          <label style="display:block;font-size:13px;margin-bottom:6px;">Mobile number</label>
          <input data-megaska-phone-input type="tel" inputmode="numeric" placeholder="10-digit mobile number" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;" />
          <button type="submit" data-megaska-request-otp style="margin-top:10px;width:100%;padding:10px;border:0;border-radius:8px;background:#111;color:#fff;">Send OTP</button>
        </form>
        <form data-megaska-otp-form hidden style="margin-top:12px;">
          <label style="display:block;font-size:13px;margin-bottom:6px;">Enter OTP</label>
          <input data-megaska-otp-input type="tel" inputmode="numeric" placeholder="6-digit OTP" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;" />
          <button type="submit" data-megaska-verify-otp style="margin-top:10px;width:100%;padding:10px;border:0;border-radius:8px;background:#111;color:#fff;">Verify OTP</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("[data-megaska-otp-close]").addEventListener("click", () => {
      closeModal();
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal
      .querySelector("[data-megaska-phone-form]")
      .addEventListener("submit", handleRequestOtpSubmit);
    modal
      .querySelector("[data-megaska-otp-form]")
      .addEventListener("submit", handleVerifyOtpSubmit);

    return modal;
  }

  function openModal() {
    const modal = ensureModal();
    modal.style.display = "flex";
    modal.querySelector("[data-megaska-phone-input]").focus();
  }

  function closeModal() {
    const modal = ensureModal();
    modal.style.display = "none";
  }

  function showOtpStep() {
    const modal = ensureModal();
    modal.querySelector("[data-megaska-phone-form]").hidden = true;
    modal.querySelector("[data-megaska-otp-form]").hidden = false;
    modal.querySelector("[data-megaska-otp-input]").focus();
  }

  function resetModal() {
    const modal = ensureModal();
    modal.querySelector("[data-megaska-phone-form]").hidden = false;
    modal.querySelector("[data-megaska-otp-form]").hidden = true;
    modal.querySelector("[data-megaska-phone-input]").value = "";
    modal.querySelector("[data-megaska-otp-input]").value = "";
    state.phone = "";
  }

  async function handleRequestOtpSubmit(event) {
    event.preventDefault();

    if (state.requesting) return;

    const modal = ensureModal();
    const phoneInput = modal.querySelector("[data-megaska-phone-input]");
    const rawPhone = phoneInput.value.trim();

    if (!rawPhone) {
      alert("Please enter your mobile number.");
      return;
    }

    const phone = normalizeIndianPhone(rawPhone);
    state.requesting = true;

    try {
      await window.MegaskaAuth.requestOtp(phone);
      state.phone = phone;
      showOtpStep();
    } catch (error) {
      console.error("[Megaska OTP] OTP request failed", error);
      alert(error.message || "Failed to send OTP. Please try again.");
    } finally {
      state.requesting = false;
    }
  }

  async function handleVerifyOtpSubmit(event) {
    event.preventDefault();

    if (state.verifying) return;

    const modal = ensureModal();
    const otp = modal.querySelector("[data-megaska-otp-input]").value.trim();

    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    if (!state.phone) {
      alert("Session expired. Please request OTP again.");
      resetModal();
      return;
    }

    state.verifying = true;

    try {
      const result = await window.MegaskaAuth.verifyOtp(state.phone, otp);
      await window.MegaskaAuth.refreshAuthState();
      console.log("[Megaska OTP] Login success", result);
      closeModal();
      resetModal();
      alert("Login successful.");
    } catch (error) {
      console.error("[Megaska OTP] OTP verify failed", error);
      alert(error.message || "Invalid OTP. Please try again.");
    } finally {
      state.verifying = false;
    }
  }

  async function handleLoginClick(event) {
    event.preventDefault();

    try {
      openModal();
    } catch (error) {
      // Fallback only if modal cannot be rendered for some reason.
      console.warn("[Megaska OTP] Modal unavailable, falling back to prompt", error);
      await handlePromptFallback();
    }
  }

  async function handlePromptFallback() {
    const phone = prompt("Enter your mobile number:");

    if (!phone) {
      alert("Please enter your mobile number.");
      return;
    }

    const normalizedPhone = normalizeIndianPhone(phone);

    try {
      await window.MegaskaAuth.requestOtp(normalizedPhone);
      const otp = prompt("Enter OTP:");

      if (!otp) {
        alert("Please enter OTP.");
        return;
      }

      await window.MegaskaAuth.verifyOtp(normalizedPhone, otp);
      await window.MegaskaAuth.refreshAuthState();
      alert("Login successful.");
    } catch (error) {
      console.error("[Megaska OTP] Login failed", error);
      alert(error.message || "Login failed");
    }
  }

  function bindLoginTriggers() {
    document.querySelectorAll("[data-megaska-open-login]").forEach((el) => {
      if (el.dataset.megaskaBound === "1") return;
      el.dataset.megaskaBound = "1";

      el.addEventListener("click", handleLoginClick);
    });
  }

  function init() {
    bindLoginTriggers();
    ensureModal();
  }

  window.MegaskaOtp = {
    init,
  };

  document.addEventListener("DOMContentLoaded", init);
})();

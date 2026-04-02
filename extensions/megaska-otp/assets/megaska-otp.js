(function () {
  async function handleLoginClick(event) {
    event.preventDefault();

    const phone = prompt("Enter your mobile number:");

    if (!phone) return;

    try {
      await window.MegaskaAuth.requestOtp(phone);

      const otp = prompt("Enter OTP:");

      if (!otp) return;

      const result = await window.MegaskaAuth.verifyOtp(phone, otp);

      console.log("[Megaska OTP] Login success", result);

      await window.MegaskaAuth.refreshAuthState();

      alert("Login successful");
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
  }

  window.MegaskaOtp = {
    init,
  };

  document.addEventListener("DOMContentLoaded", init);
})();
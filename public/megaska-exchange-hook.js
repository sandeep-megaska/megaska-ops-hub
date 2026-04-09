(function () {
  const API_BASE_URL = "https://megaska-ops-hub-exs1.vercel.app";
  const SESSION_STORAGE_KEY = "megaska_session_token";
  const MODAL_ID = "mk-exchange-modal-layer";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function injectStyles() {
    if (document.getElementById("mk-exchange-modal-styles")) return;
    const style = document.createElement("style");
    style.id = "mk-exchange-modal-styles";
    style.textContent = `
      .mk-ex-modal-layer { position: fixed; inset: 0; z-index: 10020; display: none; }
      .mk-ex-modal-layer.open { display: block; }
      .mk-ex-modal-overlay { position: absolute; inset: 0; background: rgba(17,24,39,.5); }
      .mk-ex-modal { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: min(520px, calc(100vw - 24px)); max-height: calc(100vh - 24px); overflow: auto; background: #fffaf7; border: 1px solid #f1e7df; border-radius: 18px; padding: 16px; box-shadow: 0 20px 50px rgba(17,24,39,.25); }
      .mk-ex-modal h3 { margin: 0 0 10px; font-size: 18px; }
      .mk-ex-modal p { margin: 0; }
      .mk-ex-row { margin-top: 10px; display: grid; gap: 6px; }
      .mk-ex-label { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .03em; }
      .mk-ex-input, .mk-ex-textarea { width: 100%; box-sizing: border-box; border: 1px solid #eadfd7; border-radius: 12px; background: #fff; padding: 10px 12px; font: inherit; }
      .mk-ex-textarea { min-height: 80px; resize: vertical; }
      .mk-ex-error { margin-top: 10px; color: #b91c1c; font-size: 13px; }
      .mk-ex-muted { color: #6b7280; font-size: 13px; }
      .mk-ex-success { margin-top: 10px; border: 1px solid #d9f1e4; background: #f5fcf8; border-radius: 12px; padding: 10px; display: grid; gap: 6px; }
      .mk-ex-actions { margin-top: 14px; display: flex; gap: 10px; justify-content: flex-end; }
      .mk-ex-btn { border: 1px solid #eadfd7; border-radius: 12px; background: #fff; color: #1f2937; padding: 10px 14px; font-weight: 600; cursor: pointer; text-decoration: none; }
      .mk-ex-btn.primary { background: #e85d75; border-color: #e85d75; color: #fff; }
      .mk-ex-btn:disabled { opacity: .7; cursor: not-allowed; }
      @media (max-width: 640px) { .mk-ex-modal { top: 10px; transform: translateX(-50%); max-height: calc(100vh - 20px); border-radius: 14px; } }
    `;
    document.head.appendChild(style);
  }

  async function getSessionToken() {
    try {
      if (window.MegaskaAuth) {
        if (typeof window.MegaskaAuth.getSessionToken === "function") {
          const token = await window.MegaskaAuth.getSessionToken();
          if (token) return token;
        }
        if (typeof window.MegaskaAuth.getToken === "function") {
          const token = await window.MegaskaAuth.getToken();
          if (token) return token;
        }
      }
    } catch (e) {}

    try {
      return localStorage.getItem(SESSION_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function getDrawerOrderContext() {
    const drawer = document.getElementById("mk-order-drawer");
    if (!drawer) return null;

    const productTitle = drawer.querySelector(".mk-order-hero-name")?.textContent?.trim() || "";
    const metaText = drawer.querySelector(".mk-order-hero-meta")?.textContent?.trim() || "";
    const orderNumber = metaText.split("•")[0]?.trim() || "";

    return {
      orderNumber,
      productTitle,
      currentSize: "",
      displayMeta: metaText,
    };
  }

  function closeModal() {
    const layer = document.getElementById(MODAL_ID);
    if (layer) {
      layer.classList.remove("open");
      layer.remove();
    }
  }

  function renderModal(context) {
    closeModal();
    injectStyles();

    const layer = document.createElement("div");
    layer.id = MODAL_ID;
    layer.className = "mk-ex-modal-layer open";
    layer.innerHTML = `
      <div class="mk-ex-modal-overlay" data-mk-ex-close="1"></div>
      <div class="mk-ex-modal" role="dialog" aria-modal="true" aria-label="Exchange request">
        <h3>Exchange request</h3>
        <p class="mk-ex-muted">Tell us the size you need and any useful details.</p>

        <div class="mk-ex-row">
          <label class="mk-ex-label">Item</label>
          <input class="mk-ex-input" id="mk-ex-product" value="${escapeHtml(context.productTitle || "")}" readonly />
        </div>

        <div class="mk-ex-row">
          <label class="mk-ex-label">Current size (if available)</label>
          <input class="mk-ex-input" id="mk-ex-current-size" value="${escapeHtml(context.currentSize || "")}" placeholder="e.g. M" />
        </div>

        <div class="mk-ex-row">
          <label class="mk-ex-label">Requested size</label>
          <input class="mk-ex-input" id="mk-ex-requested-size" placeholder="e.g. L" />
        </div>

        <div class="mk-ex-row">
          <label class="mk-ex-label">Reason / note</label>
          <textarea class="mk-ex-textarea" id="mk-ex-reason" placeholder="Tell us the size you need and any useful details."></textarea>
        </div>

        <div class="mk-ex-error" id="mk-ex-error" style="display:none"></div>
        <div id="mk-ex-success" style="display:none"></div>

        <div class="mk-ex-actions" id="mk-ex-form-actions">
          <button class="mk-ex-btn" type="button" data-mk-ex-close="1">Cancel</button>
          <button class="mk-ex-btn primary" type="button" id="mk-ex-submit">Submit Exchange Request</button>
        </div>
      </div>
    `;

    document.body.appendChild(layer);

    layer.addEventListener("click", function (event) {
      const target = event.target;
      if (target && target.getAttribute && target.getAttribute("data-mk-ex-close") === "1") {
        closeModal();
      }
    });

    const submitBtn = document.getElementById("mk-ex-submit");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        submitExchange(context);
      });
    }
  }

  function setSubmittingState(isSubmitting) {
    const submitBtn = document.getElementById("mk-ex-submit");
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Submitting..." : "Submit Exchange Request";
  }

  function showError(message) {
    const node = document.getElementById("mk-ex-error");
    if (!node) return;
    node.style.display = "block";
    node.textContent = message;
  }

  function clearError() {
    const node = document.getElementById("mk-ex-error");
    if (!node) return;
    node.style.display = "none";
    node.textContent = "";
  }

  function renderSuccess(request, payment, paymentErrorMessage) {
    const success = document.getElementById("mk-ex-success");
    const actions = document.getElementById("mk-ex-form-actions");
    if (!success || !actions) return;

    const paymentUrl = payment?.paymentLinkUrl || "";
    const paymentStatus = payment?.status || "PENDING";

    success.style.display = "block";
    success.className = "mk-ex-success";
    success.innerHTML = `
      <strong>Exchange request created</strong>
      <div>Request ID: ${escapeHtml(request?.id || "—")}</div>
      <div>Request status: ${escapeHtml(request?.status || "OPEN")}</div>
      <div>Reverse pickup fee: ₹120</div>
      <div>Payment status: ${escapeHtml(paymentStatus)}</div>
      ${
        paymentUrl
          ? `<a class="mk-ex-btn primary" href="${escapeHtml(paymentUrl)}" target="_blank" rel="noopener noreferrer">Pay now</a>`
          : paymentErrorMessage
            ? `<div class="mk-ex-error" style="display:block;margin-top:0;">${escapeHtml(paymentErrorMessage)}</div>
               <button class="mk-ex-btn" id="mk-ex-retry-payment" type="button">Retry payment link</button>`
            : ""
      }
    `;

    actions.innerHTML = '<button class="mk-ex-btn" type="button" data-mk-ex-close="1">Close</button>';

    const retryBtn = document.getElementById("mk-ex-retry-payment");
    if (retryBtn && request?.id) {
      retryBtn.addEventListener("click", async function () {
        try {
          retryBtn.disabled = true;
          retryBtn.textContent = "Retrying...";
          const token = await getSessionToken();
          const paymentResponse = await fetch(API_BASE_URL + "/api/requests/exchange/" + encodeURIComponent(request.id) + "/payment-link", {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
          });
          if (!paymentResponse.ok) {
            throw new Error("Payment-link generation failed");
          }
          const paymentData = await paymentResponse.json();
          renderSuccess(request, paymentData?.payment || null, "");
        } catch (error) {
          retryBtn.disabled = false;
          retryBtn.textContent = "Retry payment link";
        }
      });
    }
  }

  async function submitExchange(context) {
    clearError();
    const requestedSize = document.getElementById("mk-ex-requested-size")?.value?.trim() || "";
    const reason = document.getElementById("mk-ex-reason")?.value?.trim() || "";
    const currentSize = document.getElementById("mk-ex-current-size")?.value?.trim() || "";

    if (!context.orderNumber || !context.productTitle) {
      showError("Order details are missing. Please close and reopen this order.");
      return;
    }

    if (!requestedSize) {
      showError("Requested size is required.");
      return;
    }

    const token = await getSessionToken();
    if (!token) {
      showError("Session expired. Please login again.");
      return;
    }

    try {
      setSubmittingState(true);

      const createResponse = await fetch(API_BASE_URL + "/api/requests/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          orderNumber: context.orderNumber,
          productTitle: context.productTitle,
          currentSize: currentSize || null,
          requestedSize,
          reason: reason || "Size exchange requested",
          customerNote: reason || null,
          quantity: 1,
        }),
      });

      const createData = await createResponse.json().catch(function () {
        return {};
      });

      if (!createResponse.ok || !createData?.request?.id) {
        throw new Error(createData?.error || "Exchange request creation failed");
      }

      let payment = null;
      let paymentErrorMessage = "";

      try {
        const paymentResponse = await fetch(
          API_BASE_URL + "/api/requests/exchange/" + encodeURIComponent(createData.request.id) + "/payment-link",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const paymentData = await paymentResponse.json().catch(function () {
          return {};
        });

        if (!paymentResponse.ok) {
          paymentErrorMessage = paymentData?.error || "Payment-link generation failed. Please retry.";
        } else {
          payment = paymentData?.payment || null;
        }
      } catch (error) {
        paymentErrorMessage = "Payment-link generation failed. Please retry.";
      }

      renderSuccess(createData.request, payment, paymentErrorMessage);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Exchange request creation failed.");
    } finally {
      setSubmittingState(false);
    }
  }

  function looksLikeExchangeButton(button) {
    if (!button || !button.querySelector) return false;
    const title = button.querySelector("strong")?.textContent?.trim()?.toLowerCase() || "";
    return title === "exchange" || button.getAttribute("data-order-action") === "exchange";
  }

  function bindExchangeHook() {
    document.addEventListener("click", function (event) {
      const button = event.target && event.target.closest ? event.target.closest(".mk-order-action-item") : null;
      if (!button || !looksLikeExchangeButton(button)) return;
      event.preventDefault();

      const context = getDrawerOrderContext();
      if (!context) return;
      renderModal(context);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        const layer = document.getElementById(MODAL_ID);
        if (layer) closeModal();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindExchangeHook);
  } else {
    bindExchangeHook();
  }
})();

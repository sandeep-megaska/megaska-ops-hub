(function () {
  const MEGASKA_FALLBACK_API_BASE = "https://megaska-ops-hub-exs1.vercel.app/api";

  function getMegaskaApiBase() {
    const configuredBase = String(window?.MegaskaAuth?.API_BASE || "").trim();
    return configuredBase || MEGASKA_FALLBACK_API_BASE;
  }

  async function getMegaskaSessionTokenForApi() {
    const getSessionToken = window?.MegaskaAuth?.getSessionToken;

    if (typeof getSessionToken === "function") {
      try {
        const token = await getSessionToken();
        return String(token || "").trim();
      } catch (error) {
        console.warn("[WALLET CART UI] async getSessionToken failed", error);
      }
    }

    try {
      return String(window?.localStorage?.getItem("megaska_session_token") || "").trim();
    } catch {
      return "";
    }
  }

  async function megaskaApiFetch(path, options) {
    const normalizedPath = String(path || "").trim().startsWith("/")
      ? String(path || "").trim()
      : `/${String(path || "").trim()}`;

    const token = await getMegaskaSessionTokenForApi();
    const baseHeaders = {
      Accept: "application/json",
    };

    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }

    const incomingHeaders = options?.headers || {};
    const mergedHeaders = Object.assign({}, baseHeaders, incomingHeaders);

    const response = await fetch(`${getMegaskaApiBase()}${normalizedPath}`, Object.assign({}, options || {}, {
      headers: mergedHeaders,
    }));

    return response;
  }

  async function fetchDashboardSummaryForCartWallet() {
    const response = await megaskaApiFetch("/dashboard/summary", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Dashboard summary failed (${response.status})`);
    }

    return response.json();
  }

  async function applyWalletFromCartButton(button, availableToRedeem) {
    if (!button || button.dataset.megaskaApplying === "1") return;
    if (availableToRedeem <= 0) return;

    button.dataset.megaskaApplying = "1";
    const originalLabel = button.textContent || "Apply Wallet";
    button.disabled = true;
    button.textContent = "Applying...";

    const cartContext = await readCartContext();
    const cartToken = cartContext?.cartToken || "";
    const cartId = cartContext?.cartId || "";

    console.log("[WALLET CART UI] apply click", {
      availableToRedeem,
      cartTokenPresent: Boolean(cartToken),
      cartIdPresent: Boolean(cartId),
    });

    try {
      const walletAmount = Number((availableToRedeem / 100).toFixed(2));
      const response = await megaskaApiFetch("/wallet/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAmount,
          cartToken: cartToken || undefined,
          cartId: cartId || undefined,
          sourceFlow: "CHECKOUT",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.ok || !data?.code) {
        throw new Error(data?.error || `Wallet apply failed (${response.status})`);
      }

      console.log("[WALLET CART UI] apply success", {
        reservationId: data?.reservationId || null,
        code: data?.code || null,
        discountNodeId: data?.discountNodeId || null,
        amountMinor: data?.amountMinor || null,
      });

      const code = String(data.code || "").trim();
      const targetUrl = `/discount/${encodeURIComponent(code)}?redirect=/cart`;
      console.log("[WALLET CART UI] redirecting to wallet discount attach", {
        code,
        targetUrl,
      });

      window.location.assign(targetUrl);
    } catch (error) {
      console.error("[WALLET CART UI] apply failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      button.disabled = false;
      button.textContent = originalLabel;
      button.dataset.megaskaApplying = "0";
    }
  }

  window.MegaskaBag = Object.assign({}, window.MegaskaBag || {}, {
    getMegaskaApiBase,
    getMegaskaSessionTokenForApi,
    megaskaApiFetch,
    fetchDashboardSummaryForCartWallet,
    applyWalletFromCartButton,
  });
})();

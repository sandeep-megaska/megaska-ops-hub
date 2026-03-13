import { Outlet } from "react-router";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";

export async function loader({ request }) {
  await authenticate.admin(request);
  return null;
}

export default function AppLayout() {
  return (
    <AppProvider>
      <PolarisAppProvider i18n={polarisTranslations}>
        <Outlet />
      </PolarisAppProvider>
    </AppProvider>
  );
}
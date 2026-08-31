import { createPortalFetch } from "@/lib/portal-client";
import { SALES_API_LOCAL_STORAGE_KEY, SALES_API_SESSION_STORAGE_KEY } from "@/lib/sales-session-keys";

export const salesFetch = createPortalFetch({
  sessionStorageKey: SALES_API_SESSION_STORAGE_KEY,
  localStorageKey: SALES_API_LOCAL_STORAGE_KEY,
  loginPath: "/sales/login",
});

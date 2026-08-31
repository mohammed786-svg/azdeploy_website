import { createPortalFetch } from "@/lib/portal-client";
import { STUDIO_API_LOCAL_STORAGE_KEY, STUDIO_API_SESSION_STORAGE_KEY } from "@/lib/studio-session-keys";

export const studioFetch = createPortalFetch({
  sessionStorageKey: STUDIO_API_SESSION_STORAGE_KEY,
  localStorageKey: STUDIO_API_LOCAL_STORAGE_KEY,
  loginPath: "/studio/login",
});

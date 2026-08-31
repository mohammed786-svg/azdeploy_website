import { createPortalFetch } from "@/lib/portal-client";
import { LIBRARY_API_LOCAL_STORAGE_KEY, LIBRARY_API_SESSION_STORAGE_KEY } from "@/lib/library-session-keys";

export const libraryFetch = createPortalFetch({
  sessionStorageKey: LIBRARY_API_SESSION_STORAGE_KEY,
  localStorageKey: LIBRARY_API_LOCAL_STORAGE_KEY,
  loginPath: "/library/login",
});

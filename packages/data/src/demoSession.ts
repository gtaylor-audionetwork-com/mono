/** Stub session cookie shared by host middleware and shell nav (demo until real auth). */
export const DEMO_SESSION_COOKIE = "mono_demo_session";
export const DEMO_SESSION_VALUE = "signed-in";

export function hasDemoSessionValue(cookieValue: string | undefined): boolean {
  return cookieValue === DEMO_SESSION_VALUE;
}

export function setDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_SESSION_COOKIE}=${DEMO_SESSION_VALUE}; path=/; SameSite=Lax`;
}

export function clearDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
}

export function hasDemoSessionCookieClient(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === DEMO_SESSION_COOKIE && value === DEMO_SESSION_VALUE;
  });
}

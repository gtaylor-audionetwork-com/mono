/** Stub session used by middleware until real auth is wired (musicapp parity spike). */
export const DEMO_SESSION_COOKIE = "mono_demo_session";
export const DEMO_SESSION_VALUE = "signed-in";

export function hasDemoSession(cookieValue: string | undefined): boolean {
  return cookieValue === DEMO_SESSION_VALUE;
}

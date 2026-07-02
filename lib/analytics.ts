/**
 * Thin, safe wrapper around the Meta Pixel (fbq). No-ops when the pixel isn't
 * loaded (e.g. the NEXT_PUBLIC_META_PIXEL_ID env var isn't set), so callers can
 * fire events unconditionally without guards.
 */
type Fbq = (
  kind: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>,
) => void;

export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}

export function cleanShortcode(shortcode: string) {
  return shortcode.replace(/\s+/g, "_").replace(/_$/, "");
}

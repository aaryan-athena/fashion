// Deep-link builders for external retailers.
// These open a pre-filled search on the retailer's own site — no scraping,
// no stale product pages, and nothing for the retailer to block.

export const amazonUrl = (query: string) =>
  `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

export const myntraUrl = (query: string) =>
  `https://www.myntra.com/${query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")}?rawQuery=${encodeURIComponent(query)}`;

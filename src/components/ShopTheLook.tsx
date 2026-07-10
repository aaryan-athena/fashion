import { useState } from "react";
import { amazonUrl, myntraUrl } from "@/lib/shop-links";
import { getProductOptions } from "@/lib/product-options";
import { getVibeClothing } from "@/lib/clothing-data";

/** Amazon + Myntra deep-link buttons for a search query. */
export function ShopButtons({ query, size = "sm" }: { query: string; size?: "sm" | "xs" }) {
  const cls =
    size === "xs"
      ? "px-2 py-1 text-[9px] tracking-[0.15em]"
      : "px-3 py-1.5 text-[10px] tracking-[0.2em]";
  return (
    <span className="inline-flex gap-1.5" onClick={(e) => e.stopPropagation()}>
      <a
        href={amazonUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} uppercase border border-border text-muted-foreground hover:border-gold hover:text-gold transition`}
      >
        Amazon ↗
      </a>
      <a
        href={myntraUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} uppercase border border-border text-muted-foreground hover:border-gold hover:text-gold transition`}
      >
        Myntra ↗
      </a>
    </span>
  );
}

/**
 * Expandable list of concrete product options (Budget / Mid / Premium)
 * for a named accessory, each with retailer links.
 */
export function ProductPicker({ accessory, defaultOpen = false }: { accessory: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const options = getProductOptions(accessory);
  if (options.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-[10px] tracking-[0.25em] uppercase text-gold hover:underline"
      >
        {open ? "Hide options −" : `Shop ${options.length} options +`}
      </button>
      {open && (
        <ul className="mt-2 divide-y divide-border/60 border border-border/60">
          {options.map((o) => (
            <li key={o.tier} className="p-2.5 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="text-[9px] tracking-[0.25em] uppercase text-gold">{o.tier}</div>
                <div className="text-xs leading-snug mt-0.5">
                  <span className="text-foreground/90 font-medium">{o.brand}</span>
                  <span className="text-muted-foreground"> · {o.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">approx. {o.price}</div>
              </div>
              <ShopButtons query={o.query} size="xs" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The clothing layer for a vibe — key garments, each shoppable. */
export function ClothingRail({ vibe, heading = "Complete the fit" }: { vibe: string; heading?: string }) {
  const items = getVibeClothing(vibe);
  if (items.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{heading}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((c) => (
          <div
            key={c.item}
            className="border border-border/70 bg-background/40 px-3 py-2.5 flex items-center justify-between gap-3 flex-wrap"
          >
            <span className="text-xs text-foreground/90">{c.item}</span>
            <ShopButtons query={c.query} size="xs" />
          </div>
        ))}
      </div>
    </div>
  );
}

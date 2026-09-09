import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { amazonUrl, myntraUrl, makerUrl, makerLinkIsSearch } from "@/lib/shop-links";
import { getMakerPicks, hasHomegrownCoverage } from "@/lib/maker-picks";
import { PRICE_BAND_LABEL } from "@/lib/makers-data";
import { getVibeClothing, type ClothingItem } from "@/lib/clothing-data";

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
 * The one-line maker credit shown under a piece's name.
 *
 * This slot used to print an invented exemplar ("Rolex · Datejust 41"). It now
 * names the lead homegrown maker for the piece and where they work — real, and
 * visible without needing a click, since surfacing these labels is the point.
 */
export function MakerLine({ accessory }: { accessory: string }) {
  const [lead] = getMakerPicks(accessory, 1);

  if (!lead) {
    return (
      <span className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground/70">
        Marketplace piece
      </span>
    );
  }

  return (
    <span className="text-[10px] tracking-[0.12em] uppercase">
      <span className="text-foreground/80">{lead.maker.name}</span>
      {lead.maker.city && <span className="text-muted-foreground/70"> · {lead.maker.city}</span>}
    </span>
  );
}

/**
 * Where to actually buy a piece — homegrown Indian makers first.
 *
 * Named ProductPicker still because four routes call it that; what it lists
 * changed from invented SKUs to real labels. Prices are bands, not per-product
 * claims: the maker's own store is the only place a price is truthful.
 */
export function ProductPicker({ accessory, defaultOpen = false }: { accessory: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const picks = getMakerPicks(accessory);

  // Categories no independent Indian jeweller makes (a fitness tracker, say).
  // Say so plainly and hand off, rather than faking a homegrown option.
  if (picks.length === 0) {
    if (hasHomegrownCoverage(accessory)) return null;
    return (
      <div className="mt-2">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          No homegrown maker builds this one — it's a marketplace piece.
        </p>
        <div className="mt-1.5">
          <ShopButtons query={accessory.toLowerCase() + " men"} size="xs" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-[10px] tracking-[0.25em] uppercase text-gold hover:underline"
      >
        {open ? "Hide makers −" : `${picks.length} homegrown ${picks.length === 1 ? "maker" : "makers"} +`}
      </button>
      {open && (
        <ul className="mt-2 divide-y divide-border/60 border border-border/60">
          {picks.map(({ maker, reason, query }) => (
            <li key={maker.id} className="p-2.5">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-xs font-medium text-foreground/90">{maker.name}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {PRICE_BAND_LABEL[maker.priceBand]}
                </span>
              </div>
              {maker.city && (
                <div className="text-[9px] tracking-[0.2em] uppercase text-gold mt-0.5">{maker.city}</div>
              )}
              {reason && (
                <p className="text-[11px] text-muted-foreground leading-snug mt-1">{reason}</p>
              )}
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <a
                  href={makerUrl(maker, query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 text-[9px] tracking-[0.15em] uppercase border border-border text-muted-foreground hover:border-gold hover:text-gold transition"
                >
                  {makerLinkIsSearch(maker) ? "Shop their range ↗" : "Visit the label ↗"}
                </a>
                <Link
                  to="/makers"
                  hash={`maker-${maker.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground hover:text-gold transition"
                >
                  Their story
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The clothing layer for a vibe — key garments, each shoppable. Pass `items` directly for blended/custom vibes. */
export function ClothingRail({
  vibe,
  heading = "Complete the fit",
  items: itemsProp,
}: {
  vibe: string;
  heading?: string;
  items?: ClothingItem[];
}) {
  const items = itemsProp ?? getVibeClothing(vibe);
  if (items.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{heading}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((c) => (
          <figure
            key={c.item}
            className="group border border-border hover:border-gold-soft transition overflow-hidden bg-card/40"
          >
            <div className="aspect-square bg-card overflow-hidden">
              {c.image && (
                <img
                  src={c.image}
                  alt={c.item}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <figcaption className="p-3 space-y-2">
              <div className="text-xs font-medium leading-tight">{c.item}</div>
              <ShopButtons query={c.query} size="xs" />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

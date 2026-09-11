import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { amazonUrl, myntraUrl, makerUrl, makerLinkIsSearch } from "@/lib/shop-links";
import { getMakerPicks, hasHomegrownCoverage } from "@/lib/maker-picks";
import { PRICE_BAND_LABEL } from "@/lib/makers-data";
import { getLuxuryFor, LUXURY_TIER_LABEL } from "@/lib/luxury-data";
import { categorize } from "@/lib/accessory-category";
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
 * Where to actually buy a piece, in three tiers.
 *
 * Order is the product position, not an implementation detail: homegrown
 * makers first and open by default, then the luxury reference points, then a
 * plain marketplace search. Shoppers arrive with all three intents — "support
 * someone small", "something like a Cartier", "just show me Amazon" — and
 * answering only the first was sending the other two away.
 *
 * Prices everywhere are bands, never per-product claims. The seller's own page
 * is the only place a price is true.
 */
export function ProductPicker({ accessory, defaultOpen = false }: { accessory: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const picks = getMakerPicks(accessory);
  const luxury = getLuxuryFor(categorize(accessory));
  const marketQuery = `${accessory.toLowerCase()} men`;
  const homegrown = hasHomegrownCoverage(accessory);

  return (
    <div className="mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-[10px] tracking-[0.25em] uppercase text-gold hover:underline"
      >
        {open
          ? "Hide options −"
          : picks.length > 0
            ? `Where to buy · ${picks.length} homegrown +`
            : "Where to buy +"}
      </button>

      {open && (
        <div className="mt-2 border border-border/60 divide-y divide-border/60">
          {/* Tier 1 — homegrown. The point of the platform, so it leads. */}
          {picks.length > 0 ? (
            <section>
              <header className="px-2.5 pt-2.5 text-[9px] tracking-[0.25em] uppercase text-gold">
                Homegrown
              </header>
              <ul className="divide-y divide-border/40">
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
            </section>
          ) : (
            !homegrown && (
              <p className="p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                No independent Indian maker builds this one — the options below are the honest ones.
              </p>
            )
          )}

          {/* Tier 2 — luxury reference points. Homepages only: these houses
              block automated checks, so a guessed deep link can't be verified. */}
          {luxury.length > 0 && (
            <section>
              <header className="px-2.5 pt-2.5 text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
                Luxury
              </header>
              <ul className="divide-y divide-border/40">
                {luxury.map((b) => (
                  <li key={b.id} className="p-2.5">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="text-xs font-medium text-foreground/90">
                        {b.name}
                        {b.origin === "india" && (
                          <span className="text-[9px] tracking-[0.15em] uppercase text-gold ml-1.5">Indian</span>
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {LUXURY_TIER_LABEL[b.tier]}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-1">{b.blurb}</p>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <a
                        href={b.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 text-[9px] tracking-[0.15em] uppercase border border-border text-muted-foreground hover:border-gold hover:text-gold transition"
                      >
                        Official site ↗
                      </a>
                      {b.onMarketplace && (
                        <a
                          href={amazonUrl(`${b.name} ${marketQuery}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 text-[9px] tracking-[0.15em] uppercase border border-border text-muted-foreground hover:border-gold hover:text-gold transition"
                        >
                          On Amazon ↗
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tier 3 — the marketplace search people would have run anyway. */}
          <section className="p-2.5">
            <header className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
              Marketplace
            </header>
            <p className="text-[11px] text-muted-foreground leading-snug mb-2">
              A plain search for “{accessory.toLowerCase()}”, if you'd rather buy where you already have an account.
            </p>
            <ShopButtons query={marketQuery} size="xs" />
          </section>
        </div>
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

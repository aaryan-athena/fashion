import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { MAKERS, PRICE_BAND_LABEL, type PriceBand } from "@/lib/makers-data";
import { makerUrl, makerLinkIsSearch } from "@/lib/shop-links";
import { CATEGORIES, type Cat } from "@/lib/accessory-category";

export const Route = createFileRoute("/makers")({
  head: () => ({
    meta: [
      { title: "The Makers — The Vault" },
      {
        name: "description",
        content:
          "The independent Indian jewellery labels behind the Vault — who they are, where they work, and what they make. Small studios, named ahead of the luxury houses.",
      },
      { property: "og:title", content: "The Makers — The Vault" },
      {
        property: "og:description",
        content: "Independent Indian jewellery labels — who they are and what they make.",
      },
    ],
  }),
  component: MakersPage,
});

const BANDS: (PriceBand | "All")[] = ["All", "accessible", "mid", "premium"];

function MakersPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [band, setBand] = useState<PriceBand | "All">("All");

  const list = useMemo(
    () =>
      MAKERS.filter((m) => (cat === "All" ? true : m.makes.includes(cat as Exclude<Cat, "All">)))
        .filter((m) => (band === "All" ? true : m.priceBand === band))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [cat, band],
  );

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-light mb-5">
          {MAKERS.length} homegrown labels,
          <span className="italic text-muted-foreground"> named before anyone else.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Studios in Jaipur, Mumbai and Bengaluru that can't outspend a marketplace for your
          attention — so they lead every recommendation here. Prices are bands; the live number is
          on the maker's own site.
        </p>

        {/* Filters */}
        <div className="mt-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mr-1">Makes</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase border transition ${
                  cat === c
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border text-muted-foreground hover:border-gold-soft hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mr-1">Budget</span>
            {BANDS.map((b) => (
              <button
                key={b}
                onClick={() => setBand(b)}
                className={`px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase border transition ${
                  band === b
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border text-muted-foreground hover:border-gold-soft hover:text-foreground"
                }`}
              >
                {b === "All" ? "All" : PRICE_BAND_LABEL[b]}
              </button>
            ))}
          </div>
        </div>

        {/* Roster */}
        <div data-tour="makers-roster" className="mt-10 grid gap-4 md:grid-cols-2">
          {list.map((m) => (
            <article
              key={m.id}
              id={`maker-${m.id}`}
              className="scroll-mt-28 border border-border hover:border-gold-soft transition bg-card/40 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-display text-2xl font-light leading-tight">{m.name}</h2>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gold mt-1.5">
                    {[m.city, m.founder].filter(Boolean).join(" · ") || "Independent label"}
                  </div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground shrink-0">
                  {PRICE_BAND_LABEL[m.priceBand]}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mt-4">{m.blurb}</p>

              {/* Categories and vibes, unlabelled. Two "Makes" / "Sits in"
                  headings above two rows of chips said less than the chips do. */}
              <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                {m.makes.map((c) => (
                  <span key={c} className="text-[10px] tracking-[0.12em] uppercase border border-border px-2 py-0.5 text-foreground/80">
                    {c}
                  </span>
                ))}
                {m.vibes.map((v) => (
                  <Link
                    key={v}
                    to="/vibes"
                    hash={`vibe-${v.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-[10px] tracking-[0.12em] uppercase border border-border/60 px-2 py-0.5 text-muted-foreground hover:border-gold hover:text-gold transition"
                  >
                    {v}
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-border/60 mt-auto">
                <a
                  href={makerUrl(m)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.25em] uppercase border border-gold px-4 py-2.5 text-gold hover:bg-gold hover:text-background transition inline-block"
                >
                  {makerLinkIsSearch(m) ? "Their store ↗" : "Their site ↗"}
                </a>
              </div>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground border border-dashed border-border px-5 py-8 text-center">
            No maker on the roster matches that combination yet. Clear a filter — or if you know a
            label that belongs here, that's exactly how this list grows.
          </p>
        )}

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 hover:bg-gold hover:text-background transition"
          >
            Find your vibe →
          </Link>
          <Link
            to="/learn"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Start from zero
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

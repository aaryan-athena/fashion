import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroImg from "@/assets/hero-jewels.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { VIBES, colorToHex, lookupAccessoryDefinition, type VibeEntry } from "@/lib/vault-data";
import { vibeImage } from "@/lib/vibe-images";
import { getAccessoryMeta } from "@/lib/accessory-data";
import { ProductPicker, ClothingRail } from "@/components/ShopTheLook";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Vault — Vibe to Accessory Recommender" },
      { name: "description", content: "Type your vibe — streetwear, old money, techwear — and get the accessories that finish the fit." },
      { property: "og:title", content: "The Vault — Vibe to Accessory Recommender" },
      { property: "og:description", content: "Type your vibe and get accessories that finish the fit." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function scoreVibe(entry: VibeEntry, q: string): number {
  if (!q) return 0;
  const needle = q.toLowerCase().trim();
  const v = entry.vibe.toLowerCase();
  if (v === needle) return 100;
  if (v.startsWith(needle)) return 80;
  if (v.includes(needle)) return 60;
  if (entry.definition.toLowerCase().includes(needle)) return 30;
  if (entry.recommended.join(" ").toLowerCase().includes(needle)) return 15;
  return 0;
}

function Index() {
  const [query, setQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<string>("Luxury");
  const [filter, setFilter] = useState<"All" | "Casual" | "Formal">("All");

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return VIBES.map((v) => ({ v, s: scoreVibe(v, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6);
  }, [query]);

  const selected = useMemo(
    () => VIBES.find((v) => v.vibe === selectedVibe) ?? VIBES[0],
    [selectedVibe]
  );

  const browse = useMemo(
    () => (filter === "All" ? VIBES : VIBES.filter((v) => v.outfitType === filter)),
    [filter]
  );

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />


      {/* Hero — sits over the global fixed background image */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-5 sm:px-6 md:px-10 py-20">
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6">
          <div className="inline-flex items-center gap-3 border border-gold bg-background/70 backdrop-blur px-4 py-2 mx-auto rounded-sm shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <p className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-gold font-semibold">Men's Accessories · Chains · Rings · Watches · Bracelets</p>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[0.95] font-medium text-foreground" style={{ textShadow: "0 2px 24px color-mix(in oklab, var(--background) 80%, transparent)" }}>
            Men's accessories,
            <span className="italic text-gold"> matched to your vibe.</span>
          </h1>
          <p className="text-lg text-foreground/85 leading-relaxed max-w-2xl mx-auto" style={{ textShadow: "0 1px 14px color-mix(in oklab, var(--background) 80%, transparent)" }}>
            Streetwear. Old money. Techwear. Tell us the energy — we hand you the chains, rings, watches and bracelets that finish the fit.
          </p>

          {/* Search */}
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'streetwear', 'old money', 'techwear'…"
                className="w-full min-w-0 bg-background/85 backdrop-blur border border-border focus:border-gold outline-none px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/60 transition shadow-sm"
                aria-label="Search your vibe"
              />
              <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-xs tracking-[0.3em] uppercase text-muted-foreground sm:block">
                Vibe ↵
              </span>
            </div>
            {matches.length > 0 && (
              <div className="border border-border bg-background/90 backdrop-blur divide-y divide-border text-left rounded-sm shadow-lg">
                {matches.map(({ v }) => (
                  <button
                    key={v.vibe}
                    onClick={() => {
                      setSelectedVibe(v.vibe);
                      setQuery("");
                      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-card flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-display text-lg">{v.vibe}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{v.definition}</div>
                    </div>
                    <span className="text-xs text-gold opacity-0 group-hover:opacity-100 tracking-[0.3em]">SELECT →</span>
                  </button>
                ))}
              </div>
            )}
            {query && matches.length === 0 && (
              <p className="text-sm text-muted-foreground px-1 text-left">No vibe matches — try one of the chips below.</p>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["Streetwear", "Old Money", "Techwear", "Luxury", "Minimalist", "Y2K", "Vintage", "Sporty"].map((vibeName) => {
                const v = VIBES.find((x) => x.vibe === vibeName);
                if (!v) return null;
                return (
                  <button
                    key={v.vibe}
                    onClick={() => {
                      setSelectedVibe(v.vibe);
                      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`text-xs tracking-[0.18em] uppercase border px-4 py-2 transition backdrop-blur ${
                      selectedVibe === v.vibe ? "border-gold bg-gold/20 text-gold" : "border-border bg-background/60 text-foreground/80 hover:border-gold hover:text-foreground"
                    }`}
                  >
                    {v.vibe}
                  </button>
                );
              })}
            </div>
            <div className="text-center pt-1">
              <Link to="/vibes" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold transition">
                See all 22 vibes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section id="result" className="border-t border-border bg-card/40 py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Your edit</p>
              <h2 className="text-4xl md:text-5xl font-light">
                <span className="italic">{selected.vibe}</span>
                <span className="text-muted-foreground"> — {selected.outfitType.toLowerCase()}</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">{selected.definition}</p>
            </div>
            <div className="flex items-center gap-3">
              {selected.colors.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <span className="h-6 w-6 border border-border" style={{ backgroundColor: colorToHex(c) }} />
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div key={selected.vibe} className="grid xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.65fr)] gap-4 mb-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr] xl:grid-cols-1 gap-4">
              <div className="relative border border-gold-soft overflow-hidden">
                <img
                  src={vibeImage(selected.vibe)}
                  alt={`${selected.vibe} accessories flat lay`}
                  width={768}
                  height={768}
                  loading="lazy"
                  className="w-full aspect-[4/3] xl:aspect-square object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur border border-gold-soft px-3 py-1.5">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{selected.outfitType}</div>
                  <div className="font-display text-base leading-tight">{selected.vibe}</div>
                </div>
              </div>
              <div className="border border-border bg-background/50 p-5 space-y-4">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">The brief</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.definition}</p>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Palette</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.colors.map((c) => (
                      <div key={c} className="flex items-center gap-1.5 border border-border px-2 py-1">
                        <span className="h-3 w-3" style={{ backgroundColor: colorToHex(c) }} />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Outfit type</div>
                  <div className="font-display text-lg">{selected.outfitType}</div>
                </div>
              </div>
            </div>
            <article className="grid md:grid-cols-3 gap-3 items-stretch">
              {(() => {
                const seen = new Set<string>();
                const dedupe = (items: string[]) =>
                  items.filter((p) => {
                    const key = lookupAccessoryDefinition(p).name.toLowerCase();
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  });
                const mv = dedupe(selected.mostValuable);
                const rec = dedupe(selected.recommended);
                const add = dedupe(selected.addOns);
                return (
                  <>
                    <Block label="Most valuable" subtitle="The hero pieces" items={mv} accent />
                    <Block label="Recommended" subtitle="The full edit" items={rec} />
                    <Block label="Add-ons" subtitle="Layer them in" items={add} />
                  </>
                );
              })()}
            </article>
          </div>

          {/* Clothing layer — the garments that build this vibe */}
          <div className="border border-border bg-background/50 p-5 md:p-6">
            <ClothingRail vibe={selected.vibe} heading={`Complete the ${selected.vibe} fit`} />
          </div>
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">All 22 vibes</p>
              <h2 className="text-3xl md:text-4xl font-light">Browse the Vault</h2>
            </div>
            <div className="flex border border-border">
              {(["All", "Casual", "Formal"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs tracking-[0.25em] uppercase transition ${
                    filter === f ? "bg-foreground text-background" : "hover:bg-card"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {browse.map((v) => {
              const active = v.vibe === selected.vibe;
              return (
                <button
                  key={v.vibe}
                  onClick={() => {
                    setSelectedVibe(v.vibe);
                    document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`text-left border transition-all duration-300 group overflow-hidden ${
                    active ? "border-gold bg-card" : "border-border hover:border-gold-soft"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-card">
                    <img
                      src={vibeImage(v.vibe)}
                      alt={`${v.vibe} accessories`}
                      width={768}
                      height={768}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {v.colors.map((c) => (
                        <span key={c} className="h-3 w-3 rounded-full border border-background/60 shadow" style={{ backgroundColor: colorToHex(c) }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="font-display text-xl leading-tight">{v.vibe}</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-gold mt-1">{v.outfitType}</div>
                    <TierLine label="Most valuable" items={v.mostValuable} />
                    <TierLine label="Recommended" items={v.recommended} />
                    <TierLine label="Add-ons" items={v.addOns} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="atelier" className="border-t border-border px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { n: "01", t: "Vibe-mapped", d: "Every accessory is mapped to a vibe — no guessing what works with what." },
            { n: "02", t: "Hero + Layer", d: "We name the hero piece first, then what to layer in. Build, don't pile." },
            { n: "03", t: "Metals that match", d: "Colour palette per vibe, so the metals never fight the fit." },
          ].map((b) => (
            <div key={b.n} className="space-y-3">
              <div className="text-gold text-xs tracking-[0.3em]">{b.n}</div>
              <h4 className="text-2xl font-light">{b.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-12 flex flex-wrap gap-3">
          <Link to="/about" className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 hover:bg-gold hover:text-background transition">
            Read the full method →
          </Link>
          <Link to="/accessories" className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition">
            Accessory glossary
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function TierLine({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-t border-border/60 pt-2">
      <div className="text-[9px] tracking-[0.22em] uppercase text-gold">{label}</div>
      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{items.join(" · ")}</div>
    </div>
  );
}

function Block({ label, subtitle, items, accent = false }: { label: string; subtitle: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`h-full p-4 border ${accent ? "border-gold bg-background" : "border-border bg-background/50"}`}>
      <div className="mb-4 pb-3 border-b border-border/60">
        <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{label}</div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-1.5">{subtitle}</div>
      </div>
      <ul className="space-y-4">
        {items.map((p, i) => {
          const { name, definition } = lookupAccessoryDefinition(p);
          const meta = getAccessoryMeta(name);
          return (
            <li key={i} className="space-y-2">
              {meta ? (
                <img
                  src={meta.image}
                  alt={name}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="w-full aspect-[5/4] object-cover border border-border"
                />
              ) : (
                <div className="text-[10px] text-gold tracking-[0.2em]">{String(i + 1).padStart(2, "0")}</div>
              )}
              <div>
                <div className="font-display text-base leading-snug">{name}</div>
                {meta && (
                  <div className="text-[10px] tracking-[0.18em] uppercase mt-1 break-words">
                    <span className="text-foreground/80">{meta.brand}</span>
                    <span className="text-muted-foreground/70"> · {meta.model}</span>
                  </div>
                )}
                {definition && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{definition}</p>
                )}
                <ProductPicker accessory={name} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


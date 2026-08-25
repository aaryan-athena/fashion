import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero-jewels.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { VIBES, colorToHex, lookupAccessoryDefinition, vibeSlug, type VibeEntry } from "@/lib/vault-data";
import { vibeImage } from "@/lib/vibe-images";
import { getAccessoryMeta } from "@/lib/accessory-data";
import { ProductPicker, ClothingRail } from "@/components/ShopTheLook";
import { blendVibes, MAX_MIX, MIN_MIX } from "@/lib/vibe-mixer";
import { aiVibeSearch, type AiVibeSearchResponse } from "@/lib/api/groq-search.functions";
import { OCCASIONS, occasionAgainstDrawer } from "@/lib/occasions";
import { LookCheck, OwnToggle } from "@/components/Drawer";
import { useDrawer } from "@/lib/drawer";


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
  const words = needle.split(/\s+/).filter(Boolean);
  const v = entry.vibe.toLowerCase();
  if (v === needle) return 100;
  if (v.startsWith(needle)) return 85;
  if (v.includes(needle)) return 70;

  const outfitType = entry.outfitType.toLowerCase();
  const colors = entry.colors.join(" ").toLowerCase();
  const accessories = [...entry.mostValuable, ...entry.recommended, ...entry.addOns].join(" ").toLowerCase();
  const definition = entry.definition.toLowerCase();

  // Multi-word queries score across name, outfit type, colors, accessories and
  // definition — so "gold formal" or "black chain" surface relevant vibes
  // even when no single field matches the whole phrase.
  let score = 0;
  for (const w of words) {
    if (v.includes(w)) score += 40;
    if (outfitType.includes(w)) score += 20;
    if (colors.includes(w)) score += 18;
    if (accessories.includes(w)) score += 15;
    if (definition.includes(w)) score += 10;
  }
  return score;
}

type AiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; response: AiVibeSearchResponse; forQuery: string };

const CURATED_VIBE_NAMES = ["Streetwear", "Old Money", "Techwear", "Luxury", "Minimal", "Y2K", "Vintage", "Sporty"];

const SECTION_NAV_ITEMS = [
  { id: "hero-top", label: "Search" },
  { id: "result", label: "Your Edit" },
  { id: "occasion", label: "Occasions" },
  { id: "mix", label: "Mix & Match" },
  { id: "browse", label: "Browse" },
  { id: "atelier", label: "Method" },
];

function SectionNav() {
  const [active, setActive] = useState(SECTION_NAV_ITEMS[0].id);

  useEffect(() => {
    const targets = SECTION_NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed right-5 xl:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4"
    >
      {SECTION_NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="group flex items-center gap-3"
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={`text-[10px] tracking-[0.2em] uppercase whitespace-nowrap bg-background/90 backdrop-blur px-2 py-1 border transition ${
                isActive
                  ? "text-gold border-gold-soft opacity-100"
                  : "text-foreground/70 border-border opacity-60 group-hover:opacity-100 group-hover:text-foreground"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full border-2 shrink-0 transition ${
                isActive
                  ? "bg-gold border-gold scale-125"
                  : "bg-foreground/25 border-foreground/45 group-hover:bg-gold/30 group-hover:border-gold"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

function Index() {
  const [query, setQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<string>("Luxury");
  const [filter, setFilter] = useState<"All" | "Casual" | "Formal">("All");
  const [aiState, setAiState] = useState<AiState>({ status: "idle" });

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return VIBES.map((v) => ({ v, s: scoreVibe(v, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12);
  }, [query]);

  const askAi = async () => {
    const q = query.trim();
    if (q.length < 2 || aiState.status === "loading") return;
    setAiState({ status: "loading" });
    try {
      const response = await aiVibeSearch({ data: { query: q } });
      setAiState({ status: "done", response, forQuery: q });
    } catch {
      setAiState({
        status: "done",
        response: { ok: false, reason: "AI search is temporarily unavailable — try again shortly." },
        forQuery: q,
      });
    }
  };

  const selected = useMemo(
    () => VIBES.find((v) => v.vibe === selectedVibe) ?? VIBES[0],
    [selectedVibe]
  );

  const [showAllVibes, setShowAllVibes] = useState(false);
  const remainingVibes = useMemo(
    () => VIBES.filter((v) => !CURATED_VIBE_NAMES.includes(v.vibe)),
    []
  );

  const browse = useMemo(
    () => (filter === "All" ? VIBES : VIBES.filter((v) => v.outfitType === filter)),
    [filter]
  );

  const [occasionSlug, setOccasionSlug] = useState<string>(OCCASIONS[0].slug);
  const { owned, count: drawerCount, ready: drawerReady } = useDrawer();
  const occasion = useMemo(
    () => OCCASIONS.find((o) => o.slug === occasionSlug) ?? OCCASIONS[0],
    [occasionSlug],
  );
  const occasionEdit = useMemo(() => occasionAgainstDrawer(occasion, owned), [occasion, owned]);

  const [mixVibes, setMixVibes] = useState<string[]>([]);
  const blended = useMemo(() => blendVibes(mixVibes), [mixVibes]);
  const toggleMix = (name: string) => {
    setMixVibes((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_MIX) return prev;
      return [...prev, name];
    });
  };

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <SectionNav />

      {/* Hero — sits over the global fixed background image */}
      <section id="hero-top" className="relative min-h-[80vh] flex items-center justify-center px-5 sm:px-6 md:px-10 py-16 sm:py-20">
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6">
          <div className="inline-flex items-center gap-3 border border-gold bg-background/70 backdrop-blur px-3.5 sm:px-4 py-2 mx-auto rounded-sm shadow-sm max-w-[90vw]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
            <p className="text-[9.5px] sm:text-xs tracking-[0.14em] sm:tracking-[0.32em] uppercase text-gold font-semibold leading-snug">Men's Accessories · Chains · Rings · Watches · Earrings</p>
          </div>
          <h1 className="on-image text-4xl sm:text-6xl lg:text-7xl leading-[1.05] sm:leading-[0.95] font-medium text-foreground">
            Men's accessories,
            <span className="italic text-gold"> matched to your vibe.</span>
          </h1>
          <p className="on-image text-lg text-foreground/90 leading-relaxed max-w-2xl mx-auto">
            Streetwear. Old money. Techwear. Tell us the energy — we hand you the chains, rings, watches, earrings and
            bracelets that finish the fit.
          </p>

          {/* Search */}
          <div className="space-y-3 max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askAi();
              }}
              className="relative"
            >
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (aiState.status === "done") setAiState({ status: "idle" });
                }}
                placeholder="Try 'streetwear', or describe a whole look…"
                className="w-full min-w-0 bg-background/85 backdrop-blur border border-border focus:border-gold outline-none pl-4 pr-[5.5rem] sm:pl-5 sm:pr-28 py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 transition shadow-sm"
                aria-label="Search your vibe"
              />
              <button
                type="submit"
                disabled={query.trim().length < 2 || aiState.status === "loading"}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase border border-gold text-gold px-2.5 sm:px-3.5 py-2 sm:py-2.5 hover:bg-gold hover:text-background transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold whitespace-nowrap"
              >
                {aiState.status === "loading" ? "…" : "✨ Ask AI"}
              </button>
            </form>
            {matches.length > 0 && (
              <div className="border border-border bg-background/90 backdrop-blur divide-y divide-border text-left rounded-sm shadow-lg max-h-[420px] overflow-y-auto">
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
            {query && matches.length === 0 && aiState.status === "idle" && (
              <p className="text-sm text-muted-foreground px-1 text-left">
                No vibe matches — try one of the chips below, or hit "Ask AI" above to describe the whole look.
              </p>
            )}

            {aiState.status === "loading" && (
              <p className="text-sm text-muted-foreground px-1 text-left animate-pulse">Asking AI for your vibe…</p>
            )}

            {aiState.status === "done" && aiState.forQuery === query.trim() && (
              <div className="border border-gold-soft bg-background/95 backdrop-blur rounded-sm shadow-lg text-left p-5 space-y-4">
                {aiState.response.ok ? (
                  <>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                          AI match · {aiState.response.result.confidence} confidence
                        </div>
                        <div className="font-display text-xl">{aiState.response.result.customVibeName}</div>
                      </div>
                      <button
                        onClick={() => setAiState({ status: "idle" })}
                        className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition"
                      >
                        Dismiss ✕
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiState.response.result.styleNote}</p>
                    {aiState.response.result.suggestedColors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {aiState.response.result.suggestedColors.map((c) => (
                          <div key={c} className="flex items-center gap-1.5 border border-border px-2 py-1">
                            <span className="h-3 w-3" style={{ backgroundColor: colorToHex(c) }} />
                            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aiState.response.result.matchedVibes.map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setSelectedVibe(name);
                            setAiState({ status: "idle" });
                            setQuery("");
                            document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="text-xs tracking-[0.16em] uppercase border border-gold px-3 py-1.5 text-gold hover:bg-gold hover:text-background transition"
                        >
                          {name} →
                        </button>
                      ))}
                      {aiState.response.result.matchedVibes.length >= MIN_MIX && (
                        <button
                          onClick={() => {
                            if (aiState.status === "done" && aiState.response.ok) {
                              setMixVibes(aiState.response.result.matchedVibes.slice(0, MAX_MIX));
                            }
                            setAiState({ status: "idle" });
                            setQuery("");
                            document.getElementById("mix")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="text-xs tracking-[0.16em] uppercase border border-border px-3 py-1.5 text-foreground/80 hover:border-gold hover:text-gold transition"
                        >
                          Blend these →
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{aiState.response.reason}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {CURATED_VIBE_NAMES.map((vibeName) => {
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
              <button
                onClick={() => setShowAllVibes((s) => !s)}
                className={`text-xs tracking-[0.18em] uppercase border border-dashed px-4 py-2 transition backdrop-blur ${
                  showAllVibes
                    ? "border-gold text-gold bg-gold/10"
                    : "border-border text-muted-foreground bg-background/60 hover:border-gold hover:text-gold"
                }`}
              >
                {showAllVibes ? "Less −" : `More +${remainingVibes.length}`}
              </button>
            </div>

            {showAllVibes && (
              <div className="flex flex-wrap justify-center gap-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                {remainingVibes.map((v) => (
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
                ))}
              </div>
            )}

            <div className="text-center pt-1">
              <Link to="/vibes" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold transition">
                Open the full vibe library →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section id="result" className="panel border-t border-border py-20 md:py-24 px-6 md:px-12">
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

      {/* Occasions — the same drawer, judged against a real dress code */}
      <section id="occasion" className="panel border-t border-border px-6 md:px-12 py-24 md:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-semibold">Where are you going?</p>
          <h2 className="text-5xl sm:text-6xl md:text-7xl leading-[0.98] font-medium mb-5">
            Occasion <span className="italic text-gold">intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed text-lg">
            Most men don't lack accessories — they lack the read on when formality actually matters. Pick
            where you're going and the same catalog answers differently.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {OCCASIONS.map((o) => (
              <button
                key={o.slug}
                onClick={() => setOccasionSlug(o.slug)}
                className={`text-xs tracking-[0.16em] uppercase border px-3.5 py-2 transition ${
                  o.slug === occasionSlug
                    ? "border-gold bg-gold/20 text-gold"
                    : "border-border text-foreground/80 hover:border-gold-soft hover:text-foreground"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="border border-gold-soft bg-background/50 p-6 md:p-8 space-y-8">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-light">{occasion.label}</h3>
              <p className="text-foreground/80 leading-relaxed max-w-3xl mt-3">{occasion.blurb}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  Drawn from{" "}
                  {occasionEdit.sourceVibes.map((v, idx) => (
                    <span key={v}>
                      {idx > 0 && " × "}
                      <Link
                        to="/vibes"
                        hash={`vibe-${vibeSlug(v)}`}
                        className="text-gold hover:underline normal-case tracking-normal"
                      >
                        {v}
                      </Link>
                    </span>
                  ))}
                </span>
                {occasionEdit.palette.length > 0 && (
                  <span className="flex items-center gap-2">
                    {occasionEdit.palette.map((c) => (
                      <span
                        key={c}
                        title={c}
                        className="h-4 w-4 border border-border"
                        style={{ backgroundColor: colorToHex(c) }}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>

            {/* What to wear */}
            <div className="border-t border-border/60 pt-6">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                Right for this — {occasionEdit.pieces.length} pieces
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {occasionEdit.pieces.map((p) => {
                  const meta = getAccessoryMeta(p);
                  const have = drawerReady && owned.has(p);
                  return (
                    <div
                      key={p}
                      className={`border p-3 flex gap-3 ${have ? "border-gold-soft bg-gold/5" : "border-border"}`}
                    >
                      {meta?.image && (
                        <img
                          src={meta.image}
                          alt={p}
                          width={80}
                          height={80}
                          loading="lazy"
                          className="w-16 h-16 object-cover shrink-0 border border-border/60"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-display text-base leading-tight">{p}</div>
                        {have ? (
                          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mt-1">
                            ✓ In your drawer
                          </div>
                        ) : (
                          <div className="mt-1.5">
                            <OwnToggle accessory={p} size="xs" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ruled out — the teaching half */}
            {occasionEdit.excluded.length > 0 && (
              <div className="border-t border-border/60 pt-6">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Leave at home
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
                  {occasionEdit.excluded.map((x) => (
                    <li key={x.piece} className="text-sm text-muted-foreground">
                      <span className="text-foreground/70 line-through decoration-muted-foreground/40">
                        {x.piece}
                      </span>{" "}
                      — {x.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Against the drawer */}
            {drawerReady && drawerCount > 0 && (
              <div className="border-t border-border/60 pt-6 space-y-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">
                    From your drawer
                  </div>
                  {occasionEdit.haveIt.length > 0 ? (
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      You already own {occasionEdit.haveIt.length} of these:{" "}
                      <span className="text-foreground">{occasionEdit.haveIt.join(" · ")}</span>.
                      {occasionEdit.needIt.length > 0 && (
                        <>
                          {" "}
                          Closest gap:{" "}
                          <Link to="/drawer" className="text-gold hover:underline">
                            {occasionEdit.needIt[0]}
                          </Link>
                          .
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing in your drawer fits this occasion yet —{" "}
                      <Link to="/drawer" className="text-gold hover:underline">
                        see what to buy first
                      </Link>
                      .
                    </p>
                  )}
                </div>
                {occasionEdit.haveIt.length >= 2 && (
                  <LookCheck
                    pieces={occasionEdit.haveIt}
                    heading="Wearing your own pieces together — any problems?"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mix & Match — build a custom vibe from 2–3 existing ones */}
      <section id="mix" className="panel px-6 md:px-12 py-24 md:py-28 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-semibold">Build your own</p>
          <h2 className="text-6xl sm:text-7xl md:text-8xl leading-[0.95] font-medium mb-5">
            Mix <span className="italic text-gold">&</span> Match
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed text-lg">
            Not one vibe, but two or three? Pick {MIN_MIX}–{MAX_MIX} and we'll blend the colors, hero pieces, and clothing
            into an edit that's entirely yours.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {VIBES.map((v) => {
              const isOn = mixVibes.includes(v.vibe);
              const disabled = !isOn && mixVibes.length >= MAX_MIX;
              return (
                <button
                  key={v.vibe}
                  onClick={() => toggleMix(v.vibe)}
                  disabled={disabled}
                  className={`text-xs tracking-[0.16em] uppercase border px-3.5 py-2 transition ${
                    isOn
                      ? "border-gold bg-gold/20 text-gold"
                      : disabled
                        ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                        : "border-border text-foreground/80 hover:border-gold-soft hover:text-foreground"
                  }`}
                >
                  {v.vibe}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              {mixVibes.length}/{MAX_MIX} selected
            </span>
            {mixVibes.length > 0 && (
              <button
                onClick={() => setMixVibes([])}
                className="text-xs tracking-[0.2em] uppercase text-gold hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {!blended && (
            <p className="text-sm text-muted-foreground border border-dashed border-border px-5 py-6 text-center">
              Pick at least {MIN_MIX} vibes above to see your blend.
            </p>
          )}

          {blended && (
            <div className="border border-gold-soft bg-card/40 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blended.sourceVibes.map((n) => (
                      <span key={n} className="text-[10px] tracking-[0.2em] uppercase text-gold border border-gold-soft px-2 py-1">
                        {n}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-light">{blended.vibe}</h3>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2">{blended.outfitLabel}</div>
                  <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">{blended.definition}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {blended.colors.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <span className="h-6 w-6 border border-border" style={{ backgroundColor: colorToHex(c) }} />
                      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 items-stretch">
                <Block label="Most valuable" subtitle="One hero per vibe" items={blended.mostValuable} accent />
                <Block label="Recommended" subtitle="The blended edit" items={blended.recommended} />
                <Block label="Add-ons" subtitle="Layer them in" items={blended.addOns} />
              </div>

              {/* Blending two aesthetics is exactly where metals and weights start
                  to fight, so the check belongs here rather than as an afterthought. */}
              <div className="border-t border-border/60 pt-6">
                <LookCheck
                  pieces={blended.mostValuable.map((p) => lookupAccessoryDefinition(p).name)}
                  heading="Wearing these heroes together"
                />
              </div>

              <div className="border-t border-border/60 pt-6">
                <ClothingRail vibe={blended.vibe} heading="Complete the blended fit" items={blended.clothing} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="panel border-t border-border px-6 md:px-12 py-20">
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

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
      <section id="atelier" className="panel border-t border-border px-6 md:px-12 py-20">
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


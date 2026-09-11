import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ACCESSORY_DEFINITIONS, vibeSlug } from "@/lib/vault-data";
import { ACCESSORY_META } from "@/lib/accessory-data";
import { ProductPicker } from "@/components/ShopTheLook";
import { ConflictList, DrawerEmptyState } from "@/components/Drawer";
import { useDrawer } from "@/lib/drawer";
import { categorize } from "@/lib/accessory-category";
import { getTraits, FORMALITY_LABEL } from "@/lib/accessory-traits";
import { coverageAll, rankAcquisitions, nearMisses, dormantPieces } from "@/lib/gap-analysis";
import { checkLook } from "@/lib/pairing-rules";

export const Route = createFileRoute("/drawer")({
  head: () => ({
    meta: [
      { title: "My Drawer — The Vault" },
      {
        name: "description",
        content:
          "Tell the Vault what you own and it tells you what to buy next, which vibes you've unlocked, and whether a combination actually works.",
      },
      { property: "og:title", content: "My Drawer — The Vault" },
      { property: "og:description", content: "What you own, what's missing, and what clashes." },
    ],
  }),
  component: DrawerPage,
});

function DrawerPage() {
  const { owned, count, ready, remove, clear } = useDrawer();
  const [checking, setChecking] = useState<string[]>([]);

  const ownedList = useMemo(() => [...owned].sort(), [owned]);

  const coverage = useMemo(() => coverageAll(owned), [owned]);
  const unlocked = useMemo(() => coverage.filter((c) => c.unlocked), [coverage]);
  const near = useMemo(() => nearMisses(owned), [owned]);
  const buys = useMemo(() => rankAcquisitions(owned), [owned]);
  const dormant = useMemo(() => dormantPieces(owned), [owned]);

  const conflicts = useMemo(() => checkLook(checking), [checking]);

  const toggleChecking = (name: string) =>
    setChecking((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : prev.length >= 5 ? prev : [...prev, name],
    );

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <section data-tour="drawer-body" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <div className="panel border border-border p-6 md:p-8 mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Your collection</p>
          <h1 className="text-5xl md:text-6xl font-light mb-4">My Drawer.</h1>
          <p className="text-foreground/75 max-w-2xl">
            Tell the Vault what you already own and it stops being a catalog. It works out which vibes
            you've unlocked, which single purchase unlocks the most more, and whether a combination you're
            considering actually holds together.
          </p>
          {ready && count > 0 && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 pt-6 border-t border-border/60">
              <Stat label="Pieces owned" value={count} />
              <Stat label="Vibes unlocked" value={unlocked.length} suffix="/ 22" />
              <Stat label="Not pulling weight" value={dormant.length} />
              <button
                onClick={clear}
                className="ml-auto text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-destructive transition"
              >
                Clear drawer
              </button>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground/80 mt-6">
            Saved in this browser only — your drawer won't follow you to another device yet.
          </p>
        </div>

        {!ready && <p className="text-sm text-muted-foreground">Opening your drawer…</p>}

        {ready && count === 0 && (
          <div className="panel border border-border p-6 md:p-8">
            <DrawerEmptyState context="Your drawer is empty." />
          </div>
        )}

        {ready && count > 0 && (
          <div className="space-y-12">
            {/* ── What to buy next ─────────────────────────────────────── */}
            <div className="panel border border-border p-6 md:p-8">
              <h2 className="font-display text-3xl font-light mb-2">Complete the set.</h2>
              <p className="text-sm text-foreground/70 max-w-2xl mb-6">
                Ranked by how much each piece would actually do for you — not by price, and not by what
                we'd like to sell.
              </p>

              {near.length > 0 && (
                <div className="border border-gold-soft bg-gold/5 p-4 mb-6">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2">
                    Closest to unlocking
                  </div>
                  <ul className="space-y-1.5">
                    {near.map((n) => (
                      <li key={n.vibe} className="text-sm text-foreground/85">
                        <Link
                          to="/vibes"
                          hash={`vibe-${vibeSlug(n.vibe)}`}
                          className="text-gold hover:underline"
                        >
                          {n.vibe}
                        </Link>{" "}
                        — {n.toUnlock} {n.toUnlock === 1 ? "piece" : "pieces"} away
                        {n.unlockNeeds.length > 0 && (
                          <span className="text-muted-foreground">
                            {" "}
                            (add {n.unlockNeeds.slice(0, n.toUnlock).join(" + ").toLowerCase()})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="divide-y divide-border/60 border-y border-border/60">
                {buys.map((b) => (
                  <li key={b.piece} className="py-4 grid sm:grid-cols-[1fr_auto] gap-3 items-start">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="font-display text-xl leading-tight">{b.piece}</h3>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          {categorize(b.piece)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed mt-1 max-w-xl">
                        {ACCESSORY_DEFINITIONS[b.piece]}
                      </p>
                      <p className="text-xs mt-2">
                        {b.unlocks.length > 0 ? (
                          <span className="text-gold">
                            Unlocks {b.unlocks.length} new{" "}
                            {b.unlocks.length === 1 ? "vibe" : "vibes"} — {b.unlocks.join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Deepens {b.advances.length} {b.advances.length === 1 ? "vibe" : "vibes"} you're
                            already building
                          </span>
                        )}
                      </p>
                      <ProductPicker accessory={b.piece} />
                    </div>
                    {ACCESSORY_META[b.piece]?.image && (
                      <img
                        src={ACCESSORY_META[b.piece].image}
                        alt={b.piece}
                        width={120}
                        height={120}
                        loading="lazy"
                        className="hidden sm:block w-24 h-24 object-cover border border-border"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Combination checker ──────────────────────────────────── */}
            <div className="panel border border-border p-6 md:p-8">
              <h2 className="font-display text-3xl font-light mb-2">Check a combination.</h2>
              <p className="text-sm text-foreground/70 max-w-2xl mb-6">
                Pick up to five pieces you're thinking of wearing together. Every warning explains the rule
                behind it, so you only need to hear it once.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {ownedList.map((p) => {
                  const on = checking.includes(p);
                  const full = !on && checking.length >= 5;
                  return (
                    <button
                      key={p}
                      onClick={() => toggleChecking(p)}
                      disabled={full}
                      className={`text-[11px] tracking-[0.12em] uppercase border px-3 py-2 transition ${
                        on
                          ? "border-gold bg-gold/20 text-gold"
                          : full
                            ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
                            : "border-border text-foreground/80 hover:border-gold-soft hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {checking.length < 2 ? (
                <p className="text-sm text-muted-foreground border border-dashed border-border px-5 py-6 text-center">
                  Pick at least two pieces to check them against each other.
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      {checking.length} selected
                    </span>
                    <button
                      onClick={() => setChecking([])}
                      className="text-[10px] tracking-[0.2em] uppercase text-gold hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                  <ConflictList conflicts={conflicts} />
                </>
              )}
            </div>

            {/* ── The drawer itself ────────────────────────────────────── */}
            <div className="panel border border-border p-6 md:p-8">
              <h2 className="font-display text-3xl font-light mb-2">Everything you own.</h2>
              <p className="text-sm text-foreground/70 max-w-2xl mb-6">
                {dormant.length > 0
                  ? `${dormant.length} of these aren't yet part of any vibe you can wear — they're the pieces to build around next, not to replace.`
                  : "Every piece here is doing work in at least one wearable vibe."}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedList.map((p) => {
                  const meta = ACCESSORY_META[p];
                  const traits = getTraits(p);
                  const isDormant = dormant.includes(p);
                  return (
                    <article key={p} className="border border-border bg-background/40 flex gap-3">
                      {meta?.image && (
                        <img
                          src={meta.image}
                          alt={p}
                          width={96}
                          height={96}
                          loading="lazy"
                          className="w-20 h-20 object-cover shrink-0"
                        />
                      )}
                      <div className="py-2.5 pr-2.5 min-w-0 flex-1">
                        <h3 className="font-display text-base leading-tight">{p}</h3>
                        {traits && (
                          <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-1">
                            {traits.metal !== "None" ? traits.metal : traits.material} ·{" "}
                            {FORMALITY_LABEL[traits.formality]}
                          </p>
                        )}
                        {isDormant && (
                          <p className="text-[10px] tracking-[0.15em] uppercase text-gold mt-1">
                            Underused
                          </p>
                        )}
                        <button
                          onClick={() => {
                            remove(p);
                            setChecking((prev) => prev.filter((n) => n !== p));
                          }}
                          className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground hover:text-destructive transition mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* ── Unlocked vibes ──────────────────────────────────────── */}
            {unlocked.length > 0 && (
              <div className="panel border border-border p-6 md:p-8">
                <h2 className="font-display text-3xl font-light mb-2">Vibes you can already wear.</h2>
                <p className="text-sm text-foreground/70 max-w-2xl mb-6">
                  You own the hero piece plus at least one that supports it — enough to carry the look.
                </p>
                <div className="flex flex-wrap gap-2">
                  {unlocked.map((c) => (
                    <Link
                      key={c.vibe}
                      to="/vibes"
                      hash={`vibe-${vibeSlug(c.vibe)}`}
                      className="text-[11px] tracking-[0.15em] uppercase border border-gold px-3 py-2 text-gold hover:bg-gold hover:text-background transition"
                    >
                      {c.vibe} · {c.owned.length}/{c.total}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">{label}</div>
      <div className="font-display text-3xl font-light tabular-nums">
        {value}
        {suffix && <span className="text-base text-muted-foreground ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

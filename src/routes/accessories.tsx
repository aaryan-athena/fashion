import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ACCESSORY_DEFINITIONS, getVibesForAccessory, vibeSlug } from "@/lib/vault-data";
import { ACCESSORY_META } from "@/lib/accessory-data";
import { ProductPicker, MakerLine } from "@/components/ShopTheLook";
import { OwnToggle } from "@/components/Drawer";
import { CATEGORIES, categorize, type Cat } from "@/lib/accessory-category";


export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Accessory Glossary — The Vault" },
      { name: "description", content: "Every accessory in the Vault defined — Cuban chains, signet rings, dress watches, earrings, cufflinks and more, with what each piece actually does for a fit." },
      { property: "og:title", content: "Accessory Glossary — The Vault" },
      { property: "og:description", content: "Every chain, ring, watch, earring and bracelet defined." },
    ],
  }),
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const [filter, setFilter] = useState<Cat>("All");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const all = Object.entries(ACCESSORY_DEFINITIONS).map(([name, def]) => ({
      name,
      def,
      cat: categorize(name),
      vibes: getVibesForAccessory(name),
    }));
    return all
      .filter((i) => (filter === "All" ? true : i.cat === filter))
      .filter((i) =>
        !q.trim()
          ? true
          : (i.name + " " + i.def).toLowerCase().includes(q.toLowerCase().trim())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filter, q]);

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <div className="panel border border-border p-6 md:p-8 mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Index</p>
          <h1 className="text-5xl md:text-6xl font-light mb-4">Accessory Glossary.</h1>
          <p className="text-foreground/75 max-w-2xl">
            Every piece in the Vault, defined. What it is, what it does for a fit, and which vibes it shows up in —
            chains, rings, watches, bracelets and earrings. Tap{" "}
            <span className="text-gold">“I own this”</span> on anything you already have and{" "}
            <Link to="/drawer" className="text-gold hover:underline">
              your drawer
            </Link>{" "}
            will tell you what to buy next.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pieces…"
              className="flex-1 min-w-[200px] bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/60"
            />
            <div className="flex border border-border flex-wrap bg-background/80">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-2 text-[11px] tracking-[0.2em] uppercase transition ${
                    filter === c ? "bg-foreground text-background" : "text-foreground/75 hover:bg-card hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {items.length} {items.length === 1 ? "piece" : "pieces"}
            {filter !== "All" && ` in ${filter}`}
          </p>
        </div>

        <div data-tour="accessory-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((i) => {
            const meta = ACCESSORY_META[i.name];
            return (
              <article key={i.name} className="panel border border-border hover:border-gold-soft transition overflow-hidden flex flex-col">
                {meta?.image && (
                  <div className="aspect-square bg-card overflow-hidden">
                    <img
                      src={meta.image}
                      alt={i.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between mb-1 gap-3">
                    <h2 className="font-display text-xl font-light leading-tight">{i.name}</h2>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-gold shrink-0">{i.cat}</span>
                  </div>
                  <p className="mb-3">
                    <MakerLine accessory={i.name} />
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{i.def}</p>
                  {i.vibes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <div className="text-[9px] tracking-[0.25em] uppercase text-gold mb-2">Shows up in</div>
                      <div className="flex flex-wrap gap-1.5">
                        {i.vibes.map((vibe) => (
                          <Link
                            key={vibe}
                            to="/vibes"
                            hash={`vibe-${vibeSlug(vibe)}`}
                            className="text-[10px] tracking-[0.15em] uppercase border border-border px-2 py-1 text-muted-foreground hover:border-gold hover:text-gold transition"
                          >
                            {vibe}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-3 space-y-2">
                    <OwnToggle accessory={i.name} />
                    <ProductPicker accessory={i.name} />
                  </div>
                </div>
              </article>
            );
          })}
          {items.length === 0 && (
            <p className="panel border border-dashed border-border px-5 py-6 text-sm text-foreground/75">
              No pieces match — try clearing the filter.
            </p>
          )}
        </div>

      </section>
      <SiteFooter />
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ACCESSORY_DEFINITIONS } from "@/lib/vault-data";
import { ACCESSORY_META } from "@/lib/accessory-data";
import { ProductPicker } from "@/components/ShopTheLook";


export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Accessory Glossary — The Vault" },
      { name: "description", content: "Every accessory in the Vault defined — Cuban chains, signet rings, dress watches, cufflinks and more, with what each piece actually does for a fit." },
      { property: "og:title", content: "Accessory Glossary — The Vault" },
      { property: "og:description", content: "Every chain, ring, watch and bracelet defined." },
    ],
  }),
  component: AccessoriesPage,
});

const CATEGORIES = ["All", "Chain", "Ring", "Watch", "Bracelet", "Other"] as const;
type Cat = (typeof CATEGORIES)[number];

function categorize(name: string): Cat {
  const n = name.toLowerCase();
  if (n.includes("chain") || n.includes("necklace") || n.includes("pendant")) return "Chain";
  if (n.includes("ring")) return "Ring";
  if (n.includes("watch")) return "Watch";
  if (n.includes("bracelet")) return "Bracelet";
  return "Other";
}

function AccessoriesPage() {
  const [filter, setFilter] = useState<Cat>("All");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const all = Object.entries(ACCESSORY_DEFINITIONS).map(([name, def]) => ({
      name,
      def,
      cat: categorize(name),
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
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Index</p>
        <h1 className="text-5xl md:text-6xl font-light mb-4">Accessory Glossary.</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Every piece in the Vault, defined. What it is, what it does for a fit, and which vibes it shows up in.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pieces…"
            className="flex-1 min-w-[200px] bg-background border border-border focus:border-gold outline-none px-4 py-3 text-sm placeholder:text-muted-foreground/60"
          />
          <div className="flex border border-border flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-2 text-[11px] tracking-[0.2em] uppercase transition ${
                  filter === c ? "bg-foreground text-background" : "hover:bg-card"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((i) => {
            const meta = ACCESSORY_META[i.name];
            return (
              <article key={i.name} className="border border-border hover:border-gold-soft transition overflow-hidden flex flex-col">
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
                  {meta && (
                    <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      <span className="text-foreground">{meta.brand}</span> · {meta.model}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{i.def}</p>
                  <div className="mt-auto pt-3">
                    <ProductPicker accessory={i.name} />
                  </div>
                </div>
              </article>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No pieces match — try clearing the filter.</p>
          )}
        </div>

      </section>
      <SiteFooter />
    </main>
  );
}

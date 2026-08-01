import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { VIBES, colorToHex, lookupAccessoryDefinition, vibeSlug } from "@/lib/vault-data";
import { vibeImage } from "@/lib/vibe-images";
import { ACCESSORY_META } from "@/lib/accessory-data";
import { ProductPicker, ClothingRail } from "@/components/ShopTheLook";


export const Route = createFileRoute("/vibes")({
  head: () => ({
    meta: [
      { title: "All Vibes — The Vault" },
      { name: "description", content: "All 22 menswear vibes defined — Streetwear, Old Money, Techwear, Y2K, Goth and more, each with the accessories that finish the fit." },
      { property: "og:title", content: "All Vibes — The Vault" },
      { property: "og:description", content: "22 menswear vibes, each defined with the accessories that finish the fit." },
    ],
  }),
  component: VibesPage,
});

function VibesPage() {
  const [filter, setFilter] = useState<"All" | "Casual" | "Formal">("All");
  const list = useMemo(() => (filter === "All" ? VIBES : VIBES.filter((v) => v.outfitType === filter)), [filter]);

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Library</p>
        <h1 className="text-5xl md:text-6xl font-light mb-4">All 22 Vibes, defined.</h1>
        <p className="text-muted-foreground max-w-2xl mb-10">A full glossary of every aesthetic in the Vault — what each vibe means, the metals it lives in, and the accessory edit that locks it in.</p>

        <div className="flex border border-border w-fit mb-10">
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

        <div className="space-y-8">
          {list.map((v) => (
            <article id={`vibe-${vibeSlug(v.vibe)}`} key={v.vibe} className="border border-border hover:border-gold-soft transition grid md:grid-cols-[320px_1fr] overflow-hidden bg-card/40 scroll-mt-24">
              <div className="bg-card md:sticky md:top-0 md:self-start">
                <div className="relative">
                  <div className="aspect-[4/5] md:aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={vibeImage(v.vibe)}
                      alt={`${v.vibe} accessories`}
                      width={768}
                      height={960}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent pointer-events-none">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{v.outfitType}</div>
                    <div className="font-display text-2xl font-light text-foreground">{v.vibe}</div>
                  </div>
                </div>
                <div className="hidden md:block p-5 space-y-4 border-t border-border/60">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Palette</div>
                    <div className="flex flex-wrap gap-2">
                      {v.colors.map((c) => (
                        <div key={c} className="flex items-center gap-1.5 border border-border px-2 py-1">
                          <span className="h-3 w-3" style={{ backgroundColor: colorToHex(c) }} />
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Hero piece</div>
                    <div className="font-display text-lg leading-snug">{v.mostValuable[0]}</div>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <Link
                      to="/"
                      className="block text-center text-[10px] tracking-[0.3em] uppercase border border-gold px-4 py-2.5 hover:bg-gold hover:text-background transition"
                    >
                      Try in finder →
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">{v.outfitType}</div>
                    <h2 className="font-display text-3xl md:text-4xl font-light">{v.vibe}</h2>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {v.colors.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <span className="h-5 w-5 border border-border" style={{ backgroundColor: colorToHex(c) }} />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">{v.definition}</p>

                {/* Accessory gallery — every recommended piece pictured */}
                {(() => {
                  const seen = new Set<string>();
                  const pieces = [...v.mostValuable, ...v.recommended, ...v.addOns]
                    .map((label) => {
                      const { name } = lookupAccessoryDefinition(label);
                      const meta = ACCESSORY_META[name];
                      return { name, meta };
                    })
                    .filter((p) => {
                      if (!p.meta || seen.has(p.name)) return false;
                      seen.add(p.name);
                      return true;
                    });
                  if (pieces.length === 0) return null;
                  return (
                    <div className="mb-6">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">The Edit</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {pieces.map((p) => (
                          <figure key={p.name} className="group border border-border hover:border-gold-soft transition overflow-hidden">
                            <div className="aspect-square bg-card overflow-hidden">
                              <img
                                src={p.meta!.image}
                                alt={p.name}
                                width={1024}
                                height={1024}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <figcaption className="p-3">
                              <div className="text-xs font-medium leading-tight">{p.name}</div>
                              <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-1">
                                <span className="text-foreground/80">{p.meta!.brand}</span>
                                <span className="text-muted-foreground/60"> · {p.meta!.model}</span>
                              </div>
                              <ProductPicker accessory={p.name} />
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="grid sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Most valuable</div>
                    <div>{v.mostValuable.join(" · ")}</div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Recommended</div>
                    <div>{v.recommended.join(" · ")}</div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">Add-ons</div>
                    <div>{v.addOns.join(" · ")}</div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border/60">
                  <ClothingRail vibe={v.vibe} />
                </div>

                <div className="mt-6">
                  <Link to="/" className="text-xs tracking-[0.3em] uppercase text-gold hover:underline">
                    Open in finder →
                  </Link>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

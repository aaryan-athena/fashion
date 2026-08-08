import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { VIBES, colorToHex } from "@/lib/vault-data";
import { vibeImage } from "@/lib/vibe-images";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — The Vault" },
      { name: "description", content: "A visual atlas of men's accessory vibes — 22 editorial flat lays, every chain, ring, watch and bracelet in its natural fit." },
      { property: "og:title", content: "Lookbook — The Vault" },
      { property: "og:description", content: "22 editorial flat lays, every vibe shot in its natural fit." },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const [filter, setFilter] = useState<"All" | "Casual" | "Formal">("All");
  const list = filter === "All" ? VIBES : VIBES.filter((v) => v.outfitType === filter);

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <section className="px-6 md:px-12 pt-16 pb-10 max-w-7xl mx-auto">
        <div className="panel border border-border p-6 md:p-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Vol. 01 · The Lookbook</p>
          <h1 className="text-5xl md:text-7xl font-light leading-[0.95] max-w-4xl">
            Every vibe,
            <span className="italic text-foreground/60"> shot in its natural fit.</span>
          </h1>
          <p className="text-foreground/75 mt-6 max-w-2xl leading-relaxed">
            Twenty-two editorial flat lays. Each one is a study — the metals, the textures, the surfaces — of a single vibe living the way it should.
          </p>

          <div className="flex border border-border w-fit mt-10 bg-background/80">
            {(["All", "Casual", "Formal"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase transition ${
                  filter === f ? "bg-foreground text-background" : "text-foreground/75 hover:bg-card hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {list.map((v, i) => (
            <Link
              key={v.vibe}
              to="/vibes"
              className={`group relative block overflow-hidden border border-border hover:border-gold transition ${
                i % 7 === 0 ? "sm:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative bg-card overflow-hidden ${i % 7 === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[4/5]"}`}>
                <img
                  src={vibeImage(v.vibe)}
                  alt={`${v.vibe} flat lay`}
                  width={768}
                  height={768}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  {v.colors.map((c) => (
                    <span key={c} className="h-2.5 w-2.5 rounded-full border border-background/60" style={{ backgroundColor: colorToHex(c) }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-1.5">Plate · {String(i + 1).padStart(2, "0")} · {v.outfitType}</div>
                  <h3 className="font-display text-3xl md:text-4xl font-light leading-tight">{v.vibe}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 max-w-sm">{v.mostValuable.join(" · ")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

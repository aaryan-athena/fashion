import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Method — The Vault" },
      { name: "description", content: "How the Vault maps menswear vibes to accessories. Hero piece first, layer second, metals that match the fit." },
      { property: "og:title", content: "The Method — The Vault" },
      { property: "og:description", content: "How the Vault maps menswear vibes to accessories." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />
      <section className="panel-solid my-16 border border-border px-6 md:px-12 py-16 max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Method</p>
        <h1 className="text-5xl md:text-6xl font-light mb-8">Accessories aren't decoration. They finish the fit.</h1>
        <p className="text-lg text-foreground/80 leading-relaxed mb-12">
          Most guys overthink the outfit and underthink the jewellery. The Vault flips that. You tell us the vibe — Old Money, Techwear, Streetwear, Goth — and we hand you a small, deliberate edit of pieces that actually belong on it.
        </p>

        <div className="space-y-12">
          {[
            {
              n: "01",
              t: "Vibe-mapped, not generic",
              d: "Every recommendation is tied to a defined vibe. No 'minimal silver chain goes with everything' nonsense — we tell you which 4–6 vibes it actually elevates, and which ones it kills.",
            },
            {
              n: "02",
              t: "Hero, then layer",
              d: "We name the most valuable piece first — the one that does 70% of the styling work. Then the recommended edit. Then the add-ons. Build, don't pile.",
            },
            {
              n: "03",
              t: "Metals that match the fit",
              d: "Each vibe has a colour palette so the metals don't fight your clothes. Old Money is warm gold. Techwear is gunmetal. Y2K is chrome. Get this right and the whole outfit clicks.",
            },
            {
              n: "04",
              t: "Plain-English definitions",
              d: "We define every vibe and every piece, so you're never guessing. A Cuban chain isn't a 'fancy necklace' — it's a thick interlocking metal chain with a specific energy. Knowing that helps you buy better.",
            },
          ].map((b) => (
            <div key={b.n} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10">
              <div className="text-gold text-xs tracking-[0.3em] pt-2">{b.n}</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-light mb-3">{b.t}</h2>
                <p className="text-foreground/75 leading-relaxed">{b.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-12 flex flex-wrap gap-4">
          <Link to="/" className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 hover:bg-gold hover:text-background transition">
            Try the Finder →
          </Link>
          <Link to="/vibes" className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition">
            Browse all vibes
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

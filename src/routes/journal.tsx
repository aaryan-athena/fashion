import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { vibeImage } from "@/lib/vibe-images";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — The Vault" },
      { name: "description", content: "Editorial notes on men's accessories — hero pieces, metals, layering, and the quiet rules that make a fit feel finished." },
      { property: "og:title", content: "Journal — The Vault" },
      { property: "og:description", content: "Editorial notes on the quiet rules behind a finished fit." },
    ],
  }),
  component: JournalPage,
});

type Entry = {
  number: string;
  category: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  read: string;
};

const ENTRIES: Entry[] = [
  {
    number: "01",
    category: "The Method",
    title: "One hero. Three witnesses.",
    excerpt: "Why every great fit has a single piece doing the work — and three quieter ones backing it up.",
    body: [
      "A finished fit is rarely democratic. There is always a hero — the Cuban chain, the dive watch, the signet ring — that earns the first look and sets the room's temperature.",
      "The other pieces are witnesses. They agree with the hero. They share its metal, its weight, its century. They don't compete; they confirm. Once you start seeing accessories this way, layering stops being a math problem and becomes a casting call.",
    ],
    image: vibeImage("Old Money"),
    read: "3 min",
  },
  {
    number: "02",
    category: "Metals",
    title: "Silver is a temperature, not a colour.",
    excerpt: "On reading the room — how the cold of polished silver, the haze of gunmetal, and the warmth of brushed gold change the same outfit completely.",
    body: [
      "Polished silver is winter. It is glass on a black coat, a watch on a white cuff. It sharpens. Use it when you want the fit to feel quick, modern, a little surgical.",
      "Gunmetal is dusk. It absorbs light instead of throwing it. It's the metal of techwear, of rugged, of anything that should feel built rather than worn.",
      "Brushed gold is afternoon. Warm, slow, slightly forgiving. It softens linen and tanned leather. It is the metal of holiday, of heritage, of being unbothered.",
    ],
    image: vibeImage("Techwear"),
    read: "4 min",
  },
  {
    number: "03",
    category: "Layering",
    title: "Build. Don't pile.",
    excerpt: "A short manual on stacking chains, rings and bracelets without looking like you're trying.",
    body: [
      "Layering reads as deliberate when the pieces vary in one axis and agree on every other. Same metal, different lengths. Same length, different textures. Same texture, different weights.",
      "When everything varies, you've made a pile. When nothing varies, you've made a uniform. The middle — three pieces in quiet conversation — is the whole game.",
    ],
    image: vibeImage("Streetwear"),
    read: "2 min",
  },
  {
    number: "04",
    category: "Field Notes",
    title: "Old Money was never about money.",
    excerpt: "Quiet luxury, deconstructed — the dress watch on a worn strap, the signet ring that says nothing, the bracelet you forget you're wearing.",
    body: [
      "The vibe people now call Old Money is an aesthetic of restraint disguised as wealth. The accessories are small, warm, slightly aged. None of them announce a price.",
      "The trick is patina — leather that has been somewhere, gold that has been worn. Everything new in this category looks like it's auditioning. Buy fewer things. Wear them harder.",
    ],
    image: vibeImage("Old Money"),
    read: "3 min",
  },
  {
    number: "05",
    category: "Field Notes",
    title: "Why techwear earned its watch.",
    excerpt: "The tactical watch isn't a costume — it's the only accessory the rest of the silhouette can afford.",
    body: [
      "Techwear strips an outfit of ornament: matte fabrics, hidden seams, blacked-out hardware. In that vacuum, a single visible instrument — a tactical watch, a matte chain — becomes load-bearing.",
      "Pick one. Make it functional. Let everything else stay quiet. That contrast is the whole vibe.",
    ],
    image: vibeImage("Techwear"),
    read: "3 min",
  },
  {
    number: "06",
    category: "Field Notes",
    title: "Beachwear, but make it considered.",
    excerpt: "Why a beaded bracelet, a thin chain and a single shell outperform an arm full of holiday souvenirs.",
    body: [
      "Beachwear fails when it tries to look like an entire vacation at once. The fix is editing — one warm material, one cool one, and a single reference to the water (a shell, a pearl, a length of rope).",
      "Light fabrics already do most of the work. Accessories here are seasoning, not the meal.",
    ],
    image: vibeImage("Beachwear"),
    read: "2 min",
  },
];

function JournalPage() {
  const [hero, ...rest] = ENTRIES;
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 pt-16 pb-12 max-w-7xl mx-auto">
        <div className="panel border border-border p-6 md:p-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">The Journal</p>
          <h1 className="text-5xl md:text-7xl font-light leading-[0.95] max-w-4xl">
            Notes on metals, men,
            <span className="italic text-foreground/60"> and the rules behind a finished fit.</span>
          </h1>
        </div>
      </section>

      {/* Hero entry */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto">
        <article className="panel grid md:grid-cols-2 gap-8 lg:gap-14 border border-border p-6 md:p-10">
          <div className="order-2 md:order-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              <span className="text-gold">Entry · {hero.number}</span>
              <span className="h-px w-6 bg-border" />
              <span>{hero.category}</span>
              <span className="h-px w-6 bg-border" />
              <span>{hero.read} read</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">{hero.title}</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">{hero.excerpt}</p>
            {hero.body.map((p, i) => (
              <p key={i} className="text-sm text-foreground/70 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="order-1 md:order-2 relative border border-gold-soft overflow-hidden">
            <img src={hero.image} alt={hero.title} width={768} height={768} loading="lazy" className="w-full h-full object-cover max-h-[560px]" />
          </div>
        </article>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="on-image text-[10px] tracking-[0.3em] uppercase text-gold mb-6">More entries</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((e) => (
            <article key={e.number} className="panel group border border-border hover:border-gold-soft transition overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] bg-card overflow-hidden">
                <img src={e.image} alt={e.title} width={768} height={576} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase">
                  <span className="text-gold">Entry · {e.number}</span>
                  <span className="text-muted-foreground">{e.read}</span>
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{e.category}</div>
                <h3 className="font-display text-2xl leading-tight">{e.title}</h3>
                <p className="text-sm text-foreground/75 leading-relaxed flex-1">{e.excerpt}</p>
                <Link to="/vibes" className="text-[10px] tracking-[0.3em] uppercase text-gold pt-2">Read in vibes →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

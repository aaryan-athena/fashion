import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import founderImg from "@/assets/f_img.jpeg";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Behind The Vault — The Vault" },
      { name: "description", content: "Meet Akshin Chugh, the founder of The Vault — a Grade 11 student, national-level chess player, and builder who turned a love for men's accessories into an AI-powered style curator." },
      { property: "og:title", content: "Behind The Vault — The Vault" },
      { property: "og:description", content: "Meet Akshin Chugh, the founder of The Vault." },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Behind The Vault</p>
        <h1 className="text-5xl md:text-6xl font-light mb-12">Hi, I'm Akshin Chugh.</h1>

        <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-14 items-start">
          <div className="space-y-6 text-foreground/85 leading-relaxed text-lg">
            <p>I'm currently a Grade 11 student at NPS HSR, a national-level chess player, and someone who's always loved building things from scratch.</p>
            <p>I wrote my first lines of code when I was eight years old and built my first website a few years later. Ever since then, I've enjoyed taking ideas that exist only in my head and turning them into something people can actually use.</p>
            <p>Chess has been another huge part of my life. Years of competing taught me patience, discipline, and the importance of paying attention to the smallest details. I was fortunate enough to win the U-19 State Championship and represent Karnataka and Goa at the U-19 National Championship, where our team won silver. That mindset of constantly learning, improving, and solving problems has stayed with me far beyond the chessboard.</p>
            <p>Over the last few years, I also developed a real interest in men's fashion. What fascinated me most wasn't clothing—it was accessories. A watch, chain, ring, or bracelet can completely change the feel of an outfit, yet there wasn't a simple way to know what actually worked together.</p>
            <p>I found myself spending hours scrolling through Pinterest, Instagram, and fashion communities, trying to understand why certain combinations looked effortless while others didn't. I wanted a place that didn't just sell accessories, but actually helped people style them.</p>
            <p>That's how The Vault was born.</p>
            <p>The Vault is built around one simple idea: great style shouldn't require hours of research. Describe your vibe, and let AI curate accessories that fit your aesthetic and work together as a complete stack.</p>
            <p>Building The Vault has been an opportunity to combine my interests in design, artificial intelligence, and creating products that solve everyday problems. My goal isn't just to recommend accessories—it's to make personal style feel more approachable and enjoyable for everyone.</p>
            <p>This is only the beginning, and I'm excited to see where The Vault goes next.</p>

            <div className="pt-8 border-t border-border">
              <p className="text-foreground text-lg italic">— Akshin Chugh</p>
              <p className="text-xs tracking-[0.25em] uppercase text-foreground/90 mt-2">Founder, The Vault</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/" className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 hover:bg-gold hover:text-background transition">
                Try the Finder →
              </Link>
              <Link to="/about" className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition">
                The Method
              </Link>
            </div>
          </div>

          <figure className="md:sticky md:top-8">
            <div className="border border-border overflow-hidden bg-card">
              <img
                src={founderImg}
                alt="Akshin Chugh, founder of The Vault"
                width={960}
                height={1280}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
            <figcaption className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-3">
              Akshin Chugh · Bengaluru
            </figcaption>
          </figure>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

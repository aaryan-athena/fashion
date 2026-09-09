import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { LESSONS, DEMO_PIECES } from "@/lib/learn-content";
import { checkLook, verdict, type Severity } from "@/lib/pairing-rules";
import { getTraits, FORMALITY_LABEL } from "@/lib/accessory-traits";
import { getAccessoryMeta } from "@/lib/accessory-data";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Accessories, Explained — The Vault" },
      {
        name: "description",
        content:
          "Men's accessorising from zero: why it matters, what to buy first, whether you can mix metals, and how much is too much. With a live checker for any combination.",
      },
      { property: "og:title", content: "Accessories, Explained — The Vault" },
      {
        property: "og:description",
        content: "The rules of men's accessorising, explained for someone starting from nothing.",
      },
    ],
  }),
  component: LearnPage,
});

const TONE_STYLES: Record<Severity | "clear", { border: string; text: string; label: string }> = {
  clash: { border: "border-red-500/60", text: "text-red-400", label: "Clash" },
  caution: { border: "border-gold", text: "text-gold", label: "Caution" },
  note: { border: "border-border", text: "text-muted-foreground", label: "Note" },
  clear: { border: "border-emerald-500/50", text: "text-emerald-400", label: "Works" },
};

function LearnPage() {
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 pt-16 pb-10 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Start From Zero</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] mb-5">
          Nobody teaches men
          <span className="italic text-muted-foreground"> how to wear jewellery.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          So most men opt out, and the ones who don't learn by buying the wrong things for a few
          years. There are maybe six rules in total. They're below, each one stated so you can use
          it without this site — and a checker at the end that tells you when you've broken one,
          and why.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Lessons">
          {LESSONS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-[10px] tracking-[0.18em] uppercase border border-border px-3 py-1.5 text-muted-foreground hover:border-gold hover:text-gold transition"
            >
              {String(i + 1).padStart(2, "0")} · {l.rule.split(".")[0].slice(0, 28)}
              {l.rule.split(".")[0].length > 28 ? "…" : ""}
            </a>
          ))}
          <a
            href="#checker"
            className="text-[10px] tracking-[0.18em] uppercase border border-gold px-3 py-1.5 text-gold hover:bg-gold hover:text-background transition"
          >
            Try the checker ↓
          </a>
        </nav>
      </section>

      {/* Lessons */}
      <section className="px-6 md:px-12 pb-10 max-w-4xl mx-auto space-y-4">
        {LESSONS.map((l, i) => (
          <article
            key={l.id}
            id={l.id}
            className="scroll-mt-24 border border-border bg-card/40 p-6 md:p-8"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-light leading-tight">
                {l.question}
              </h2>
            </div>

            <p className="text-lg text-gold leading-snug border-l-2 border-gold pl-4 my-5">
              {l.rule}
            </p>

            <div className="space-y-3 max-w-2xl">
              {l.body.map((p, k) => (
                <p key={k} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {l.example && (
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div className="border border-emerald-500/40 bg-emerald-500/5 p-4">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-emerald-400 mb-1.5">
                    Works
                  </div>
                  <p className="text-sm text-foreground/90 leading-snug">{l.example.right}</p>
                </div>
                <div className="border border-red-500/40 bg-red-500/5 p-4">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-red-400 mb-1.5">
                    Doesn't
                  </div>
                  <p className="text-sm text-foreground/90 leading-snug">{l.example.wrong}</p>
                </div>
              </div>
            )}

            {l.next && l.next.to !== "/learn" && (
              <div className="mt-6">
                <Link
                  to={l.next.to}
                  className="text-[10px] tracking-[0.25em] uppercase text-gold hover:underline"
                >
                  {l.next.label} →
                </Link>
              </div>
            )}
          </article>
        ))}
      </section>

      <Checker />

      <SiteFooter />
    </main>
  );
}

/**
 * The demo the PRD asks for: not a video, but the rules running live.
 *
 * It calls the same checkLook() the rest of the app uses, so what it teaches is
 * exactly what the app enforces. Breaking a rule on purpose is the fastest way
 * to learn it, so the piece set is chosen to make clashes easy to trigger.
 */
function Checker() {
  const [picked, setPicked] = useState<string[]>(["Dress Watch", "Cuban Chain"]);

  const conflicts = useMemo(() => checkLook(picked), [picked]);
  const outcome = useMemo(() => verdict(conflicts), [conflicts]);
  const tone = TONE_STYLES[outcome.tone];

  const toggle = (piece: string) =>
    setPicked((p) => (p.includes(piece) ? p.filter((x) => x !== piece) : [...p, piece]));

  return (
    <section
      id="checker"
      className="scroll-mt-24 border-t border-border bg-card/30 px-6 md:px-12 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Demo</p>
        <h2 className="text-3xl md:text-5xl font-light leading-tight mb-4">
          Build a bad combination
          <span className="italic text-muted-foreground"> on purpose.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Pick pieces as if you were getting dressed. Every rule above is running underneath this —
          when something's wrong, it says what and why, in a form you can carry to a shop.
        </p>

        {/* Piece picker */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEMO_PIECES.map((piece) => {
            const on = picked.includes(piece);
            const traits = getTraits(piece);
            const meta = getAccessoryMeta(piece);
            return (
              <button
                key={piece}
                onClick={() => toggle(piece)}
                aria-pressed={on}
                className={`text-left border transition overflow-hidden flex items-center gap-3 ${
                  on ? "border-gold bg-gold/15" : "border-border hover:border-gold-soft bg-background/40"
                }`}
              >
                {meta?.image && (
                  <img
                    src={meta.image}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-14 w-14 object-cover shrink-0"
                  />
                )}
                <span className="min-w-0 py-2 pr-2">
                  <span className={`block text-xs leading-tight ${on ? "text-gold" : "text-foreground/90"}`}>
                    {piece}
                  </span>
                  {traits && (
                    <span className="block text-[9px] tracking-[0.15em] uppercase text-muted-foreground mt-0.5">
                      {traits.metal !== "None" ? `${traits.metal} · ` : ""}
                      {FORMALITY_LABEL[traits.formality]}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Verdict */}
        <div className={`mt-8 border-l-4 ${tone.border} bg-background/60 p-5`}>
          <div className={`text-[10px] tracking-[0.3em] uppercase ${tone.text} mb-1.5`}>
            {tone.label}
          </div>
          <p className="text-foreground/90 leading-relaxed">
            {picked.length === 0 ? "Pick a piece or two to see the rules fire." : outcome.line}
          </p>
        </div>

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <ul className="mt-4 space-y-3">
            {conflicts.map((c, i) => {
              const s = TONE_STYLES[c.severity];
              return (
                <li key={i} className={`border ${s.border} bg-background/40 p-5`}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-display text-lg leading-tight">{c.title}</h3>
                    <span className={`text-[9px] tracking-[0.25em] uppercase ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{c.why}</p>
                  <p className="text-sm text-foreground/90 leading-relaxed mt-2">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-gold mr-2">Fix</span>
                    {c.fix}
                  </p>
                  {c.pieces.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.pieces.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] tracking-[0.12em] uppercase border border-border px-2 py-0.5 text-muted-foreground"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 border-t border-border pt-8 flex flex-wrap gap-3">
          <Link
            to="/start"
            className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 text-gold hover:bg-gold hover:text-background transition"
          >
            Now get a real brief →
          </Link>
          <Link
            to="/makers"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Who makes this stuff
          </Link>
          <Link
            to="/accessories"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Every piece, defined
          </Link>
        </div>
      </div>
    </section>
  );
}

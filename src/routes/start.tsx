import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductPicker } from "@/components/ShopTheLook";
import { colorToHex, lookupAccessoryDefinition } from "@/lib/vault-data";
import { getAccessoryMeta } from "@/lib/accessory-data";
import { FORMALITY_LABEL } from "@/lib/accessory-traits";
import { useDrawer } from "@/lib/drawer";
import { buildBrief, type IntakeBrief } from "@/lib/intake-brief";
import {
  LOOKING_CHOICES,
  OCCASION_CHOICES,
  OWNS_CHOICES,
  QUESTION_COUNT,
  WEAR_CHOICES,
  answeredCount,
  isComplete,
  useIntake,
  type Intake,
} from "@/lib/onboarding";
import { intakeNote, type IntakeNoteResult } from "@/lib/api/onboarding.functions";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start Here — The Vault" },
      {
        name: "description",
        content:
          "Four questions — what you want, the occasion, how often you'd wear it, what you already own — and we'll name the one piece to buy first, from an independent Indian maker.",
      },
      { property: "og:title", content: "Start Here — The Vault" },
      { property: "og:description", content: "Four questions to your first piece." },
    ],
  }),
  component: StartPage,
});

type NoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; result: IntakeNoteResult }
  | { status: "failed"; reason: string };

function StartPage() {
  const { intake, ready, save, clear } = useIntake();
  const [draft, setDraft] = useState<Partial<Intake>>({});
  const [showResult, setShowResult] = useState(false);

  // A returning visitor sees their answer, not a blank form.
  useEffect(() => {
    if (ready && intake) {
      setDraft(intake);
      setShowResult(true);
    }
  }, [ready, intake]);

  const brief = useMemo(() => (isComplete(draft) ? buildBrief(draft) : null), [draft]);
  const answered = answeredCount(draft);

  const submit = () => {
    if (!isComplete(draft)) return;
    save(draft);
    setShowResult(true);
    requestAnimationFrame(() =>
      document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const restart = () => {
    clear();
    setDraft({});
    setShowResult(false);
  };

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 py-16 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Start Here</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] mb-5">
          Four questions.
          <span className="italic text-muted-foreground"> One piece to buy first.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Most accessory advice assumes you already know what you want. This doesn't. Answer these
          and we'll name the single piece worth buying, why it's right for the occasion, and which
          independent Indian maker to get it from.
        </p>

        {/* Progress */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex gap-1.5" role="presentation">
            {Array.from({ length: QUESTION_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-1 w-10 transition-colors ${i < answered ? "bg-gold" : "bg-border"}`}
              />
            ))}
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground tabular-nums">
            {answered} / {QUESTION_COUNT}
          </span>
        </div>

        {/* Questions */}
        <div className="mt-10 space-y-10">
          <Question
            n="01"
            label="What are you after?"
            help="If you don't know, say so — that's a real answer."
          >
            <ChoiceGrid
              choices={LOOKING_CHOICES}
              value={draft.looking}
              onPick={(looking) => setDraft((d) => ({ ...d, looking }))}
            />
          </Question>

          <Question n="02" label="What's the occasion?" help="Dress codes differ more than styles do.">
            <ChoiceGrid
              choices={OCCASION_CHOICES}
              value={draft.occasion}
              onPick={(occasion) => setDraft((d) => ({ ...d, occasion }))}
              compact
            />
          </Question>

          <Question n="03" label="How often would you wear it?">
            <ChoiceGrid
              choices={WEAR_CHOICES}
              value={draft.wear}
              onPick={(wear) => setDraft((d) => ({ ...d, wear }))}
            />
          </Question>

          <Question n="04" label="Do you already own pieces like this?">
            <ChoiceGrid
              choices={OWNS_CHOICES}
              value={draft.owns}
              onPick={(owns) => setDraft((d) => ({ ...d, owns }))}
            />
          </Question>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={submit}
            disabled={!isComplete(draft)}
            className="text-xs tracking-[0.3em] uppercase border border-gold px-6 py-3.5 text-gold hover:bg-gold hover:text-background transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold"
          >
            {showResult ? "Update my brief →" : "Get my brief →"}
          </button>
          {ready && intake && (
            <button
              onClick={restart}
              className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-gold transition"
            >
              Start over
            </button>
          )}
          {!isComplete(draft) && (
            <span className="text-xs text-muted-foreground">
              {QUESTION_COUNT - answered} left
            </span>
          )}
        </div>
      </section>

      {showResult && brief && <BriefResult brief={brief} intake={draft as Intake} />}

      <SiteFooter />
    </main>
  );
}

function Question({
  n,
  label,
  help,
  children,
}: {
  n: string;
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold tabular-nums">{n}</span>
        <div>
          <h2 className="font-display text-2xl font-light leading-tight">{label}</h2>
          {help && <p className="text-xs text-muted-foreground mt-1">{help}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function ChoiceGrid<T extends string>({
  choices,
  value,
  onPick,
  compact = false,
}: {
  choices: { value: T; label: string; hint?: string }[];
  value: T | undefined;
  onPick: (v: T) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-2 ${compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {choices.map((c) => {
        const on = value === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onPick(c.value)}
            aria-pressed={on}
            className={`text-left border px-4 py-3 transition ${
              on
                ? "border-gold bg-gold/15"
                : "border-border hover:border-gold-soft hover:bg-card/60"
            }`}
          >
            <span className={`block text-sm ${on ? "text-gold" : "text-foreground/90"}`}>
              {c.label}
            </span>
            {c.hint && !compact && (
              <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {c.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BriefResult({ brief, intake }: { brief: IntakeBrief; intake: Intake }) {
  const { isOwned, toggle, ready: drawerReady } = useDrawer();
  const [note, setNote] = useState<NoteState>({ status: "idle" });

  // Ask for the covering note once per brief. The brief itself is already on
  // screen, so this is additive — a failure degrades to no paragraph, not to
  // no answer.
  const key = `${intake.looking}|${intake.occasion}|${intake.wear}|${intake.owns}`;
  useEffect(() => {
    if (!brief.lead) return;
    let cancelled = false;
    setNote({ status: "loading" });

    intakeNote({
      data: {
        occasion: brief.occasion.label,
        constraint: brief.constraint,
        lead: brief.lead.piece,
        leadWhy: brief.lead.why,
        alternates: brief.alternates.map((a) => a.piece),
        palette: brief.palette,
        ruledOut: brief.ruledOut.map((r) => r.piece),
      },
    })
      .then((res) => {
        if (cancelled) return;
        setNote(res.ok ? { status: "done", result: res.result } : { status: "failed", reason: res.reason });
      })
      .catch(() => {
        if (cancelled) return;
        setNote({ status: "failed", reason: "The AI service is temporarily unavailable." });
      });

    return () => {
      cancelled = true;
    };
  }, [key, brief]);

  return (
    <section id="brief" className="scroll-mt-24 border-t border-border bg-card/40 px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Your brief</p>

        {note.status === "done" ? (
          <h2 className="text-3xl md:text-4xl font-light leading-tight mb-4">{note.result.headline}</h2>
        ) : (
          <h2 className="text-3xl md:text-4xl font-light leading-tight mb-4">
            {brief.occasion.label}
          </h2>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{brief.constraint}</p>

        {note.status === "loading" && (
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">Writing your note…</p>
        )}
        {note.status === "done" && (
          <div className="mt-5 max-w-2xl space-y-3">
            <p className="text-foreground/90 leading-relaxed">{note.result.note}</p>
            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-gold-soft pl-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-1">
                Watch out
              </span>
              {note.result.watchOut}
            </p>
          </div>
        )}
        {note.status === "failed" && (
          <p className="mt-4 text-xs text-muted-foreground max-w-2xl">
            {note.reason} The picks below don't depend on it — they come from the occasion's dress
            code, not the model.
          </p>
        )}

        {/* Palette */}
        {brief.palette.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {brief.palette.map((c) => (
              <span key={c} className="flex items-center gap-1.5 border border-border px-2 py-1">
                <span className="h-3 w-3" style={{ backgroundColor: colorToHex(c) }} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
              </span>
            ))}
          </div>
        )}

        {/* Lead piece */}
        {brief.lead && (
          <article className="mt-10 border border-gold bg-background p-6 md:p-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Buy this first</div>
            <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
              {getAccessoryMeta(brief.lead.piece)?.image && (
                <img
                  src={getAccessoryMeta(brief.lead.piece)!.image}
                  alt={brief.lead.piece}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="w-full aspect-square object-cover border border-border"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-display text-3xl font-light leading-tight">{brief.lead.piece}</h3>
                {brief.lead.formality && (
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-1.5">
                    {FORMALITY_LABEL[brief.lead.formality]}
                  </div>
                )}
                <p className="text-sm text-gold mt-3">{brief.lead.why}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {lookupAccessoryDefinition(brief.lead.piece).definition}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <ProductPicker accessory={brief.lead.piece} defaultOpen />
                </div>
                {drawerReady && (
                  <button
                    onClick={() => toggle(brief.lead!.piece)}
                    className="mt-4 text-[10px] tracking-[0.25em] uppercase border border-border px-3 py-2 hover:border-gold hover:text-gold transition"
                  >
                    {isOwned(brief.lead.piece) ? "✓ In my drawer" : "I already own this"}
                  </button>
                )}
              </div>
            </div>
          </article>
        )}

        {/* Alternates */}
        {brief.alternates.length > 0 && (
          <div className="mt-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              Also right for this
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brief.alternates.map((a) => (
                <div key={a.piece} className="border border-border bg-background/50 p-4 flex flex-col">
                  <h4 className="font-display text-lg leading-tight">{a.piece}</h4>
                  {a.formality && (
                    <div className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                      {FORMALITY_LABEL[a.formality]}
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground leading-snug mt-2 flex-1">{a.why}</p>
                  <ProductPicker accessory={a.piece} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ruled out — teaching the rule matters more than the pick */}
        {brief.ruledOut.length > 0 && (
          <div className="mt-10 border border-dashed border-border p-5">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Left out on purpose
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {brief.ruledOut.map((r) => (
                <li key={r.piece} className="text-sm">
                  <span className="text-foreground/90">{r.piece}</span>
                  <span className="text-muted-foreground"> — {r.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/wishlist"
            className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 text-gold hover:bg-gold hover:text-background transition"
          >
            Match my wishlist →
          </Link>
          <Link
            to="/makers"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Meet the makers
          </Link>
          <Link
            to="/learn"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Learn the rules
          </Link>
        </div>
      </div>
    </section>
  );
}

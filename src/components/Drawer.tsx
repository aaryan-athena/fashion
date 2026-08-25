import { Link } from "@tanstack/react-router";
import { useDrawer } from "@/lib/drawer";
import { checkLook, verdict, type Conflict, type Severity } from "@/lib/pairing-rules";
import { getTraits } from "@/lib/accessory-traits";

/**
 * Own-it toggle. Renders nothing until the drawer has loaded from storage, so
 * the server and first client paint agree (see lib/drawer.ts).
 */
export function OwnToggle({ accessory, size = "sm" }: { accessory: string; size?: "sm" | "xs" }) {
  const { isOwned, toggle, ready } = useDrawer();
  const owned = isOwned(accessory);

  const cls =
    size === "xs"
      ? "px-2 py-1 text-[9px] tracking-[0.15em]"
      : "px-3 py-1.5 text-[10px] tracking-[0.2em]";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(accessory);
      }}
      disabled={!ready}
      aria-pressed={owned}
      className={`${cls} uppercase border transition disabled:opacity-40 ${
        owned
          ? "border-gold bg-gold/15 text-gold"
          : "border-border text-muted-foreground hover:border-gold hover:text-gold"
      }`}
    >
      {owned ? "✓ In drawer" : "+ I own this"}
    </button>
  );
}

const SEVERITY_STYLE: Record<Severity, { bar: string; label: string; text: string }> = {
  clash: { bar: "bg-destructive", label: "Clash", text: "text-destructive" },
  caution: { bar: "bg-gold", label: "Caution", text: "text-gold" },
  note: { bar: "bg-muted-foreground", label: "Note", text: "text-muted-foreground" },
};

/** The teaching surface: what's wrong, the rule behind it, and the fix. */
export function ConflictList({
  conflicts,
  showClear = true,
}: {
  conflicts: Conflict[];
  showClear?: boolean;
}) {
  const v = verdict(conflicts);

  if (conflicts.length === 0) {
    if (!showClear) return null;
    return (
      <div className="border border-gold-soft bg-gold/5 px-4 py-3">
        <div className="text-[10px] tracking-[0.25em] uppercase text-gold">Clear</div>
        <p className="text-sm text-foreground/80 mt-1">{v.line}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conflicts.map((c, i) => {
        const s = SEVERITY_STYLE[c.severity];
        return (
          <div key={`${c.title}-${i}`} className="flex gap-3 border border-border bg-background/50">
            <span aria-hidden className={`w-[3px] shrink-0 ${s.bar}`} />
            <div className="py-3 pr-4 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-[9px] tracking-[0.25em] uppercase ${s.text}`}>{s.label}</span>
                <h4 className="font-display text-lg leading-tight">{c.title}</h4>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed mt-1.5">{c.why}</p>
              <p className="text-sm text-foreground/90 leading-relaxed mt-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold mr-2">Fix</span>
                {c.fix}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Runs the pairing rules over a set of pieces and renders the result. Used on
 * the blended-vibe edit so the mixer starts giving feedback instead of just
 * listing pieces.
 */
export function LookCheck({
  pieces,
  heading = "Does this combination work?",
}: {
  pieces: string[];
  heading?: string;
}) {
  // Only pieces we have traits for can be judged; saying nothing is better than
  // pretending an unknown piece passed.
  const known = pieces.filter((p) => getTraits(p));
  if (known.length < 2) return null;

  const conflicts = checkLook(known);

  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{heading}</div>
      <ConflictList conflicts={conflicts} />
    </div>
  );
}

/** Empty-drawer prompt, shown wherever a feature needs owned pieces to work. */
export function DrawerEmptyState({ context }: { context: string }) {
  return (
    <div className="border border-dashed border-border px-5 py-8 text-center">
      <p className="text-sm text-foreground/75 max-w-md mx-auto leading-relaxed">
        {context} Tap <span className="text-gold">“I own this”</span> on any piece in the glossary and
        it lands here.
      </p>
      <Link
        to="/accessories"
        className="inline-block mt-4 text-[10px] tracking-[0.3em] uppercase border border-gold px-5 py-2.5 hover:bg-gold hover:text-background transition"
      >
        Open the glossary →
      </Link>
    </div>
  );
}

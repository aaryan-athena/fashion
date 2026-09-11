import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductPicker } from "@/components/ShopTheLook";
import {
  CURATED_EDITS,
  OPEN_COLLAB_SLOTS,
  curatorById,
  editPieces,
  type CuratedEdit,
} from "@/lib/creator-data";
import { getAccessoryMeta } from "@/lib/accessory-data";
import { lookupAccessoryDefinition } from "@/lib/vault-data";
import { getTraits, FORMALITY_LABEL } from "@/lib/accessory-traits";

export const Route = createFileRoute("/curated")({
  head: () => ({
    meta: [
      { title: "Curated Edits — The Vault" },
      {
        name: "description",
        content:
          "Small sets of accessories chosen together and explained — the first three pieces, wedding season, all black. Each one points at independent Indian makers.",
      },
      { property: "og:title", content: "Curated Edits — The Vault" },
      { property: "og:description", content: "Accessory sets chosen together, and why." },
    ],
  }),
  component: CuratedPage,
});

function CuratedPage() {
  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 pt-16 pb-10 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Curated Edits</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] mb-5">
          Sets chosen together,
          <span className="italic text-muted-foreground"> not filtered by category.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          A catalog can tell you what a signet ring is. It can't tell you that this signet, that
          watch and no chain is a complete answer for a wedding you're attending, not hosting.
          These are those answers — four pieces or fewer, with the reasoning attached.
        </p>
      </section>

      <section data-tour="curated-edits" className="px-6 md:px-12 pb-16 max-w-5xl mx-auto space-y-6">
        {CURATED_EDITS.map((edit) => (
          <EditCard key={edit.id} edit={edit} />
        ))}
      </section>

      {/* The collab programme — stated as an open invitation rather than faked */}
      <section className="border-t border-border bg-card/30 px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Collaborations</p>
          <h2 className="text-3xl md:text-4xl font-light leading-tight mb-4">
            Two of these slots are open.
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
            The edits above are ours. The more interesting ones won't be — they'll come from people
            who dress better than we do and from the makers themselves. Every collaborator keeps
            their byline, links out to their own channel, and any paid or gifted arrangement is
            labelled on the edit itself.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {OPEN_COLLAB_SLOTS.map((slot) => (
              <article
                key={slot.id}
                className="border border-dashed border-border p-6 flex flex-col bg-background/40"
              >
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  Open slot
                </div>
                <h3 className="font-display text-xl font-light leading-tight">{slot.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 flex-1">
                  {slot.pitch}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/founder"
              className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 text-gold hover:bg-gold hover:text-background transition"
            >
              Who's behind this →
            </Link>
            <Link
              to="/makers"
              className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
            >
              The maker roster
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function EditCard({ edit }: { edit: CuratedEdit }) {
  const curator = curatorById(edit.curatorId);
  const pieces = editPieces(edit);

  return (
    <article id={edit.id} className="scroll-mt-24 border border-border bg-card/40 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl md:text-3xl font-light leading-tight">{edit.title}</h2>
          {curator && (
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold mt-2">
              {curator.kind === "house" ? (
                <>{curator.name} · {curator.role}</>
              ) : (
                <>
                  Curated by{" "}
                  <a
                    href={curator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @{curator.handle}
                  </a>
                </>
              )}
            </div>
          )}
        </div>
        {edit.budget && (
          <div className="text-right shrink-0">
            <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">All in</div>
            <div className="text-sm tabular-nums text-foreground/90">{edit.budget}</div>
          </div>
        )}
      </div>

      {curator?.kind === "creator" && (
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground border border-border px-2 py-1 inline-block mb-4">
          {curator.disclosure}
        </p>
      )}

      <p className="text-muted-foreground leading-relaxed max-w-2xl">{edit.blurb}</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pieces.map((p) => {
          const meta = getAccessoryMeta(p);
          const traits = getTraits(p);
          return (
            <div key={p} className="border border-border bg-background/50 flex flex-col overflow-hidden">
              {meta?.image && (
                <img
                  src={meta.image}
                  alt={p}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                />
              )}
              <div className="p-3 flex-1 flex flex-col">
                <div className="font-display text-base leading-snug">{p}</div>
                {traits && (
                  <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                    {FORMALITY_LABEL[traits.formality]}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground leading-snug mt-1.5 flex-1">
                  {lookupAccessoryDefinition(p).definition}
                </p>
                <ProductPicker accessory={p} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-l-2 border-gold-soft pl-4 max-w-2xl">
        <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-1.5">How to wear it</div>
        <p className="text-sm text-foreground/90 leading-relaxed">{edit.stylingNote}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {edit.vibes.map((v) => (
          <Link
            key={v}
            to="/vibes"
            hash={`vibe-${v.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="text-[10px] tracking-[0.12em] uppercase border border-border px-2 py-0.5 text-muted-foreground hover:border-gold hover:text-gold transition"
          >
            {v}
          </Link>
        ))}
      </div>
    </article>
  );
}

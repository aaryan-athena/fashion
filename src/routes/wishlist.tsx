import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductPicker } from "@/components/ShopTheLook";
import { VIBES, colorToHex } from "@/lib/vault-data";
import { vibeImage } from "@/lib/vibe-images";
import { blendVibes, MAX_MIX, MIN_MIX } from "@/lib/vibe-mixer";
import { getAccessoryMeta } from "@/lib/accessory-data";
import { readWishlist, type WishlistReadResult } from "@/lib/api/wishlist.functions";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist Match — The Vault" },
      {
        name: "description",
        content:
          "Upload a screenshot of your Amazon or Flipkart wishlist and get accessories that actually sit with the clothes you already want.",
      },
      { property: "og:title", content: "Wishlist Match — The Vault" },
      {
        property: "og:description",
        content: "Your wishlist already knows your taste. Point it at accessories.",
      },
    ],
  }),
  component: WishlistPage,
});

/** Hard ceiling on the base64 payload, matching the server's own validator. */
const MAX_DATA_URL_CHARS = 6_000_000;

/**
 * Decode a file to something drawable, without assuming createImageBitmap.
 *
 * Safari only shipped createImageBitmap(Blob) recently and some in-app
 * browsers still lack it, so fall back to an <img> + object URL rather than
 * failing the whole feature on a missing API.
 */
async function decode(file: File): Promise<{ draw: CanvasImageSource; w: number; h: number; release: () => void }> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return { draw: bitmap, w: bitmap.width, h: bitmap.height, release: () => bitmap.close?.() };
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("That image couldn't be decoded."));
      el.src = url;
    });
    return {
      draw: img,
      w: img.naturalWidth,
      h: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Shrink a screenshot before it goes anywhere.
 *
 * A phone screenshot is often 3–8MB, and base64 inflates it by a third on top.
 * Vision models don't need the pixels — they need the text legible — so 1400px
 * on the long edge at JPEG 0.82 keeps product names readable while landing the
 * payload comfortably inside the request limit.
 *
 * The result is deliberately NOT kept in React state: a multi-megabyte data
 * URL held in state and rendered as an <img src> puts megabytes of string into
 * the DOM and through every render, which is enough to make the main thread
 * misbehave on a mid-range phone. The preview uses a cheap object URL instead,
 * and the base64 lives only as long as the request that needs it.
 */
async function downscale(file: File, maxEdge = 1400, quality = 0.82): Promise<string> {
  const { draw, w: sw, h: sh, release } = await decode(file);
  try {
    const scale = Math.min(1, maxEdge / Math.max(sw, sh));
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't process that image in this browser.");
    ctx.drawImage(draw, 0, 0, w, h);

    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    // A very tall screenshot can still exceed the cap at this edge length.
    // Step the quality down before giving up, so a long wishlist still works.
    for (let q = quality - 0.2; dataUrl.length > MAX_DATA_URL_CHARS && q >= 0.4; q -= 0.2) {
      dataUrl = canvas.toDataURL("image/jpeg", q);
    }
    if (dataUrl.length > MAX_DATA_URL_CHARS) {
      throw new Error("That screenshot is too large — try cropping it to just the list.");
    }
    return dataUrl;
  } finally {
    release();
  }
}

type State =
  | { status: "idle" }
  | { status: "reading" }
  | { status: "done"; result: WishlistReadResult }
  | { status: "failed"; reason: string };

function WishlistPage() {
  const [state, setState] = useState<State>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Object URL for the thumbnail. Kept in a ref-plus-state pair so it can be
  // revoked deterministically: leaking these pins the whole image in memory.
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  const setPreviewUrl = (url: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreview(url);
  };

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setState({ status: "failed", reason: "That's not an image — a PNG or JPEG screenshot works." });
      return;
    }

    setState({ status: "reading" });
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // `image` stays a local: it is multiple megabytes of base64 and must not
      // enter React state or the DOM.
      const image = await downscale(file);
      const res = await readWishlist({ data: { image } });
      setState(res.ok ? { status: "done", result: res.result } : { status: "failed", reason: res.reason });
    } catch (err) {
      setState({
        status: "failed",
        reason:
          err instanceof Error && err.message
            ? err.message
            : "Couldn't read that image — try a different screenshot.",
      });
    }
  };

  return (
    <main className="min-h-screen text-foreground">
      <SiteHeader />

      <section className="px-6 md:px-12 py-16 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Wishlist Match</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] mb-5">
          Your wishlist already
          <span className="italic text-muted-foreground"> knows your taste.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Screenshot a shopping list of clothes you like and drop it here. We read the product names,
          work out how you actually dress, and answer with <strong className="text-foreground/90">accessories</strong> that
          sit with those clothes — homegrown Indian makers first, with luxury and marketplace options
          alongside.
        </p>

        {/* Being specific about the input is the difference between this
            working first try and reading as broken. */}
        <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
          <div className="border border-border/70 bg-card/30 p-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2">Works</div>
            <ul className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <li>· A wishlist, cart or order history — Amazon, Flipkart, Myntra, any store</li>
              <li>· Clothing and footwear, where the product names are readable</li>
              <li>· A screenshot straight off your phone</li>
            </ul>
          </div>
          <div className="border border-border/70 bg-card/30 p-4">
            <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Won't work
            </div>
            <ul className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <li>· Photos of clothes with no text to read</li>
              <li>· A zoomed-out page where the titles are illegible</li>
              <li>· A list of jewellery — this reads clothes and suggests accessories, not the reverse</li>
            </ul>
          </div>
        </div>

        {/* Upload */}
        <div
          data-tour="wishlist-upload"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`mt-10 border-2 border-dashed p-10 text-center transition ${
            dragging ? "border-gold bg-gold/10" : "border-border bg-card/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="text-sm text-muted-foreground">
            {state.status === "reading" ? "Reading your wishlist…" : "Drop a screenshot here"}
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={state.status === "reading"}
            className="mt-4 text-xs tracking-[0.3em] uppercase border border-gold px-6 py-3.5 text-gold hover:bg-gold hover:text-background transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state.status === "reading" ? "Working…" : "Choose a screenshot"}
          </button>
          <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed max-w-md mx-auto">
            The image is read once and never stored — not on our servers, not in your browser. It's
            resized on your device before it's sent.
          </p>
        </div>

        {state.status === "failed" && (
          <div className="mt-6 border border-border bg-card/40 p-5">
            <p className="text-sm text-foreground/90">{state.reason}</p>
            <p className="text-xs text-muted-foreground mt-2">
              A screenshot where the product names are legible works best. Or{" "}
              <Link to="/start" className="text-gold hover:underline">
                answer four questions instead
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {state.status === "done" && <WishlistResult result={state.result} preview={preview} />}

      <SiteFooter />
    </main>
  );
}

function WishlistResult({ result, preview }: { result: WishlistReadResult; preview: string | null }) {
  // Accessories come from the matched vibes through the normal engine — the
  // model never picks pieces, so nothing here can be a hallucinated product.
  const edit = useMemo(() => {
    const names = result.matchedVibes.slice(0, MAX_MIX);
    if (names.length >= MIN_MIX) {
      const blended = blendVibes(names);
      if (blended) {
        return {
          title: blended.vibe,
          palette: blended.colors,
          hero: blended.mostValuable,
          rest: [...blended.recommended, ...blended.addOns],
        };
      }
    }
    const v = VIBES.find((x) => x.vibe === names[0]);
    return v
      ? {
          title: v.vibe,
          palette: v.colors,
          hero: v.mostValuable,
          rest: [...v.recommended, ...v.addOns],
        }
      : null;
  }, [result.matchedVibes]);

  return (
    <section className="border-t border-border bg-card/40 px-6 md:px-12 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">What we read</p>

        <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start">
          {preview && (
            <img
              src={preview}
              alt="The wishlist screenshot you uploaded"
              className="w-full border border-border"
            />
          )}
          <div className="min-w-0">
            {result.items.length > 0 && (
              <>
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  In your wishlist
                </div>
                <ul className="flex flex-wrap gap-1.5 mb-5">
                  {result.items.map((item) => (
                    <li
                      key={item}
                      className="text-[11px] border border-border px-2 py-1 text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.styleSignals.length > 0 && (
              <>
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                  Reads as
                </div>
                <ul className="flex flex-wrap gap-1.5 mb-5">
                  {result.styleSignals.map((s) => (
                    <li
                      key={s}
                      className="text-[11px] tracking-[0.1em] uppercase border border-gold-soft px-2 py-1 text-gold"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="text-foreground/90 leading-relaxed max-w-2xl">{result.note}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {result.matchedVibes.map((v) => (
                <Link
                  key={v}
                  to="/vibes"
                  hash={`vibe-${v.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-[10px] tracking-[0.2em] uppercase border border-gold px-3 py-1.5 text-gold hover:bg-gold hover:text-background transition"
                >
                  {v} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        {edit && (
          <div className="mt-14">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Accessories that fit</p>
                <h2 className="font-display text-3xl md:text-4xl font-light">{edit.title}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {edit.palette.map((c) => (
                  <span key={c} className="flex items-center gap-1.5 border border-border px-2 py-1">
                    <span className="h-3 w-3" style={{ backgroundColor: colorToHex(c) }} />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{c}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-[280px_1fr] gap-6 items-start">
              <img
                src={vibeImage(result.matchedVibes[0])}
                alt={`${edit.title} accessories`}
                width={768}
                height={768}
                loading="lazy"
                className="w-full aspect-square object-cover border border-gold-soft"
              />
              <div className="space-y-6 min-w-0">
                <PieceRow label="Start here" pieces={edit.hero} accent />
                <PieceRow label="Then layer" pieces={edit.rest.slice(0, 6)} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-14 border-t border-border pt-8 flex flex-wrap gap-3">
          <Link
            to="/start"
            className="text-xs tracking-[0.3em] uppercase border border-gold px-5 py-3 text-gold hover:bg-gold hover:text-background transition"
          >
            Answer four questions →
          </Link>
          <Link
            to="/makers"
            className="text-xs tracking-[0.3em] uppercase border border-border px-5 py-3 hover:border-gold transition"
          >
            Meet the makers
          </Link>
        </div>
      </div>
    </section>
  );
}

function PieceRow({
  label,
  pieces,
  accent = false,
}: {
  label: string;
  pieces: string[];
  accent?: boolean;
}) {
  if (pieces.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">{label}</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pieces.map((p) => {
          const meta = getAccessoryMeta(p);
          return (
            <div
              key={p}
              className={`border p-3 flex flex-col ${accent ? "border-gold bg-background" : "border-border bg-background/50"}`}
            >
              {meta?.image && (
                <img
                  src={meta.image}
                  alt={p}
                  width={300}
                  height={240}
                  loading="lazy"
                  className="w-full aspect-[5/4] object-cover border border-border mb-2"
                />
              )}
              <div className="font-display text-base leading-snug">{p}</div>
              <ProductPicker accessory={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

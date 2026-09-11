import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TourButton } from "./Tour";
import { useDrawer } from "@/lib/drawer";

type NavLink = { to: string; label: string; exact?: boolean };

/**
 * The full map, used by the mobile drawer and the footer.
 *
 * Ordered as a newcomer would need it: the two ways in (Start Here, Learn)
 * before the browsing surfaces, since the platform's problem is people who
 * don't yet know they want jewellery.
 */
const NAV_LINKS: NavLink[] = [
  { to: "/", label: "Finder", exact: true },
  { to: "/start", label: "Start Here" },
  { to: "/learn", label: "Learn" },
  { to: "/wishlist", label: "Wishlist Match" },
  { to: "/makers", label: "Makers" },
  { to: "/curated", label: "Edits" },
  { to: "/vibes", label: "Vibes" },
  { to: "/accessories", label: "Accessories" },
  { to: "/drawer", label: "My Drawer" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "The Method" },
  { to: "/founder", label: "Founder" },
];

/**
 * Desktop bar. Thirteen links don't fit on one row at any sane font size, so
 * this is the subset; everything else stays one tap away in the mobile menu
 * and in the footer.
 */
const PRIMARY_NAV: NavLink[] = NAV_LINKS.filter((l) =>
  ["/start", "/learn", "/wishlist", "/makers", "/vibes", "/drawer"].includes(l.to),
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, ready } = useDrawer();
  // Only render the badge once storage has been read, so the server markup and
  // the first client paint match.
  const badge = ready && count > 0 ? count : null;

  // The wordmark already links home, but it doesn't read as a control. On any
  // page other than the finder, give people an explicit way back.
  const onHome = useLocation({ select: (l) => l.pathname === "/" });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 sm:px-6 md:px-10 lg:px-12 lg:flex lg:justify-between lg:gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <div className="h-2 w-2 rounded-full bg-gold" />
          <span className="text-sm tracking-[0.3em] uppercase truncate">The Vault</span>
        </Link>
        <nav className="hidden lg:flex min-w-0 gap-5 xl:gap-9 text-[10px] xl:text-[11px] tracking-[0.2em] xl:tracking-[0.25em] uppercase text-muted-foreground">
          {PRIMARY_NAV.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-foreground" }}
              className="hover:text-foreground transition whitespace-nowrap"
            >
              {l.label}
              {l.to === "/drawer" && badge !== null && <span className="text-gold ml-1">({badge})</span>}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          {!onHome && (
            <Link
              to="/"
              aria-label="Back to the finder"
              title="Back to the finder"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-8 w-8 border border-border hover:border-gold hover:text-gold transition shrink-0"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <TourButton />
          <ThemeToggle />
          <Link to="/vibes" className="hidden sm:inline-block lg:hidden text-[11px] tracking-[0.25em] uppercase border-b border-gold pb-0.5 hover:text-gold transition">
            Browse
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex lg:hidden items-center justify-center h-8 w-8 border border-border hover:border-gold transition shrink-0"
          >
            <span className="relative h-2.5 w-3.5 block">
              <span className={`absolute left-0 right-0 h-px bg-foreground transition ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 right-0 top-1/2 h-px bg-foreground transition ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 right-0 h-px bg-foreground transition ${open ? "top-1/2 -rotate-45" : "top-full -translate-y-px"}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background/95 backdrop-blur px-5 sm:px-6 py-2 flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-gold" }}
              onClick={() => setOpen(false)}
              className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition py-3.5 border-b border-border/60 last:border-b-0"
            >
              {l.label}
              {l.to === "/drawer" && badge !== null && <span className="text-gold ml-1">({badge})</span>}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="panel border-t border-border mt-20">
      <div className="px-6 md:px-12 py-14 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-sm tracking-[0.3em] uppercase">The Vault</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            A vibe-first accessory guide for men. Every chain, ring, watch, earring and bracelet
            mapped to the fit it belongs in — led by independent Indian makers, with luxury and
            marketplace options alongside.
          </p>
        </div>
        <FooterCol title="Start" links={[
          { to: "/start", label: "Four Questions" },
          { to: "/learn", label: "Accessories, Explained" },
          { to: "/wishlist", label: "Wishlist Match" },
          { to: "/", label: "Vibe Finder" },
        ]} />
        <FooterCol title="Browse" links={[
          { to: "/makers", label: "The Makers" },
          { to: "/curated", label: "Curated Edits" },
          { to: "/vibes", label: "All Vibes" },
          { to: "/accessories", label: "Accessory Index" },
          { to: "/drawer", label: "My Drawer" },
        ]} />
      </div>
      <div className="border-t border-border px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-3 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
        <span>© The Vault · Vol. 01</span>
        <span>22 vibes · accessories that finish the fit</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-xs text-muted-foreground hover:text-foreground transition tracking-wide">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

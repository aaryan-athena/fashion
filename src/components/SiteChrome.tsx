import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b border-border overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 sm:px-6 md:px-10 lg:px-12 lg:flex lg:justify-between lg:gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-2 w-2 rounded-full bg-gold" />
          <span className="text-sm tracking-[0.3em] uppercase truncate">The Vault</span>
        </Link>
        <nav className="hidden lg:flex min-w-0 gap-5 xl:gap-9 text-[10px] xl:text-[11px] tracking-[0.2em] xl:tracking-[0.25em] uppercase text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Finder</Link>
          <Link to="/vibes" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Vibes</Link>
          <Link to="/lookbook" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Lookbook</Link>
          <Link to="/accessories" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Accessories</Link>
          <Link to="/journal" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Journal</Link>
          <Link to="/about" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">The Method</Link>
          <Link to="/founder" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">Founder</Link>
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <Link to="/vibes" className="hidden sm:inline-block text-[11px] tracking-[0.25em] uppercase border-b border-gold pb-0.5 hover:text-gold transition">
            Browse
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/30 mt-20">
      <div className="px-6 md:px-12 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-sm tracking-[0.3em] uppercase">The Vault</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            A vibe-first accessory atlas for men. 22 aesthetics, every chain, ring, watch and bracelet mapped to the fit it belongs in.
          </p>
        </div>
        <FooterCol title="Explore" links={[
          { to: "/", label: "Finder" },
          { to: "/vibes", label: "All Vibes" },
          { to: "/lookbook", label: "Lookbook" },
        ]} />
        <FooterCol title="Learn" links={[
          { to: "/accessories", label: "Accessory Index" },
          { to: "/journal", label: "Journal" },
          { to: "/about", label: "The Method" },
        ]} />
        <div className="space-y-3">
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold">Newsletter</div>
          <p className="text-xs text-muted-foreground leading-relaxed">New vibes, drops, and editorial — once a month, never more.</p>
          <form className="flex border border-border focus-within:border-gold transition" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="flex-1 bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground/50"
              aria-label="Email address"
            />
            <button className="text-[10px] tracking-[0.3em] uppercase px-3 bg-foreground text-background hover:bg-gold transition">Join</button>
          </form>
        </div>
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

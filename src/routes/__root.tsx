import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import heroBg from "../assets/hero-jewels.jpg";
import { reportAppError } from "../lib/error-reporting";
import { TourOverlay, TourPrompt } from "../components/Tour";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Vault — Vibe to Accessory Recommender" },
      { name: "description", content: "The Vault recommends men's accessories based on your outfit's vibe." },
      { name: "author", content: "The Vault" },
      { property: "og:title", content: "The Vault — Vibe to Accessory Recommender" },
      { property: "og:description", content: "The Vault recommends men's accessories based on your outfit's vibe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Vault — Vibe to Accessory Recommender" },
      { name: "twitter:description", content: "The Vault recommends men's accessories based on your outfit's vibe." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Solid base color (white in light, dark in dark) sits underneath the image */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-background" />
      {/* Light-mode hero — same photo as dark mode, brightened, desaturated and softly blurred so it
          reads as texture behind the UI rather than as detail competing with the type */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden dark:hidden">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover scale-110 [filter:brightness(1.6)_contrast(0.85)_saturate(0.45)_blur(3px)]"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "hsl(40 30% 96%)", opacity: 0.7 }} />
      </div>
      {/* Dark-mode hero */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden dark:block">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover scale-110 [filter:brightness(0.6)_contrast(1.02)_saturate(0.7)_blur(3px)]"
        />
      </div>

      {/* Tint overlay — dark wash in dark mode, light wash in light mode. Heavy enough that body copy
          keeps its contrast ratio anywhere on the page, not just over the darker parts of the photo. */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--background) 68%, transparent), color-mix(in oklab, var(--background) 86%, transparent))",
        }}
      />

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Mounted at the root so a tour step can point at any element on any
          route, and so the overlay sits above the sticky header. */}
      <TourOverlay />
      <TourPrompt />
    </QueryClientProvider>
  );
}

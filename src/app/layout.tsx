import "@/styles/global.css";
import type { ReactNode } from "react";
import { nav } from "@/lib/nav";
import Search from "@/components/search";
import LogoClient from "@/components/LogoClient";
import Navigation from "@/components/Navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className="page-shell">
        <div className="page-grid">
          <aside className="page-sidebar">
            <div className="page-brand">
              <LogoClient />
            </div>
            <Search />
            <Navigation items={nav} />
          </aside>
          <main className="page-content">
            <article className="content-article">{children}</article>
          </main>
        </div>
      </body>
    </html>
  );
}

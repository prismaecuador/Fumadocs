import "@/styles/global.css";
import type { ReactNode } from "react";
import { nav } from "@/lib/nav";
import Search from "@/components/search";
import LogoClient from "@/components/LogoClient";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className="page-shell">
        {/* Header móvil */}
        <header className="mobile-header">
          <div className="mobile-header-left">
            <LogoClient />
          </div>
          <div className="mobile-header-right">
            <Search />
            <MobileNav items={nav} />
          </div>
        </header>

        <div className="page-grid">
          {/* Sidebar desktop */}
          <aside className="page-sidebar">
            <div className="page-brand">
              <LogoClient />
            </div>
            <Search />
            <Navigation items={nav} />
            <div className="sidebar-footer">
              Desarrollado por Prisma
            </div>
          </aside>

          <main className="page-content">
            <article className="content-article">{children}</article>
          </main>
        </div>
      </body>
    </html>
  );
}

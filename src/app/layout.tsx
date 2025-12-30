import "@/styles/global.css";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { getNavForClient } from "@/lib/nav";
import Search from "@/components/search";
import LogoClient from "@/components/LogoClient";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";

async function getClientFromHeaders(): Promise<string> {
  const headersList = await headers();
  const clientName = headersList.get("x-client-name") || "partner-gym";
  return clientName;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Detectar cliente desde la URL
  const clientName = await getClientFromHeaders();
  const nav = getNavForClient(clientName);
  const hasNav = nav.length > 0;

  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className="page-shell">
        {/* Header móvil - solo mostrar si hay navegación */}
        {hasNav && (
          <header className="mobile-header">
            <div className="mobile-header-left">
              <LogoClient />
            </div>
            <div className="mobile-header-right">
              <Search />
              <MobileNav items={nav} />
            </div>
          </header>
        )}

        <div className="page-grid">
          {/* Sidebar desktop - solo mostrar si hay navegación */}
          {hasNav && (
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
          )}

          <main className={hasNav ? "page-content" : "page-content-full"}>
            <article className="content-article">{children}</article>
          </main>
        </div>
      </body>
    </html>
  );
}

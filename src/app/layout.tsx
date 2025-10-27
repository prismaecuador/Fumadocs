import "@/styles/global.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { nav } from "@/lib/nav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className="page-shell">
        <div className="page-grid">
          <aside className="page-sidebar">
            <div className="page-brand">
              <Link href="/" aria-label="Ir al inicio">
                <img
                  src="/logo.svg"
                  alt="Logotipo"
                  className="page-logo"
                  width={140}
                  height={48}
                />
              </Link>
            </div>
            <div className="page-search">
              <div className="search-control">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="search-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79l4.25 4.25a1 1 0 0 0 1.42-1.42L15.5 14Zm-5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                  />
                </svg>
                <input
                  id="sidebar-search"
                  type="search"
                  placeholder="Buscar en la documentación"
                  aria-label="Buscar en la documentación"
                  className="search-input"
                />
              </div>
            </div>
            <nav className="nav">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="page-content">
            <article className="content-article">{children}</article>
          </main>
        </div>
      </body>
    </html>
  );
}

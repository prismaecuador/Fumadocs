import '@/app/globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { nav } from '@/lib/nav'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen grid grid-cols-[280px_1fr]">
          <aside className="border-r bg-zinc-50 p-4">
            <div className="mb-6 font-semibold">__PROJECT_NAME__ Docs</div>
            <nav className="space-y-2">
              {nav.map((i) => (
                <div key={i.href}>
                  <Link href={i.href} className="block rounded px-2 py-1 hover:bg-zinc-100">
                    {i.title}
                  </Link>
                </div>
              ))}
            </nav>
          </aside>
          <main className="p-8 prose max-w-4xl">{children}</main>
        </div>
      </body>
    </html>
  )
}

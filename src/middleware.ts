import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl

  let clientName = 'partner-gym' // Default client

  // Detectar subdominio de forma robusta
  const parts = hostname.split('.')

  // Ignorar localhost o IPs - extraer del pathname
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168')) {
    // En desarrollo, extraer cliente del pathname: /partner-gym/... → partner-gym
    const pathMatch = pathname.match(/^\/([^\/]+)/)
    if (pathMatch && pathMatch[1]) {
      clientName = pathMatch[1]
    }
  } else if (parts.length >= 3) {
    // Producción: extraer subdominio (primera parte)
    // partnergym.helloprisma.com → partnergym
    // aurora.helloprisma.com → aurora
    clientName = parts[0]

    // Si la URL no empieza con el cliente, reescribir
    // aurora.helloprisma.com/ → aurora.helloprisma.com/aurora
    // aurora.helloprisma.com/partner-gym/... → aurora.helloprisma.com/aurora
    if (pathname === '/' || !pathname.startsWith(`/${clientName}`)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${clientName}${pathname === '/' ? '' : pathname}`
      return NextResponse.rewrite(url)
    }
  } else if (parts.length === 2) {
    // Si es solo helloprisma.com (sin subdominio), usar partner-gym
    clientName = 'partner-gym'
  }

  // Pasar el cliente y pathname como headers para acceso en la aplicación
  const response = NextResponse.next()
  response.headers.set('x-client-name', clientName)
  response.headers.set('x-pathname', request.nextUrl.pathname)

  return response
}

export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto archivos estáticos y públicos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)',
  ],
}

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
    // partner.helloprisma.com → partner
    // aurora.helloprisma.com → aurora
    const subdomain = parts[0]

    // Mapear subdominio a nombre de cliente (carpeta)
    // partner → partner-gym
    // aurora → aurora
    // sushicat → sushicat
    const subdomainToClient: Record<string, string> = {
      'partner': 'partner-gym',
      'aurora': 'aurora',
      'sushicat': 'sushicat'
    }

    clientName = subdomainToClient[subdomain] || subdomain

    // Reescribir URL para que sea limpia
    // partner.helloprisma.com/seccion-1 → /partner-gym/seccion-1 (interno)
    // partner.helloprisma.com/ → /partner-gym (interno)
    const url = request.nextUrl.clone()
    url.pathname = `/${clientName}${pathname}`

    const response = NextResponse.rewrite(url)
    response.headers.set('x-client-name', clientName)
    response.headers.set('x-pathname', pathname)
    return response
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.json).*)',
  ],
}

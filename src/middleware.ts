import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl

  // Extraer el subdominio
  const parts = hostname.split('.')
  let clientName = 'default'

  // Detectar subdominio
  // Ejemplos:
  // - cliente1.helloprisma.com → cliente1
  // - localhost:3000 → default
  // - helloprisma.com → default
  if (parts.length > 2 && hostname !== 'localhost') {
    clientName = parts[0]
  }

  // Pasar el cliente como header para acceso en la aplicación
  const response = NextResponse.next()
  response.headers.set('x-client-name', clientName)

  // También establecer variable de entorno para ingest
  process.env.CLIENT_NAME = clientName

  return response
}

export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto archivos estáticos y públicos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)',
  ],
}
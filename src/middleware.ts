import { NextRequest, NextResponse } from 'next/server'
import { readdirSync } from 'fs'
import { join } from 'path'

// Función para obtener lista de clientes disponibles
function getAvailableClients(): string[] {
  try {
    const clientsPath = join(process.cwd(), 'import', 'clientes')
    return readdirSync(clientsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  } catch {
    return []
  }
}

export function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl

  let clientName = 'default'

  // Detectar subdominio de forma robusta
  // Ejemplos:
  // - partnergym.helloprisma.com → partner-gym
  // - example.helloprisma.com → example
  // - partnergym.helloprisma.com.mx → partner-gym
  // - localhost:3000 → default (usar primer cliente disponible)
  // - helloprisma.com → default

  const parts = hostname.split('.')

  // Ignorar localhost o IPs
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168')) {
    // En desarrollo, usar el primer cliente disponible
    const clients = getAvailableClients()
    if (clients.length > 0) {
      clientName = clients[0]
    }
  } else if (parts.length >= 3) {
    // Producción: extraer subdominio (primera parte)
    // partnergym.helloprisma.com → partnergym
    const subdomain = parts[0]

    // Normalizar nombre (algunos subdominios podrían ser 'partnergym' y el folder 'partner-gym')
    clientName = subdomain
  } else if (parts.length === 2) {
    // Si es solo helloprisma.com (sin subdominio), usar default o primer cliente
    const clients = getAvailableClients()
    if (clients.length > 0) {
      clientName = clients[0]
    }
  }

  // Pasar el cliente como header para acceso en la aplicación
  const response = NextResponse.next()
  response.headers.set('x-client-name', clientName)

  return response
}

export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto archivos estáticos y públicos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)',
  ],
}
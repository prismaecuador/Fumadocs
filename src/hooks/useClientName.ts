import { useEffect, useState } from 'react'

export function useClientName(): string {
  const [clientName, setClientName] = useState('default')

  useEffect(() => {
    // Obtener el subdominio del hostname
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const parts = hostname.split('.')

    let name = 'default'

    // Detectar subdominio consistente con middleware
    if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.startsWith('192.168')) {
      // En desarrollo, intentar detectar del pathname
      const pathname = window.location.pathname
      const pathMatch = pathname.match(/^\/([^\/]+)/)
      if (pathMatch && pathMatch[1] !== '') {
        name = pathMatch[1]
      }
    } else if (parts.length >= 3) {
      // Producción: extraer subdominio (primera parte)
      // partnergym.helloprisma.com → partnergym
      name = parts[0]
    }

    setClientName(name)
  }, [])

  return clientName
}
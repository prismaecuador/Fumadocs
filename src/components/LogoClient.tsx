'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LogoClient() {
  const [clientName, setClientName] = useState<string>('default')
  const [currentLogo, setCurrentLogo] = useState<string>('/default/logo.svg')

  useEffect(() => {
    // Obtener el nombre del cliente del hostname o del path
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    const parts = hostname.split('.')

    let name = 'default'

    // Primero intentar detectar desde el pathname (para localhost)
    const pathMatch = pathname.match(/^\/([^\/]+)/)
    if (pathMatch && pathMatch[1] !== 'default') {
      name = pathMatch[1]
    } else if (parts.length > 2 && hostname !== 'localhost') {
      // Si es apple.deziklabs.com → apple
      name = parts[0]
    }

    setClientName(name)
    // Establecer el logo inicial basado en el cliente detectado
    setCurrentLogo(`/${name}/logo.svg`)
  }, []) // Se ejecuta solo una vez al montar

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    const currentSrc = img.src

    // Intentar diferentes variantes del logo
    if (currentSrc.includes(`/${clientName}/logo.svg`)) {
      // Si falla SVG, intentar PNG
      setCurrentLogo(`/${clientName}/logo.png`)
    } else if (currentSrc.includes(`/${clientName}/logo.png`)) {
      // Si falla PNG, usar fallback global
      img.src = '/logo.svg'
    }
  }

  return (
    <Link href="/" aria-label="Ir al inicio">
      <img
        src={currentLogo}
        alt="Logotipo"
        className="page-logo"
        width={140}
        height={48}
        onError={handleLogoError}
      />
    </Link>
  )
}

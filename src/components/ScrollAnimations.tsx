'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let lastScrollY = window.scrollY
    let scrollDirection: 'down' | 'up' = 'down'
    let images = new Set<Element>()
    let texts = new Set<Element>()

    // Función para inicializar elementos
    const initElements = () => {
      // Limpiar elementos anteriores
      images.clear()
      texts.clear()

      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        // IMÁGENES - siempre se animan
        const imageElements = document.querySelectorAll('.content-article img')
        imageElements.forEach(element => {
          element.classList.add('scroll-animated-image')
          images.add(element)
        })

        // TEXTOS - solo fade in una vez
        const textElements = document.querySelectorAll('.content-article h1, .content-article h2, .content-article h3, .content-article h4, .content-article h5, .content-article h6, .content-article p, .content-article ul, .content-article ol, .content-article blockquote, .content-article pre')
        textElements.forEach(element => {
          element.classList.add('scroll-animated-text')
          texts.add(element)
        })

        // Check inicial para elementos ya visibles
        checkElements()
      }, 100)
    }

    // Función para verificar elementos
    const checkElements = () => {
      const windowHeight = window.innerHeight

      // IMÁGENES - Se animan siempre (ida y vuelta)
      images.forEach(element => {
        const rect = element.getBoundingClientRect()

        // Imagen está en viewport
        const isInViewport = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2

        if (isInViewport) {
          // Remover clases anteriores
          element.classList.remove('from-top', 'from-bottom')

          // Agregar clase según dirección
          if (scrollDirection === 'down') {
            element.classList.add('from-bottom')
          } else {
            element.classList.add('from-top')
          }

          // Hacer visible
          element.classList.add('visible')
        } else {
          // Cuando sale del viewport, resetear para próxima entrada
          element.classList.remove('visible')
        }
      })

      // TEXTOS - Solo fade in una vez (no desaparecen)
      texts.forEach(element => {
        const rect = element.getBoundingClientRect()

        // Texto está en viewport
        const isInViewport = rect.top < windowHeight * 0.85

        if (isInViewport && !element.classList.contains('visible')) {
          element.classList.add('visible')
        }
      })
    }

    // Detectar dirección del scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      lastScrollY = currentScrollY

      checkElements()
    }

    // Inicializar elementos
    initElements()

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      images.clear()
      texts.clear()
    }
  }, [pathname]) // Re-ejecutar cuando cambie la ruta

  return null // Este componente no renderiza nada
}

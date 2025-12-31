'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let lastScrollY = window.scrollY
    let scrollDirection: 'down' | 'up' = 'down'
    let animatedElements = new Set<Element>()

    // Función para inicializar elementos
    const initElements = () => {
      // Limpiar elementos anteriores
      animatedElements.clear()

      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        // SOLO IMÁGENES - sin textos ni títulos
        const elements = document.querySelectorAll('.content-article img')

        // Agregar clases iniciales a todos los elementos
        elements.forEach(element => {
          element.classList.add('scroll-animated')
          animatedElements.add(element)
        })

        // Check inicial para elementos ya visibles
        checkElements()
      }, 100)
    }

    // Función para verificar elementos
    const checkElements = () => {
      const windowHeight = window.innerHeight

      animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect()

        // Elemento está en viewport - con margen ajustado para evitar parpadeos
        // Si está en la parte superior (ya scrolleado), siempre visible
        const isAboveViewport = rect.bottom < 0
        const isInTopPortion = rect.top < windowHeight * 0.2 && rect.bottom > 0
        const isInViewport = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.1

        // Si el elemento ya fue animado y está arriba, mantenerlo visible
        if (isAboveViewport || isInTopPortion) {
          element.classList.add('visible')
          element.classList.add('from-bottom')
          return
        }

        if (isInViewport) {
          // Solo aplicar animación si no estaba visible antes
          if (!element.classList.contains('visible')) {
            // Remover clases anteriores
            element.classList.remove('from-top', 'from-bottom')

            // Agregar clase según dirección
            if (scrollDirection === 'down') {
              element.classList.add('from-bottom')
            } else {
              element.classList.add('from-top')
            }
          }

          // Hacer visible
          element.classList.add('visible')
        } else if (rect.top > windowHeight) {
          // Solo ocultar si está completamente debajo del viewport
          element.classList.remove('visible')
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
      animatedElements.clear()
    }
  }, [pathname]) // Re-ejecutar cuando cambie la ruta

  return null // Este componente no renderiza nada
}

'use client'

import { useEffect } from 'react'

export default function ScrollAnimations() {
  useEffect(() => {
    // Seleccionar todos los elementos animables en el contenido
    const elements = document.querySelectorAll('.content-article img, .content-article h1, .content-article h2, .content-article h3, .content-article h4, .content-article h5, .content-article h6, .content-article p, .content-article ul, .content-article ol, .content-article blockquote, .content-article pre')

    let lastScrollY = window.scrollY
    let scrollDirection: 'down' | 'up' = 'down'

    // Agregar clases iniciales a todos los elementos
    elements.forEach(element => {
      element.classList.add('scroll-animated')
    })

    // Función para verificar elementos
    const checkElements = () => {
      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Elemento está en viewport (con un poco de margen)
        const isInViewport = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15

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
    }

    // Detectar dirección del scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      lastScrollY = currentScrollY

      checkElements()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Check inicial
    checkElements()

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null // Este componente no renderiza nada
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let elements = new Set<Element>()

    const initElements = () => {
      elements.clear()

      setTimeout(() => {
        // Todos los elementos del contenido - fade in simple
        const allElements = document.querySelectorAll('.content-article > *')
        allElements.forEach(element => {
          element.classList.add('scroll-fade-in')
          elements.add(element)
        })

        checkElements()
      }, 100)
    }

    const checkElements = () => {
      const windowHeight = window.innerHeight

      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const isInViewport = rect.top < windowHeight * 0.85

        if (isInViewport && !element.classList.contains('visible')) {
          element.classList.add('visible')
        }
      })
    }

    const handleScroll = () => {
      checkElements()
    }

    initElements()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      elements.clear()
    }
  }, [pathname])

  return null
}

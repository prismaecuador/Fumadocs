'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavItem = {
  title: string
  href: string
  items?: NavItem[]
}

export default function Navigation({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Auto-expandir la sección activa al montar o cuando cambia el pathname
  useEffect(() => {
    const activeSection = items.find((item) => {
      if (pathname === item.href) return true
      if (item.items) {
        return item.items.some((subItem) => pathname === subItem.href)
      }
      return false
    })

    if (activeSection) {
      setExpandedSections((prev) => {
        const newSet = new Set(prev)
        newSet.add(activeSection.href)
        return newSet
      })
    }
  }, [pathname, items])

  const toggleSection = (href: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  const isActive = (href: string) => pathname === href
  const isParentActive = (item: NavItem) => {
    if (pathname === item.href) return true
    if (item.items) {
      return item.items.some(subItem => pathname === subItem.href)
    }
    return false
  }

  return (
    <nav className="nav">
      {items.map((item) => {
        const hasSubItems = item.items && item.items.length > 0
        const isExpanded = expandedSections.has(item.href)
        const isItemActive = isActive(item.href)
        const isParentItemActive = isParentActive(item)

        return (
          <div key={item.href} className="nav-section">
            {hasSubItems ? (
              // Si tiene subsecciones, el item principal solo despliega/colapsa
              <div className="nav-item-wrapper">
                <button
                  onClick={() => toggleSection(item.href)}
                  className={`nav-link nav-link-button ${isParentItemActive ? 'parent-active' : ''}`}
                >
                  {item.title}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`nav-toggle-icon ${isExpanded ? 'expanded' : ''}`}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              // Si no tiene subsecciones, es un link normal
              <div className="nav-item-wrapper">
                <Link
                  href={item.href}
                  className={`nav-link ${isItemActive ? 'active' : ''}`}
                >
                  {item.title}
                </Link>
              </div>
            )}
            {hasSubItems && isExpanded && (
              <div className="nav-subitems">
                {item.items!.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`nav-sublink ${isActive(subItem.href) ? 'active' : ''}`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

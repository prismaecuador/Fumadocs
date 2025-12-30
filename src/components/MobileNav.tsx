"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  title: string;
  href: string;
  items?: NavItem[];
};

type MobileNavProps = {
  items: NavItem[];
};

export default function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isOpen ? (
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsOpen(false)}>
          <nav className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
            {items.map((section) => (
              <div key={section.href} className="mobile-nav-section">
                <Link
                  href={section.href}
                  className="mobile-nav-section-title"
                  onClick={() => setIsOpen(false)}
                >
                  {section.title}
                </Link>
                {section.items && section.items.length > 0 && (
                  <div className="mobile-nav-items">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="mobile-nav-item"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

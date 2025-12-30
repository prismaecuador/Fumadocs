"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchEntry = {
  title: string;
  href: string;
  content: string;
  section?: string;
};

const MIN_QUERY_LENGTH = 2;

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        const response = await fetch("/search-index.json");
        if (!response.ok) return;
        const data: SearchEntry[] = await response.json();
        if (!cancelled) setEntries(data);
      } catch (error) {
        console.error("No se pudo cargar el índice de búsqueda", error);
      }
    }

    loadIndex();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < MIN_QUERY_LENGTH) return [];

    return entries
      .map((entry) => {
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesContent = entry.content.toLowerCase().includes(q);

        if (!matchesTitle && !matchesContent) return null;

        let snippet = entry.content;
        const index = snippet.toLowerCase().indexOf(q);
        if (index >= 0) {
          const start = Math.max(0, index - 40);
          const end = Math.min(snippet.length, index + q.length + 60);
          snippet = `${start > 0 ? "…" : ""}${snippet
            .slice(start, end)
            .trim()}${end < entry.content.length ? "…" : ""}`;
        } else {
          snippet = snippet.slice(0, 100).trim() + "…";
        }

        return {
          ...entry,
          score: matchesTitle ? 2 : 1,
          snippet,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const scoreDiff = (b!.score ?? 0) - (a!.score ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (a!.title || "").localeCompare(b!.title || "");
      })
      .slice(0, 8) as Array<
      SearchEntry & { score: number; snippet: string }
    >;
  }, [entries, query]);

  function handleSelect(href: string) {
    setQuery("");
    setIsOpen(false);
    router.push(href);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].href);
    }
  }

  return (
    <div className="page-search" ref={containerRef}>
      <form className="search-control" role="search" onSubmit={handleSubmit}>
        <svg width="28" height="28" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Search in guidelines</title><path d="M42,42 L29,29 L42,42 Z M32.5,20 C32.5,27.6 26.8,32.5 20,32.5 C13.1,32.5 7.5,26.9 7.5,20 C7.5,13.1 13.1,7.5 20,7.5 C26.9,7.5 32.5,13.1 32.5,20 Z" stroke="rgb(184, 184, 185)" strokeWidth="1" fill="none" fillRule="evenodd"></path></svg>
        <input
          id="sidebar-search"
          type="search"
          placeholder="Buscar"
          aria-label="Buscar"
          className="search-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </form>
      {isOpen && results.length > 0 && (
        <div className="search-results" role="listbox">
          {results.map((result) => (
            <button
              key={`${result.href}-${result.snippet}`}
              type="button"
              className="search-result"
              onClick={() => handleSelect(result.href)}
            >
              <span className="search-result-inline">
                <span className="search-result-page">{result.title}</span>
                <span className="search-result-snippet">{result.snippet}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      {isOpen && query.trim().length >= MIN_QUERY_LENGTH && results.length === 0 && (
        <div className="search-results" role="status">
          <div className="search-result search-result-empty">
            <span className="search-result-title">
              No se encontraron coincidencias
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

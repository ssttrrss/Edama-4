"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
  className?: string
}

export function SearchBar({ placeholder = "Search...", onSearch, initialValue = "", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  // Handle clear button
  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  // Update search when initialValue changes
  useEffect(() => {
    if (initialValue !== query) {
      setQuery(initialValue)
    }
  }, [initialValue])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`
        flex h-10 w-full items-center overflow-hidden rounded-lg border bg-white transition-all
        ${
          isFocused
            ? "border-green-500 ring-2 ring-green-500/20 dark:border-green-400 dark:ring-green-400/10"
            : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        }
      `}
      >
        <Search className="ml-3 h-4 w-4 flex-shrink-0 text-gray-400" />

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent px-3 text-sm outline-none dark:text-gray-100"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </form>
  )
}

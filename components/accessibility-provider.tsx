"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: "normal" | "large" | "extra-large"
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
  setFontSize: (size: "normal" | "large" | "extra-large") => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSizeState] = useState<"normal" | "large" | "extra-large">("normal")

  useEffect(() => {
    // Check for system preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    // Load saved preferences
    const savedReducedMotion = localStorage.getItem("accessibility-reduced-motion")
    const savedHighContrast = localStorage.getItem("accessibility-high-contrast")
    const savedFontSize = localStorage.getItem("accessibility-font-size")

    if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion))
    if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast))
    if (savedFontSize) setFontSizeState(savedFontSize as "normal" | "large" | "extra-large")
  }, [])

  useEffect(() => {
    // Apply accessibility classes to document
    const root = document.documentElement

    if (reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    if (highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    root.classList.remove("font-normal", "font-large", "font-extra-large")
    root.classList.add(`font-${fontSize}`)
  }, [reducedMotion, highContrast, fontSize])

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem("accessibility-reduced-motion", JSON.stringify(newValue))
  }

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("accessibility-high-contrast", JSON.stringify(newValue))
  }

  const setFontSize = (size: "normal" | "large" | "extra-large") => {
    setFontSizeState(size)
    localStorage.setItem("accessibility-font-size", size)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        highContrast,
        fontSize,
        toggleReducedMotion,
        toggleHighContrast,
        setFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

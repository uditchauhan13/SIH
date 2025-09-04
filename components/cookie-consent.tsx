"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, X, Settings } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "necessary")
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Cookie className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">Cookie Preferences</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We use cookies to enhance your experience and analyze site usage. You can customize your preferences
                  or accept all cookies.
                </p>
              </div>
              <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 space-y-3 border-t border-slate-700 pt-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Necessary Cookies</p>
                      <p className="text-xs text-slate-400">Required for basic site functionality</p>
                    </div>
                    <div className="w-10 h-6 bg-cyan-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Analytics Cookies</p>
                      <p className="text-xs text-slate-400">Help us improve our website</p>
                    </div>
                    <button
                      onClick={() => setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? "bg-cyan-500 justify-end" : "bg-slate-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Marketing Cookies</p>
                      <p className="text-xs text-slate-400">Personalized ads and content</p>
                    </div>
                    <button
                      onClick={() => setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? "bg-cyan-500 justify-end" : "bg-slate-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showSettings ? "Hide" : "Settings"}
              </Button>
              {showSettings ? (
                <Button onClick={handleSavePreferences} size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Save Preferences
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Reject All
                  </Button>
                  <Button onClick={handleAcceptAll} size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Accept All
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

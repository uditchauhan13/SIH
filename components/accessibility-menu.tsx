"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccessibility } from "@/components/accessibility-provider"
import { Accessibility, X, Eye, Pause, Type, Contrast } from "lucide-react"

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { reducedMotion, highContrast, fontSize, toggleReducedMotion, toggleHighContrast, setFontSize } =
    useAccessibility()

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open accessibility menu"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Menu Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-cyan-400" />
                    Accessibility Options
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                    aria-label="Close accessibility menu"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        {reducedMotion ? (
                          <Pause className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">Reduce Motion</p>
                        <p className="text-sm text-slate-400">Minimize animations</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleReducedMotion}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        reducedMotion ? "bg-cyan-500 justify-end" : "bg-slate-600 justify-start"
                      }`}
                      aria-label={`${reducedMotion ? "Disable" : "Enable"} reduced motion`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Contrast className={`w-5 h-5 ${highContrast ? "text-cyan-400" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">High Contrast</p>
                        <p className="text-sm text-slate-400">Increase color contrast</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleHighContrast}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        highContrast ? "bg-cyan-500 justify-end" : "bg-slate-600 justify-start"
                      }`}
                      aria-label={`${highContrast ? "Disable" : "Enable"} high contrast`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Type className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Text Size</p>
                        <p className="text-sm text-slate-400">Adjust font size</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["normal", "large", "extra-large"] as const).map((size) => (
                        <Button
                          key={size}
                          variant={fontSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFontSize(size)}
                          className={`text-xs ${
                            fontSize === size
                              ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                              : "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {size === "normal" ? "Normal" : size === "large" ? "Large" : "X-Large"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard Navigation Info */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Keyboard Navigation</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>
                        <kbd className="bg-slate-600 px-1 rounded text-xs">Tab</kbd> - Navigate elements
                      </li>
                      <li>
                        <kbd className="bg-slate-600 px-1 rounded text-xs">Enter</kbd> - Activate buttons
                      </li>
                      <li>
                        <kbd className="bg-slate-600 px-1 rounded text-xs">Esc</kbd> - Close modals
                      </li>
                      <li>
                        <kbd className="bg-slate-600 px-1 rounded text-xs">Space</kbd> - Scroll page
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

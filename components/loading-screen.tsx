"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Satellite, Globe, Zap } from "lucide-react"
import React from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Satellite, text: "Connecting to satellites...", duration: 1000 },
    { icon: Globe, text: "Processing atmospheric data...", duration: 1200 },
    { icon: Zap, text: "Initializing AI models...", duration: 800 },
  ]

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let stepTimeout: NodeJS.Timeout

    const startLoading = () => {
      // Progress animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setTimeout(() => setIsLoading(false), 500)
            return 100
          }
          return prev + 2
        })
      }, 60)

      // Step progression
      let currentStepIndex = 0
      const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
          currentStepIndex++
          setCurrentStep(currentStepIndex)
          stepTimeout = setTimeout(nextStep, steps[currentStepIndex].duration)
        }
      }
      stepTimeout = setTimeout(nextStep, steps[0].duration)
    }

    startLoading()

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex items-center justify-center"
        >
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute inset-0 opacity-10 bg-[url('/satellite-monitoring-earth-from-space-with-data-vi.jpg')] bg-cover bg-center"
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                  opacity: 0,
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Satellite className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">AirSight AI</h1>
              <p className="text-slate-300 text-sm">Satellite Air Quality Monitoring</p>
            </motion.div>

            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center"
                >
                  {steps[currentStep] &&
                    React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-cyan-400" })}
                </motion.div>
                <span className="text-white font-medium">{steps[currentStep]?.text}</span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-slate-400 text-sm">{progress}% Complete</p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? "bg-cyan-400" : "bg-slate-600"
                  }`}
                  animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: index === currentStep ? Number.POSITIVE_INFINITY : 0 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

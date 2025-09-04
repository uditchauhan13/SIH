"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function AnimatedTyping({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="inline-block w-0.5 h-8 bg-primary ml-1"
      />
    </span>
  )
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ y: 0 }}
        animate={{ y: -50 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[url('/satellite-monitoring-earth-from-space-with-data-vi.jpg')] bg-cover bg-center bg-no-repeat" />
      </motion.div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedTyping
              text="Transforming Air Quality Monitoring with AI"
              className="text-5xl md:text-6xl font-bold text-foreground"
            />
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            Harnessing satellite technology for a cleaner tomorrow. Real-time monitoring, predictive analytics, and
            actionable insights for environmental protection.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3">
                  View Live Dashboard
                </Button>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
          <div className="w-full max-w-4xl mx-auto">
            <motion.img
              src="/satellite-monitoring-earth-from-space-with-data-vi.jpg"
              alt="Satellite monitoring visualization"
              className="w-full h-auto rounded-lg shadow-2xl border border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

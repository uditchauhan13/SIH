"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function FloatingDemoButton() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ delay: 4, type: "spring", stiffness: 300, damping: 20 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="relative">
        <motion.button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white text-xs z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3" />
        </motion.button>

        <Link href="/dashboard">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(6, 182, 212, 0.7)",
                "0 0 0 10px rgba(6, 182, 212, 0)",
                "0 0 0 0 rgba(6, 182, 212, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg rounded-full px-6 py-3 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Quick Demo
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}

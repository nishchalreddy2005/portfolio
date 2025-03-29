"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(true)

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 30000)

    // Prevent scrolling when popup is visible
    if (isVisible) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "auto"
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-black border-2 border-primary/30 rounded-lg shadow-2xl max-w-2xl w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <div className="p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setIsVisible(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>

              <h2 className="text-2xl font-bold text-white mb-4">Welcome to My Portfolio</h2>

              <p className="text-white text-lg mb-6">
                To get the best and complete view of my portfolio, please open the website in full screen on desktop, or
                enable the 'Desktop Site' option on your mobile device.
              </p>

              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30, ease: "linear" }}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => setIsVisible(false)}
                >
                  Continue to Portfolio
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


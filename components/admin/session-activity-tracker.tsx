"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function SessionActivityTracker() {
  const { refreshSession } = useAuth()

  useEffect(() => {
    // Events that indicate user activity
    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"]

    // Debounce function to limit how often we refresh the session
    let timeout: NodeJS.Timeout | null = null

    const handleActivity = () => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        refreshSession()
      }, 1000) // Wait 1 second after activity stops before refreshing
    }

    // Add event listeners for all activity events
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Clean up event listeners
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })

      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [refreshSession])

  // This component doesn't render anything visible
  return null
}

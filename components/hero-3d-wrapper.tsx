"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import the 3D component with no SSR
const Hero3DDynamic = dynamic(() => import("./hero-3d"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
  ),
})

export default function Hero3DWrapper() {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) {
    return <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
  }

  return <Hero3DDynamic />
}


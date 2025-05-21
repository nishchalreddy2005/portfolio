"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, FileText, ChevronRight, Linkedin, Github } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Advanced Typewriter effect component
const AdvancedTypewriter = ({ phrases, typingSpeed = 100, deletingSpeed = 50, delayAfterPhrase = 1500 }) => {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  // Blink cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Typing/deleting effect
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (displayText.length < currentPhrase.length) {
            setDisplayText(currentPhrase.substring(0, displayText.length + 1))
          } else {
            // Finished typing, wait before deleting
            setTimeout(() => setIsDeleting(true), delayAfterPhrase)
          }
        } else {
          // Deleting
          if (displayText.length > 0) {
            setDisplayText(displayText.substring(0, displayText.length - 1))
          } else {
            // Finished deleting, move to next phrase
            setIsDeleting(false)
            setPhraseIndex((phraseIndex + 1) % phrases.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, delayAfterPhrase])

  return (
    <div className="text-xl md:text-2xl text-foreground/80 flex items-center justify-center">
      <span className="mr-2">I am</span>
      <span className="min-w-[20px] inline-block">{displayText}</span>
      <span
        className={`inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 0.2s" }}
      ></span>
    </div>
  )
}

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const { toast } = useToast()

  // Phrases to cycle through in the typewriter effect
  const phrases = [
    "Computer Science Engineer",
    "Tech Enthusiast",
    "Problem Solver",
    "Full Stack Developer",
    "Leadership Enthusiast",
    "Collaborative Team Leader",
    "Continuous Learner",
    "Certified Enterprise Application Developer",
    "Proactive Developer and Technologist",
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle resume download
  const handleDownloadResume = () => {
    // Show success notification
    toast({
      title: "Success!",
      description: "CV downloaded successfully",
      variant: "default",
      duration: 5000,
      className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
    })
  }

  // Separate useEffect for canvas animation that runs only after component is mounted
  useEffect(() => {
    if (!isMounted || !canvasRef.current) return

    // Canvas setup for particle animation
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return // Safety check

    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Particle settings
    const particleCount = 200
    const particles = []
    const colors = ["#3b82f6", "#6366f1", "#10b981", "#06b6d4"]

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1,
        isSquare: Math.random() > 0.9, // 10% chance to be a square
      })
    }

    // Animation function
    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.fillStyle = particle.color

        if (particle.isSquare) {
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
        } else {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Move particles
        particle.y += particle.speed

        // Reset particles when they go off screen
        if (particle.y > height) {
          particle.y = 0
          particle.x = Math.random() * width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      if (canvas) {
        canvas.width = width
        canvas.height = height
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted]) // Only run after component is mounted

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background dark:bg-[#050505]"
    >
      {/* Particle background - only render on client side */}
      {isMounted && <canvas ref={canvasRef} className="absolute inset-0 z-0" />}

      <div className="container mx-auto px-4 z-10">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold mb-4">
            <span className="text-foreground dark:text-white">G V R Nishchal</span>{" "}
            <span className="text-primary">Reddy</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="mb-6">
            <AdvancedTypewriter phrases={phrases} />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="https://drive.google.com/uc?export=download&id=1JVLB0XEdKztxMybpN-mAg_ZXxxbuR7ZV"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadResume}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download CV
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            {/* LinkedIn button with fill effect on hover */}
            <Button
              variant="outline"
              size="lg"
              className="text-foreground dark:text-white border-foreground/20 dark:border-white/20 bg-foreground/5 dark:bg-white/5 backdrop-blur-sm hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 relative overflow-hidden group"
              onClick={() => window.open("https://www.linkedin.com/in/gvrnishchalreddy/", "_blank")}
            >
              <span className="relative z-10 flex items-center">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </span>
              <span className="absolute inset-0 bg-[#0077b5] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>

            {/* GitHub button with red fill effect on hover */}
            <Button
              variant="outline"
              size="lg"
              className="text-foreground dark:text-white border-foreground/20 dark:border-white/20 bg-foreground/5 dark:bg-white/5 backdrop-blur-sm hover:bg-[#f94d6a] hover:border-[#f94d6a] hover:text-white transition-all duration-300 relative overflow-hidden group"
              onClick={() => window.open("https://github.com/nishchalreddy2005", "_blank")}
            >
              <span className="relative z-10 flex items-center">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </span>
              <span className="absolute inset-0 bg-[#f94d6a] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10 flex flex-col items-center justify-center">
        <p className="text-foreground/60 dark:text-white/60 mb-2 text-center">Scroll Down</p>
        <a href="#about" aria-label="Scroll down" className="flex justify-center">
          <ArrowDown className="h-6 w-6 text-foreground/60 dark:text-white/60" />
        </a>
      </div>
    </section>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react"

export default function Projects3DCSS({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  // Handle touch events
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  // Navigate to previous project
  const prevProject = () => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  // Navigate to next project
  const nextProject = () => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  // Scroll to active project when activeIndex changes
  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = activeIndex * (320 + 16) // card width + gap
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [activeIndex])

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-black to-gray-900 rounded-xl overflow-hidden">
      {/* Perspective container */}
      <div className="absolute inset-0 flex items-center justify-center perspective">
        {/* Reflective floor */}
        <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
          onClick={prevProject}
          aria-label="Previous project"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
          onClick={nextProject}
          aria-label="Next project"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>

        {/* Project cards container */}
        <div
          ref={containerRef}
          className="flex space-x-4 px-16 py-8 overflow-x-auto hide-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex

            return (
              <motion.div
                key={project.id}
                className={`relative flex-shrink-0 w-[320px] h-[400px] rounded-xl ${isActive ? "z-10" : "z-0"}`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 0.9,
                  y: isActive ? -20 : 0,
                  rotateY: (index - activeIndex) * 5,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveIndex(index)}
              >
                {/* Card content */}
                <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-primary to-secondary rounded-xl overflow-hidden transform preserve-3d shadow-2xl">
                  {/* Screen */}
                  <div className="flex-grow bg-white dark:bg-gray-800 m-3 mt-4 rounded-t-lg overflow-hidden">
                    <div className="h-full flex flex-col">
                      {/* Project title bar */}
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="text-sm font-bold truncate">{project.title}</h3>
                      </div>

                      {/* Project content */}
                      <div className="flex-grow p-4 flex flex-col">
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>

                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-auto flex justify-between"
                          >
                            <Button size="sm" variant="outline" className="text-xs">
                              <Github className="mr-1 h-3 w-3" /> Code
                            </Button>
                            <Button size="sm" className="text-xs bg-gradient-to-r from-primary to-secondary">
                              <ExternalLink className="mr-1 h-3 w-3" /> Demo
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="h-6 bg-gradient-to-r from-primary to-secondary rounded-b-xl"></div>
                </div>

                {/* Reflection */}
                <div className="absolute top-full left-0 right-0 h-[200px] transform scale-y-[-0.5] opacity-30 blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary rounded-xl"></div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


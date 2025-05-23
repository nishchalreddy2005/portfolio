"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Linkedin, Mail, Phone, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push("/admin/profile")
    } else {
      router.push("/admin")
    }
  }

  return (
    <footer className="bg-muted/30 py-12 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold gradient-heading">Nishchal Reddy</h2>
            <p className="mt-2 text-foreground/60 max-w-md">
              A dedicated professional with experience in leading technology and society initiatives, passionate about
              leveraging technical expertise to drive impactful societal change.
            </p>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com/nishchalreddy2005"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/gvrnishchalreddy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:2200033247cseh@gmail.com"
              className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="tel:+918431099097"
              className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              aria-label="Phone"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} G V R Nishchal Reddy. All rights reserved.
          </p>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
            onClick={handleAdminClick}
            aria-label="Admin Dashboard"
          >
            <img src="/images/admin-icon.png" alt="" className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  )
}

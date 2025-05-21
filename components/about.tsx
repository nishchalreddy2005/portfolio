"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, User } from "lucide-react"
import { useEffect, useState } from "react"

interface AboutProps {
  data: {
    bio: string
    name?: string
    email?: string
    phone?: string
    location?: string
    image_url?: string
  }
}

export default function About({ data }: AboutProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // State to store the profile image URL and name
  const [profileImage, setProfileImage] = useState<string>("")
  const [profileName, setProfileName] = useState<string>("")

  // Effect to get the profile data from localStorage if not in props
  useEffect(() => {
    if (typeof window !== "undefined") {
      // For image URL
      const imageUrl = data.image_url || localStorage.getItem("profile_image_url") || ""
      setProfileImage(imageUrl)

      // For name
      const name = data.name || localStorage.getItem("profile_name") || "G V R Nishchal Reddy"
      setProfileName(name)

      // Log for debugging
      console.log("Profile image URL:", imageUrl)
      console.log("Profile name:", name)
    }
  }, [data.image_url, data.name])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Use data from props or fallback to defaults
  const email = data.email || "2200033247cseh@gmail.com"
  const phone = data.phone || "+91 8431099097"
  const location = data.location || "Vijayawada, India"

  return (
    <section id="about" className="section-container bg-background">
      <div className="container mx-auto">
        <h2 className="section-title">About Me</h2>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 rounded-2xl overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt={profileName}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={() => {
                      // If image fails to load, clear it so we show the placeholder
                      console.error("Failed to load profile image:", profileImage)
                      setProfileImage("")
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <User size={64} />
                    <span className="sr-only">Profile image placeholder</span>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-primary/10 rounded-full z-0"></div>
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-secondary/10 rounded-full z-0"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-accent rounded-full z-0"></div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-4 gradient-heading">Computer Science Engineer & Tech Enthusiast</h3>

            <div className="space-y-4 text-foreground/80 mb-8">
              <p>{data.bio}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="card-hover glass">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60">Name</h4>
                    <p className="font-medium">{profileName}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover glass">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60">Location</h4>
                    <p className="font-medium">{location}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover glass">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-foreground/60">Email</h4>
                    <p className="font-medium break-words text-sm sm:text-base">{email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover glass">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60">Phone</h4>
                    <p className="font-medium">{phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, User } from "lucide-react"

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0u3lCifx5qGr6LtBszLsZzgAgZoirw.png"
                  alt="Nishchal Reddy"
                  className="w-full h-full object-cover rounded-2xl"
                />
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
              <p>
                I'm a dedicated professional with experience in leading technology and society initiatives at Focus, the
                student governance body at K L University, and an internship with Indian Railways.
              </p>
              <p>
                I demonstrate strong leadership, communication, and organizational skills through organizing workshops
                and streamlining processes. I possess a friendly, positive attitude with proven abilities in teamwork,
                problem-solving, and customer service.
              </p>
              <p>My career goals include leveraging technical expertise to drive impactful societal change.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="card-hover glass">
                <CardContent className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60">Name</h4>
                    <p className="font-medium">G V R Nishchal Reddy</p>
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
                    <p className="font-medium">Vijayawada, India</p>
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
                    <p className="font-medium break-words text-sm sm:text-base">2200033247cseh@gmail.com</p>
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
                    <p className="font-medium">+91 8431099097</p>
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

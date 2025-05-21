"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Award, CheckCircle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const certificationsData = [
  {
    id: 1,
    title: "Introduction to Industry 4.0 and Industrial Internet of Things",
    issuer: "NPTEL",
    date: "2024",
    icon: "award",
    certificateUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2gbLMb8NiYxCXYySwxOZJZO5FzYQcT.png",
  },
  {
    id: 2,
    title: "Red Hat Certified Enterprise Application Developer",
    issuer: "Red Hat",
    date: "2024",
    icon: "award",
    certificateUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hLpbk61ABvPZkegvambHhLBdCQPRxJ.png",
  },
  {
    id: 3,
    title: "MongoDB Associate Database Administrator",
    issuer: "MongoDB",
    date: "2025",
    icon: "award",
    certificateUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1736326384924.jpg-goGbcDdBgzZr1ixRoyncJuWFxXzf7c.jpeg",
  },
]

export default function Certifications() {
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
    <section id="certifications" className="section-container bg-muted/30">
      <div className="container mx-auto">
        <h2 className="section-title">My Certifications</h2>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {certificationsData.map((cert) => (
            <motion.div key={cert.id} variants={itemVariants} transition={{ duration: 0.5 }}>
              <Card
                className={`h-full card-hover overflow-hidden border-t-4 border-t-accent ${cert.certificateUrl ? "cursor-pointer" : ""}`}
                onClick={() => cert.certificateUrl && window.open(cert.certificateUrl, "_blank")}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                      <p className="text-foreground/70">{cert.issuer}</p>
                    </div>
                    <p className="text-sm text-foreground/60 font-medium">{cert.date}</p>
                  </div>
                  {cert.certificateUrl && (
                    <div className="mt-3 text-sm text-primary hover:text-primary/80 flex items-center">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Certificate
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

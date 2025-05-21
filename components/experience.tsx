"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const experienceData = [
  {
    id: 1,
    title: "Lead, Tech and Society",
    company: "Focus (Student Governance Body at K L University)",
    location: "Vijayawada, India",
    period: "August 2024 – Current",
    description: [
      "Organized workshops, discussions, and events related to technology and its impact on society, reaching over 200 participants.",
      "Proactively led and managed multiple projects independently, ensuring timely delivery and high-quality outcomes.",
      "Effectively communicated complex technical concepts to diverse audiences, including team members.",
    ],
  },
  {
    id: 2,
    title: "Intern",
    company: "Indian Railways",
    location: "Hubli, India",
    period: "May 2024 – May 2024",
    description: [
      "Gained hands-on experience in Network Virtualization Technology, applying classroom knowledge to real-world challenges.",
    ],
  },
]

export default function Experience() {
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
    <section id="experience" className="section-container bg-muted/30">
      <div className="container mx-auto">
        <h2 className="section-title">My Experience</h2>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

            {experienceData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                className={`relative z-10 mb-12 last:mb-0 flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2 md:pr-8 md:pl-8 flex justify-center md:justify-end">
                  <Card className={`card-hover w-full max-w-md ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <p className="text-primary font-medium">{item.company}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-foreground/70">
                          <Calendar className="h-4 w-4 mr-2 text-secondary" />
                          <span>{item.period}</span>
                        </div>

                        <div className="flex items-center text-foreground/70">
                          <MapPin className="h-4 w-4 mr-2 text-secondary" />
                          <span>{item.location}</span>
                        </div>

                        <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                          {item.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-6 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary border-4 border-background"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

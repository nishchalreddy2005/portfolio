"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { GraduationCap, Calendar, Award, School, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const educationData = [
  {
    id: 1,
    degree: "B.Tech in Computer Science and Engineering (Honours)",
    specialization: "Specialization in Distributed Ledger Analytics",
    institution: "K L University",
    location: "Vaddeshwaram, India",
    period: "2022 – 2026",
    grade: "CGPA: 8.5",
  },
  {
    id: 2,
    degree: "BBA",
    specialization: "Dual Degree (Online)",
    institution: "K L University",
    location: "Vaddeshwaram, India",
    period: "2023 – 2026",
    grade: "CGPA: 9.24",
  },
  {
    id: 3,
    degree: "Board of Intermediate Education (MPC)",
    institution: "Shirdi Sai Junior College",
    location: "Rajahmundry, India",
    period: "2020 – 2022",
    grade: "Percentage: 65%",
    coursework: "Mathematics, Physics, Chemistry",
  },
  {
    id: 4,
    degree: "Central Board of Secondary Education (CBSE)",
    institution: "Tripura English Medium School",
    location: "Rajahmundry, India",
    period: "2018 – 2020",
    grade: "Percentage: 77%",
  },
]

export default function Education() {
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
    <section id="education" className="section-container bg-background">
      <div className="container mx-auto">
        <h2 className="section-title">My Education</h2>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationData.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} transition={{ duration: 0.5 }} className="h-full">
                <Card className="h-full card-hover overflow-hidden border-t-4 border-t-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {index < 2 ? (
                          <GraduationCap className="h-6 w-6 text-primary" />
                        ) : (
                          <School className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{item.degree}</CardTitle>
                        {item.specialization && <p className="text-foreground/70 mt-1">{item.specialization}</p>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-foreground/70">
                        <School className="h-4 w-4 mr-2 text-secondary" />
                        <span>{item.institution}</span>
                      </div>

                      <div className="flex items-center text-foreground/70">
                        <MapPin className="h-4 w-4 mr-2 text-secondary" />
                        <span>{item.location}</span>
                      </div>

                      <div className="flex items-center text-foreground/70">
                        <Calendar className="h-4 w-4 mr-2 text-secondary" />
                        <span>{item.period}</span>
                      </div>

                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-secondary" />
                        <Badge variant="outline" className="font-normal">
                          {item.grade}
                        </Badge>
                      </div>

                      {item.coursework && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-foreground/70">
                            <span className="font-medium">Coursework:</span> {item.coursework}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

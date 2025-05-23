"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExperienceItemProps {
  id: string | number
  title: string
  company: string
  location: string
  startDate?: string
  endDate?: string
  current?: boolean
  period?: string
  description: string[]
}

interface ExperienceProps {
  data: ExperienceItemProps[] | { items: any[]; descriptions: any[] }
}

// Helper function to format date from YYYY-MM to Month YYYY
function formatDate(dateString: string): string {
  if (!dateString) return ""

  // Check if the date is already in a month name format
  if (dateString.includes(" ")) return dateString

  try {
    const [year, month] = dateString.split("-")
    if (!year || !month) return dateString

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Convert month number to month name (month numbers are 1-based, array is 0-based)
    const monthIndex = Number.parseInt(month) - 1
    if (monthIndex < 0 || monthIndex >= 12) return dateString

    return `${monthNames[monthIndex]} ${year}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export default function Experience({ data = [] }: ExperienceProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Process the data to ensure it's in the expected format
  let experienceData: ExperienceItemProps[] = []

  if (Array.isArray(data)) {
    // Data is already in the right format
    experienceData = data
  } else if (data && typeof data === "object" && "items" in data) {
    // Data is in the format { items: [], descriptions: [] }
    // Convert it to the expected format
    experienceData = data.items.map((item) => {
      // Find descriptions for this item
      const itemDescriptions = data.descriptions
        .filter((desc) => desc.experience_id === item.id)
        .map((desc) => desc.description)

      return {
        id: item.id,
        title: item.title,
        company: item.company,
        location: item.location,
        startDate: item.start_date,
        endDate: item.end_date,
        current: item.current,
        description: itemDescriptions,
      }
    })
  }

  console.log("Experience data processed:", experienceData)

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

  // If no experience data is provided, show a message
  if (!experienceData || experienceData.length === 0) {
    return (
      <section id="experience" className="section-container bg-muted/30">
        <div className="container mx-auto">
          <h2 className="section-title">My Experience</h2>
          <p className="text-center text-muted-foreground">No experience data available.</p>
        </div>
      </section>
    )
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

            {experienceData.map((item, index) => {
              // Format dates with month names
              const formattedStartDate = formatDate(item.startDate || "")
              const formattedEndDate = item.current ? "Present" : formatDate(item.endDate || "")

              // Format period string from startDate and endDate if period is not provided
              const period = item.period || `${formattedStartDate} – ${formattedEndDate}`

              return (
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
                            <span>{period}</span>
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
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

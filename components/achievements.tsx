"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  issuer: string
  url: string
}

export default function Achievements({ data = [] }: { data: Achievement[] }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <section id="achievements" className="section-container py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-3xl font-bold mb-8">Achievements</h2>

        <motion.ul
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto space-y-2 list-disc pl-6"
        >
          {data.map((achievement) => (
            <motion.li
              key={achievement.id}
              variants={itemVariants}
              transition={{ duration: 0.3 }}
              className="text-base"
            >
              {achievement.title}
              {achievement.issuer && ` - ${achievement.issuer}`}
              {achievement.date && ` (${achievement.date})`}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

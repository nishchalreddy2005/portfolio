"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"
import { defaultProfileData } from "@/utils/local-storage-service"
import { Loader2 } from "lucide-react"
import { technicalSkills, softSkills } from "@/components/skills-data"

export default function SeedDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const supabase = getSupabaseBrowserClient()

      // Seed About data
      const { error: aboutError } = await supabase.from("about").upsert({ bio: defaultProfileData.about.bio })

      if (aboutError) throw new Error(`Error seeding about data: ${aboutError.message}`)

      // Seed Contact data
      const { error: contactError } = await supabase.from("contact").upsert({
        email: defaultProfileData.contact.email,
        phone: defaultProfileData.contact.phone,
        location: defaultProfileData.contact.location,
      })

      if (contactError) throw new Error(`Error seeding contact data: ${contactError.message}`)

      // Seed Education data
      // First, delete existing education data to avoid duplicates
      await supabase.from("education").delete().gt("id", 0)

      // Prepare education data in the exact order shown in the image
      const educationData = defaultProfileData.education.map((edu) => {
        // Ensure start_year and end_year are not null or empty
        const start_year = edu.startYear || "2000" // Default to "2000" if startYear is empty
        const end_year = edu.endYear || "Present" // Default to "Present" if endYear is empty

        return {
          id: edu.id || undefined, // Remove id if it's null or undefined to let Supabase generate one
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location,
          start_year,
          end_year,
          grade: edu.grade,
          specialization: edu.specialization,
        }
      })

      console.log("Seeding education data:", educationData)

      // Insert new education data
      const { error: educationError } = await supabase.from("education").insert(educationData)

      if (educationError) throw new Error(`Error seeding education data: ${educationError.message}`)

      // Seed Technical Skills data
      // First, delete existing technical skills to avoid duplicates
      await supabase.from("technical_skill").delete().gt("id", 0)

      // Use the skills data from the frontend
      const technicalSkillsData = technicalSkills.map((skill, index) => ({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      }))

      const { error: technicalSkillsError } = await supabase.from("technical_skill").insert(technicalSkillsData)

      if (technicalSkillsError) throw new Error(`Error seeding technical skills data: ${technicalSkillsError.message}`)

      // Seed Soft Skills data
      // First, delete existing soft skills to avoid duplicates
      await supabase.from("soft_skill").delete().gt("id", 0)

      // Use the skills data from the frontend
      const softSkillsData = softSkills.map((skill, index) => ({
        name: skill.name,
        level: skill.level,
      }))

      const { error: softSkillsError } = await supabase.from("soft_skill").insert(softSkillsData)

      if (softSkillsError) throw new Error(`Error seeding soft skills data: ${softSkillsError.message}`)

      // Seed Experience data
      for (const exp of defaultProfileData.experience) {
        // Insert experience
        const { data: experienceData, error: experienceError } = await supabase
          .from("experience")
          .upsert({
            title: exp.title,
            company: exp.company,
            location: exp.location,
            start_date: exp.startDate || "2000-01", // Default if empty
            end_date: exp.endDate || (exp.current ? null : "Present"), // Default if empty
            current: exp.current,
          })
          .select("id")
          .single()

        if (experienceError) throw new Error(`Error seeding experience data: ${experienceError.message}`)

        // Insert experience descriptions
        const descriptionsData = exp.description.map((desc, index) => ({
          experience_id: experienceData.id,
          description: desc,
          display_order: index,
        }))

        const { error: descriptionsError } = await supabase.from("experience_description").upsert(descriptionsData)

        if (descriptionsError) throw new Error(`Error seeding experience descriptions: ${descriptionsError.message}`)
      }

      // Seed Projects data
      for (const project of defaultProfileData.projects) {
        // Insert project
        const { data: projectData, error: projectError } = await supabase
          .from("project")
          .upsert({
            title: project.title,
            category: project.category,
            description: project.description,
            image: project.image,
            github: project.github,
            demo: project.demo,
            linkedin: project.linkedin,
          })
          .select("id")
          .single()

        if (projectError) throw new Error(`Error seeding project data: ${projectError.message}`)

        // Insert project features
        const featuresData = project.features.map((feature, index) => ({
          project_id: projectData.id,
          feature: feature,
          display_order: index,
        }))

        const { error: featuresError } = await supabase.from("project_feature").upsert(featuresData)

        if (featuresError) throw new Error(`Error seeding project features: ${featuresError.message}`)

        // Insert project technologies
        const technologiesData = project.technologies.map((tech, index) => ({
          project_id: projectData.id,
          technology: tech,
          display_order: index,
        }))

        const { error: technologiesError } = await supabase.from("project_technology").upsert(technologiesData)

        if (technologiesError) throw new Error(`Error seeding project technologies: ${technologiesError.message}`)
      }

      // Seed Certifications data
      const certificationsData = defaultProfileData.certifications.map((cert) => ({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date || "2023", // Default if empty
        certificate_url: cert.certificateUrl,
      }))

      const { error: certificationsError } = await supabase.from("certification").upsert(certificationsData)

      if (certificationsError) throw new Error(`Error seeding certifications data: ${certificationsError.message}`)

      setResult({
        success: true,
        message: "Database seeded successfully with initial data!",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Seed Database</CardTitle>
        <CardDescription>Populate your Supabase database with initial portfolio data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will populate your database with sample data from the default profile. Use this to get started quickly
          with your portfolio.
        </p>
        <Button onClick={handleSeedDatabase} disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding Database...
            </span>
          ) : (
            "Seed Database"
          )}
        </Button>
      </CardContent>
      {result && (
        <CardFooter className={result.success ? "text-green-600" : "text-red-600"}>
          <p>{result.message}</p>
        </CardFooter>
      )}
    </Card>
  )
}

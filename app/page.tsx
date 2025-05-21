import type { Metadata } from "next/types"
import About from "@/components/about"
import Contact from "@/components/contact"
import Experience from "@/components/experience"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Navbar from "@/components/navbar"
import Education from "@/components/education"
import Certifications from "@/components/certifications"
import Footer from "@/components/footer"
import WelcomePopup from "@/components/welcome-popup"
import { getSupabaseServerClient } from "@/utils/supabase-client"
import Achievements from "@/components/achievements"

export const metadata: Metadata = {
  title: "G V R Nishchal Reddy - Portfolio",
  description: "G V R Nishchal Reddy's Portfolio Website",
}

// Function to fetch portfolio data from Supabase
async function getPortfolioData() {
  const supabase = getSupabaseServerClient()
  let aboutData = null
  let contactData = null
  let educationData = []
  let experienceData = []
  let experienceDescriptions = []
  let customCategories = []
  let technicalSkills = []
  let softSkills = []
  let projectsData = []
  let projectFeatures = []
  let projectTechnologies = []
  let certificationsData = []
  let achievementsData = []

  try {
    // Fetch about data
    try {
      const { data: aboutResult, error: aboutError } = await supabase
        .from("about")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!aboutError) {
        aboutData = aboutResult
      } else {
        console.error("Error fetching about data:", aboutError)
      }
    } catch (error) {
      console.error("Exception fetching about data:", error)
    }

    // Fetch contact data
    try {
      const { data: contactResult, error: contactError } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!contactError) {
        contactData = contactResult
      } else {
        console.error("Error fetching contact data:", contactError)
      }
    } catch (error) {
      console.error("Exception fetching contact data:", error)
    }

    // Fetch education data
    try {
      const { data: educationResult, error: educationError } = await supabase
        .from("education")
        .select("*")
        .order("start_year", { ascending: false })

      if (!educationError) {
        educationData = educationResult || []
      } else {
        console.error("Error fetching education data:", educationError)
      }
    } catch (error) {
      console.error("Exception fetching education data:", error)
    }

    // Fetch experience data
    try {
      const { data: experienceResult, error: experienceError } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false })

      if (!experienceError) {
        experienceData = experienceResult || []
      } else {
        console.error("Error fetching experience data:", experienceError)
      }
    } catch (error) {
      console.error("Exception fetching experience data:", error)
    }

    // Fetch experience descriptions
    try {
      const { data: descriptionsResult, error: descriptionsError } = await supabase
        .from("experience_description")
        .select("*")
        .order("display_order", { ascending: true })

      if (!descriptionsError) {
        experienceDescriptions = descriptionsResult || []
      } else {
        console.error("Error fetching experience descriptions:", descriptionsError)
      }
    } catch (error) {
      console.error("Exception fetching experience descriptions:", error)
    }

    // Fetch custom categories - IMPORTANT: Fetch this first before technical skills
    try {
      const { data: categoriesResult, error: categoriesError } = await supabase
        .from("custom_skill_category")
        .select("*")
        .order("name", { ascending: true })

      if (!categoriesError) {
        customCategories = categoriesResult || []
      } else {
        console.error("Error fetching custom categories:", categoriesError)
      }
    } catch (error) {
      console.error("Exception fetching custom categories:", error)
    }

    // Fetch technical skills - first try with join, fallback to simple query
    try {
      const { data: technicalResult, error: technicalError } = await supabase
        .from("technical_skill")
        .select(`
          *,
          custom_category:custom_category_id(id, name, icon, color)
        `)
        .order("name", { ascending: true })

      if (!technicalError) {
        technicalSkills = technicalResult || []
      } else {
        throw technicalError
      }
    } catch (joinError) {
      console.error("Error with join query for technical skills:", joinError)

      // Fallback to simple query without join
      try {
        const { data: fallbackResult, error: fallbackError } = await supabase
          .from("technical_skill")
          .select("*")
          .order("name", { ascending: true })

        if (!fallbackError) {
          technicalSkills = fallbackResult || []
        } else {
          console.error("Error with fallback query for technical skills:", fallbackError)
        }
      } catch (fallbackError) {
        console.error("Exception in fallback query for technical skills:", fallbackError)
      }
    }

    // Fetch soft skills
    try {
      const { data: softResult, error: softError } = await supabase
        .from("soft_skill")
        .select("*")
        .order("name", { ascending: true })

      if (!softError) {
        softSkills = softResult || []
      } else {
        console.error("Error fetching soft skills:", softError)
      }
    } catch (error) {
      console.error("Exception fetching soft skills:", error)
      // Provide fallback data for soft skills if fetch fails
      softSkills = [
        { id: "fallback-1", name: "Communication", level: 90 },
        { id: "fallback-2", name: "Teamwork", level: 85 },
        { id: "fallback-3", name: "Problem Solving", level: 95 },
        { id: "fallback-4", name: "Adaptability", level: 90 },
        { id: "fallback-5", name: "Leadership", level: 80 },
      ]
    }

    // Fetch projects
    try {
      const { data: projectsResult, error: projectsError } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false })

      if (!projectsError) {
        projectsData = projectsResult || []
      } else {
        console.error("Error fetching projects:", projectsError)
      }
    } catch (error) {
      console.error("Exception fetching projects:", error)
    }

    // Fetch project features
    try {
      const { data: featuresResult, error: featuresError } = await supabase
        .from("project_feature")
        .select("*")
        .order("display_order", { ascending: true })

      if (!featuresError) {
        projectFeatures = featuresResult || []
      } else {
        console.error("Error fetching project features:", featuresError)
      }
    } catch (error) {
      console.error("Exception fetching project features:", error)
    }

    // Fetch project technologies
    try {
      const { data: technologiesResult, error: technologiesError } = await supabase
        .from("project_technology")
        .select("*")
        .order("display_order", { ascending: true })

      if (!technologiesError) {
        projectTechnologies = technologiesResult || []
      } else {
        console.error("Error fetching project technologies:", technologiesError)
      }
    } catch (error) {
      console.error("Exception fetching project technologies:", error)
    }

    // Fetch certifications
    try {
      const { data: certificationsResult, error: certificationsError } = await supabase
        .from("certification")
        .select("*")
        .order("date", { ascending: false })

      if (!certificationsError) {
        certificationsData = certificationsResult || []
      } else {
        console.error("Error fetching certifications:", certificationsError)
      }
    } catch (error) {
      console.error("Exception fetching certifications:", error)
    }

    // Fetch achievements
    try {
      const { data: achievementsResult, error: achievementsError } = await supabase
        .from("achievement")
        .select("*")
        .order("date", { ascending: false })

      if (!achievementsError) {
        achievementsData = achievementsResult || []
      } else {
        console.error("Error fetching achievements:", achievementsError)
      }
    } catch (error) {
      console.error("Exception fetching achievements:", error)
    }
  } catch (error) {
    console.error("Error in getPortfolioData:", error)
  }

  // Process experience data to include descriptions
  const processedExperience =
    experienceData?.map((exp) => {
      // Find all descriptions for this experience
      const descriptions =
        experienceDescriptions?.filter((desc) => desc.experience_id === exp.id)?.map((desc) => desc.description) || []

      return {
        id: exp.id,
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.start_date,
        endDate: exp.end_date,
        current: exp.current,
        description: descriptions,
      }
    }) || []

  // Process technical skills with custom categories
  const processedTechnicalSkills = technicalSkills.map((skill) => {
    // If this skill has a custom category ID
    if (skill.custom_category_id) {
      // First try to get the category from the join result
      let customCategory = skill.custom_category

      // If join didn't work, find the category manually
      if (!customCategory) {
        customCategory = customCategories.find((cat) => cat.id === skill.custom_category_id)
      }

      if (customCategory) {
        return {
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: customCategory.name,
          custom_category_id: skill.custom_category_id,
          customCategory: {
            id: customCategory.id,
            name: customCategory.name,
            icon: customCategory.icon,
            color: customCategory.color,
          },
        }
      }
    }

    // Regular category or fallback if custom category not found
    return {
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category || "Other",
    }
  })

  // Map education data to the format expected by the Education component
  const mappedEducationData = educationData.map((item) => ({
    id: item.id,
    degree: item.degree,
    institution: item.institution,
    location: item.location,
    startYear: item.start_year,
    endYear: item.end_year,
    grade: item.grade,
    specialization: item.specialization,
  }))

  // Add a timestamp to force cache busting
  const timestamp = new Date().getTime()

  return {
    about: {
      bio: aboutData?.bio || "",
      name: aboutData?.name || "G V R Nishchal Reddy",
      image_url: aboutData?.image_url || "",
      email: contactData?.email || "",
      phone: contactData?.phone || "",
      location: contactData?.location || "",
    },
    contact: contactData || { email: "", phone: "", location: "" },
    education: mappedEducationData,
    experience: processedExperience,
    skills: {
      technical: processedTechnicalSkills || [],
      soft: softSkills || [],
      customCategories: customCategories || [],
      timestamp: timestamp, // Add timestamp to force re-render
    },
    projects: {
      items: projectsData || [],
      features: projectFeatures || [],
      technologies: projectTechnologies || [],
    },
    certifications: certificationsData || [],
    achievements: achievementsData || [],
  }
}

// Add cache control to prevent caching
export const revalidate = 0

export default async function Home() {
  const portfolioData = await getPortfolioData()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About data={portfolioData.about} />
      <Skills data={portfolioData.skills} />
      <Education data={portfolioData.education} />
      <Experience data={portfolioData.experience} />
      <Projects data={portfolioData.projects} />
      {portfolioData?.certifications && portfolioData.certifications.length > 0 && (
        <Certifications data={portfolioData.certifications} />
      )}
      {portfolioData?.achievements && portfolioData.achievements.length > 0 && (
        <Achievements data={portfolioData.achievements} />
      )}
      <Contact data={portfolioData.contact} />
      <Footer />
      <WelcomePopup />
    </main>
  )
}

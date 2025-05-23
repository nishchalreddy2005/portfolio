import { getSupabaseBrowserClient } from "@/utils/supabase-client"
import type { ProfileData } from "./local-storage-service"

export interface CustomCategory {
  id: string
  name: string
  icon?: string
  color?: string
}

// Helper function to format date from YYYY-MM to Month YYYY if needed
function formatDateIfNeeded(dateString: string): string {
  if (!dateString) return ""

  // If the date already has a space (like "January 2023"), assume it's already formatted
  if (dateString.includes(" ")) return dateString

  // Check if it's in YYYY-MM format
  const parts = dateString.split("-")
  if (parts.length !== 2) return dateString

  const year = parts[0]
  const month = parts[1]

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

  const monthIndex = Number.parseInt(month) - 1
  if (monthIndex < 0 || monthIndex >= 12) return dateString

  return `${monthNames[monthIndex]} ${year}`
}

// Function to fetch all portfolio data
export async function fetchPortfolioData(): Promise<ProfileData> {
  console.log("Fetching portfolio data from Supabase...")
  const supabase = getSupabaseBrowserClient()

  try {
    // Fetch about data
    const { data: aboutData, error: aboutError } = await supabase
      .from("about")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (aboutError && aboutError.code !== "PGRST116") {
      console.error("Error fetching about data:", aboutError)
    }

    // Fetch contact data
    const { data: contactData, error: contactError } = await supabase
      .from("contact")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (contactError && contactError.code !== "PGRST116") {
      console.error("Error fetching contact data:", contactError)
    }

    // Fetch education data
    const { data: educationData, error: educationError } = await supabase
      .from("education")
      .select("*")
      .order("start_year", { ascending: false })

    if (educationError) {
      console.error("Error fetching education data:", educationError)
    }

    // Fetch experience data
    const { data: experienceData, error: experienceError } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false })

    if (experienceError) {
      console.error("Error fetching experience data:", experienceError)
    }

    // Fetch experience descriptions
    const { data: experienceDescriptions, error: descriptionsError } = await supabase
      .from("experience_description")
      .select("*")
      .order("display_order", { ascending: true })

    if (descriptionsError) {
      console.error("Error fetching experience descriptions:", descriptionsError)
    }

    // Fetch custom categories
    const { data: customCategories, error: customCategoriesError } = await supabase
      .from("custom_skill_category")
      .select("*")
      .order("name", { ascending: true })

    if (customCategoriesError) {
      console.error("Error fetching custom categories:", customCategoriesError)
    }

    // Fetch technical skills
    const { data: technicalSkills, error: technicalError } = await supabase
      .from("technical_skill")
      .select(`
        *,
        custom_category:custom_category_id(id, name, icon, color)
      `)
      .order("name", { ascending: true })

    if (technicalError) {
      console.error("Error fetching technical skills:", technicalError)
    }

    // Fetch soft skills
    let softSkills = []
    try {
      const { data: softSkillsData, error: softError } = await supabase
        .from("soft_skill")
        .select("*")
        .order("name", { ascending: true })

      if (softError) {
        console.error("Error fetching soft skills:", softError)
        // Provide fallback data
        softSkills = [
          { id: "fallback-1", name: "Communication", level: 90 },
          { id: "fallback-2", name: "Teamwork", level: 85 },
          { id: "fallback-3", name: "Problem Solving", level: 95 },
          { id: "fallback-4", name: "Adaptability", level: 90 },
          { id: "fallback-5", name: "Leadership", level: 80 },
        ]
      } else {
        softSkills = softSkillsData || []
      }
    } catch (error) {
      console.error("Exception in soft skills fetch:", error)
      // Provide fallback data
      softSkills = [
        { id: "fallback-1", name: "Communication", level: 90 },
        { id: "fallback-2", name: "Teamwork", level: 85 },
        { id: "fallback-3", name: "Problem Solving", level: 95 },
        { id: "fallback-4", name: "Adaptability", level: 90 },
        { id: "fallback-5", name: "Leadership", level: 80 },
      ]
    }

    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase
      .from("project")
      .select("*")
      .order("created_at", { ascending: false })

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
    }

    // Fetch project technologies
    const { data: projectTechnologies, error: technologiesError } = await supabase
      .from("project_technology")
      .select("*")
      .order("display_order", { ascending: true })

    if (technologiesError) {
      console.error("Error fetching project technologies:", technologiesError)
    }

    // Fetch certifications
    const { data: certificationsData, error: certificationsError } = await supabase
      .from("certification")
      .select("*")
      .order("date", { ascending: false })

    if (certificationsError) {
      console.error("Error fetching certifications:", certificationsError)
    }

    // Fetch achievements
    const { data: achievementsData, error: achievementsError } = await supabase
      .from("achievement")
      .select("*")
      .order("date", { ascending: false })

    if (achievementsError) {
      console.error("Error fetching achievements:", achievementsError)
    }

    // Fetch project categories
    const { data: projectCategories, error: categoriesError } = await supabase
      .from("project_category")
      .select("*")
      .order("name", { ascending: true })

    if (categoriesError) {
      console.error("Error fetching project categories:", categoriesError)
    }

    // Process experience data to include descriptions
    const processedExperience =
      experienceData?.map((exp) => {
        const descriptions =
          experienceDescriptions?.filter((desc) => desc.experience_id === exp.id)?.map((desc) => desc.description) || []

        return {
          id: exp.id,
          title: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: formatDateIfNeeded(exp.start_date), // Format the date
          endDate: formatDateIfNeeded(exp.end_date), // Format the date
          current: exp.current,
          description: descriptions,
        }
      }) || []

    // When processing projects, include teamType
    const processedProjects =
      projectsData?.map((project) => {
        const technologies =
          projectTechnologies?.filter((tech) => tech.project_id === project.id)?.map((tech) => tech.technology) || []

        return {
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          image: project.image,
          github: project.github,
          demo: project.demo,
          linkedin: project.linkedin,
          teamType: project.team_type || "solo", // Map team_type from database to teamType in frontend
          technologies,
        }
      }) || []

    // Process technical skills with custom categories
    const processedTechnicalSkills =
      technicalSkills?.map((skill) => {
        if (skill.custom_category_id) {
          let customCategory = skill.custom_category

          if (!customCategory) {
            customCategory = customCategories?.find((cat) => cat.id === skill.custom_category_id)
          }

          if (customCategory) {
            return {
              id: skill.id,
              name: skill.name,
              level: skill.level,
              category: customCategory.name || "Custom",
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

        return {
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category || "Other",
          custom_category_id: null,
          customCategory: undefined,
        }
      }) || []

    // Create the profile data object
    const timestamp = new Date().getTime()

    // Get image_url from localStorage if not in database
    let imageUrl = aboutData?.image_url || ""
    if (!imageUrl && typeof window !== "undefined") {
      imageUrl = localStorage.getItem("profile_image_url") || ""
      console.log("Retrieved image URL from localStorage:", imageUrl)
    }

    // Get name from localStorage if needed
    let name = aboutData?.name || ""
    if (!name && typeof window !== "undefined") {
      name = localStorage.getItem("profile_name") || ""
      console.log("Retrieved name from localStorage:", name)
    }

    const profileData: ProfileData = {
      about: {
        bio: aboutData?.bio || "",
        image_url: imageUrl,
        name: name,
      },
      contact: {
        email: contactData?.email || "",
        phone: contactData?.phone || "",
        location: contactData?.location || "",
      },
      education:
        educationData?.map((edu) => ({
          id: edu.id,
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location,
          startYear: edu.start_year || "",
          endYear: edu.end_year || "",
          grade: edu.grade,
          specialization: edu.specialization,
        })) || [],
      skills: {
        technical: processedTechnicalSkills,
        soft:
          softSkills?.map((skill) => ({
            id: skill.id,
            name: skill.name,
            level: skill.level,
          })) || [],
        customCategories:
          customCategories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
          })) || [],
        timestamp: timestamp,
      },
      experience: processedExperience,
      // Include project categories in the returned data
      // Update the projects field in the profileData object:
      projects: {
        items: processedProjects,
        technologies: projectTechnologies || [],
        categories: projectCategories || [],
      },
      certifications:
        certificationsData?.map((cert) => ({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          certificateUrl: cert.certificate_url,
        })) || [],
      // Add this to the profileData object in the fetchPortfolioData function
      achievements:
        achievementsData?.map((achievement) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          issuer: achievement.issuer,
          url: achievement.url,
        })) || [],
    }

    return profileData
  } catch (error) {
    console.error("Error in fetchPortfolioData:", error)
    throw error
  }
}

// Update the updateAbout function to handle the missing image_url column

// Replace the existing updateAbout function with this version:
export async function updateAbout(about: {
  bio: string
  name?: string
  email?: string
  phone?: string
  location?: string
  image_url?: string
}) {
  const supabase = getSupabaseBrowserClient()

  try {
    // First, get the existing about record to get its ID
    const { data: existingAbout, error: fetchError } = await supabase
      .from("about")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching about record:", fetchError)
      throw fetchError
    }

    // Only include bio in the database update - this is the only field we know exists
    const aboutData = {
      bio: about.bio,
    }

    // Store name and image_url in localStorage
    if (typeof window !== "undefined") {
      if (about.name) localStorage.setItem("profile_name", about.name)
      if (about.image_url) localStorage.setItem("profile_image_url", about.image_url)
    }

    if (!existingAbout) {
      // If no record exists, create a new one with just the bio
      const { error: insertError } = await supabase.from("about").insert(aboutData)

      if (insertError) {
        console.error("Error creating about record:", insertError)
        throw insertError
      }
    } else {
      // Update the existing record using its UUID - only update bio
      const { error: bioError } = await supabase.from("about").update(aboutData).eq("id", existingAbout.id)

      if (bioError) {
        console.error("Error updating about bio:", bioError)
        throw bioError
      }
    }

    // Update contact information if provided
    if (about.email || about.phone || about.location) {
      // First, get the existing contact record to get its ID
      const { data: existingContact, error: fetchContactError } = await supabase
        .from("contact")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (fetchContactError && fetchContactError.code !== "PGRST116") {
        console.error("Error fetching contact record:", fetchContactError)
        throw fetchContactError
      }

      const contactData: any = {}
      if (about.email) contactData.email = about.email
      if (about.phone) contactData.phone = about.phone
      if (about.location) contactData.location = about.location

      if (!existingContact) {
        // If no record exists, create a new one
        const { error: insertContactError } = await supabase.from("contact").insert(contactData)

        if (insertContactError) {
          console.error("Error creating contact record:", insertContactError)
          throw insertContactError
        }
      } else {
        // Update the existing record using its UUID
        const { error: contactError } = await supabase.from("contact").update(contactData).eq("id", existingContact.id)

        if (contactError) {
          console.error("Error updating contact info:", contactError)
          throw contactError
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateAbout:", error)
    throw error
  }
}

// Update the updateCertifications function to properly handle the data

// Certifications
export async function updateCertifications(certifications: any[]) {
  const supabase = getSupabaseBrowserClient()

  try {
    console.log("Updating certifications in Supabase:", certifications)

    // Delete all existing certifications
    const { error: deleteError } = await supabase
      .from("certification")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      console.error("Error deleting existing certifications:", deleteError)
      throw deleteError
    }

    // Then, insert the new certifications
    if (certifications.length > 0) {
      // Make sure all certifications have the required fields
      const processedCertifications = certifications.map((cert) => {
        return {
          id: cert.id, // ID is now required and should be a valid UUID
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date || null,
          certificate_url: cert.certificate_url || cert.certificateUrl || null,
        }
      })

      const { error } = await supabase.from("certification").insert(processedCertifications)

      if (error) {
        console.error("Error inserting certifications:", error)
        throw error
      }
    }

    console.log("Certifications updated successfully")
  } catch (error) {
    console.error("Error updating certifications:", error)
    throw error
  }
}

// Contact
export async function updateContact(contact: { email: string; phone: string; location: string }) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("contact").update(contact).eq("id", 1)

  if (error) {
    console.error("Error updating contact:", error)
    throw error
  }
}

// Custom Categories
export async function createCustomCategory(category: Omit<CustomCategory, "id">): Promise<CustomCategory> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("custom_skill_category").insert([category]).select("*").single()

  if (error) {
    console.error("Error creating custom category:", error)
    throw error
  }

  return data as CustomCategory
}

export async function updateCustomCategory(category: CustomCategory) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("custom_skill_category").update(category).eq("id", category.id)

  if (error) {
    console.error("Error updating custom category:", error)
    throw error
  }
}

export async function deleteCustomCategory(id: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("custom_skill_category").delete().eq("id", id)

  if (error) {
    console.error("Error deleting custom category:", error)
    throw error
  }
}

export async function fetchCustomCategories(): Promise<CustomCategory[]> {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("custom_skill_category").select("*").order("name")

  if (error) {
    console.error("Error fetching custom categories:", error)
    throw error
  }

  return data as CustomCategory[]
}

// Education
export async function updateEducation(education: any[]) {
  const supabase = getSupabaseBrowserClient()

  // First, delete existing education data to avoid duplicates
  await supabase.from("education").delete().gt("id", 0)

  // Then, insert the new education data
  const { error } = await supabase.from("education").insert(education)

  if (error) {
    console.error("Error updating education:", error)
    throw error
  }
}

// Experience
export async function updateExperience(data: any[]): Promise<void> {
  const supabase = getSupabaseBrowserClient()

  try {
    // Get existing experience items
    const { data: existingData, error: fetchError } = await supabase.from("experience").select("id")

    if (fetchError) {
      throw new Error(`Error fetching experience data: ${fetchError.message}`)
    }

    // Create a map of existing IDs
    const existingIds = new Set(existingData?.map((item) => item.id) || [])

    // Process each experience item
    for (const item of data) {
      let experienceId = item.id

      // Prepare the experience data without descriptions
      const experienceData = {
        title: item.title,
        company: item.company,
        location: item.location,
        start_date: item.start_date,
        end_date: item.end_date,
        current: item.current,
      }

      if (experienceId && existingIds.has(experienceId)) {
        // Update existing item
        const { error } = await supabase.from("experience").update(experienceData).eq("id", experienceId)

        if (error) {
          throw new Error(`Error updating experience item: ${error.message}`)
        }

        // Remove from set to track what's been processed
        existingIds.delete(experienceId)
      } else {
        // Insert new item
        const { data: newExperience, error } = await supabase
          .from("experience")
          .insert(experienceData)
          .select("id")
          .single()

        if (error) {
          throw new Error(`Error inserting experience item: ${error.message}`)
        }

        experienceId = newExperience.id
      }

      // Handle descriptions for this experience
      if (experienceId && item.descriptions) {
        // Delete existing descriptions for this experience
        await supabase.from("experience_description").delete().eq("experience_id", experienceId)

        // Insert new descriptions
        if (item.descriptions.length > 0) {
          const descriptionsToInsert = item.descriptions.map((desc: string, index: number) => ({
            experience_id: experienceId,
            description: desc,
            display_order: index,
          }))

          const { error: descError } = await supabase.from("experience_description").insert(descriptionsToInsert)

          if (descError) {
            throw new Error(`Error inserting experience descriptions: ${descError.message}`)
          }
        }
      }
    }

    // Delete items that weren't in the update
    if (existingIds.size > 0) {
      const { error } = await supabase.from("experience").delete().in("id", Array.from(existingIds))

      if (error) {
        throw new Error(`Error deleting experience items: ${error.message}`)
      }
    }
  } catch (error) {
    console.error("Error updating experience:", error)
    throw error
  }
}

// Update the updateProjects function to handle category_id
export async function updateProjects(projects: any[]) {
  const supabase = getSupabaseBrowserClient()

  try {
    // Get existing projects
    const { data: existingData, error: fetchError } = await supabase.from("project").select("id")

    if (fetchError) {
      throw new Error(`Error fetching project data: ${fetchError.message}`)
    }

    // Create a map of existing IDs
    const existingIds = new Set(existingData?.map((item) => item.id) || [])

    // Process each project
    for (const item of projects) {
      let projectId = item.id

      // Prepare the project data without technologies
      const projectData = {
        title: item.title,
        category: item.category, // Keep for backward compatibility
        category_id: item.category_id ? Number.parseInt(item.category_id) : null, // Ensure it's an integer
        project_type: item.projectType || null, // Add project_type field
        description: item.description,
        image: item.image,
        github: item.github,
        demo: item.demo,
        linkedin: item.linkedin,
        team_type: item.teamType || "solo", // Map teamType from frontend to team_type in database
      }

      if (projectId && existingIds.has(projectId)) {
        // Update existing project
        const { error } = await supabase.from("project").update(projectData).eq("id", projectId)

        if (error) {
          throw new Error(`Error updating project: ${error.message}`)
        }

        // Remove from set to track what's been processed
        existingIds.delete(projectId)
      } else {
        // Insert new project
        const { data: newProject, error } = await supabase.from("project").insert(projectData).select("id").single()

        if (error) {
          throw new Error(`Error inserting project: ${error.message}`)
        }

        projectId = newProject.id
      }

      // Handle technologies for this project
      if (projectId && item.technologies) {
        // Delete existing technologies for this project
        await supabase.from("project_technology").delete().eq("project_id", projectId)

        // Insert new technologies
        if (item.technologies.length > 0) {
          const technologiesToInsert = item.technologies.map((tech: string, index: number) => ({
            project_id: projectId,
            technology: tech,
            display_order: index,
          }))

          const { error: techError } = await supabase.from("project_technology").insert(technologiesToInsert)

          if (techError) {
            throw new Error(`Error inserting project technologies: ${techError.message}`)
          }
        }
      }
    }

    // Delete projects that weren't in the update
    if (existingIds.size > 0) {
      const { error } = await supabase.from("project").delete().in("id", Array.from(existingIds))

      if (error) {
        throw new Error(`Error deleting projects: ${error.message}`)
      }
    }
  } catch (error) {
    console.error("Error updating projects:", error)
    throw error
  }
}

// Skills
export async function updateSkills(skills: any) {
  const supabase = getSupabaseBrowserClient()

  try {
    // Handle technical skills
    const { data: existingTechnical, error: fetchTechnicalError } = await supabase
      .from("technical_skill")
      .select("id, name")

    if (fetchTechnicalError) {
      console.error(`Error fetching technical skills: ${fetchTechnicalError.message}`)
      throw new Error(`Error fetching technical skills: ${fetchTechnicalError.message}`)
    }

    const existingTechnicalIds = new Set(existingTechnical?.map((item) => item.id) || [])

    // Create a map of existing skill names to detect duplicates
    const existingTechnicalNames = new Map()
    existingTechnical?.forEach((skill) => {
      existingTechnicalNames.set(skill.name.toLowerCase().trim(), skill.id)
    })

    // Track which IDs we've processed to know which ones to delete
    const processedTechnicalIds = new Set()

    // Process each technical skill
    for (const skill of skills.technical) {
      // Check if this is a duplicate by name (for new skills)
      const normalizedName = skill.name.toLowerCase().trim()
      const existingIdWithSameName = existingTechnicalNames.get(normalizedName)

      // Determine if using predefined or custom category
      const skillData = {
        name: skill.name,
        level: skill.level,
        category: skill.category || "Custom", // Always provide a category, never null
        custom_category_id: skill.custom_category_id || null,
      }

      console.log("Processing technical skill:", skillData)

      try {
        // If this is an existing skill by ID
        if (skill.id && existingTechnicalIds.has(skill.id)) {
          // Update existing skill
          const { error } = await supabase.from("technical_skill").update(skillData).eq("id", skill.id)

          if (error) {
            console.error(`Error updating technical skill: ${error.message}`)
          } else {
            // Mark this ID as processed
            processedTechnicalIds.add(skill.id)
          }
        }
        // If this is a new skill but a duplicate name exists
        else if (existingIdWithSameName && !skill.id.toString().startsWith("new-")) {
          // Update the existing skill with the same name
          const { error } = await supabase.from("technical_skill").update(skillData).eq("id", existingIdWithSameName)

          if (error) {
            console.error(`Error updating duplicate technical skill: ${error.message}`)
          } else {
            // Mark this ID as processed
            processedTechnicalIds.add(existingIdWithSameName)
          }
        }
        // This is a completely new skill
        else if (skill.name.trim() !== "") {
          // Insert new skill
          const { data: newSkill, error } = await supabase
            .from("technical_skill")
            .insert(skillData)
            .select("id")
            .single()

          if (error) {
            console.error(`Error inserting technical skill: ${error.message}`)
          } else if (newSkill) {
            // Mark this new ID as processed
            processedTechnicalIds.add(newSkill.id)
          }

          // Add this name to our map to prevent future duplicates in this batch
          existingTechnicalNames.set(normalizedName, "pending-insert")
        }
      } catch (skillError) {
        console.error("Error processing skill:", skillError)
        // Continue with other skills instead of stopping the whole process
      }
    }

    // Delete technical skills that weren't in the update
    const technicalSkillsToDelete = Array.from(existingTechnicalIds).filter((id) => !processedTechnicalIds.has(id))

    if (technicalSkillsToDelete.length > 0) {
      console.log("Deleting technical skills:", technicalSkillsToDelete)
      const { error: deleteError } = await supabase.from("technical_skill").delete().in("id", technicalSkillsToDelete)

      if (deleteError) {
        console.error(`Error deleting technical skills: ${deleteError.message}`)
        throw new Error(`Error deleting technical skills: ${deleteError.message}`)
      }
    }

    // Handle soft skills
    const { data: existingSoft, error: fetchSoftError } = await supabase.from("soft_skill").select("id, name")

    if (fetchSoftError) {
      console.error(`Error fetching soft skills: ${fetchSoftError.message}`)
      throw new Error(`Error fetching soft skills: ${fetchSoftError.message}`)
    }

    const existingSoftIds = new Set(existingSoft?.map((item) => item.id) || [])

    // Create a map of existing soft skill names to detect duplicates
    const existingSoftNames = new Map()
    existingSoft?.forEach((skill) => {
      existingSoftNames.set(skill.name.toLowerCase().trim(), skill.id)
    })

    // Track which soft skill IDs we've processed
    const processedSoftIds = new Set()

    // Process each soft skill
    for (const skill of skills.soft) {
      try {
        // Check if this is a duplicate by name (for new skills)
        const normalizedName = skill.name.toLowerCase().trim()
        const existingIdWithSameName = existingSoftNames.get(normalizedName)

        if (skill.id && existingSoftIds.has(skill.id)) {
          // Update existing skill
          const { error } = await supabase
            .from("soft_skill")
            .update({
              name: skill.name,
              level: skill.level,
            })
            .eq("id", skill.id)

          if (error) {
            console.error(`Error updating soft skill: ${error.message}`)
          } else {
            processedSoftIds.add(skill.id)
          }
        }
        // If this is a new skill but a duplicate name exists
        else if (existingIdWithSameName && !skill.id.toString().startsWith("new-")) {
          // Update the existing skill with the same name
          const { error } = await supabase
            .from("soft_skill")
            .update({
              name: skill.name,
              level: skill.level,
            })
            .eq("id", existingIdWithSameName)

          if (error) {
            console.error(`Error updating duplicate soft skill: ${error.message}`)
          } else {
            processedSoftIds.add(existingIdWithSameName)
          }
        } else if (skill.name.trim() !== "") {
          // Insert new skill
          const { data: newSkill, error } = await supabase
            .from("soft_skill")
            .insert({
              name: skill.name,
              level: skill.level,
            })
            .select("id")
            .single()

          if (error) {
            console.error(`Error inserting soft skill: ${error.message}`)
          } else if (newSkill) {
            processedSoftIds.add(newSkill.id)
          }

          // Add this name to our map to prevent future duplicates in this batch
          existingSoftNames.set(normalizedName, "pending-insert")
        }
      } catch (skillError) {
        console.error("Error processing soft skill:", skillError)
      }
    }

    // Delete soft skills that weren't in the update
    const softSkillsToDelete = Array.from(existingSoftIds).filter((id) => !processedSoftIds.has(id))

    if (softSkillsToDelete.length > 0) {
      console.log("Deleting soft skills:", softSkillsToDelete)
      const { error: deleteError } = await supabase.from("soft_skill").delete().in("id", softSkillsToDelete)

      if (deleteError) {
        console.error(`Error deleting soft skills: ${deleteError.message}`)
        throw new Error(`Error deleting soft skills: ${deleteError.message}`)
      }
    }
  } catch (error) {
    console.error("Error in updateSkills:", error)
    throw error
  }
}

// Achievements
export async function updateAchievements(achievements: any[]) {
  const supabase = getSupabaseBrowserClient()

  try {
    console.log("Updating achievements in Supabase:", achievements)

    // Delete all existing achievements
    const { error: deleteError } = await supabase
      .from("achievement")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      console.error("Error deleting existing achievements:", deleteError)
      throw deleteError
    }

    // Then, insert the new achievements
    if (achievements.length > 0) {
      // Make sure all achievements have the required fields
      const processedAchievements = achievements.map((achievement) => {
        return {
          id: achievement.id, // ID is required and should be a valid UUID
          title: achievement.title,
          description: achievement.description || null,
          date: achievement.date || null,
          issuer: achievement.issuer || null,
          url: achievement.url || null,
        }
      })

      const { error } = await supabase.from("achievement").insert(processedAchievements)

      if (error) {
        console.error("Error inserting achievements:", error)
        throw error
      }
    }

    console.log("Achievements updated successfully")
  } catch (error) {
    console.error("Error updating achievements:", error)
    throw error
  }
}

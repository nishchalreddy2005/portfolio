"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Home, AlertTriangle, Loader2 } from "lucide-react"
import { getProfileData } from "@/utils/local-storage-service"
import { defaultProfileData } from "@/utils/local-storage-service"
import type { ProfileData } from "@/utils/local-storage-service"

// Import form components
import AboutForm from "@/components/admin/profile/about-form"
import EducationForm from "@/components/admin/profile/education-form"
import ContactForm from "@/components/admin/profile/contact-form"
import SkillsForm from "@/components/admin/profile/skills-form"
import ExperienceForm from "@/components/admin/profile/experience-form"
import ProjectsForm from "@/components/admin/profile/projects-form"
import CertificationsForm from "@/components/admin/profile/certifications-form"
import AchievementsForm from "@/components/admin/profile/achievements-form"
import SettingsForm from "@/components/admin/profile/settings-form"

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState("about")
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Load profile data from Supabase if available, otherwise from localStorage
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Try to import the fetchPortfolioData function
        const { fetchPortfolioData } = await import("@/utils/supabase-data-service")
        const data = await fetchPortfolioData()
        console.log("Data loaded from Supabase:", data)

        // Check if education data is empty and use default if needed
        if (!data.education || data.education.length < 4) {
          console.log("Missing education data from Supabase, using default education data")
          data.education = defaultProfileData.education
        }

        // Add this logging to see what education data we have
        console.log("Education data after processing:", data.education)

        // Ensure projects has the expected structure
        if (!data.projects || !data.projects.items) {
          console.log("Missing or invalid projects data, initializing with empty array")
          data.projects = {
            items: [],
            categories: [],
            features: [],
            technologies: [],
          }
        }

        // Ensure settings has the expected structure
        if (!data.settings) {
          console.log("Missing settings data, initializing with default")
          data.settings = defaultProfileData.settings
        }

        setProfileData(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching from Supabase, falling back to localStorage:", error)
        setError("Failed to load data from Supabase. Using local data instead.")

        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const data = getProfileData()
          console.log("Data loaded from localStorage:", data)
          setProfileData(data)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/")
  }

  // Handle data updates from child components
  const handleDataUpdate = (newData: ProfileData) => {
    setProfileData(newData)
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully",
      variant: "default",
      className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      duration: 2000, // 2 seconds
    })
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading profile data</AlertTitle>
          <AlertDescription>
            Could not load your profile data. Please try refreshing the page or contact support.
          </AlertDescription>
          <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile Editor</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" /> View Portfolio
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {error && (
          <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutForm
              initialData={profileData.about}
              onSave={(data) => handleDataUpdate({ ...profileData, about: data })}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationForm
              initialData={profileData.education}
              onSave={(data) => handleDataUpdate({ ...profileData, education: data })}
            />
          </TabsContent>

          <TabsContent value="contact">
            <ContactForm
              initialData={profileData.contact}
              onSave={(data) => handleDataUpdate({ ...profileData, contact: data })}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsForm
              initialData={profileData.skills}
              onSave={(data) => handleDataUpdate({ ...profileData, skills: data })}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceForm
              initialData={profileData.experience}
              onSave={(data) => handleDataUpdate({ ...profileData, experience: data })}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsForm
              initialData={profileData.projects}
              onSave={(data) => handleDataUpdate({ ...profileData, projects: data })}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationsForm
              initialData={profileData.certifications}
              onSave={(data) => handleDataUpdate({ ...profileData, certifications: data })}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsForm
              initialData={profileData.achievements}
              onSave={(data) => handleDataUpdate({ ...profileData, achievements: data })}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsForm
              initialData={profileData.settings || {}}
              onSave={(data) => handleDataUpdate({ ...profileData, settings: data })}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

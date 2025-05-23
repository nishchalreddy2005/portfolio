import { getSupabaseBrowserClient } from "./supabase-client"
import { getProfileData as getLocalProfileData, updateProfileSection } from "./local-storage-service"
import type { ProfileData } from "./local-storage-service"

// Function to check if Supabase is available
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from("about").select("*").limit(1)

    // If there's no error, Supabase is available
    return !error
  } catch (error) {
    console.error("Error checking Supabase availability:", error)
    return false
  }
}

// Function to get profile data (from Supabase if available, otherwise from localStorage)
export async function getProfileData(): Promise<ProfileData> {
  try {
    const supabaseAvailable = await isSupabaseAvailable()

    if (supabaseAvailable) {
      try {
        // Try to import and use fetchPortfolioData from supabase-data-service
        const { fetchPortfolioData } = await import("./supabase-data-service")
        const data = await fetchPortfolioData()
        console.log("Fetched data from Supabase:", data)
        return data
      } catch (error) {
        console.error("Error fetching from Supabase:", error)
        // Fall back to localStorage
        return getLocalProfileData()
      }
    } else {
      // Fall back to localStorage
      return getLocalProfileData()
    }
  } catch (error) {
    console.error("Error getting profile data:", error)
    // Fall back to localStorage
    return getLocalProfileData()
  }
}

// Function to save profile data (to Supabase if available, otherwise to localStorage)
export async function saveProfileData(section: string, data: any): Promise<void> {
  try {
    const supabaseAvailable = await isSupabaseAvailable()

    if (supabaseAvailable) {
      // Try to save data to Supabase
      // Implementation would go here
    }

    // Always save to localStorage as a backup
    updateProfileSection(section as any, data)
  } catch (error) {
    console.error(`Error saving ${section} data:`, error)
    // Fall back to localStorage
    updateProfileSection(section as any, data)
  }
}

"use client"
import { Layers, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"

interface ProjectCategoriesNavProps {
  onCategoryChange: (category: string) => void
  activeCategory: string
}

export default function ProjectCategoriesNav({ onCategoryChange, activeCategory }: ProjectCategoriesNavProps) {
  const [categories, setCategories] = useState([
    { id: "all", label: "All Projects", icon: <Layers className="h-4 w-4 mr-2" /> },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.from("project_category").select("*").order("name", { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          // Always include "All Projects" as the first option
          const allCategories = [
            { id: "all", label: "All Projects", icon: <Layers className="h-4 w-4 mr-2" /> },
            ...data.map((cat) => ({
              id: cat.id.toString(), // Convert integer ID to string
              label: cat.name,
              icon: <Code className="h-4 w-4 mr-2" />,
            })),
          ]
          setCategories(allCategories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-wrap rounded-lg overflow-hidden bg-[#1a1d29]">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center justify-center py-3 px-6 text-sm font-medium transition-colors",
                activeCategory === category.id
                  ? "bg-black text-white"
                  : "text-gray-300 hover:bg-[#232736] hover:text-white",
              )}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

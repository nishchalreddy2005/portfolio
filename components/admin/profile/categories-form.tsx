"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash, Edit } from "lucide-react"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"

interface Category {
  id: number
  name: string
}

export default function CategoriesForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("project_category").select("*").order("name")

      if (error) {
        throw error
      }

      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load project categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Check if category with same name already exists
      const { data: existingCategories } = await supabase
        .from("project_category")
        .select("id")
        .eq("name", newCategoryName.trim())

      if (existingCategories && existingCategories.length > 0) {
        toast({
          title: "Error",
          description: "A category with this name already exists",
          variant: "destructive",
        })
        return
      }

      // Insert new category
      const { data, error } = await supabase.from("project_category").insert({ name: newCategoryName.trim() }).select()

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Category added successfully",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })

      setNewCategoryName("")
      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async (id: number, name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Check if category with same name already exists (excluding current category)
      const { data: existingCategories } = await supabase
        .from("project_category")
        .select("id")
        .eq("name", name.trim())
        .neq("id", id)

      if (existingCategories && existingCategories.length > 0) {
        toast({
          title: "Error",
          description: "A category with this name already exists",
          variant: "destructive",
        })
        return
      }

      // Update category
      const { error } = await supabase.from("project_category").update({ name: name.trim() }).eq("id", id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Category updated successfully",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })

      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Check if any projects are using this category
      const { data: projects, error: projectsError } = await supabase.from("project").select("id").eq("category_id", id)

      if (projectsError) {
        throw projectsError
      }

      if (projects && projects.length > 0) {
        toast({
          title: "Error",
          description: `Cannot delete category: ${projects.length} project(s) are using this category`,
          variant: "destructive",
        })
        return
      }

      // Delete category
      const { error } = await supabase.from("project_category").delete().eq("id", id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })

      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Categories</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-1"
            />
            <Button onClick={handleAddCategory} disabled={isLoading || !newCategoryName.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-muted-foreground">No categories found. Add your first category above.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                  {editingCategory === category.id ? (
                    <Input
                      value={category.name}
                      onChange={(e) => {
                        const updatedCategories = categories.map((c) =>
                          c.id === category.id ? { ...c, name: e.target.value } : c,
                        )
                        setCategories(updatedCategories)
                      }}
                      className="flex-1 mr-2"
                    />
                  ) : (
                    <span>{category.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingCategory === category.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateCategory(category.id, category.name)}
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category.id)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isLoading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

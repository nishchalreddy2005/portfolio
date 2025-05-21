"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { compressImage, isValidImageUrl } from "@/utils/image-utils"
import { Label } from "@/components/ui/label"

const projectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  projectType: z.string().optional(),
  teamType: z.enum(["solo", "team"]).default("solo"),
  date: z.string().optional(),
  github: z.string().url({
    message: "Please enter a valid URL.",
  }),
  demo: z
    .union([
      z.string().url({
        message: "Please enter a valid URL.",
      }),
      z.string().length(0),
    ])
    .optional(),
  linkedin: z
    .union([
      z.string().url({
        message: "Please enter a valid URL.",
      }),
      z.string().length(0),
    ])
    .optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
})

export default function ProjectsForm() {
  const { toast } = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [technologies, setTechnologies] = useState([])
  const [newTechnology, setNewTechnology] = useState("")
  const [features, setFeatures] = useState([])
  const [newFeature, setNewFeature] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageError, setImageError] = useState("")
  const [categories, setCategories] = useState([])

  // Add a new state for managing categories
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)

  // Add a function to handle adding new categories
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
      setAddingCategory(true)
      const supabase = getSupabaseBrowserClient()

      // Insert the new category - let the database assign the ID
      const { data, error } = await supabase.from("project_category").insert({ name: newCategoryName }).select()

      if (error) {
        console.error("Error adding category:", error)
        throw error
      }

      // Add to local state
      if (data && data.length > 0) {
        setCategories([...categories, { id: data[0].id.toString(), name: data[0].name }])
        setNewCategoryName("")

        toast({
          title: "Success",
          description: "Category added successfully",
        })
      }
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category: " + (error.message || "Unknown error"),
        variant: "destructive",
      })
    } finally {
      setAddingCategory(false)
    }
  }

  // Add a function to fetch categories from the database
  const fetchCategories = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("project_category").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        throw error
      }

      if (data && data.length > 0) {
        // Convert integer IDs to strings for consistency in the UI
        setCategories(data.map((cat) => ({ id: cat.id.toString(), name: cat.name })))
      } else if (data && data.length === 0) {
        // If no categories exist, seed the default ones
        const defaultCategories = [{ name: "Python" }, { name: "MERN" }, { name: "Enterprise" }, { name: "Java" }]

        try {
          const { data: insertedData, error: insertError } = await supabase
            .from("project_category")
            .insert(defaultCategories)
            .select()

          if (insertError) throw insertError

          if (insertedData) {
            setCategories(insertedData.map((cat) => ({ id: cat.id.toString(), name: cat.name })))
          }
        } catch (seedError) {
          console.error("Error seeding default categories:", seedError)
        }
      }
    } catch (error) {
      console.error("Error in fetchCategories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  // Update the useEffect to call fetchCategories
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCategories()
        await fetchProjects()
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadData()
  }, [])

  // Add a function to delete a category
  const handleDeleteCategory = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Projects using this category will need to be reassigned.",
      )
    )
      return

    try {
      const supabase = getSupabaseBrowserClient()

      // Check if any projects are using this category
      const { data: projectsUsingCategory, error: checkError } = await supabase
        .from("project")
        .select("id")
        .eq("category_id", Number.parseInt(id))

      if (checkError) throw checkError

      if (projectsUsingCategory && projectsUsingCategory.length > 0) {
        toast({
          title: "Cannot Delete",
          description: `This category is being used by ${projectsUsingCategory.length} project(s). Please reassign these projects first.`,
          variant: "destructive",
        })
        return
      }

      // If no projects are using this category, proceed with deletion
      const { error } = await supabase.from("project_category").delete().eq("id", Number.parseInt(id))

      if (error) throw error

      // Update local state
      setCategories(categories.filter((cat) => cat.id !== id))

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category: " + (error.message || "Unknown error"),
        variant: "destructive",
      })
    }
  }

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      projectType: "",
      teamType: "solo",
      date: "",
      github: "",
      demo: "",
      linkedin: "",
      image: "",
      technologies: [],
      features: [],
    },
  })

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Fetch projects without trying to join with project_category
      const { data: projects, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch all categories to use for mapping
      const { data: allCategories } = await supabase.from("project_category").select("*")

      // Create a map of category IDs to names
      const categoryMap = {}
      if (allCategories) {
        allCategories.forEach((cat) => {
          categoryMap[cat.id] = cat.name
        })
      }

      // For each project, fetch its technologies
      const enhancedProjects = await Promise.all(
        projects.map(async (project) => {
          // Fetch technologies
          const { data: technologies } = await supabase
            .from("project_technology")
            .select("technology")
            .eq("project_id", project.id)
            .order("display_order", { ascending: true })

          return {
            ...project,
            // Look up the category name from our map
            category: project.category_id ? categoryMap[project.category_id] || "Unknown" : "Unknown",
            features: [], // We'll add this later if needed
            technologies: technologies?.map((t) => t.technology) || [],
          }
        }),
      )

      setProjects(enhancedProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects: " + (error.message || "Unknown error"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const supabase = getSupabaseBrowserClient()

      // Process image if there's a file
      let imageUrl = data.image
      if (imageFile) {
        try {
          // Compress the image
          const compressedFile = await compressImage(imageFile, {
            maxWidth: 400,
            maxHeight: 300,
            quality: 0.5,
            maxSizeMB: 1,
          })

          // Upload to Supabase Storage
          const fileName = `project_${Date.now()}_${imageFile.name}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("portfolio")
            .upload(`projects/${fileName}`, compressedFile)

          if (uploadError) throw uploadError

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("portfolio").getPublicUrl(`projects/${fileName}`)

          imageUrl = publicUrl
        } catch (error) {
          console.error("Image upload error:", error)
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload image. Using URL if provided.",
            variant: "destructive",
          })
        }
      }

      // Prepare project data
      // Find the category name based on the selected category ID
      const selectedCategory = categories.find((cat) => cat.id === data.category)
      const categoryName = selectedCategory ? selectedCategory.name : "Other"

      const projectData = {
        title: data.title,
        description: data.description,
        category: categoryName, // Add the category name to satisfy the NOT NULL constraint
        category_id: Number.parseInt(data.category), // Convert string ID to integer
        project_type: data.projectType || null, // Add project type
        team_type: data.teamType, // Add team type
        date: data.date || null,
        github: data.github,
        demo: data.demo || null,
        linkedin: data.linkedin || null,
        image: imageUrl || null,
      }

      let projectId

      if (editingProject) {
        // Update existing project
        const { data: updatedProject, error } = await supabase
          .from("project")
          .update(projectData)
          .eq("id", editingProject.id)
          .select()

        if (error) throw error
        projectId = editingProject.id

        // Delete existing features and technologies
        await supabase.from("project_feature").delete().eq("project_id", projectId)
        await supabase.from("project_technology").delete().eq("project_id", projectId)
      } else {
        // Insert new project
        const { data: newProject, error } = await supabase.from("project").insert(projectData).select()

        if (error) throw error
        projectId = newProject[0].id
      }

      // Insert features
      if (features.length > 0) {
        const featureData = features.map((feature, index) => ({
          project_id: projectId,
          feature,
          display_order: index,
        }))

        const { error: featureError } = await supabase.from("project_feature").insert(featureData)

        if (featureError) throw featureError
      }

      // Insert technologies
      if (technologies.length > 0) {
        const techData = technologies.map((technology, index) => ({
          project_id: projectId,
          technology,
          display_order: index,
        }))

        const { error: techError } = await supabase.from("project_technology").insert(techData)

        if (techError) throw techError
      }

      toast({
        title: "Success",
        description: editingProject ? "Project updated successfully" : "Project added successfully",
      })

      // Reset form and state
      resetForm()
      fetchProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project: " + (error.message || "Unknown error"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Delete features and technologies first (foreign key constraints)
      await supabase.from("project_feature").delete().eq("project_id", id)
      await supabase.from("project_technology").delete().eq("project_id", id)

      // Then delete the project
      const { error } = await supabase.from("project").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setTechnologies(project.technologies || [])
    setFeatures(project.features || [])
    setImagePreview(project.image || "")

    // Convert category_id to string if it exists
    const categoryValue = project.category_id ? project.category_id.toString() : ""

    form.reset({
      title: project.title,
      description: project.description,
      category: categoryValue,
      projectType: project.project_type || "",
      teamType: project.team_type || "solo", // Add team type
      date: project.date || "",
      github: project.github,
      demo: project.demo || "",
      linkedin: project.linkedin || "",
      image: project.image || "",
      technologies: project.technologies || [],
      features: project.features || [],
    })
  }

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      category: "",
      projectType: "",
      teamType: "solo",
      date: "",
      github: "",
      demo: "",
      linkedin: "",
      image: "",
      technologies: [],
      features: [],
    })
    setEditingProject(null)
    setTechnologies([])
    setFeatures([])
    setNewTechnology("")
    setNewFeature("")
    setImageFile(null)
    setImagePreview("")
    setImageError("")
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()])
      setNewTechnology("")
    }
  }

  const removeTechnology = (tech) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size should be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload an image file")
      return
    }

    setImageFile(file)
    setImageError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Clear the URL field since we're using a file
    form.setValue("image", "")
  }

  const handleImageUrlChange = async (e) => {
    const url = e.target.value
    form.setValue("image", url)

    if (!url) {
      setImagePreview("")
      setImageError("")
      return
    }

    // Basic URL validation
    if (!url.startsWith("http")) {
      setImageError("Please enter a valid URL")
      setImagePreview("")
      return
    }

    // Check if URL is likely to work
    const isValid = await isValidImageUrl(url)
    if (!isValid) {
      setImageError(
        "Warning: This URL may not be accessible due to CORS restrictions. Consider using Imgur, Cloudinary, or other image hosting services.",
      )
    } else {
      setImageError("")
    }

    setImagePreview(url)
    setImageFile(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Management Section - Moved to the top for better visibility */}
      <div className="border p-6 rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-4">Manage Project Categories</h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="max-w-md"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCategoryName.trim()) {
                  e.preventDefault()
                  handleAddCategory()
                }
              }}
            />
            <Button onClick={handleAddCategory} disabled={addingCategory || !newCategoryName.trim()}>
              {addingCategory ? "Adding..." : "Add Category"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {categories.map((category) => (
              <Card key={category.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {category.id}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold">Add/Edit Project</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Project Type field */}
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Java, React, Python, etc." {...field} />
                  </FormControl>
                  <FormDescription>The primary technology or framework used</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Team Type field */}
            <FormField
              control={form.control}
              name="teamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo Project</SelectItem>
                      <SelectItem value="team">Team Project</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Was this a solo or team project?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="June 2023" {...field} />
                  </FormControl>
                  <FormDescription>When the project was completed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="demo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://myproject.com" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty if no demo available</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Post URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/post/..." {...field} />
                  </FormControl>
                  <FormDescription>Leave empty if no LinkedIn post</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your project..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Technologies</Label>
              <div className="flex mt-2 mb-4">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  className="mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTechnology()
                    }
                  }}
                />
                <Button type="button" onClick={addTechnology} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 rounded-full hover:bg-destructive/20 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Features (Optional)</Label>
              <div className="flex mt-2 mb-4">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-1 rounded-full hover:bg-destructive/20 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input placeholder="https://example.com/image.jpg" {...field} onChange={handleImageUrlChange} />
                    <div className="flex items-center">
                      <div className="text-sm text-muted-foreground">Or upload an image:</div>
                      <Input type="file" accept="image/*" onChange={handleImageChange} className="ml-4" />
                    </div>
                  </div>
                </FormControl>
                {imageError && <p className="text-sm text-amber-500 mt-1">{imageError}</p>}
                <FormDescription>Recommended size: 400x300px. Max size: 1MB.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Image Preview:</p>
              <div className="relative w-full max-w-[400px] h-[200px] border rounded-md overflow-hidden">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError("Failed to load image. Please check the URL.")
                    setImagePreview("")
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold">Existing Projects</h3>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects added yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {project.image && (
                      <div className="w-full md:w-1/4 h-40 md:h-auto">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                            {project.project_type && <p className="text-sm text-primary">{project.project_type}</p>}
                            <p className="text-xs text-muted-foreground">
                              {project.team_type === "team" ? "Team Project" : "Solo Project"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies?.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

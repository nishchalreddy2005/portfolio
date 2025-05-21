"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { updateProfileSection } from "@/utils/local-storage-service"

// Define the form schema
const formSchema = z.object({
  resumeLink: z.string().url("Please enter a valid URL"),
})

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
  initialData: {
    resumeLink?: string
  }
  onSave: (data: { resumeLink: string }) => void
}

export default function SettingsForm({ initialData, onSave }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeLink: initialData?.resumeLink || "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true)
    try {
      // Save to localStorage
      updateProfileSection("settings", values)

      // Call the onSave callback
      onSave(values)

      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
        variant: "default",
        className: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Update your portfolio settings</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="resumeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Download Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a Google Drive direct download link for your resume. For Google Drive, use the format:
                    https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

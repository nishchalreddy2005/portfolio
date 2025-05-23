"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import SeedDatabase from "@/scripts/seed-database"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SeedDatabasePage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Short delay to prevent flash of login form if already authenticated
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isAuthenticated) {
        router.push("/admin")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
        </Button>

        <h1 className="text-3xl font-bold mb-8">Database Management</h1>

        <SeedDatabase />
      </div>
    </div>
  )
}

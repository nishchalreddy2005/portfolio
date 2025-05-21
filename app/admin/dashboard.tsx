"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { isSupabaseAvailable } from "@/utils/data-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Dashboard() {
  const router = useRouter()
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "available" | "unavailable">("checking")

  useEffect(() => {
    const checkSupabase = async () => {
      const available = await isSupabaseAvailable()
      setSupabaseStatus(available ? "available" : "unavailable")
    }

    checkSupabase()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src="/images/admin-icon.png" alt="" className="w-8 h-8 mr-3" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          <Home className="mr-2 h-4 w-4" /> View Portfolio
        </Button>
      </div>

      {supabaseStatus === "checking" && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTitle className="flex items-center">
            <span className="animate-spin mr-2">⟳</span> Checking database connection...
          </AlertTitle>
          <AlertDescription>Please wait while we check your Supabase connection.</AlertDescription>
        </Alert>
      )}

      {supabaseStatus === "unavailable" && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Supabase connection unavailable</AlertTitle>
          <AlertDescription>
            Your changes will be saved to localStorage only. Please check your Supabase configuration.
          </AlertDescription>
        </Alert>
      )}

      {supabaseStatus === "available" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Supabase connection available</AlertTitle>
          <AlertDescription>Your changes will be saved to the Supabase database.</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={() => router.push("/admin/profile")} className="bg-primary">
          Edit Portfolio
        </Button>

        <Button
          onClick={() => router.push("/admin/seed")}
          className="bg-secondary"
          disabled={supabaseStatus !== "available"}
        >
          Seed Database
        </Button>
      </div>
    </div>
  )
}

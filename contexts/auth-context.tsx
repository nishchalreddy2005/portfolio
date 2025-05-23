"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/utils/supabase-client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  resetCredentials: (newUsername: string, newPassword: string) => Promise<boolean>
  sessionExpiry: Date | null
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Session duration in milliseconds
const SESSION_DURATION = 60 * 60 * 1000 // 1 hour
const EXTENDED_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [sessionCheckInterval, setSessionCheckInterval] = useState<NodeJS.Timeout | null>(null)

  const supabase = getSupabaseBrowserClient()

  // Function to check if the session is expired
  const isSessionExpired = () => {
    if (!sessionExpiry) return true
    return new Date() > sessionExpiry
  }

  // Function to refresh the session
  const refreshSession = () => {
    const storedAuth = localStorage.getItem("authState")
    if (storedAuth) {
      const authData = JSON.parse(storedAuth)
      const duration = authData.rememberMe ? EXTENDED_SESSION_DURATION : SESSION_DURATION
      const newExpiry = new Date(Date.now() + duration)
      setSessionExpiry(newExpiry)

      // Update localStorage with new expiry
      localStorage.setItem(
        "authState",
        JSON.stringify({
          ...authData,
          sessionExpiry: newExpiry.toISOString(),
        }),
      )
    }
  }

  // Set up session check interval
  useEffect(() => {
    if (isAuthenticated && !sessionCheckInterval) {
      // Check session every minute
      const interval = setInterval(() => {
        if (isSessionExpired()) {
          logout()
        }
      }, 60 * 1000)
      setSessionCheckInterval(interval)
    }

    return () => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval)
        setSessionCheckInterval(null)
      }
    }
  }, [isAuthenticated, sessionExpiry])

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check localStorage for hardcoded login
        const storedAuth = localStorage.getItem("authState")
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)

          // Check if session is expired
          if (authData.sessionExpiry) {
            const expiry = new Date(authData.sessionExpiry)
            setSessionExpiry(expiry)

            if (new Date() > expiry) {
              // Session expired, clear localStorage and don't authenticate
              localStorage.removeItem("authState")
              setIsLoading(false)
              return
            }
          }

          if (authData.isAuthenticated && authData.user) {
            setUser(authData.user)
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          }
        }

        // Try to get session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.warn("Error checking auth status:", error)
          // If there's an error with Supabase, we'll still allow the hardcoded login to work
          setIsLoading(false)
          return
        }

        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    let subscription
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      })
      subscription = data.subscription
    } catch (error) {
      console.error("Error setting up auth state change listener:", error)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Check if we have credentials in localStorage (from reset)
      const storedCredentials = localStorage.getItem("adminCredentials")
      if (storedCredentials) {
        const credentials = JSON.parse(storedCredentials)
        if (email === credentials.username && password === credentials.password) {
          // Create a mock user for the admin
          const mockUser = {
            id: "admin-user",
            email: "admin@example.com",
            user_metadata: {
              name: "Admin User",
            },
            app_metadata: {
              role: "admin",
            },
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User

          // Set session expiry
          const duration = rememberMe ? EXTENDED_SESSION_DURATION : SESSION_DURATION
          const expiry = new Date(Date.now() + duration)
          setSessionExpiry(expiry)

          // Set the user and authentication state
          setUser(mockUser)
          setIsAuthenticated(true)

          // Store auth state in localStorage
          localStorage.setItem(
            "authState",
            JSON.stringify({
              isAuthenticated: true,
              user: mockUser,
              rememberMe,
              sessionExpiry: expiry.toISOString(),
            }),
          )
          return true
        }
      }

      // Check if credentials exist in the database
      const { data: adminData, error: adminError } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("username", email)
        .single()

      if (adminData && adminData.password === password) {
        // Create a mock user for the admin
        const mockUser = {
          id: adminData.id || "admin-user",
          email: "admin@example.com",
          user_metadata: {
            name: "Admin User",
          },
          app_metadata: {
            role: "admin",
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as User

        // Set session expiry
        const duration = rememberMe ? EXTENDED_SESSION_DURATION : SESSION_DURATION
        const expiry = new Date(Date.now() + duration)
        setSessionExpiry(expiry)

        // Set the user and authentication state
        setUser(mockUser)
        setIsAuthenticated(true)

        // Store auth state in localStorage
        localStorage.setItem(
          "authState",
          JSON.stringify({
            isAuthenticated: true,
            user: mockUser,
            rememberMe,
            sessionExpiry: expiry.toISOString(),
          }),
        )
        return true
      }

      // Fallback to hardcoded login if no database record found
      if (email === "nishchal" && password === "07062005@Nr") {
        // Instead of trying to authenticate with Supabase, create a mock user
        const mockUser = {
          id: "admin-user",
          email: "admin@example.com",
          user_metadata: {
            name: "Admin User",
          },
          app_metadata: {
            role: "admin",
          },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as User

        // Set session expiry
        const duration = rememberMe ? EXTENDED_SESSION_DURATION : SESSION_DURATION
        const expiry = new Date(Date.now() + duration)
        setSessionExpiry(expiry)

        // Set the user and authentication state
        setUser(mockUser)
        setIsAuthenticated(true)

        // Store auth state in localStorage for the hardcoded login
        localStorage.setItem(
          "authState",
          JSON.stringify({
            isAuthenticated: true,
            user: mockUser,
            rememberMe,
            sessionExpiry: expiry.toISOString(),
          }),
        )
        return true
      }

      // If not using hardcoded credentials, try to authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error signing in:", error.message)
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const resetCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    try {
      // Always store in localStorage as a reliable fallback
      localStorage.setItem(
        "adminCredentials",
        JSON.stringify({
          username: newUsername,
          password: newPassword,
        }),
      )

      // Try to update the hardcoded credentials in the auth context
      if (typeof window !== "undefined") {
        const authState = localStorage.getItem("authState")
        if (authState) {
          localStorage.removeItem("authState")
        }
      }

      // Since we've stored the credentials in localStorage, we can return success
      // even if the database operations fail

      try {
        // Try to create the admin_credentials table if it doesn't exist
        await supabase
          .rpc("exec", {
            query: `
            CREATE TABLE IF NOT EXISTS admin_credentials (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              username TEXT NOT NULL,
              password TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
          `,
          })
          .then((result) => {
            console.log("Table creation result:", result)
          })
          .catch((err) => {
            console.log("Table creation error (non-fatal):", err)
          })

        // Wait a moment for the table to be created
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Try to insert the credentials
        const { data, error } = await supabase
          .from("admin_credentials")
          .insert([
            {
              username: newUsername,
              password: newPassword,
              id: crypto.randomUUID(),
            },
          ])
          .select()

        if (error) {
          console.log("Insert error (non-fatal):", error)
          // Continue even if there's an error - we have localStorage as backup
        } else {
          console.log("Insert success:", data)
        }
      } catch (dbError) {
        console.log("Database operation error (non-fatal):", dbError)
        // Continue even if there's an error - we have localStorage as backup
      }

      return true
    } catch (error) {
      console.error("Reset credentials error:", error)
      // Even if there's an error, we've already stored in localStorage
      return true
    }
  }

  const logout = async () => {
    try {
      // Remove from localStorage
      localStorage.removeItem("authState")

      // Reset state
      setUser(null)
      setIsAuthenticated(false)
      setSessionExpiry(null)

      // Clear session check interval
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval)
        setSessionCheckInterval(null)
      }

      // Sign out from Supabase
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        resetCredentials,
        sessionExpiry,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

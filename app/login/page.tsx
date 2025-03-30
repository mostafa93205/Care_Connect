"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, login } = useUser()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const loggedInUser = await login(identifier, password)
    if (loggedInUser) {
      router.push("/")
    } else {
      setError("Invalid credentials. Please try again.")
    }
  }

  if (user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/login", label: "Login" },
        ]}
      />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in using your ID or Email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="identifier">ID or Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


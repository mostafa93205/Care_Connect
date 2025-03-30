"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">CareConnect</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.firstName}!</span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


"use client"

import { cn } from "@/lib/utils"
import { Bell, Calendar, FileText, Home, LifeBuoy, LogOut, Map, Newspaper, Stethoscope, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Medical Records", href: "/medical-records", icon: FileText },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Nearby Hospitals", href: "/nearby-hospitals", icon: Map },
  { name: "Choose a Doctor", href: "/choose-doctor", icon: Stethoscope },
  { name: "News & Updates", href: "/news", icon: Newspaper },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Support", href: "/support", icon: LifeBuoy },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex w-64 flex-col bg-white border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary">CareConnect</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}


"use client"

import { useUser } from "@/contexts/UserContext"
import { Sidebar } from "@/components/sidebar"

export function ClientSideSidebar() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return <Sidebar />
}


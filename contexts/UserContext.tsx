"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { userStorage } from "@/utils/userStorage"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  gender: string
  phone: string
  address?: string
  emergencyContact?: string
  bloodType?: string
  insuranceProvider?: string
  insuranceNumber?: string
  registrationDate?: string
}

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (identifier: string, password: string) => User | null
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = userStorage.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const login = (identifier: string, password: string) => {
    const loggedInUser = userStorage.login(identifier, password)
    if (loggedInUser) {
      setUser(loggedInUser)
    }
    return loggedInUser
  }

  const logout = () => {
    userStorage.logout()
    setUser(null)
  }

  return <UserContext.Provider value={{ user, setUser, login, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export type { User }


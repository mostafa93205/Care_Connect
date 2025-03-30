"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getAppointments } from "@/app/actions/appointmentActions"

type Appointment = {
  id: number
  date: string
  time: string
  doctor: string
  specialty: string
  status?: string // Added status field
}

type AppointmentContextType = {
  appointments: Appointment[]
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
  isLoading: boolean
  rescheduleAppointment: (id: number, newDate: string, newTime: string) => void
  getActiveAppointments: () => Appointment[]
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export const useAppointments = () => {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider")
  }
  return context
}

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      try {
        // Use the client-side function instead of server action
        const fetchedAppointments = getAppointments()
        setAppointments(fetchedAppointments)
      } catch (error) {
        console.error("Failed to fetch appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const rescheduleAppointment = (id: number, newDate: string, newTime: string) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? newDate === "cancelled"
            ? { ...appointment, status: "cancelled" }
            : { ...appointment, date: newDate, time: newTime }
          : appointment,
      ),
    )
  }

  const getActiveAppointments = () => {
    return appointments.filter((appointment) => appointment.status !== "cancelled")
  }

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments, isLoading, rescheduleAppointment, getActiveAppointments }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}


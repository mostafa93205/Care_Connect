"use client"

// Remove the "use server" directive and revalidatePath import
// import { revalidatePath } from "next/cache"

// Convert to client-side function
export async function addAppointment(appointment: {
  id: number
  date: string
  time: string
  doctor: string
  specialty: string
}) {
  // Store in localStorage instead of server-side database
  const appointments = getAppointments()
  appointments.push(appointment)
  localStorage.setItem("appointments", JSON.stringify(appointments))

  return { success: true, appointment }
}

export function getAppointments() {
  // Get appointments from localStorage
  const storedAppointments = localStorage.getItem("appointments")
  if (storedAppointments) {
    return JSON.parse(storedAppointments)
  }

  // Return default appointments if none exist
  const defaultAppointments = [
    { id: 1, date: "2024-02-15", time: "10:00 AM", doctor: "Dr. Ahmed Hassan", specialty: "Cardiology" },
    { id: 2, date: "2024-02-20", time: "2:30 PM", doctor: "Dr. Mona Ali", specialty: "Pediatrics" },
  ]

  localStorage.setItem("appointments", JSON.stringify(defaultAppointments))
  return defaultAppointments
}


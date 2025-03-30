"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppointments } from "@/contexts/AppointmentContext"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function ManageAppointmentClient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { appointments, rescheduleAppointment } = useAppointments()
  const { toast } = useToast()
  const appointmentId = Number.parseInt(params.id)
  const appointment = appointments.find((a) => a.id === appointmentId)

  const [newDate, setNewDate] = useState<Date | undefined>(appointment ? new Date(appointment.date) : undefined)
  const [newTime, setNewTime] = useState(appointment ? appointment.time : "")

  if (!appointment) {
    return <div>Appointment not found</div>
  }

  const handleCancel = () => {
    if (appointment) {
      rescheduleAppointment(appointmentId, "cancelled", "cancelled")
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
      router.push("/appointments")
    }
  }

  const handleReschedule = () => {
    if (newDate && newTime) {
      rescheduleAppointment(appointmentId, format(newDate, "yyyy-MM-dd"), newTime)
      toast({
        title: "Appointment Rescheduled",
        description: "Your appointment has been successfully rescheduled.",
      })
      router.push("/appointments")
    } else {
      toast({
        title: "Error",
        description: "Please select a new date and time",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/appointments", label: "Appointments" },
          { href: `/manage-appointment/${appointmentId}`, label: "Manage Appointment" },
        ]}
      />
      <h1 className="text-3xl font-bold">Manage Appointment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Doctor:</strong> {appointment.doctor}
            </p>
            <p>
              <strong>Specialty:</strong> {appointment.specialty}
            </p>
            <p>
              <strong>Current Date:</strong> {appointment.date}
            </p>
            <p>
              <strong>Current Time:</strong> {appointment.time}
            </p>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Reschedule</h3>
              <div>
                <Calendar mode="single" selected={newDate} onSelect={setNewDate} className="rounded-md border" />
              </div>
              <div>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleReschedule}>Reschedule Appointment</Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


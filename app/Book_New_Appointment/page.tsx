"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { doctors } from "@/components/doctor-list"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import Link from "next/link"
import { useAppointments } from "@/contexts/AppointmentContext"
import { useToast } from "@/components/ui/use-toast"

export default function BookNewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setAppointments } = useAppointments()
  const { toast } = useToast()

  useEffect(() => {
    const doctorId = searchParams.get("doctor")
    if (doctorId) {
      const doctor = doctors.find((d) => d.id.toString() === doctorId)
      if (doctor) {
        setSelectedDoctor(doctor)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDoctor && selectedDate && selectedTime) {
      setIsSubmitting(true)
      const newAppointment = {
        id: Date.now(),
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
      }
      try {
        // const result = await addAppointment(newAppointment)
        // if (result.success) {
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment])
        toast({
          title: "Appointment Booked",
          description: "Your appointment has been successfully booked.",
        })
        router.push("/appointments")
        // } else {
        //   throw new Error("Failed to book appointment")
        // }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to book appointment. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }
  }

  const isDateUnavailable = (date: Date) => {
    if (!selectedDoctor) return false
    const dayOfWeek = date.getDay()
    const isAvailableDay = selectedDoctor.availability.availableDays.includes(dayOfWeek)
    const isWithinThreeDays = isBefore(date, addDays(new Date(), 3))
    const isAfterNextAvailable = isAfter(startOfDay(date), startOfDay(selectedDoctor.availability.nextAvailable))
    return !isAvailableDay || (isWithinThreeDays && !isAfterNextAvailable)
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/appointments", label: "Appointments" },
          { href: "/Book_New_Appointment", label: "Book New Appointment" },
        ]}
      />
      <h1 className="text-3xl font-bold">Book New Appointment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="doctor">Selected Doctor</Label>
              {selectedDoctor ? (
                <div className="flex items-center justify-between">
                  <span>
                    {selectedDoctor.name} - {selectedDoctor.specialty}
                  </span>
                  <Button variant="outline" asChild>
                    <Link href="/choose-doctor">Change Doctor</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/choose-doctor">Choose a Doctor</Link>
                </Button>
              )}
            </div>
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={isDateUnavailable}
                modifiers={{
                  unavailable: isDateUnavailable,
                }}
                modifiersStyles={{
                  unavailable: { color: "red" },
                }}
              />
            </div>
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Choose a time" />
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
            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Input
                id="reason"
                placeholder="Brief description of your visit"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


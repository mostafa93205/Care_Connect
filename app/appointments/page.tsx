"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit } from "lucide-react"
import Link from "next/link"
import { useAppointments } from "@/contexts/AppointmentContext"

export default function AppointmentsPage() {
  const { getActiveAppointments, isLoading } = useAppointments()

  if (isLoading) {
    return <div>Loading appointments...</div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/appointments", label: "Appointments" },
        ]}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button asChild>
          <Link href="/Book_New_Appointment" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Book New Appointment
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getActiveAppointments().map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.specialty}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/manage-appointment/${appointment.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Calendar className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


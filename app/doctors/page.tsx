"use client"

import { useState } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Star } from "lucide-react"
import Link from "next/link"

const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    rating: 4.8,
    availability: "Next available: Today",
    hospital: "Cairo Hospital",
  },
  {
    id: 2,
    name: "Dr. Mona Ali",
    specialty: "Pediatrics",
    rating: 4.6,
    availability: "Next available: Tomorrow",
    hospital: "Alexandria Medical Center",
  },
  {
    id: 3,
    name: "Dr. Youssef Ibrahim",
    specialty: "Dermatology",
    rating: 4.9,
    availability: "Next available: In 2 days",
    hospital: "Giza Clinic",
  },
  {
    id: 4,
    name: "Dr. Sara Mohamed",
    specialty: "Neurology",
    rating: 4.7,
    availability: "Next available: In 3 days",
    hospital: "Mansoura Hospital",
  },
  {
    id: 5,
    name: "Dr. Khaled Nabil",
    specialty: "Orthopedics",
    rating: 4.5,
    availability: "Next available: Today",
    hospital: "Aswan General Hospital",
  },
]

const specialties = ["Cardiology", "Pediatrics", "Dermatology", "Neurology", "Orthopedics"]

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialty === "" || doctor.specialty === selectedSpecialty)
    )
  })

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/doctors", label: "Doctors" },
        ]}
      />
      <h1 className="text-3xl font-bold">Find a Doctor</h1>
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Search by name or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={(value) => setSelectedSpecialty(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{doctor.rating}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{doctor.availability}</p>
              <Button className="w-full mt-4" asChild>
                <Link href={`/Book_New_Appointment?doctor=${doctor.id}`}>
                  <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


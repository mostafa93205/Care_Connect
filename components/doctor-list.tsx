"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    rating: 4.8,
    availability: { nextAvailable: new Date(Date.now() + 86400000), availableDays: [0, 1, 3, 4] },
    hospital: "Cairo Hospital",
    location: "Cairo",
    phone: "+20 123 456 7890",
  },
  {
    id: 2,
    name: "Dr. Mona Ali",
    specialty: "Pediatrics",
    rating: 4.6,
    availability: { nextAvailable: new Date(Date.now() + 172800000), availableDays: [1, 2, 4, 5] },
    hospital: "Alexandria Medical Center",
    location: "Alexandria",
    phone: "+20 123 456 7891",
  },
  {
    id: 3,
    name: "Dr. Youssef Ibrahim",
    specialty: "Dermatology",
    rating: 4.9,
    availability: { nextAvailable: new Date(Date.now() + 259200000), availableDays: [0, 2, 3, 5] },
    hospital: "Giza Clinic",
    location: "Giza",
    phone: "+20 123 456 7892",
  },
  {
    id: 4,
    name: "Dr. Sara Mohamed",
    specialty: "Neurology",
    rating: 4.7,
    availability: { nextAvailable: new Date(Date.now() + 345600000), availableDays: [1, 3, 4, 6] },
    hospital: "Mansoura Hospital",
    location: "Mansoura",
    phone: "+20 123 456 7893",
  },
  {
    id: 5,
    name: "Dr. Khaled Nabil",
    specialty: "Orthopedics",
    rating: 4.5,
    availability: { nextAvailable: new Date(Date.now() + 86400000), availableDays: [0, 2, 4, 6] },
    hospital: "Aswan General Hospital",
    location: "Aswan",
    phone: "+20 123 456 7894",
  },
  {
    id: 6,
    name: "Dr. Laila Farouk",
    specialty: "Ophthalmology",
    rating: 4.8,
    availability: { nextAvailable: new Date(Date.now() + 172800000), availableDays: [1, 3, 5, 6] },
    hospital: "Luxor Eye Center",
    location: "Luxor",
    phone: "+20 123 456 7895",
  },
  {
    id: 7,
    name: "Dr. Omar Hesham",
    specialty: "Psychiatry",
    rating: 4.6,
    availability: { nextAvailable: new Date(Date.now() + 259200000), availableDays: [0, 2, 4, 5] },
    hospital: "Tanta Mental Health Clinic",
    location: "Tanta",
    phone: "+20 123 456 7896",
  },
  {
    id: 8,
    name: "Dr. Nour Mahmoud",
    specialty: "Gynecology",
    rating: 4.9,
    availability: { nextAvailable: new Date(Date.now() + 86400000), availableDays: [1, 2, 3, 5] },
    hospital: "Port Said Women's Hospital",
    location: "Port Said",
    phone: "+20 123 456 7897",
  },
  {
    id: 9,
    name: "Dr. Amr Salah",
    specialty: "Urology",
    rating: 4.7,
    availability: { nextAvailable: new Date(Date.now() + 345600000), availableDays: [0, 1, 3, 6] },
    hospital: "Hurghada Medical Complex",
    location: "Hurghada",
    phone: "+20 123 456 7898",
  },
  {
    id: 10,
    name: "Dr. Heba Adel",
    specialty: "Endocrinology",
    rating: 4.8,
    availability: { nextAvailable: new Date(Date.now() + 172800000), availableDays: [2, 3, 4, 6] },
    hospital: "Sohag University Hospital",
    location: "Sohag",
    phone: "+20 123 456 7899",
  },
]

export function DoctorList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))]
  const locations = [...new Set(doctors.map((doctor) => doctor.location))]

  const filteredDoctors = doctors.filter(
    (doctor) =>
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialty === "" || doctor.specialty === selectedSpecialty) &&
      (selectedLocation === "" || doctor.location === selectedLocation),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search doctors, specialties, or hospitals"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Specialties">All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Locations">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
              <div className="mt-4 space-y-2">
                <p className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next available: {format(doctor.availability.nextAvailable, "MMM d, yyyy")}
                </p>
                <p className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {doctor.hospital}, {doctor.location}
                </p>
                <p className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {doctor.phone}
                </p>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href={`/Book_New_Appointment?doctor=${doctor.id}`}>Book Appointment</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


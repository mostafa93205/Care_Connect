"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { userStorage } from "@/utils/userStorage"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContact: "",
    bloodType: "",
    insuranceProvider: "",
    insuranceNumber: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    // Clear error for this field when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" })
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error for this field when user makes a selection
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    const requiredFields = ["id", "firstName", "lastName", "email", "password", "dateOfBirth", "gender", "phone"]
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required"
      }
    })

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Phone validation
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // ID validation (assuming national ID format)
    if (formData.id && !/^[0-9]{10,14}$/.test(formData.id)) {
      newErrors.id = "Please enter a valid ID number (10-14 digits)"
    }

    // Terms acceptance
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newUser = {
      id: formData.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address || "",
      emergencyContact: formData.emergencyContact || "",
      bloodType: formData.bloodType || "",
      insuranceProvider: formData.insuranceProvider || "",
      insuranceNumber: formData.insuranceNumber || "",
      registrationDate: new Date().toISOString(),
    }

    // Check if user with this ID or email already exists
    const existingUsers = userStorage.getUsers()
    const userExists = existingUsers.some((user) => user.id === formData.id || user.email === formData.email)

    if (userExists) {
      setErrors({
        ...errors,
        general: "A user with this ID or email already exists",
      })
      return
    }

    userStorage.saveUser(newUser)

    // Show success message
    setShowSuccess(true)

    // Redirect after a short delay
    setTimeout(() => {
      const { password, ...userWithoutPassword } = newUser
      userStorage.setCurrentUser(userWithoutPassword)
      router.push("/")
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/register", label: "Patient Registration" },
        ]}
      />

      {showSuccess && (
        <Alert className="bg-green-50 border-green-500">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your registration was successful. You will be redirected to the dashboard.
          </AlertDescription>
        </Alert>
      )}

      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>Please fill in your information to create a new patient account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid gap-4 mt-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="id">
                      National ID Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="id"
                      type="text"
                      value={formData.id}
                      onChange={handleChange}
                      className={errors.id ? "border-red-500" : ""}
                    />
                    {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
                  </div>
                  <div>
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => handleSelectChange("bloodType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type (if known)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid gap-4 mt-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" type="text" value={formData.address} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Name and phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Insurance Information</h3>
                <div className="grid gap-4 mt-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      type="text"
                      value={formData.insuranceProvider}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceNumber">Insurance Policy Number</Label>
                    <Input id="insuranceNumber" type="text" value={formData.insuranceNumber} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid gap-4 mt-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean)
                    if (checked && errors.terms) {
                      setErrors({ ...errors, terms: "" })
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms of service and privacy policy <span className="text-red-500">*</span>
                  </label>
                  {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


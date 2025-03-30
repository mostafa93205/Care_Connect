"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const newsItems = [
  {
    id: 1,
    title: "New COVID-19 Vaccination Center Opens",
    category: "Healthcare News",
    date: "2024-01-30",
    content:
      "A new vaccination center has opened in the city center, increasing the capacity for COVID-19 vaccinations. The center is equipped with state-of-the-art facilities and is staffed by experienced healthcare professionals.",
    priority: "high",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    title: "Health Tips: Managing Winter Wellness",
    category: "Health Tips",
    date: "2024-01-29",
    content:
      "As winter continues, it's important to take care of your health. This article provides essential tips for staying healthy during the cold months, including advice on nutrition, exercise, and mental health.",
    priority: "medium",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    title: "Hospital Updates Operating Hours",
    category: "Updates",
    date: "2024-01-28",
    content:
      "Central Hospital announces new extended operating hours for its outpatient services. This change aims to provide more flexibility for patients and reduce waiting times.",
    priority: "low",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    title: "New Healthcare Initiatives in Egypt",
    category: "Healthcare News",
    date: "2024-02-01",
    content:
      "The Egyptian government has launched new healthcare initiatives aimed at improving the quality of medical services across the country. These initiatives include the construction of new hospitals and the introduction of advanced medical technologies.",
    priority: "high",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 5,
    title: "Health Tips: Staying Hydrated in Egypt's Climate",
    category: "Health Tips",
    date: "2024-02-02",
    content:
      "Staying hydrated is crucial, especially in Egypt's hot climate. This article provides tips on how to maintain proper hydration levels, including the importance of drinking water and consuming hydrating foods.",
    priority: "medium",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 6,
    title: "Egyptian Hospitals Receive International Accreditation",
    category: "Updates",
    date: "2024-02-03",
    content:
      "Several hospitals in Egypt have received international accreditation for their high standards of patient care and medical services. This achievement highlights the country's commitment to improving healthcare quality.",
    priority: "low",
    image: "/placeholder.svg?height=100&width=200",
  },
]

export function NewsFeed() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredNews = newsItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          News & Important Updates
          <Badge variant="outline">Latest News</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Healthcare News">Healthcare News</SelectItem>
              <SelectItem value="Health Tips">Health Tips</SelectItem>
              <SelectItem value="Updates">Updates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.content.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "outline"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="w-full mt-4">View All News</Button>
      </CardContent>
    </Card>
  )
}


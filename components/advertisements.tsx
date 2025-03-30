import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const advertisements = [
  {
    id: 1,
    title: "20% Off Medical Check-ups",
    description: "Get a 20% discount on all medical check-ups at Cairo International Hospital",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-Dx289naJZvWFkCXOSbwYBUa6FoWQHq.jpeg",
    link: "#",
    bgColor: "bg-[#E8F4FF]",
    textColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Comprehensive Family Health Insurance",
    description: "Protect your family with our comprehensive health insurance package from Health for All Company",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imag2-0AV8jBnx5FsKzepvR3x1dPP7AZ0VXR.jpeg",
    link: "#",
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
  },
  {
    id: 3,
    title: "Mobile Clinics in Your Area",
    description: "Visit the mobile clinics in your area for free medical consultations",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imag3-5bA6oz4ZnWVaGAYR418OGOIUzIjHbt.jpeg",
    link: "#",
    bgColor: "bg-[#f0f9f6]",
    textColor: "text-emerald-700",
  },
]

export function Advertisements() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Advertisements and Special Offers</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {advertisements.map((ad) => (
          <Card key={ad.id} className={`${ad.bgColor} hover:shadow-lg transition-shadow duration-200`}>
            <CardContent className="p-4">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={ad.imageUrl || "/placeholder.svg"}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={ad.id <= 2}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm">
                  <h3 className="font-bold text-lg text-white">{ad.title}</h3>
                </div>
              </div>
              <p className={`text-sm mb-4 ${ad.textColor}`}>{ad.description}</p>
              <Button
                asChild
                className={`w-full ${
                  ad.id === 1
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ad.id === 2
                      ? "bg-gray-800 hover:bg-gray-900"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <a href={ad.link}>Learn More</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


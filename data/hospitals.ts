export interface Hospital {
  id: number
  name: string
  position: [number, number]
  address: string
  phone: string
  specialties: { name: string; consultants: number }[]
  availableICUBeds: number
  regularBeds: number
  availableConsultants: number
  status: "Open" | "Closed" | "Emergency Only"
}

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Dar Al Fouad Hospital",
    position: [29.99756135219433, 30.96602967508169],
    address: "North Teseen Street, Fifth Settlement, Cairo",
    phone: "0221600205",
    specialties: [
      { name: "Cardiology", consultants: 8 },
      { name: "Pediatrics", consultants: 7 },
      { name: "Obstetrics and Gynecology", consultants: 10 },
      { name: "General Surgery", consultants: 5 },
    ],
    availableICUBeds: 15,
    regularBeds: 80,
    availableConsultants: 30,
    status: "Open",
  },
  {
    id: 2,
    name: "Al Salam International Hospital",
    position: [29.985123849796405, 31.230291158449997],
    address: "Nile Corniche, Maadi, Cairo",
    phone: "01092001443",
    specialties: [
      { name: "Internal Medicine", consultants: 7 },
      { name: "Orthopedics", consultants: 6 },
      { name: "Neurosurgery", consultants: 5 },
      { name: "Radiology", consultants: 7 },
    ],
    availableICUBeds: 10,
    regularBeds: 60,
    availableConsultants: 25,
    status: "Open",
  },
  {
    id: 3,
    name: "Ain Shams Specialized Hospital",
    position: [30.07868893334308, 31.287665736047416],
    address: "Ramses Street, Abbasiya, Cairo",
    phone: "01098106892",
    specialties: [
      { name: "Surgery", consultants: 10 },
      { name: "Internal Medicine", consultants: 8 },
      { name: "Pediatrics", consultants: 9 },
      { name: "Obstetrics and Gynecology", consultants: 8 },
    ],
    availableICUBeds: 8,
    regularBeds: 70,
    availableConsultants: 35,
    status: "Emergency Only",
  },
  {
    id: 4,
    name: "Alexandria University Hospital",
    position: [31.203961732936023, 29.906700074227707],
    address: "Khartoum Square, Azarita, Alexandria",
    phone: "034862920",
    specialties: [
      { name: "Cardiology", consultants: 10 },
      { name: "Neurology", consultants: 8 },
      { name: "Oncology", consultants: 12 },
      { name: "Pediatrics", consultants: 10 },
      { name: "General Surgery", consultants: 10 },
    ],
    availableICUBeds: 25,
    regularBeds: 150,
    availableConsultants: 50,
    status: "Open",
  },
  {
    id: 5,
    name: "El Galaa Teaching Hospital",
    position: [30.054875802198964, 31.23823741570875],
    address: "El Galaa Street, Ramses, Cairo",
    phone: "0225756245",
    specialties: [
      { name: "Surgery", consultants: 8 },
      { name: "Internal Medicine", consultants: 7 },
      { name: "Orthopedics", consultants: 7 },
      { name: "Obstetrics and Gynecology", consultants: 6 },
    ],
    availableICUBeds: 12,
    regularBeds: 90,
    availableConsultants: 28,
    status: "Closed",
  },
  {
    id: 6,
    name: "Rofayda Maternity Hospital",
    position: [30.0084, 31.2106],
    address: "Sheikh Zayed City, Giza Governorate",
    phone: "0238500600",
    specialties: [
      { name: "Obstetrics", consultants: 7 },
      { name: "Gynecology", consultants: 5 },
      { name: "Neonatology", consultants: 3 },
    ],
    availableICUBeds: 20,
    regularBeds: 5,
    availableConsultants: 15,
    status: "Open",
  },
  {
    id: 7,
    name: "Al Mehwar Hospital",
    position: [30.0231, 30.9727],
    address: "6th of October City, Giza Governorate",
    phone: "0238247247",
    specialties: [
      { name: "General Medicine", consultants: 8 },
      { name: "Surgery", consultants: 8 },
      { name: "Pediatrics", consultants: 8 },
      { name: "Orthopedics", consultants: 8 },
    ],
    availableICUBeds: 18,
    regularBeds: 75,
    availableConsultants: 32,
    status: "Open",
  },
  {
    id: 8,
    name: "Sheikh Zayed Specialized Hospital",
    position: [30.0382, 31.0784],
    address: "Sheikh Zayed City, Giza Governorate",
    phone: "0238500500",
    specialties: [
      { name: "Cardiology", consultants: 12 },
      { name: "Neurology", consultants: 10 },
      { name: "Oncology", consultants: 10 },
      { name: "Urology", consultants: 8 },
    ],
    availableICUBeds: 22,
    regularBeds: 100,
    availableConsultants: 40,
    status: "Open",
  },
  {
    id: 9,
    name: "Neuro Espitalia Hospital",
    position: [30.0746, 31.2797],
    address: "Nasr City, Cairo Governorate",
    phone: "0224011200",
    specialties: [
      { name: "Neurology", consultants: 7 },
      { name: "Neurosurgery", consultants: 5 },
      { name: "Psychiatry", consultants: 4 },
      { name: "Rehabilitation", consultants: 4 },
    ],
    availableICUBeds: 16,
    regularBeds: 50,
    availableConsultants: 20,
    status: "Open",
  },
]


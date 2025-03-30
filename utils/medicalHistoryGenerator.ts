import type { User } from "@/contexts/UserContext"

const allergies = ["No known allergies", "Peanuts", "Penicillin", "Latex", "Shellfish", "Pollen"]
const medications = [
  "Paracetamol - 500mg - twice daily",
  "Amoxicillin - 250mg - three times daily",
  "Lisinopril - 10mg - once daily",
  "Metformin - 500mg - twice daily",
  "Atorvastatin - 20mg - once daily",
]
const chronicConditions = [
  "No chronic conditions recorded",
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Hypothyroidism",
]
const surgeries = [
  "No previous surgeries",
  "Appendectomy - 2015",
  "Tonsillectomy - 2010",
  "Knee Arthroscopy - 2018",
  "Cesarean Section - 2019",
]

export function generateMedicalHistory(user: User) {
  // Use a deterministic approach instead of relying on Math.random
  const userSeed = user.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Create a simple deterministic random function based on the seed
  const random = (max: number) => Math.floor(((Math.sin(userSeed * (max + 1)) + 1) * max) / 2)

  return {
    healthScore: 60 + random(40),
    allergies: allergies[random(allergies.length)],
    currentMedications: medications.slice(0, 1 + random(3)).join("\n"),
    chronicConditions: chronicConditions[random(chronicConditions.length)],
    previousSurgeries: surgeries[random(surgeries.length)],
  }
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Heart, Brain, TreesIcon as Lungs } from "lucide-react"

const healthRisks = [
  { name: "Cardiovascular", risk: "Low", icon: Heart, color: "text-green-500" },
  { name: "Diabetes", risk: "Moderate", icon: Activity, color: "text-yellow-500" },
  { name: "Neurological", risk: "Low", icon: Brain, color: "text-green-500" },
  { name: "Respiratory", risk: "High", icon: Lungs, color: "text-red-500" },
]

export function PersonalizedHealthDashboard() {
  const recommendations = [
    "Increase daily water intake to 8 glasses",
    "Add 30 minutes of moderate exercise to your routine",
    "Schedule your annual check-up",
    "Consider reducing sodium in your diet",
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-500">Good</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Your health score is good. Keep up the good work!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Health Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {healthRisks.map((risk) => (
              <div key={risk.name} className="flex items-center space-x-2">
                <risk.icon className={`h-8 w-8 ${risk.color}`} />
                <div>
                  <p className="font-semibold">{risk.name}</p>
                  <p className={`text-sm ${risk.color}`}>{risk.risk} Risk</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button className="w-full">Set New Health Goal</Button>
    </div>
  )
}


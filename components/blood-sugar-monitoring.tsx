"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for blood sugar readings
const initialReadings = [
  { date: "2023-06-01", value: 120, time: "Fasting" },
  { date: "2023-06-02", value: 140, time: "After Meal" },
  { date: "2023-06-03", value: 110, time: "Fasting" },
  { date: "2023-06-04", value: 130, time: "After Meal" },
  { date: "2023-06-05", value: 115, time: "Fasting" },
]

export function BloodSugarMonitoring() {
  const [readings, setReadings] = useState(initialReadings)
  const [newReading, setNewReading] = useState({ value: "", time: "Fasting" })

  const addReading = () => {
    if (newReading.value) {
      const today = new Date().toISOString().split("T")[0]
      setReadings([...readings, { date: today, value: Number.parseInt(newReading.value), time: newReading.time }])
      setNewReading({ value: "", time: "Fasting" })
    }
  }

  const getRecommendation = () => {
    const latestReading = readings[readings.length - 1]
    if (latestReading.value < 70) {
      return "Your blood sugar is low. Consider eating a small snack."
    } else if (latestReading.value > 180) {
      return "Your blood sugar is high. Make sure to stay hydrated and consult your doctor if it remains elevated."
    } else {
      return "Your blood sugar is within a normal range. Keep up the good work!"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Blood Sugar Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="sugar-level">Blood Sugar Level (mg/dL)</Label>
              <Input
                id="sugar-level"
                type="number"
                value={newReading.value}
                onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                placeholder="Enter blood sugar level"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="reading-time">Reading Time</Label>
              <Select value={newReading.time} onValueChange={(value) => setNewReading({ ...newReading, time: value })}>
                <SelectTrigger id="reading-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fasting">Fasting</SelectItem>
                  <SelectItem value="Before Meal">Before Meal</SelectItem>
                  <SelectItem value="After Meal">After Meal</SelectItem>
                  <SelectItem value="Bedtime">Bedtime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addReading} className="w-full">
            Add Reading
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Blood Sugar Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Latest Reading</h3>
          <p>
            {readings[readings.length - 1].value} mg/dL ({readings[readings.length - 1].time})
          </p>
          <p className="text-sm text-muted-foreground mt-2">{getRecommendation()}</p>
        </div>
      </CardContent>
    </Card>
  )
}


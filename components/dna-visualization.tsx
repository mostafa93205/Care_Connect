"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DNA_COLORS = {
  A: "#FF4136", // Red
  T: "#2ECC40", // Green
  C: "#0074D9", // Blue
  G: "#FFDC00", // Yellow
}

const DNA_PAIRS = {
  A: "T",
  T: "A",
  C: "G",
  G: "C",
}

interface DNAVisualizationProps {
  sequence: string
}

export function DNAVisualization({ sequence }: DNAVisualizationProps) {
  const [dnaSequence, setDnaSequence] = useState<string[]>([])

  useEffect(() => {
    setDnaSequence(sequence.toUpperCase().split(""))
  }, [sequence])

  return (
    <Card className="print-section">
      <CardHeader>
        <CardTitle>DNA Sequence Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* First strand */}
          <div className="flex flex-wrap justify-center gap-1 p-2 bg-white rounded-lg">
            {dnaSequence.map((base, index) => (
              <div key={`first-${index}`} className="relative">
                <div
                  className="w-8 h-8 flex items-center justify-center text-white font-bold rounded-full shadow-sm print:shadow-none"
                  style={{ backgroundColor: DNA_COLORS[base as keyof typeof DNA_COLORS] || "#AAAAAA" }}
                >
                  {base}
                </div>
                <div className="h-4 w-px bg-gray-300 mx-auto print:bg-gray-600" />
              </div>
            ))}
          </div>

          {/* Connecting lines */}
          <div className="h-px bg-gray-300 w-full print:bg-gray-600" />

          {/* Complementary strand */}
          <div className="flex flex-wrap justify-center gap-1 p-2 bg-white rounded-lg">
            {dnaSequence.map((base, index) => (
              <div key={`second-${index}`} className="relative">
                <div className="h-4 w-px bg-gray-300 mx-auto print:bg-gray-600" />
                <div
                  className="w-8 h-8 flex items-center justify-center text-white font-bold rounded-full shadow-sm print:shadow-none"
                  style={{
                    backgroundColor:
                      DNA_COLORS[DNA_PAIRS[base as keyof typeof DNA_PAIRS] as keyof typeof DNA_COLORS] || "#AAAAAA",
                  }}
                >
                  {DNA_PAIRS[base as keyof typeof DNA_PAIRS]}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-2xl mt-6 print:mt-8">
            <div className="text-sm font-medium mb-2">Legend:</div>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(DNA_COLORS).map(([base, color]) => (
                <div key={base} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm">{base}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


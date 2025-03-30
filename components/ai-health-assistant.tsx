"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIHealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Health Assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = { role: "assistant", content: generateAIResponse(input) }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    // This is a placeholder. In a real implementation, this would call an AI service.
    const lowercaseInput = userInput.toLowerCase()
    if (lowercaseInput.includes("appointment")) {
      return "I can help you schedule an appointment. What type of doctor would you like to see?"
    } else if (lowercaseInput.includes("medication")) {
      return "I can assist with medication reminders. Would you like me to set one up for you?"
    } else if (lowercaseInput.includes("symptom")) {
      return "I'm here to help with your symptoms. Can you describe them in more detail?"
    } else {
      return "I'm here to assist with any health-related questions or concerns. Could you provide more details about what you need help with?"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Health Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
              <div className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                  <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                </Avatar>
                <div
                  className={`mx-2 p-2 rounded-lg ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} className="ml-2">
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


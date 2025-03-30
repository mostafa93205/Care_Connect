"use client"

import type React from "react"
import { useState } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, Mail, MessageCircle, Phone, Twitter } from "lucide-react"

export default function SupportPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ user: string; message: string }[]>([])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { user: "You", message: chatMessage }])
      // Simulated response (in a real app, this would come from a backend)
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { user: "Support", message: "Thank you for your message. A support agent will be with you shortly." },
        ])
      }, 1000)
      setChatMessage("")
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/support", label: "Support" },
        ]}
      />
      <h1 className="text-3xl font-bold">Support</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>+20 123 456 7890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>support@careconnect.com</span>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto mb-4 p-2 border rounded">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-2 ${chat.user === "You" ? "text-right" : "text-left"}`}>
                  <span className="font-bold">{chat.user}: </span>
                  {chat.message}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <Button type="submit">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Your Email" />
            <Input placeholder="Subject" />
            <Textarea placeholder="Your Message" />
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


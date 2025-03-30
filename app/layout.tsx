import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { AppointmentProvider } from "@/contexts/AppointmentContext"
import { UserProvider } from "@/contexts/UserContext"
import { ClientSideSidebar } from "@/components/client-side-sidebar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <UserProvider>
          <AppointmentProvider>
            <div className="flex h-screen">
              <ClientSideSidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
              </div>
            </div>
          </AppointmentProvider>
        </UserProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

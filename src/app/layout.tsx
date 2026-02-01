import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "QuickCart - Fresh Groceries Delivered Fast",
  description: "Order fresh groceries online and get them delivered to your door. Premium quality, competitive prices.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}

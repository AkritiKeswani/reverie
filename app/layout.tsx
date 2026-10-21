import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { ClientOnly } from "@/components/client-only"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Reverie - Journal & Self-Discovery",
  description: "Your peaceful space for reflection and self-discovery",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      localization={{
        signIn: { start: { title: "Sign in to Reverie" } },
        signUp: { start: { title: "Create your Reverie account" } },
      }}
      appearance={{
        variables: {
          colorPrimary: "#38a3ec",
          colorText: "#1a2e44",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          borderRadius: "1rem",
          fontFamily: "var(--font-manrope)",
        },
        elements: {
          card: "shadow-xl shadow-sky-200/40 border border-sky-100",
          modalBackdrop: "bg-sky-950/20 backdrop-blur-sm",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${manrope.variable} font-sans antialiased`}>
          <ClientOnly>
            {children}
            <Toaster />
          </ClientOnly>
        </body>
      </html>
    </ClerkProvider>
  )
}

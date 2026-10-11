"use client"

import type React from "react"

import { MessageCircle } from "lucide-react"

interface WhatsAppContactProps {
  phoneNumber?: string
  message?: string
  cta?: string
  className?: string
  children?: React.ReactNode
}

export default function WhatsAppContact({
  phoneNumber = "1234567890",
  message = "Hello! I'm interested in your services.",
  cta= "WhatsApp",
  className = "",
  children,
}: WhatsAppContactProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors ${className}`}
    >
      {children || (
        <>
          <MessageCircle className="w-5 h-5" />
          {cta}
        </>
      )}
    </button>
  )
}

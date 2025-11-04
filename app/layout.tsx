"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatbotWidget from '../components/ChatbotWidget';
import { ChatbotProvider, useChatbot } from '../context/ChatbotContext';
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ChatbotProvider>
            {children}
            <ChatbotWidgetWrapper />
          </ChatbotProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function ChatbotWidgetWrapper() {
  const { isChatbotOpen, appointmentContext, closeChatbot, openChatbot, openChatbotWithAppointment } = useChatbot();

  return (
    <ChatbotWidget
      isOpen={isChatbotOpen}
      onClose={closeChatbot}
      initialAppointmentContext={appointmentContext}
      onChatStarted={openChatbotWithAppointment} // Cette prop est maintenant gérée par le contexte
      onOpenWithoutContext={openChatbot} // Nouvelle prop pour ouvrir sans contexte
    />
  );
}

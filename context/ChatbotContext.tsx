"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppointmentContext {
  id: string;
  leadDate: string;
  sales: string;
  contact: string;
  appointmentDate: string;
  appointmentTime: string;
  campaignName: string;
  companyName?: string; // Nouvelle colonne
  appointmentPhase: string;
  transactionPhase: string;
  price: string;
}

interface ChatbotContextType {
  isChatbotOpen: boolean;
  appointmentContext: AppointmentContext | null;
  openChatbotWithAppointment: (context: AppointmentContext) => void;
  openChatbot: () => void; // Nouvelle fonction pour ouvrir sans contexte
  closeChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [appointmentContext, setAppointmentContext] = useState<AppointmentContext | null>(null);

  const openChatbotWithAppointment = (context: AppointmentContext) => {
    setAppointmentContext(context);
    setIsChatbotOpen(true);
  };

  const openChatbot = () => { // Implémentation de la nouvelle fonction
    setAppointmentContext(null); // Pas de contexte initial
    setIsChatbotOpen(true);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setAppointmentContext(null);
  };

  return (
    <ChatbotContext.Provider value={{ isChatbotOpen, appointmentContext, openChatbotWithAppointment, openChatbot, closeChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

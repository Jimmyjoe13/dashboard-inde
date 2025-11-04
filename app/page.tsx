"use client";

import { useState, useEffect } from 'react';
import { useChatbot } from '../context/ChatbotContext';
import { useSession, signOut } from "next-auth/react";

// Icônes SVG pour une meilleure lisibilité
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m-1 3H9m7 0h-1m1-4h-1m-1-4h-1m-1-4h-1m-1-3h-1M4 21h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5.5c.58 0 1.13.2 1.57.58l7.43 7.43c.4.4.4 1.03 0 1.43l-5.5 5.5c-.4.4-1.03.4-1.43 0L3.42 12.57c-.38-.4-.58-.95-.58-1.57V7c0-2.21 1.79-4 4-4z" />
  </svg>
);

interface Appointment {
  id: string;
  leadDate: string;
  sales: string;
  contact: string;
  appointmentDate: string;
  appointmentTime: string;
  campaignName: string;
  companyName?: string;
  appointmentPhase: string;
  transactionPhase: string;
  price: string;
}

interface GroupedAppointments {
  [salesName: string]: Appointment[];
}

export default function Home() {
  const [groupedAppointments, setGroupedAppointments] = useState<GroupedAppointments>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openChatbotWithAppointment } = useChatbot();

  const handleAppointmentClick = (appointment: Appointment) => {
    openChatbotWithAppointment(appointment);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/get-sheet');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const rawData = result.data;

        if (!rawData || rawData.length === 0) {
          setGroupedAppointments({});
          setLoading(false);
          return;
        }

        const headers = rawData[0];
        const appointments: Appointment[] = rawData.slice(1).map((row: string[]) => {
          const obj: Partial<Appointment> = {};
          headers.forEach((header: string, index: number) => {
            const key = header
              .replace(/[^a-zA-Z0-9 ]/g, '')
              .replace(/ /g, '')
              .toLowerCase();
            
            switch (key) {
              case 'id': obj.id = row[index]; break;
              case 'datedeprisederdvdulead': obj.leadDate = row[index]; break;
              case 'salesms': obj.sales = row[index]; break;
              case 'contact': obj.contact = row[index]; break;
              case 'datedurdv': obj.appointmentDate = row[index]; break;
              case 'heuredurdv': obj.appointmentTime = row[index]; break;
              case 'nomdelacampange': obj.campaignName = row[index]; break;
              case 'nomdelentreprise': obj.companyName = row[index]; break;
              case 'phasedurdv': obj.appointmentPhase = row[index]; break;
              case 'phasedelatransaction': obj.transactionPhase = row[index]; break;
              case 'prixttc': obj.price = row[index]; break;
              default: break;
            }
          });
          return obj as Appointment;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredAppointments = appointments.filter(app => {
          if (!app.appointmentDate) return false;
          const [day, month, year] = app.appointmentDate.split('/').map(Number);
          const appDate = new Date(year, month - 1, day);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() === today.getTime();
        });

        const grouped: GroupedAppointments = filteredAppointments.reduce((acc, app) => {
          if (app.sales) {
            if (!acc[app.sales]) {
              acc[app.sales] = [];
            }
            acc[app.sales].push(app);
          }
          return acc;
        }, {} as GroupedAppointments);

        setGroupedAppointments(grouped);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Impossible de charger les rendez-vous.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'nouveau': return 'bg-blue-500';
      case 'en cours': return 'bg-yellow-500';
      case 'terminé': return 'bg-green-500';
      case 'annulé': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const { data: session } = useSession();

  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Chargement des rendez-vous...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 pt-4 flex justify-between items-center">
          <h1 className="text-5xl font-extrabold text-primary-700 mb-2">
            Dashboard des Rendez-vous Sales
          </h1>
          {session && (
            <div className="flex items-center space-x-4">
              <p className="text-gray-700">Connecté en tant que <span className="font-semibold">{session.user?.name || session.user?.email}</span></p>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          )}
          <p className="text-xl text-gray-600">
            Rendez-vous du <span className="font-bold text-primary-600">{todayFormatted}</span>
          </p>
        </header>

        {Object.keys(groupedAppointments).length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-md">
            <p className="text-center text-2xl text-gray-500">Aucun rendez-vous planifié pour aujourd'hui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedAppointments).map(([salesName, appointments]) => (
              <div key={salesName} className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <h3 className="text-2xl font-bold mb-5 text-primary-700 border-b-2 border-primary-100 pb-3">{salesName}</h3>
                <div className="space-y-5">
                  {appointments.map((app, index) => (
                    <div
                      key={app.id || index}
                      className="bg-gray-50 p-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100 flex flex-col space-y-2"
                      onClick={() => handleAppointmentClick(app)}
                    >
                      <div className="flex items-center text-lg font-semibold text-gray-800">
                        <CalendarIcon />
                        <span>{app.appointmentTime ? `${app.appointmentTime} - ` : ''} {app.contact}</span>
                      </div>
                      {app.companyName && (
                        <p className="flex items-center text-md font-medium text-gray-700">
                          <BuildingIcon />
                          <span>Entreprise: {app.companyName}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <p className="flex items-center">
                          <TagIcon />
                          <span>Phase: {app.appointmentPhase}</span>
                        </p>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getPhaseColor(app.appointmentPhase)}`}>
                          {app.appointmentPhase}
                        </span>
                      </div>
                      {app.campaignName && <p className="text-xs text-gray-500">Campagne: {app.campaignName}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

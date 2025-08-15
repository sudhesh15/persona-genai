import React, { useEffect, useState } from "react";
import PersonaCard from "@/components/PersonaCard";
import ChatWindow from "@/components/ChatWindow";
import { Loader2, MessageCircle } from "lucide-react";

interface Persona {
  name: string;
  age: number;
  birthday: string;
  characteristics: string[];
}

interface PersonasData {
  [key: string]: Persona;
}

const Index = () => {
  const [personas, setPersonas] = useState<PersonasData>({});
  const [selected, setSelected] = useState<string>("person1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with fallback data
    const fetchPersonas = async () => {
      try {
        const response = await fetch("http://localhost:5000/personas");
        if (response.ok) {
          const data = await response.json();
          setPersonas(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        // Fallback data for demo
        console.warn('Using fallback persona data');
        setPersonas({
          person1: {
            name: "Sarah AI",
            age: 25,
            birthday: "March 15",
            characteristics: ["Friendly", "Creative", "Helpful", "Enthusiastic"]
          },
          person2: {
            name: "Alex Mentor",
            age: 30,
            birthday: "July 22",
            characteristics: ["Professional", "Analytical", "Patient", "Wise"]
          },
          person3: {
            name: "TechBot",
            age: 1,
            birthday: "January 1",
            characteristics: ["Logical", "Efficient", "Precise", "Advanced"]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Persona Chat
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose an AI persona and start an engaging conversation. Each persona has a unique personality and style.
        </p>
      </div>

      {/* Persona Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-up">
        {Object.keys(personas).map((personaId) => (
          <PersonaCard
            key={personaId}
            persona={personas[personaId]}
            isActive={selected === personaId}
            onClick={() => setSelected(personaId)}
          />
        ))}
      </div>

      {/* Chat Window */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <ChatWindow personaId={selected} />
      </div>
    </div>
  );
};

export default Index;
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Persona {
  name: string;
  age: number;
  birthday: string;
  characteristics: string[];
  avatar?: string;
  intro: string;
}

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  onClick: () => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isActive, onClick }) => {
  const getAvatarPath = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('sarah') || nameLower.includes('female')) {
      return '/src/assets/persona-female.jpg';
    } else if (nameLower.includes('alex') || nameLower.includes('male')) {
      return '/src/assets/persona-male.jpg';
    } else {
      return '/src/assets/persona-robot.jpg';
    }
  };

  return (
    <Card
      className={cn(
        "relative p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-0 backdrop-blur-md",
        "min-w-[280px] max-w-[320px] group",
        isActive
          ? "persona-card-active animate-pulse-glow"
          : "persona-card-gradient hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className={cn(
          "relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all duration-300",
          isActive ? "border-white shadow-glow" : "border-border/50 group-hover:border-primary/50"
        )}>
          <img
            src={persona.avatar || getAvatarPath(persona.name)}
            alt={persona.name}
            className="w-full h-full object-cover"
          />
          {isActive && (
            <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          )}
        </div>

        {/* Name */}
        <h3 className={cn(
          "text-xl font-bold text-center transition-colors",
          isActive ? "text-white" : "text-foreground"
        )}>
          {persona.name}
        </h3>

        {/* Intro */}
        {persona.intro && (
          <div className={cn(
            "text-sm text-center mt-2",
            isActive ? "text-white/90" : "text-muted-foreground"
          )}>
            {persona.intro}
          </div>
        )}


        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-3 right-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonaCard;
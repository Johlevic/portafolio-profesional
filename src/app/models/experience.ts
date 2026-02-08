// models/experience.ts
export interface Experience {
  company: string;
  location: string;
  role: string;
  duration: string;
  type: string;
  responsibilities: string[];
  icon: string;
  isExpanded?: boolean; // <-- propiedad opcional
  isVisible?: boolean;
}

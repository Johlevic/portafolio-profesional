// experience.model.ts
export interface Experience {
  company: string;
  location: string;
  role: string;
  duration: string;
  type: 'remoto' | 'presencial' | 'hibrido' | 'contrato';
  responsibilities: string[];
  icon: string; // Clase CSS para el ícono
}

export type Role = "user" | "assistant" | "system" | "tool";

export interface Message {
  id: string;
  role: Role;
  content: string;
  ts: number; // Date.now()
}

export interface ChatState {
  messages: Message[];
  pending: boolean;
  error?: string | null;
}

export interface CampaignInput {
  producto: string;
  publico: string;
}

export interface ChatRequestBody {
  messages: { role: Role; content: string }[];
  // Opcional: puedes enviar también producto/público si tu backend lo espera por campos dedicados
  producto?: string;
  publico?: string;
}

export interface ChatResponse {
  messages: Message[]; // respuesta del agente
}

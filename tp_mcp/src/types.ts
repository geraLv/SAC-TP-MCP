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

export interface CampaignResult {
  producto: string;
  publico_objetivo: string;
  tweets: string[];
  linkedin_post?: string | null;
  instagram_post?: string | null;
  resumen?: string | null;
  generated_at?: string | null;
}

export interface CampaignRecord {
  id: string;
  producto: string;
  publico_objetivo: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  result?: CampaignResult | null;
  error?: string | null;
}

export interface CampaignPayload {
  producto: string;
  publico_objetivo: string;
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

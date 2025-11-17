import type { CampaignData, CampaignResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DATA_API_URL =
  import.meta.env.VITE_DATA_API_URL ?? "http://localhost:5001";

export async function postChat(body: unknown): Promise<Response> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

function toErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "error" in body) {
    const value = (body as { error?: unknown }).error;
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return fallback;
}

export async function getCampaignData(): Promise<CampaignData | null> {
  const res = await fetch(`${DATA_API_URL}/datos-campania`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new Error(
      toErrorMessage(body, "No pudimos obtener los datos de la campaña.")
    );
  }

  return parseJson<CampaignData>(res);
}

export async function saveCampaignData(
  payload: CampaignData
): Promise<CampaignData> {
  const res = await fetch(`${DATA_API_URL}/datos-campania`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await parseJson<unknown>(res);

  if (!res.ok) {
    throw new Error(
      toErrorMessage(body, "No pudimos guardar los datos de la campaña.")
    );
  }

  const producto =
    typeof (body as { producto?: unknown }).producto === "string"
      ? (body as { producto: string }).producto
      : payload.producto;
  const publico =
    typeof (body as { publico_objetivo?: unknown }).publico_objetivo ===
    "string"
      ? (body as { publico_objetivo: string }).publico_objetivo
      : payload.publico_objetivo;
  return { producto, publico_objetivo: publico };
}

export async function getCampaignResults(): Promise<CampaignResult | null> {
  const res = await fetch(`${DATA_API_URL}/resultados-campania`, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new Error(
      toErrorMessage(body, "No pudimos obtener los resultados de la campaña.")
    );
  }

  return parseJson<CampaignResult>(res);
}

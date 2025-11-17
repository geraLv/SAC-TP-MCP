import type { CampaignPayload, CampaignRecord } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

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
  if (body && typeof body === "object") {
    if ("error" in body) {
      const value = (body as { error?: unknown }).error;
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
    if ("detail" in body) {
      const value = (body as { detail?: unknown }).detail;
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }
  return fallback;
}

export async function createCampaign(
  payload: CampaignPayload
): Promise<CampaignRecord> {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseJson<unknown>(res);

  if (!res.ok) {
    throw new Error(
      toErrorMessage(body, "No pudimos enviar los datos de la campaña.")
    );
  }

  return body as CampaignRecord;
}

export async function getLatestCampaign(
  status?: CampaignRecord["status"]
): Promise<CampaignRecord | null> {
  const url = new URL(`${API_URL}/campaigns/latest`);
  if (status) {
    url.searchParams.set("status", status);
  }
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new Error(
      toErrorMessage(body, "No pudimos obtener la última campaña generada.")
    );
  }

  return parseJson<CampaignRecord>(res);
}

export async function getCampaigns(limit = 20): Promise<CampaignRecord[]> {
  const url = new URL(`${API_URL}/campaigns`);
  url.searchParams.set("limit", String(limit));
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new Error(
      toErrorMessage(body, "No pudimos obtener el historial de campañas.")
    );
  }

  return parseJson<CampaignRecord[]>(res);
}

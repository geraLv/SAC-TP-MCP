const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function postChat(body: unknown): Promise<Response> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

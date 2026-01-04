// lib/kv.ts
const KV_URL = process.env.KV_REST_API_URL!;
const KV_TOKEN = process.env.KV_REST_API_TOKEN!;

export async function kvGet<T>(key: string): Promise<T | null> {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.result ?? null;
}

export async function kvSet<T>(key: string, value: T, ttlSeconds: number) {
  await fetch(`${KV_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
      ex: ttlSeconds,
    }),
  });
}

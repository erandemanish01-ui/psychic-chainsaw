// Netlify function: POST /api/checkout
import { createCheckout } from "../../lib/checkout.mjs";

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const { status, body } = await createCheckout(payload, new URL(req.url).origin);
  return json(status, body);
};

export const config = { path: "/api/checkout" };

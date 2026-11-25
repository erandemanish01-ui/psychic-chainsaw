// Vercel function: POST /api/checkout
import { createCheckout } from "../lib/checkout.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  let payload;
  try {
    payload = req.body; // Vercel parses JSON lazily and throws here if it is malformed
    if (typeof payload === "string") payload = JSON.parse(payload);
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  const { status, body } = await createCheckout(payload, `${proto}://${req.headers.host}`);
  return res.status(status).json(body);
}

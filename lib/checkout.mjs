// Creates a Stripe Checkout Session for the shopping bag.
// Shared by api/checkout.mjs (Vercel) and netlify/functions/create-checkout-session.mjs (Netlify).
// Prices are looked up server-side from Stripe price IDs, so the browser can't change what is charged.
// Requires the STRIPE_SECRET_KEY environment variable (set it in the host's dashboard, never in the site code).

const PRICES = {
  1: "price_1UdrK4Afl38tcHyZbLnUWIsm", // Structured Everyday Blazer  £89
  4: "price_1UdrKNAfl38tcHyZWBlRPpfk", // Soft Form Ceramic Vase      £36
  8: "price_1UeA9TAfl38tcHyZSsWeD9aN", // Natural Linen Cushion Cover £59
  // ids 2, 3, 5, 6, 7 retired — never reuse them
  9:  "price_1Ue9nlAfl38tcHyZvlXZFaBj", // MON-001 Aurelia Contrast Work Tote          £139.99
  10: "price_1Ue9o7Afl38tcHyZCPjn6WZL", // MON-002 Noir Quilted Multi-Pocket Backpack  £135.99
  11: "price_1Ue9o7Afl38tcHyZFGLZqFwW", // MON-003 Vela Quilted Crossbody Bag          £112.99
  12: "price_1Ue9o8Afl38tcHyZB5TcfLbO", // MON-004 Sable Everyday Travel Backpack      £132.99
  13: "price_1Ue9o9Afl38tcHyZg5ipYBe7", // MON-005 Silver Edit 45-Piece Jewellery Set  £114.99
  14: "price_1Ue9oAAfl38tcHyZUprPMwi0", // MON-006 Rosé Heart Crystal Stud Earrings    £133.99
  15: "price_1Ue9oBAfl38tcHyZhfIDxEqv", // MON-007 Celeste Tree Pendant Necklace       £146.39
  16: "price_1Ue9oCAfl38tcHyZJku2fQXW", // MON-008 Clover Initial Pendant Necklace     £115.99
  17: "price_1Ue9oDAfl38tcHyZlNaUCRGW", // MON-009 Northline Hooded Fleece Jacket      £76.00
  18: "price_1Ue9oEAfl38tcHyZYFFRY5Fe", // MON-010 Trailmark Waterproof Hooded Jacket  £89.00
  19: "price_1Ue9oFAfl38tcHyZMJfHz3Nf", // MON-011 Packlite Lightweight Rain Jacket    £99.00
};

const fail = (status, error, extra = {}) => ({ status, body: { error, ...extra } });

export async function createCheckout(payload, origin) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return fail(500, "Payments are not configured yet.");

  const items = payload?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return fail(400, "Your bag is empty.");
  }

  const form = new URLSearchParams();
  for (const [i, item] of items.entries()) {
    const price = Object.hasOwn(PRICES, item?.id) ? PRICES[item.id] : null;
    const quantity = Number(item?.qty);
    if (!price || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return fail(400, "Your bag contains an invalid item.");
    }
    form.append(`line_items[${i}][price]`, price);
    form.append(`line_items[${i}][quantity]`, String(quantity));
  }

  form.append("mode", "payment");
  form.append("success_url", `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  form.append("cancel_url", `${origin}/?checkout=cancelled`);
  form.append("shipping_address_collection[allowed_countries][0]", "GB");
  form.append("phone_number_collection[enabled]", "true");
  form.append("billing_address_collection", "auto");

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key.trim()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const session = await res.json();
    if (!res.ok) {
      const code = session.error?.code || session.error?.type || `http_${res.status}`;
      console.error("Stripe error:", code, session.error?.message);
      return fail(502, "Could not start checkout. Please try again.", { code });
    }
    return { status: 200, body: { url: session.url } };
  } catch (err) {
    console.error("Stripe request failed:", err);
    return fail(502, "Could not start checkout. Please try again.");
  }
}

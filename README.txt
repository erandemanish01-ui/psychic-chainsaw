MONIYORA — OXO-London-inspired storefront prototype

This updated design follows the reference site's broad ecommerce structure: compact announcement strip, full shopping navigation with category mega-menu, rotating hero banners, promotional ticker, category browsing, bestseller grid, fresh arrivals, seasonal feature, social gallery, service benefits and detailed footer.

It is an original Moniyora design and does not copy OXO London's logo, text, product photos, code or brand assets.

Open index.html in a browser. Internet is needed for Google Fonts and Unsplash images.

Interactive prototype:
- Category navigation and filtering
- Search, rotating hero, responsive mobile menu
- Product cards and add-to-bag
- Shopping bag quantity updates and subtotal
- Account, seller registration, wholesale and order tracking form interfaces
- Newsletter form interface

Not production-connected:
No actual checkout/payment, customer account, order database, shipment tracking, seller submission, wholesale email, or newsletter subscription is active. Connect an ecommerce platform/backend, secure payment processor, authentication, fulfilment/carrier tracking, email/CRM and consent-compliant analytics before taking orders. Add accurate UK privacy, cookie, terms, delivery, returns and refund policies and verified company contact details. Sample products/prices/images are placeholders.


STRIPE CHECKOUT (added)
- Live Stripe account (Moniyora Ltd): 11 SKUs MON-001..MON-011 (site ids 9-19, metadata sku/asin)
  + 3 original products (ids 1 blazer, 4 vase, 8 cushion £59). Ids 2,3,5,6,7 archived — never reuse those ids.
- Product images: product_images/MON-xxx.jpg (draft, user-supplied — confirm image rights before launch).
- "Proceed to checkout" posts the bag to /api/checkout. The logic and price IDs are in lib/checkout.mjs;
  api/checkout.mjs serves it on Vercel, netlify/functions/create-checkout-session.mjs on Netlify.
- The host must have STRIPE_SECRET_KEY set. Vercel: Project > Settings > Environment Variables (Production), then redeploy.
  Never put the secret key in any site file.
- Changing a price: create a new price in Stripe and update the PRICES map in lib/checkout.mjs, plus the price in script.js.
- Opening index.html directly from disk will NOT work for checkout; use the deployed site or `vercel dev` / `netlify dev`.

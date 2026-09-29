## Q1 — Blocking questions (PR author only)

Please reply on this PR with **A1**, **A2**, and **A3** (one thread or separate comments). The task plan below stays **waiting-for-approve** until these are recorded in `docs/ambiguity-log.md`.

---

**Q1 — Portland mail-order shipping fee at checkout**

The RFP leaves the shipping fee model for Portland mail-order to implementers. For the POC checkout total, which rule should we demo?

- Flat fee per order (please state amount or “fictional flat $X”)
- Fee by item count or weight tier (describe briefly)
- Free shipping over a cart subtotal threshold (state threshold)
- **$0 / placeholder line** with copy such as “shipping calculated at fulfilment” (no numeric fee)

---

**Q2 — Returns and refunds in the POC**

The RFP states a fourteen-day returns limit but not condition, refund method, or return-shipping rules. What should the POC include?

- **(a)** Static buyer-facing policy text only (no return initiation UI)
- **(b)** Simple “request return” demo form with placeholder staff handling
- **(c)** Omit returns from the POC entirely for now

---

**Q3 — Staff tools access in the POC**

How should staff reach inventory, staff picks, and guest order lookup in this demo?

- No login or gate (local POC only; `/staff/*` unauthenticated)
- Shared demo password (you specify label/behavior)
- Other (describe)

---

After answers are logged, reply **`/approve`** (or run `/irfp-approve` in Cursor) to unlock implementation.

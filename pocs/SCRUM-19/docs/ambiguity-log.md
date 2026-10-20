# Ambiguity log

- Jira key: SCRUM-19

## Open questions

_(none — Q1–Q11 answered in Jira comment 10405, 2026-10-19)_

## Answered

### Q1 — Displayed price rule

- Asked: 2026-10-19 (Requirements Planner)
- Question: For browse, product detail, basket, and checkout, should the POC treat prices as **cached/guide “from” prices** only, **live bookable prices** that must match at payment, or **both** with explicit messaging when they differ? What copy must appear when a price is indicative versus final?
- Answer (Jira comment 10405, **A1**): Browse, listing, and detail use cached guide “from” prices (fixture-backed, refreshed on a notional daily job). Basket and checkout show the same guide price as “Price today” with short copy: “Final price is confirmed when you pay. If the supplier price changes before payment, we’ll show the updated total before you confirm.” No live supplier API in the POC; one mock “price changed” path on checkout is enough to demo the message. Indicative: label “Guide price” / “From” on browse; “Total to pay today” on checkout.
- Status: answered

### Q2 — Guest versus registered accounts

- Asked: 2026-10-19 (Requirements Planner)
- Question: In phase one, is checkout **guest-only** (email minimum for lookup/confirmation), **account optional**, or **account required** for some journeys (e.g. held quote, repeat bookers)? If required in some cases, which paths?
- Answer (Jira comment 10405, **A2**): Guest checkout is the default (email required; name optional). Optional account via “Save details for next time” (email + password, fake auth). No account-required path in the POC. Staff/back-office login is out of scope.
- Status: answered

### Q3 — Online payment schedule

- Asked: 2026-10-19 (Requirements Planner)
- Question: At hosted-card checkout, should the POC collect **full balance**, a **deposit** (e.g. thirty percent with balance later), or **buyer-selectable** schedule where compliant? What deposit/balance labels and amounts should appear on checkout summary for the demo?
- Answer (Jira comment 10405, **A3**): Hosted-card flow collects a **30% deposit** at checkout; balance due before travel (date from fixture). Demo labels: “Pay deposit today (30%)”, “Balance due by [fixture date]”, line items for deposit vs balance. Full-pay-only is not required for the demo.
- Status: answered

### Q4 — Flight-only SKUs on the web

- Asked: 2026-10-19 (Requirements Planner)
- Question: Should the customer-facing POC include **any flight-only** packages in browse/search fixtures, or **packaged leisure only** (flight+hotel, hotel-only, curated specials) with flight-only excluded from the web catalog?
- Answer (Jira comment 10405, **A4**): Packaged leisure only in the customer catalog (flight + hotel or flight + package). Flight-only SKUs are not bookable online; they may appear as “Call to book” teasers at most—default POC: **omit flight-only from catalog** to reduce scope.
- Status: answered

### Q5 — Shop attribution on checkout

- Asked: 2026-10-19 (Requirements Planner)
- Question: When a shopper selects a **shop** at checkout, how should attribution work for the demo—**round-robin call centre**, **sticky retail consultant**, **nearest high-street shop**, or **no shop picker in POC** until policy is set? Which shop list (names/locations) may appear in fixtures?
- Answer (Jira comment 10405, **A5**): At checkout, shopper picks a shop from a dropdown (functional per Q9). Attribution rule for the demo: **selected shop wins** (retail consultant ownership of that shop in fixtures). Demo shop names only: “Harbour Travel — Manchester”, “Harbour Travel — Leeds”, “Harbour Travel — Bristol” (fictional). No round-robin or geo-nearest in POC.
- Status: answered

### Q6 — Supplier feed failure UX

- Asked: 2026-10-19 (Requirements Planner)
- Question: When a package is temporarily unavailable due to **supplier/feed failure**, should the POC **hide** the product, show it with a **telephone call-to-action**, or show **honest temporary unavailability** inline (and on detail)? Should basket/checkout block affected lines?
- Answer (Jira comment 10405, **A6**): Affected products show “Temporarily unavailable” with telephone CTA (non-clickable number in UI copy, e.g. 0800 000 0000). Block add-to-basket for affected lines; if already in basket, block checkout with message to remove or call. Do not hide silently.
- Status: answered

### Q7 — Currency and VAT display

- Asked: 2026-10-19 (Requirements Planner)
- Question: For GBP-default with occasional EUR quotes, should list/detail/basket/checkout show **prices inclusive of VAT**, **exclusive with VAT line**, or **per product type** rules? How should EUR packages be labelled when shown alongside GBP?
- Answer (Jira comment 10405, **A7**): Prices **VAT-inclusive in GBP** on all customer-facing totals. Checkout shows one line: “Includes VAT where applicable.” EUR shown as secondary reference only: “Approx. €XXX (indicative; you pay in GBP)” using a fixed fixture rate—no live FX.
- Status: answered

### Q8 — Held-quote capture

- Asked: 2026-10-19 (Requirements Planner)
- Question: For **held-quote** (distinct from paid checkout), which fields are **required** in phase one—e.g. email only, email + phone, travel dates, party size, departure airport—and what **confirmation message** should the shopper see after submit (no invented SLA)?
- Answer (Jira comment 10405, **A8**): Required: email, phone, departure date, return date, adults / children, preferred airport (dropdown from fixtures), package or destination (from context). Optional: notes. Confirmation (no SLA): “We’ve saved your request. A consultant will contact you using the details you provided.” Do not promise response times.
- Status: answered

### Q9 — Checkout shop picker in POC

- Asked: 2026-10-19 (Requirements Planner)
- Question: Wireframes omit the shop picker; for this POC should we render a **functional shop dropdown** (behaviour per **A5**), a **disabled placeholder** explaining “attribution TBC”, or **omit** the control until buyer policy exists?
- Answer (Jira comment 10405, **A9**): **Functional shop dropdown** at checkout (required field), populated from the three demo shops in A5. Not disabled; not omitted.
- Status: answered

### Q10 — Travel guide / blog depth

- Asked: 2026-10-19 (Requirements Planner)
- Question: RFP cites ~fifty migrated articles. For the POC, should we implement **a short sample list** (e.g. three to five fictional guides), **listing only** with one sample article body, or **defer blog routes** entirely and link nav to browse only?
- Answer (Jira comment 10405, **A10**): Listing page + one sample article (static markdown/fixture). No CMS; **two guide cards** on listing, one full article route. Defer comments, tags, and search.
- Status: answered

### Q11 — Contact and trust copy

- Asked: 2026-10-19 (Requirements Planner)
- Question: For **contact page** hours/bank-holiday text and **ATOL/trust strip** footer placeholders, should the POC use **buyer-supplied wording** you will paste in Jira, **explicit placeholder labels** (e.g. “ATOL copy pending legal”), or **omit** trust/legal blocks until approved copy exists?
- Answer (Jira comment 10405, **A11**): Use explicit placeholders: “ATOL / trust wording — pending legal approval” in a muted trust strip on checkout and footer. Contact block: fictitious “Customer services: Mon–Fri 9–5” and placeholder phone. Do not invent real ATOL numbers or regulatory claims.
- Status: answered

## Ignored comments

Comments from the automation account or bodies prefixed `**[IRFP POC Creator]**` (do not use for gates).

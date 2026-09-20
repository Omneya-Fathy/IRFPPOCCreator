# RFP brief

- Jira key: SCRUM-6
- Attachments used: RFP.docx
- Extracted at: 2026-09-20

## Description

Willow & Page Booksellers needs an e-commerce site for physical books. Customers browse and search the catalogue, view product details, add items to a cart, and complete guest checkout with delivery address. Staff curate featured lists and manage inventory (price and on-hand quantity per location). Website stock changes only when staff edit it — not on web checkout or till sale.

## Core capabilities

- Catalogue browse and search (genre, author, title, ISBN)
- Product pages: cover, title, author, ISBN, price, stock display
- Shopping cart (add, update quantity, remove)
- Guest checkout with delivery address
- Order confirmation (email payload for POC)
- Staff-curated featured lists on home page
- Staff inventory: edit price and on-hand quantity per location (Hawthorne, Cedar)
- Staff order lookup
- Stock does not auto-decrement on checkout

## UI specifications

Missing — must ask. PR author approved **minimal functional layout** (nav, catalogue grid, product detail, cart, checkout, staff admin).

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Ebooks, gift wrap, loyalty programs
- Till integration, auto stock sync
- Recommendations engine
- Cedar ship-from
- Account-required checkout
- Real payment processing (PR author: no payment for now)

## Blocking gaps

| Gap | Resolution |
| --- | --- |
| Shipping destinations | Egypt only (PR author A1) |
| In-stock display | Single in-stock flag (PR author A2) |
| Staff auth | Open without auth for demo (PR author A3) |
| Card payments | No payment for now (PR author A4) |
| Order email | Log/show confirmation payload (PR author A5) |
| UI layout | Minimal functional layout (PR author A6) |

## Sensitive data

Use fake data only. No real customer records or payment credentials.

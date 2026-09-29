# Test report

- Jira key: SCRUM-11
- Vitest: **passed** (28 tests, 11 files)
- Command: `npm test` in `pocs/SCRUM-11/`
- Build: `npm run build` succeeded (review run)

## Coverage highlights

- Theme tokens differ from scaffold defaults (`lib/theme.test.ts`)
- Availability helpers: combined, mail-order eligible, in-store only (`lib/inventory.test.ts`)
- Portland address validation (`lib/portland-address.test.ts`)
- Checkout: rejects non-Portland and in-store-only cart; A1 shipping fee fields (`lib/checkout.test.ts`)
- Guest order lookup requires order id **and** email (`lib/store.test.ts`)
- Cart excludes non–mail-order-eligible lines (`lib/cart.test.ts`)
- Static returns policy route (`lib/returns-policy.test.ts`)
- Staff unauthenticated access (`lib/staff-access.test.ts`)

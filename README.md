# OrbitPay — cross-border payments platform foundation

A distinct fintech dashboard foundation inspired by the operational breadth of global payment platforms. It is not affiliated with Flutterwave, Relworx, Wise, or any other provider.

## What is included
- Responsive Next.js dashboard interface.
- Transfer quote form (calculation-only; no money movement).
- Sender-paid fee calculation endpoint using integer minor units.
- PostgreSQL starter schema for users, merchants, beneficiaries, transfers, fee rules and a double-entry ledger.
- Environment variable template.

## Requirements
- Node.js 20+
- PostgreSQL 15+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Quote endpoint
`POST /api/quote`

Example:
```json
{
  "principalMinor": 100000,
  "currency": "EUR",
  "platformFeeBps": 100,
  "providerFeeBps": 480,
  "fixedFeeMinor": 0
}
```
All amounts are integer minor units. The endpoint returns a calculation only. It does not collect funds, create a wallet balance, convert currency, or initiate a payout.

## Database
Create a PostgreSQL database and apply:
```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Critical production work still required
1. Select the legal operating model and obtain required authorisations in each market/corridor.
2. Contract appropriately licensed collection, safeguarding/custody, FX and payout partners.
3. Implement provider-specific payment initiation, signed webhooks, idempotency, retries and reconciliation.
4. Implement full double-entry posting with per-currency debit/credit balancing and immutable audit history.
5. Implement identity verification, KYB, sanctions/PEP screening, AML transaction monitoring, suspicious activity escalation and record retention.
6. Add secure sessions, MFA, RBAC, secrets management, encryption, rate limiting, abuse prevention and security testing.
7. Obtain card-industry compliance through a PCI-compliant provider/tokenisation approach; do not store raw card data.
8. Add live FX sourcing, quote expiry, slippage controls, fee-rule approval/versioning and customer disclosures.
9. Build operational controls for refunds, disputes, chargebacks, failed payouts and customer support.
10. Complete independent penetration testing, reconciliation tests, disaster recovery and regulatory sign-off before production.

## Important
This repository is a software starting point, not a licensed financial institution or production remittance service. Do not accept or hold customer funds with it. Dashboard sample rows are illustrative UI content only; no live transaction data is present.

# OrbitPay — Phase 2 account foundation

This is a development starter for the OrbitPay global payments project. It adds Supabase email/password authentication, personal/merchant signup selection, a protected customer dashboard, and a minimal profiles schema.

## Run locally
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and add the project URL and anon key.
4. Run `npm install`, then `npm run dev`.
5. Open `http://localhost:3000`.

## Important security notes
- Do not expose the Supabase service-role key in browser code.
- The signup metadata is only a request for a personal or merchant profile. Never permit self-assignment of admin privileges.
- Before launch, add server-side authorization/RBAC, email verification enforcement, MFA, rate limits, bot protection, audit logs, secure password reset, session controls, KYC/KYB, sanctions screening, fraud monitoring, and tested data-retention controls.
- The schema intentionally contains no wallet balance or money-transfer execution. A production ledger must be immutable, double-entry, currency-specific, reconciled, and posted only after verified settlement events.
- This project does not accept, store, convert, or pay out real funds. Use licensed payment/e-money/remittance partners and obtain required approvals in every market before enabling money movement.
- The dashboard is not a production financial service and has not been security-audited.

## Planned next modules
1. Merchant onboarding, KYB and API key lifecycle.
2. Admin console with server-enforced RBAC and immutable audit trail.
3. Fee engine: sender pays all disclosed charges; recipient receives the quoted principal after FX.
4. Provider adapter interfaces for bank, card and mobile-money partners.
5. Double-entry ledger, settlement, reconciliation, refunds and dispute workflows.
6. Corridor-by-corridor compliance and regulatory launch checklist.

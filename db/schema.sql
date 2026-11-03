-- PostgreSQL foundation. Run only after creating a dedicated database.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer','merchant','admin','compliance')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  legal_name TEXT NOT NULL,
  country_code CHAR(2) NOT NULL,
  kyc_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  display_name TEXT NOT NULL,
  country_code CHAR(2) NOT NULL,
  payout_method TEXT NOT NULL,
  provider_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fee_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  currency CHAR(3) NOT NULL,
  platform_fee_bps INTEGER NOT NULL DEFAULT 0 CHECK (platform_fee_bps >= 0),
  provider_fee_bps INTEGER NOT NULL DEFAULT 0 CHECK (provider_fee_bps >= 0),
  fixed_fee_minor BIGINT NOT NULL DEFAULT 0 CHECK (fixed_fee_minor >= 0),
  minimum_fee_minor BIGINT,
  maximum_fee_minor BIGINT,
  version INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(corridor,payment_method,currency,version)
);

CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference TEXT NOT NULL UNIQUE,
  sender_user_id UUID NOT NULL REFERENCES users(id),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id),
  source_currency CHAR(3) NOT NULL,
  destination_currency CHAR(3) NOT NULL,
  principal_minor BIGINT NOT NULL CHECK (principal_minor > 0),
  sender_fee_minor BIGINT NOT NULL CHECK (sender_fee_minor >= 0),
  sender_total_minor BIGINT NOT NULL CHECK (sender_total_minor = principal_minor + sender_fee_minor),
  fx_rate NUMERIC(24,12),
  recipient_amount_minor BIGINT,
  status TEXT NOT NULL CHECK (status IN ('created','quoted','awaiting_funds','funds_received','compliance_review','payout_pending','completed','failed','refunded','cancelled')),
  provider_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only double-entry ledger. Never edit/delete posted entries.
CREATE TABLE ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_code TEXT NOT NULL UNIQUE,
  currency CHAR(3) NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset','liability','equity','income','expense')),
  owner_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID REFERENCES transfers(id),
  description TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_transaction_id UUID NOT NULL REFERENCES ledger_transactions(id),
  account_id UUID NOT NULL REFERENCES ledger_accounts(id),
  direction TEXT NOT NULL CHECK (direction IN ('debit','credit')),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transfers_sender_created ON transfers(sender_user_id, created_at DESC);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_beneficiaries_user ON beneficiaries(user_id);
CREATE INDEX idx_ledger_entries_transaction ON ledger_entries(ledger_transaction_id);

-- Production must add a deferred constraint/transactional posting service
-- that guarantees total debits equal total credits per currency.
-- Ledger writes should be append-only and performed inside DB transactions.

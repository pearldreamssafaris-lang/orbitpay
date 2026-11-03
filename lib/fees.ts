export type FeeInput = {
  principalMinor: number;
  currency: string;
  platformFeeBps: number;
  providerFeeBps: number;
  fixedFeeMinor: number;
};

/**
 * Amounts are integer minor units (e.g. cents/cents-equivalent).
 * Basis points: 100 bps = 1%. Fee is added to sender's payment;
 * recipient principal is not reduced by this calculation.
 * Production pricing must be loaded from an approved, versioned fee table.
 */
export function calculateSenderPaidQuote(input: FeeInput) {
  const { principalMinor, currency, platformFeeBps, providerFeeBps, fixedFeeMinor } = input;
  for (const [key, value] of Object.entries({ platformFeeBps, providerFeeBps, fixedFeeMinor })) {
    if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${key} must be a non-negative integer`);
  }
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("currency must be a three-letter ISO code");
  const platformFeeMinor = Math.round(principalMinor * platformFeeBps / 10000);
  const providerFeeMinor = Math.round(principalMinor * providerFeeBps / 10000);
  const totalFeeMinor = platformFeeMinor + providerFeeMinor + fixedFeeMinor;
  return {
    currency,
    recipientPrincipalMinor: principalMinor,
    platformFeeMinor,
    providerFeeMinor,
    fixedFeeMinor,
    totalSenderFeeMinor: totalFeeMinor,
    totalSenderPaysMinor: principalMinor + totalFeeMinor
  };
}

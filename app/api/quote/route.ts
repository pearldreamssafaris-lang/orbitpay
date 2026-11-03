import { NextResponse } from "next/server";
import { calculateSenderPaidQuote } from "@/lib/fees";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { principalMinor, currency, platformFeeBps, providerFeeBps, fixedFeeMinor } = body;
    if (!Number.isSafeInteger(principalMinor) || principalMinor <= 0) {
      return NextResponse.json({ error: "principalMinor must be a positive integer in the currency's minor unit." }, { status: 400 });
    }
    const quote = calculateSenderPaidQuote({
      principalMinor,
      currency: String(currency || "").toUpperCase(),
      platformFeeBps: Number(platformFeeBps ?? 0),
      providerFeeBps: Number(providerFeeBps ?? 0),
      fixedFeeMinor: Number(fixedFeeMinor ?? 0)
    });
    return NextResponse.json({ ...quote, mode: "calculation_only", message: "Not a payment instruction. Configure approved providers, live FX and compliance before production." });
  } catch {
    return NextResponse.json({ error: "Invalid quote request." }, { status: 400 });
  }
}

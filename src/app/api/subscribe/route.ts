// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { subscribeToMailerLite } from '@/lib/mailerlite';

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const { email, name, city, honeypot } = await req.json();

    if (honeypot && String(honeypot).trim() !== '') {
      return NextResponse.json({ ok: true }); // bot ignorato
    }
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'EMAIL_INVALID' }, { status: 400 });
    }

    await subscribeToMailerLite({ email, name, city });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'UNEXPECTED';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

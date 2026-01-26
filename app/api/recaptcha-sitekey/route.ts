import { NextResponse } from 'next/server'

/**
 * Public endpoint to fetch reCAPTCHA site key at runtime.
 * This avoids relying on client-side build-time env inlining.
 */
export async function GET() {
  const siteKey = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '').trim()
  return NextResponse.json({ siteKey })
}


import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return NextResponse.json({
    hasUrl: !!url,
    hasKey: !!key,
    urlLength: url?.length || 0,
    keyLength: key?.length || 0,
    urlPreview: url?.substring(0, 30) + '...' || 'missing',
    keyPreview: key?.substring(0, 30) + '...' || 'missing',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
  })
}

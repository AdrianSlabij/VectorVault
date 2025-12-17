import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
// This route handles the OAuth callback from Supabase. Supabase gives us a code
export async function GET(request) {
  console.log('Auth callback invoked')
  const { searchParams, origin } = new URL(request.url)
  //Grab the code from Supabase
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/chat'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
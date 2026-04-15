import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

// Edge-compatible: usa solo authConfig, sin bcryptjs
const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  // Prevención de redirect loop
  if (pathname === '/cuenta-suspendida') return NextResponse.next()

  if (pathname.startsWith('/dashboard/professional')) {
    // Sin sesión → login
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Solo verificar suscripción para profesionales
    if (session.user?.role === 'professional') {
      try {
        const response = await fetch(`${req.nextUrl.origin}/api/check-active-status`, {
          headers: { 'Cookie': req.headers.get('cookie') || '' },
        })

        if (response.ok) {
          const data = await response.json()

          if (!data.isActive) {
            return NextResponse.redirect(new URL('/cuenta-suspendida', req.url))
          }

          const now = new Date()
          const { subscription_status, trial_ends_at, grace_period_ends_at } = data

          if (subscription_status === 'active') {
            // OK — continuar
          } else if (subscription_status === 'trialing') {
            if (!trial_ends_at || new Date(trial_ends_at) <= now) {
              return NextResponse.redirect(new URL('/cuenta-suspendida', req.url))
            }
          } else if (subscription_status === 'past_due') {
            if (!grace_period_ends_at || new Date(grace_period_ends_at) <= now) {
              return NextResponse.redirect(new URL('/cuenta-suspendida', req.url))
            }
          } else {
            return NextResponse.redirect(new URL('/cuenta-suspendida', req.url))
          }
        }
      } catch (error) {
        console.error('Middleware: error al verificar suscripción:', error)
        // En caso de error temporal, dejamos pasar
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/professional/:path*',
    '/cuenta-suspendida',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Si está en el dashboard del profesional, verificar que esté activo
  if (request.nextUrl.pathname.startsWith('/dashboard/professional')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Si es profesional, verificar que su cuenta esté activa
    if (session.user.role === 'professional') {
      try {
        // Verificar en Supabase si está activo
        const response = await fetch(`${request.nextUrl.origin}/api/check-active-status`, {
          headers: {
            'Cookie': request.headers.get('cookie') || '',
          },
        })

        if (response.ok) {
          const data = await response.json()

          // Si la cuenta está inactiva, redirigir a página de suspensión
          if (!data.isActive) {
            return NextResponse.redirect(new URL('/cuenta-suspendida', request.url))
          }
        }
      } catch (error) {
        console.error('Error checking active status:', error)
        // En caso de error, dejamos pasar (para no bloquear si hay un problema temporal)
      }
    }
  }

  // Permitir acceso si está en la página de cuenta suspendida
  if (request.nextUrl.pathname === '/cuenta-suspendida') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/professional/:path*',
    '/cuenta-suspendida',
  ],
}

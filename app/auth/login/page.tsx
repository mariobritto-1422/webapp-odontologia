'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthSidePanel from '../_components/AuthSidePanel'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const registered = searchParams.get('registered')
    if (registered === 'true') {
      setSuccessMessage('¡Cuenta creada exitosamente! Ya podés iniciar sesión.')
    } else if (registered === 'patient') {
      setSuccessMessage('¡Registro completado! Ya podés iniciar sesión.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        const authError = String(result.error)

        if (
          authError.includes('AUTH_SERVER_MISCONFIGURED') ||
          authError.includes('AUTH_PROFESSIONAL_QUERY_FAILED') ||
          authError.includes('AUTH_PATIENT_QUERY_FAILED') ||
          authError.includes('CallbackRouteError')
        ) {
          setError('Error del servidor al validar el acceso. Si estás en producción, revisá Netlify y las variables de Supabase.')
        } else {
          setError('Email o contraseña incorrectos')
        }
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel />

      {/* Panel derecho */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="13" fill="#1A56DB"/>
                <text x="32" y="38" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="30" fontWeight="800" fill="white" letterSpacing="-1">S</text>
                <path d="M18 47 Q32 56 46 47" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="text-xl font-bold text-blue-600">SonrisApp</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
            <p className="text-sm text-slate-500 mt-1">Ingresá a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg py-2.5 font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 text-center mb-3">¿No tenés cuenta?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/auth/register/professional"
                className="text-center border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Soy Profesional
              </Link>
              <Link
                href="/auth/register/patient"
                className="text-center border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Soy Paciente
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

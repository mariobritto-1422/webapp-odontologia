'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthSidePanel from '../../_components/AuthSidePanel'

interface Professional {
  id: string
  name: string
  specialty: string
  slug: string
  branding: {
    logoUrl?: string
    primaryColor?: string
    consultorioName?: string
  }
}

function RegisterPatientForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const professionalSlug = searchParams.get('professional')

  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loadingProfessional, setLoadingProfessional] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (professionalSlug) {
      fetchProfessional(professionalSlug)
    } else {
      setLoadingProfessional(false)
    }
  }, [professionalSlug])

  const fetchProfessional = async (slug: string) => {
    try {
      const response = await fetch(`/api/professionals/${slug}`)
      const data = await response.json()

      if (response.ok && data.professional) {
        setProfessional(data.professional)
      } else {
        setError('Profesional no encontrado')
      }
    } catch (error) {
      setError('Error al cargar información del profesional')
    } finally {
      setLoadingProfessional(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!professionalSlug) {
      setError('Debes seleccionar un profesional para registrarte')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      setError('Debes aceptar los términos y la política de privacidad')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          professionalSlug,
          acceptedTerms: formData.acceptedTerms,
          acceptedPrivacy: formData.acceptedPrivacy,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al crear la cuenta')
        return
      }

      router.push('/auth/login?registered=patient')
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfessional) {
    return (
      <div className="min-h-screen flex">
        <AuthSidePanel />
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!professionalSlug || !professional) {
    return (
      <div className="min-h-screen flex">
        <AuthSidePanel />
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Registro de Paciente</h1>
            <p className="text-sm text-slate-500">
              {error || 'Necesitás un enlace de invitación de tu profesional para registrarte.'}
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-semibold transition-colors text-sm"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel />

      {/* Panel derecho */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

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
            <h1 className="text-2xl font-bold text-slate-900">Crear cuenta de paciente</h1>
          </div>

          {/* Info del profesional */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">Te estás registrando con:</p>
            <p className="font-semibold text-slate-900 text-sm">{professional.name}</p>
            <p className="text-xs text-slate-500">{professional.specialty}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="+542945415186"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Repetí tu contraseña"
                required
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  className="mt-0.5 accent-blue-600"
                  required
                />
                <span className="text-sm text-slate-600">
                  Acepto los{' '}
                  <Link href="/terminos" target="_blank" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </Link>{' '}
                  *
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptedPrivacy"
                  checked={formData.acceptedPrivacy}
                  onChange={handleChange}
                  className="mt-0.5 accent-blue-600"
                  required
                />
                <span className="text-sm text-slate-600">
                  Acepto la{' '}
                  <Link href="/privacidad" target="_blank" className="text-blue-600 hover:underline">
                    política de privacidad
                  </Link>{' '}
                  *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg py-2.5 font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya tenés cuenta?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Iniciar sesión
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function RegisterPatientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Cargando...</p>
        </div>
      </div>
    }>
      <RegisterPatientForm />
    </Suspense>
  )
}

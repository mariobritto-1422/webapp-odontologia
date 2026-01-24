'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!professionalSlug || !professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🦷 Registro de Paciente
          </h1>
          <p className="text-gray-600 mb-8">
            {error || 'Necesitas un enlace de invitación de tu profesional para registrarte.'}
          </p>
          <Link href="/auth/login">
            <button className="btn-primary">
              Volver al Login
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🦷 Registro de Paciente
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600 mb-1">Te estás registrando con:</p>
            <p className="font-semibold text-gray-900">{professional.name}</p>
            <p className="text-sm text-gray-600">{professional.specialty}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Repetí tu contraseña"
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="mt-1 mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                Acepto los términos y condiciones *
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                name="acceptedPrivacy"
                checked={formData.acceptedPrivacy}
                onChange={handleChange}
                className="mt-1 mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                Acepto la política de privacidad *
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPatientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <RegisterPatientForm />
    </Suspense>
  )
}

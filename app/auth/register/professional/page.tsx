'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthSidePanel from '../../_components/AuthSidePanel'

export default function RegisterProfessionalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    specialty: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones del cliente
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register/professional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          specialty: formData.specialty,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al crear la cuenta')
        return
      }

      // Registro exitoso, redirigir al login
      router.push('/auth/login?registered=true')
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-slate-900">Crear cuenta profesional</h1>
            <p className="text-sm text-slate-500 mt-1">Empezá tu prueba gratis de 14 días</p>
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
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-1">
                Especialidad *
              </label>
              <input
                id="specialty"
                name="specialty"
                type="text"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Odontología General"
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

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg py-2.5 font-semibold transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta Profesional'}
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

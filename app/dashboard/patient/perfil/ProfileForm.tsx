'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Patient = {
  id: string
  name: string
  email: string
  phone: string | null
  professional: {
    id: string
    name: string
    specialty: string
    phone: string | null
    email: string | null
    address: string | null
  }
}

type ProfileFormProps = {
  patient: Patient
}

export default function ProfileForm({ patient }: ProfileFormProps) {
  const router = useRouter()
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Formulario de información personal
  const [name, setName] = useState(patient.name)
  const [phone, setPhone] = useState(patient.phone || '')

  // Formulario de contraseña
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const response = await fetch('/api/patient/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          name,
          phone: phone || null,
        }),
      })

      if (response.ok) {
        setSuccess('Información actualizada correctamente')
        setIsEditingInfo(false)
        router.refresh()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Error al actualizar la información')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al actualizar la información')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/patient/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          currentPassword,
          newPassword,
        }),
      })

      if (response.ok) {
        setSuccess('Contraseña actualizada correctamente')
        setIsEditingPassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cambiar la contraseña')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/auth/login'
    })
  }

  return (
    <div className="space-y-4">
      {/* Mensajes de éxito/error */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Información Personal */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Información Personal</h3>
          {!isEditingInfo && (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Editar
            </button>
          )}
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleUpdateInfo} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: +54 9 11 1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={patient.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                El email no se puede modificar
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditingInfo(false)
                  setName(patient.name)
                  setPhone(patient.phone || '')
                  setError('')
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Nombre
              </p>
              <p className="text-gray-900">{patient.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Email
              </p>
              <p className="text-gray-900">{patient.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Teléfono
              </p>
              <p className="text-gray-900">{patient.phone || 'No especificado'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Seguridad</h3>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Cambiar
            </button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleUpdatePassword} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditingPassword(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Guardando...' : 'Cambiar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Contraseña
              </p>
              <p className="text-gray-900">••••••••</p>
            </div>
          </div>
        )}
      </div>

      {/* Información del Profesional */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Tu Profesional</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Nombre
            </p>
            <p className="text-gray-900 font-medium">{patient.professional.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
              Especialidad
            </p>
            <p className="text-gray-900">{patient.professional.specialty}</p>
          </div>

          {patient.professional.phone && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Teléfono
              </p>
              <a
                href={`tel:${patient.professional.phone}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {patient.professional.phone}
              </a>
            </div>
          )}

          {patient.professional.email && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Email
              </p>
              <a
                href={`mailto:${patient.professional.email}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {patient.professional.email}
              </a>
            </div>
          )}

          {patient.professional.address && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Dirección
              </p>
              <p className="text-gray-900">{patient.professional.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cerrar Sesión */}
      <div className="pt-4">
        <button
          onClick={handleSignOut}
          className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

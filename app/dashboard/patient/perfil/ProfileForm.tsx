'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Patient = {
  id: string
  name: string
  email: string
  phone: string | null
  dni: string | null
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
  const [dni, setDni] = useState(patient.dni || '')

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
          dni: dni || null,
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

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5"
  const fieldLabelClass = "text-xs text-slate-400 uppercase font-semibold tracking-wide mb-0.5"

  return (
    <div className="space-y-4">
      {/* Mensajes de éxito/error */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-700 font-medium">✓ {success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Información Personal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-semibold text-slate-900 text-sm">Información personal</p>
          {!isEditingInfo && (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Editar
            </button>
          )}
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleUpdateInfo} className="p-4 space-y-3.5">
            <div>
              <label className={labelClass}>Nombre completo *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej: +542945415186" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>DNI</label>
              <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Ej: 30.123.456" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={patient.email} disabled className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`} />
              <p className="text-xs text-slate-400 mt-1">El email no se puede modificar</p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsEditingInfo(false)
                  setName(patient.name)
                  setPhone(patient.phone || '')
                  setDni(patient.dni || '')
                  setError('')
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 space-y-3">
            <div>
              <p className={fieldLabelClass}>Nombre</p>
              <p className="text-sm text-slate-900 font-medium">{patient.name}</p>
            </div>
            <div>
              <p className={fieldLabelClass}>Email</p>
              <p className="text-sm text-slate-900">{patient.email}</p>
            </div>
            <div>
              <p className={fieldLabelClass}>Teléfono</p>
              <p className="text-sm text-slate-900">{patient.phone || <span className="text-slate-400">No especificado</span>}</p>
            </div>
            <div>
              <p className={fieldLabelClass}>DNI</p>
              <p className="text-sm text-slate-900">{patient.dni || <span className="text-slate-400">No especificado</span>}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-semibold text-slate-900 text-sm">Seguridad</p>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Cambiar contraseña
            </button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleUpdatePassword} className="p-4 space-y-3.5">
            <div>
              <label className={labelClass}>Contraseña actual *</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Nueva contraseña *</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className={inputClass} />
              <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className={labelClass}>Confirmar nueva contraseña *</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
            </div>

            <div className="flex gap-3 pt-1">
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
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {isSaving ? 'Guardando...' : 'Cambiar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4">
            <p className={fieldLabelClass}>Contraseña</p>
            <p className="text-sm text-slate-900 tracking-widest">••••••••</p>
          </div>
        )}
      </div>

      {/* Información del Profesional */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-900 text-sm">Tu profesional</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {patient.professional.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm">{patient.professional.name}</p>
              <p className="text-xs text-slate-500">{patient.professional.specialty}</p>
            </div>
          </div>

          {patient.professional.phone && (
            <div>
              <p className={fieldLabelClass}>Teléfono</p>
              <a href={`tel:${patient.professional.phone}`} className="text-sm text-blue-600 hover:text-blue-700">
                {patient.professional.phone}
              </a>
            </div>
          )}

          {patient.professional.email && (
            <div>
              <p className={fieldLabelClass}>Email</p>
              <a href={`mailto:${patient.professional.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                {patient.professional.email}
              </a>
            </div>
          )}

          {patient.professional.address && (
            <div>
              <p className={fieldLabelClass}>Dirección</p>
              <p className="text-sm text-slate-900">{patient.professional.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cerrar Sesión */}
      <div>
        <button
          onClick={handleSignOut}
          className="w-full px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

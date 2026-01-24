'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BrandingFormProps = {
  professional: any
}

export default function BrandingForm({ professional }: BrandingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const defaultBranding = {
    logoUrl: null,
    primaryColor: '#1E40AF',
    secondaryColor: '#10B981',
    consultorioName: '',
  }

  const [branding, setBranding] = useState(
    professional.branding || defaultBranding
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/professional/update-branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional.id,
          branding,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Error al actualizar el branding')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al actualizar el branding')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setBranding({
      ...branding,
      [field]: value,
    })
  }

  const presetColors = {
    blue: { primary: '#1E40AF', secondary: '#10B981' },
    purple: { primary: '#7C3AED', secondary: '#EC4899' },
    green: { primary: '#059669', secondary: '#0891B2' },
    orange: { primary: '#EA580C', secondary: '#F59E0B' },
    pink: { primary: '#DB2777', secondary: '#8B5CF6' },
  }

  const applyPreset = (preset: keyof typeof presetColors) => {
    setBranding({
      ...branding,
      primaryColor: presetColors[preset].primary,
      secondaryColor: presetColors[preset].secondary,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Branding actualizado correctamente
          </p>
        </div>
      )}

      {/* Nombre del consultorio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Consultorio
        </label>
        <input
          type="text"
          value={branding.consultorioName}
          onChange={(e) => handleChange('consultorioName', e.target.value)}
          placeholder="Ej: Clínica Dental García"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Este nombre aparecerá en la página de inicio para tus pacientes
        </p>
      </div>

      {/* Paletas predefinidas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paletas de Colores Predefinidas
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(presetColors).map(([key, colors]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key as keyof typeof presetColors)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-full h-8 rounded"
                  style={{ backgroundColor: colors.primary }}
                />
                <div
                  className="w-full h-8 rounded"
                  style={{ backgroundColor: colors.secondary }}
                />
              </div>
              <p className="text-xs text-gray-600 capitalize">{key}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color primario */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Primario
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={branding.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={branding.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            placeholder="#1E40AF"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Se usa para botones principales y elementos destacados
        </p>
      </div>

      {/* Color secundario */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Secundario
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={branding.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={branding.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            placeholder="#10B981"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Se usa para acentos y elementos complementarios
        </p>
      </div>

      {/* Vista previa */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Vista Previa
        </h3>
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-2" style={{ color: branding.primaryColor }}>
            {branding.consultorioName || 'Nombre del Consultorio'}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-2 text-white font-medium rounded-lg"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Botón Primario
            </button>
            <button
              type="button"
              className="px-6 py-2 text-white font-medium rounded-lg"
              style={{ backgroundColor: branding.secondaryColor }}
            >
              Botón Secundario
            </button>
          </div>
        </div>
      </div>

      {/* Logo (placeholder para futura implementación) */}
      <div className="pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo del Consultorio
        </label>
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            Próximamente: Subida de logo personalizado
          </p>
        </div>
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Branding'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import OdontogramCanvas from './components/OdontogramCanvas'
import Toolbar from './components/Toolbar'
import LegendPanel from './components/LegendPanel'
import {
  type Odontogram,
  type SurfaceName,
  type ToolType,
  TOOTH_TOOLS,
} from '@/types/odontogram'

interface OdontogramEditorProps {
  patientId: string
  patientName: string
  initialOdontogram: Odontogram | null
}

export default function OdontogramEditor({
  patientId,
  patientName,
  initialOdontogram,
}: OdontogramEditorProps) {
  const router = useRouter()

  // Estado del odontograma
  const [odontogram, setOdontogram] = useState<Odontogram>(
    initialOdontogram || {
      lastUpdated: new Date().toISOString(),
      dentitionType: 'permanent',
      teeth: {},
    }
  )

  // Herramienta seleccionada
  const [selectedTool, setSelectedTool] = useState<ToolType>(TOOTH_TOOLS[0])

  // Estados de UI
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  // Manejar click en superficie de diente
  const handleSurfaceClick = useCallback(
    (toothNumber: number, surface: SurfaceName) => {
      setOdontogram((prev) => {
        const toothKey = toothNumber.toString()
        const currentTooth = prev.teeth[toothKey] || { surfaces: {} }

        // Si la herramienta seleccionada es de "diente completo" (corona, fractura, ausente, implante)
        // pintar todas las superficies con un solo clic
        if (selectedTool.wholeTooth) {
          return {
            ...prev,
            teeth: {
              ...prev.teeth,
              [toothKey]: {
                ...currentTooth,
                surfaces: {
                  vestibular: {
                    status: selectedTool.id as any,
                    color: selectedTool.color,
                    notes: '',
                  },
                  lingual: {
                    status: selectedTool.id as any,
                    color: selectedTool.color,
                    notes: '',
                  },
                  mesial: {
                    status: selectedTool.id as any,
                    color: selectedTool.color,
                    notes: '',
                  },
                  distal: {
                    status: selectedTool.id as any,
                    color: selectedTool.color,
                    notes: '',
                  },
                  oclusal: {
                    status: selectedTool.id as any,
                    color: selectedTool.color,
                    notes: '',
                  },
                },
              },
            },
            lastUpdated: new Date().toISOString(),
          }
        }

        // Para herramientas de superficie individual (sano, caries, restauración)
        return {
          ...prev,
          teeth: {
            ...prev.teeth,
            [toothKey]: {
              ...currentTooth,
              surfaces: {
                ...currentTooth.surfaces,
                [surface]: {
                  status: selectedTool.id as any,
                  color: selectedTool.color,
                  notes: '',
                },
              },
            },
          },
          lastUpdated: new Date().toISOString(),
        }
      })
      setIsDirty(true)
      setSaveSuccess(false)
      setSaveError(null)
    },
    [selectedTool]
  )

  // Guardar odontograma
  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch(`/api/odontogram/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ odontogram }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar el odontograma')
      }

      setIsDirty(false)
      setSaveSuccess(true)

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving odontogram:', error)
      setSaveError('No se pudo guardar el odontograma. Intenta nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }

  // Cambiar tipo de dentición
  const handleDentitionTypeChange = (type: 'permanent' | 'temporary') => {
    setOdontogram((prev) => ({
      ...prev,
      dentitionType: type,
      lastUpdated: new Date().toISOString(),
    }))
    setIsDirty(true)
  }

  // Exportar a PDF
  const handleExportPDF = async () => {
    setIsExporting(true)
    setExportError(null)

    try {
      // Capturar el canvas del odontograma como imagen
      const canvasElement = document.getElementById('odontogram-canvas')
      if (!canvasElement) {
        throw new Error('No se pudo encontrar el canvas del odontograma')
      }

      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Mayor resolución
      })
      const imageBase64 = canvas.toDataURL('image/png')

      // Enviar al backend para generar el PDF
      const response = await fetch(`/api/odontogram/${patientId}/export-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ odontogramImageBase64: imageBase64 }),
      })

      if (!response.ok) {
        throw new Error('Error al generar el PDF')
      }

      // Descargar el PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `odontograma-${patientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      setExportError('No se pudo exportar el PDF. Intenta nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }

  // Confirmación antes de salir con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Volver atrás
  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        '¿Deseas salir sin guardar los cambios?'
      )
      if (!confirmed) return
    }
    router.back()
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Odontograma de {patientName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Última actualización:{' '}
              {new Date(odontogram.lastUpdated).toLocaleString('es-AR')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Toggle dentición */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleDentitionTypeChange('permanent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  odontogram.dentitionType === 'permanent'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Permanente
              </button>
              <button
                onClick={() => handleDentitionTypeChange('temporary')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  odontogram.dentitionType === 'temporary'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Temporaria
              </button>
            </div>

            {/* Botón Exportar PDF */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isExporting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
              }`}
            >
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>

            {/* Botón Guardar */}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                !isDirty || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md'
              }`}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>

            {/* Botón Volver */}
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {saveSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium">
              ✓ Odontograma guardado correctamente
            </p>
          </div>
        )}

        {saveError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">{saveError}</p>
          </div>
        )}

        {exportError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">{exportError}</p>
          </div>
        )}

        {isDirty && !saveSuccess && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠ Hay cambios sin guardar
            </p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

      {/* Layout principal: Canvas + Legend */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Canvas del odontograma */}
        <div className="xl:col-span-3">
          <OdontogramCanvas
            dentitionType={odontogram.dentitionType}
            teeth={odontogram.teeth}
            onSurfaceClick={handleSurfaceClick}
          />
        </div>

        {/* Panel de leyenda */}
        <div className="xl:col-span-1">
          <LegendPanel />
        </div>
      </div>

      {/* Loading overlay */}
      {(isSaving || isExporting) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-700 font-medium">
              {isSaving ? 'Guardando odontograma...' : 'Exportando PDF...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

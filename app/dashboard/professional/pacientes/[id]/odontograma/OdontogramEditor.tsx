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
    <div className="space-y-4">

      {/* Barra de acciones */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900 text-sm">
              Paciente: {patientName}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Última actualización: {new Date(odontogram.lastUpdated).toLocaleString('es-AR')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle dentición */}
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => handleDentitionTypeChange('permanent')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  odontogram.dentitionType === 'permanent'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Permanente
              </button>
              <button
                onClick={() => handleDentitionTypeChange('temporary')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  odontogram.dentitionType === 'temporary'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Temporaria
              </button>
            </div>

            {/* Exportar PDF */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>

            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                !isDirty || isSaving
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>

            {/* Volver */}
            <button
              onClick={handleBack}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors px-2"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {saveSuccess && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-emerald-700 font-medium">✓ Odontograma guardado correctamente</p>
          </div>
        )}
        {saveError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-red-600 font-medium">{saveError}</p>
          </div>
        )}
        {exportError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-red-600 font-medium">{exportError}</p>
          </div>
        )}
        {isDirty && !saveSuccess && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-amber-700 font-medium">⚠ Hay cambios sin guardar</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

      {/* Canvas + Leyenda */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <OdontogramCanvas
            dentitionType={odontogram.dentitionType}
            teeth={odontogram.teeth}
            onSurfaceClick={handleSurfaceClick}
          />
        </div>
        <div className="xl:col-span-1">
          <LegendPanel />
        </div>
      </div>

      {/* Loading overlay */}
      {(isSaving || isExporting) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-700 font-medium text-center">
              {isSaving ? 'Guardando odontograma...' : 'Exportando PDF...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

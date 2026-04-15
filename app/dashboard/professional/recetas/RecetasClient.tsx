'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type Medication = {
  name: string
  dose: string
  quantity: string
  instructions: string
}

type Patient = {
  id: string
  name: string
  dni: string | null
}

type Prescription = {
  id: string
  patient_id: string
  medications: Medication[]
  diagnosis: string | null
  notes: string | null
  created_at: string
  patients: { id: string; name: string; dni: string | null }
}

const emptyMedication = (): Medication => ({
  name: '',
  dose: '',
  quantity: '',
  instructions: '',
})

export default function RecetasClient({ patients }: { patients: Patient[] }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true)

  // Form state
  const [selectedPatient, setSelectedPatient] = useState('')
  const [medications, setMedications] = useState<Medication[]>([emptyMedication()])
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // PDF download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const fetchPrescriptions = useCallback(async () => {
    try {
      const res = await fetch('/api/prescriptions')
      const json = await res.json()
      if (json.data) setPrescriptions(json.data)
    } catch (err) {
      console.error('Error fetching prescriptions:', err)
    } finally {
      setLoadingPrescriptions(false)
    }
  }, [])

  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  const addMedication = () => {
    setMedications([...medications, emptyMedication()])
  }

  const removeMedication = (index: number) => {
    if (medications.length === 1) return
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications]
    updated[index] = { ...updated[index], [field]: value }
    setMedications(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const validMedications = medications.filter((m) => m.name.trim())
    if (!selectedPatient) {
      setError('Seleccioná un paciente')
      return
    }
    if (validMedications.length === 0) {
      setError('Ingresá al menos un medicamento')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          medications: validMedications,
          diagnosis: diagnosis.trim() || null,
          notes: notes.trim() || null,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setSelectedPatient('')
        setMedications([emptyMedication()])
        setDiagnosis('')
        setNotes('')
        await fetchPrescriptions()
        setTimeout(() => setSuccess(false), 4000)
      } else {
        const json = await res.json()
        setError(json.error || 'Error al crear la receta')
      }
    } catch {
      setError('Error al crear la receta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async (prescriptionId: string, patientName: string) => {
    setDownloadingId(prescriptionId)
    try {
      const res = await fetch(`/api/prescriptions/pdf?id=${prescriptionId}`)
      if (!res.ok) {
        alert('Error al generar el PDF')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receta-${patientName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-8">

      {/* Nueva receta */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Receta</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">Receta creada correctamente</p>
            </div>
          )}

          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paciente *
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccioná un paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.dni ? ` — DNI ${p.dni}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Ej: Caries múltiple, periodontitis..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Medicamentos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Medicamentos *
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Agregar medicamento
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                >
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Medicamento {index + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="Ej: Amoxicilina"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Dosis</label>
                      <input
                        type="text"
                        value={med.dose}
                        onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                        placeholder="Ej: 500mg"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cantidad</label>
                      <input
                        type="text"
                        value={med.quantity}
                        onChange={(e) => updateMedication(index, 'quantity', e.target.value)}
                        placeholder="Ej: 21 comprimidos"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Instrucciones</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="Ej: 1 cada 8 horas por 7 días"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Indicaciones adicionales para el paciente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Receta'}
            </button>
          </div>
        </form>
      </div>

      {/* Historial de recetas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recetas Emitidas</h2>
        </div>

        {loadingPrescriptions ? (
          <div className="p-12 text-center text-gray-500">Cargando...</div>
        ) : prescriptions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay recetas emitidas aún</p>
            <p className="text-sm mt-2">Las recetas que crees aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{rx.patients?.name}</p>
                    {rx.patients?.dni && (
                      <p className="text-sm text-gray-500">DNI: {rx.patients.dni}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {format(parseISO(rx.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    {rx.diagnosis && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Diagnóstico:</span> {rx.diagnosis}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {rx.medications.length} medicamento{rx.medications.length !== 1 ? 's' : ''}:{' '}
                      {rx.medications.map((m) => m.name).join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadPDF(rx.id, rx.patients?.name || 'paciente')}
                    disabled={downloadingId === rx.id}
                    className="shrink-0 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloadingId === rx.id ? 'Generando...' : 'Descargar PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

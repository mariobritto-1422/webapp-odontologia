'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ScheduleFormProps = {
  professional: any
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

export default function ScheduleForm({ professional }: ScheduleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [schedule, setSchedule] = useState(
    professional.schedule || {
      monday: { enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
      tuesday: { enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
      wednesday: { enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
      thursday: { enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
      friday: { enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
      saturday: { enabled: false, slots: [] },
      sunday: { enabled: false, slots: [] },
    }
  )

  const [appointmentDuration, setAppointmentDuration] = useState(
    professional.appointment_duration || 30
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/professional/update-schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional.id,
          schedule,
          appointment_duration: appointmentDuration,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Error al actualizar los horarios')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al actualizar los horarios')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
      },
    })
  }

  const updateSlot = (
    day: string,
    slotIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newSlots = [...schedule[day].slots]
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      [field]: value,
    }
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: newSlots,
      },
    })
  }

  const addSlot = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: [
          ...schedule[day].slots,
          { start: '15:00', end: '19:00' },
        ],
      },
    })
  }

  const removeSlot = (day: string, slotIndex: number) => {
    const newSlots = schedule[day].slots.filter(
      (_: any, i: number) => i !== slotIndex
    )
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: newSlots,
      },
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
            Horarios actualizados correctamente
          </p>
        </div>
      )}

      {/* Duración de turnos */}
      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duración de cada turno
        </label>
        <select
          value={appointmentDuration}
          onChange={(e) => setAppointmentDuration(Number(e.target.value))}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={15}>15 minutos</option>
          <option value={30}>30 minutos</option>
          <option value={45}>45 minutos</option>
          <option value={60}>1 hora</option>
          <option value={90}>1 hora y 30 minutos</option>
          <option value={120}>2 horas</option>
        </select>
      </div>

      {/* Horarios por día */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Horarios de Atención
        </h3>

        {DAYS.map((day) => (
          <div
            key={day.key}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            {/* Día y toggle */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={schedule[day.key].enabled}
                  onChange={() => toggleDay(day.key)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  {day.label}
                </span>
              </label>

              {schedule[day.key].enabled && (
                <button
                  type="button"
                  onClick={() => addSlot(day.key)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Agregar horario
                </button>
              )}
            </div>

            {/* Slots de horario */}
            {schedule[day.key].enabled && (
              <div className="space-y-2 pl-8">
                {schedule[day.key].slots.map((slot: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        updateSlot(day.key, index, 'start', e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        updateSlot(day.key, index, 'end', e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {schedule[day.key].slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(day.key, index)}
                        className="text-red-600 hover:text-red-700"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Horarios'}
        </button>
      </div>
    </form>
  )
}

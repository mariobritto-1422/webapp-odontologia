'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type Professional = {
  id: string
  name: string
  schedule: any
  appointment_duration: number
  blocked_dates: string[]
}

type ExistingAppointment = {
  date: string
  time: string
}

type NewAppointmentFlowProps = {
  patientId: string
  professional: Professional
  existingAppointments: ExistingAppointment[]
}

export default function NewAppointmentFlow({
  patientId,
  professional,
  existingAppointments,
}: NewAppointmentFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Generar fechas disponibles (próximos 30 días)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    const schedule = professional.schedule || {}

    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i)
      const dayName = format(date, 'EEEE', { locale: es }).toLowerCase()
      const englishDayMap: Record<string, string> = {
        lunes: 'monday',
        martes: 'tuesday',
        miércoles: 'wednesday',
        jueves: 'thursday',
        viernes: 'friday',
        sábado: 'saturday',
        domingo: 'sunday',
      }
      const englishDay = englishDayMap[dayName]

      // Verificar si el día está habilitado en el horario del profesional
      if (schedule[englishDay]?.enabled) {
        // Verificar si no está en fechas bloqueadas
        const dateStr = format(date, 'yyyy-MM-dd')
        if (!professional.blocked_dates?.includes(dateStr)) {
          dates.push(date)
        }
      }
    }

    return dates
  }

  // Generar horarios disponibles para la fecha seleccionada
  const getAvailableTimeSlots = (date: Date) => {
    if (!date) return []

    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase()
    const englishDayMap: Record<string, string> = {
      lunes: 'monday',
      martes: 'tuesday',
      miércoles: 'wednesday',
      jueves: 'thursday',
      viernes: 'friday',
      sábado: 'saturday',
      domingo: 'sunday',
    }
    const englishDay = englishDayMap[dayName]
    const schedule = professional.schedule || {}
    const daySchedule = schedule[englishDay]

    if (!daySchedule || !daySchedule.enabled) return []

    const slots: string[] = []
    const duration = professional.appointment_duration || 30
    const dateStr = format(date, 'yyyy-MM-dd')

    // Obtener turnos ya tomados para esa fecha
    const takenSlots = existingAppointments
      .filter((apt) => apt.date === dateStr)
      .map((apt) => apt.time)

    // Generar slots para cada franja horaria
    daySchedule.slots?.forEach((slot: { start: string; end: string }) => {
      const [startHour, startMinute] = slot.start.split(':').map(Number)
      const [endHour, endMinute] = slot.end.split(':').map(Number)

      let currentHour = startHour
      let currentMinute = startMinute

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(
          currentMinute
        ).padStart(2, '0')}`

        // Solo agregar si no está tomado
        if (!takenSlots.includes(timeSlot)) {
          slots.push(timeSlot)
        }

        // Avanzar según duración del turno
        currentMinute += duration
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
      }
    })

    return slots
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/patient/request-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          professionalId: professional.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          notes,
        }),
      })

      if (response.ok) {
        router.push('/dashboard/patient?success=turno-solicitado')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Error al solicitar el turno')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al solicitar el turno')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableDates = getAvailableDates()
  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4">
        <StepIndicator number={1} active={step === 1} completed={step > 1} label="Fecha" />
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <StepIndicator number={2} active={step === 2} completed={step > 2} label="Horario" />
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <StepIndicator number={3} active={step === 3} completed={false} label="Confirmar" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Step 1: Select Date */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Paso 1: Selecciona una fecha
          </h3>

          {availableDates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No hay fechas disponibles en los próximos 30 días
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Por favor contacta con el profesional
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableDates.slice(0, 12).map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900">
                    {format(date, 'EEEE', { locale: es })}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {format(date, 'd')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(date, 'MMMM yyyy', { locale: es })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Time */}
      {step === 2 && selectedDate && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Paso 2: Selecciona un horario
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
            </div>
            <button
              onClick={() => {
                setStep(1)
                setSelectedDate(null)
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Cambiar fecha
            </button>
          </div>

          {availableTimeSlots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
              <button
                onClick={() => {
                  setStep(1)
                  setSelectedDate(null)
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Seleccionar otra fecha
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{time}</p>
                  <p className="text-xs text-gray-600">hs</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedDate && selectedTime && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Paso 3: Confirmar turno
          </h3>

          {/* Resumen */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  {selectedTime} hs
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Con: {professional.name}
                </p>
              </div>
            </div>
          </div>

          {/* Notas opcionales */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ej: Primera consulta, dolor de muela, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              Tu solicitud quedará pendiente de confirmación por parte del profesional. Te notificaremos cuando sea confirmada.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep(2)
                setSelectedTime(null)
              }}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Solicitando...' : 'Confirmar Turno'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StepIndicator({
  number,
  active,
  completed,
  label,
}: {
  number: number
  active: boolean
  completed: boolean
  label: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
          completed
            ? 'bg-green-600 text-white'
            : active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <p className="text-xs text-gray-600 mt-1 font-medium">{label}</p>
    </div>
  )
}

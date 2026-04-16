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
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3">
        <StepIndicator number={1} active={step === 1} completed={step > 1} label="Fecha" />
        <div className="w-8 h-px bg-slate-200"></div>
        <StepIndicator number={2} active={step === 2} completed={step > 2} label="Horario" />
        <div className="w-8 h-px bg-slate-200"></div>
        <StepIndicator number={3} active={step === 3} completed={false} label="Confirmar" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Select Date */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Paso 1 — Seleccioná una fecha
          </p>

          {availableDates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">
                No hay fechas disponibles en los próximos 30 días
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Contactá al profesional para coordinar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {availableDates.slice(0, 12).map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                >
                  <p className="font-medium text-slate-600 text-xs capitalize">
                    {format(date, 'EEEE', { locale: es })}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-1 leading-none">
                    {format(date, 'd')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Paso 2 — Elegí un horario
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </p>
            </div>
            <button
              onClick={() => {
                setStep(1)
                setSelectedDate(null)
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Cambiar fecha
            </button>
          </div>

          {availableTimeSlots.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">No hay horarios disponibles para esta fecha</p>
              <button
                onClick={() => {
                  setStep(1)
                  setSelectedDate(null)
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Seleccionar otra fecha
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
                >
                  <p className="font-bold text-slate-900 text-sm">{time}</p>
                  <p className="text-xs text-slate-400">hs</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedDate && selectedTime && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Paso 3 — Confirmá el turno
          </p>

          {/* Resumen */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm capitalize">
                  {format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
                <p className="text-xl font-bold text-blue-600 mt-0.5">
                  {selectedTime} hs
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Con: {professional.name}
                </p>
              </div>
            </div>
          </div>

          {/* Notas opcionales */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ej: Primera consulta, dolor de muela, etc."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-amber-800">
              Tu solicitud quedará pendiente de confirmación por parte del profesional.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep(2)
                setSelectedTime(null)
              }}
              className="flex-1 px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Volver
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isSubmitting ? 'Solicitando...' : 'Confirmar turno'}
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
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
          completed
            ? 'bg-emerald-600 text-white'
            : active
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-400'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <p className={`text-xs mt-1 font-semibold ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</p>
    </div>
  )
}

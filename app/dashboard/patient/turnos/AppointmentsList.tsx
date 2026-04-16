'use client'

import { useState } from 'react'
import { format, isPast, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

type Appointment = {
  id: string
  date: string
  time: string
  datetime: string
  status: string
  notes: string | null
  professional: {
    name: string
    specialty: string
    phone: string
  }
}

type AppointmentsListProps = {
  appointments: Appointment[]
  patientId: string
}

type FilterType = 'all' | 'upcoming' | 'pending' | 'past'

export default function AppointmentsList({ appointments, patientId }: AppointmentsListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('upcoming')
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Filtrar turnos según el filtro seleccionado
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(`${apt.date}T${apt.time}:00`)
    const isUpcoming = !isPast(aptDate)

    switch (filter) {
      case 'upcoming':
        return isUpcoming && apt.status !== 'cancelled'
      case 'pending':
        return apt.status === 'pending' && isUpcoming
      case 'past':
        return isPast(aptDate) || apt.status === 'cancelled' || apt.status === 'completed'
      case 'all':
        return true
      default:
        return true
    }
  })

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowCancelModal(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return

    setCancellingId(selectedAppointment.id)

    try {
      const response = await fetch('/api/patient/cancel-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          patientId,
        }),
      })

      if (response.ok) {
        setShowCancelModal(false)
        setSelectedAppointment(null)
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Error al cancelar el turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cancelar el turno')
    } finally {
      setCancellingId(null)
    }
  }

  // Contar turnos por categoría
  const counts = {
    upcoming: appointments.filter(
      (apt) => !isPast(parseISO(`${apt.date}T${apt.time}:00`)) && apt.status !== 'cancelled'
    ).length,
    pending: appointments.filter(
      (apt) => apt.status === 'pending' && !isPast(parseISO(`${apt.date}T${apt.time}:00`))
    ).length,
    past: appointments.filter(
      (apt) =>
        isPast(parseISO(`${apt.date}T${apt.time}:00`)) ||
        apt.status === 'cancelled' ||
        apt.status === 'completed'
    ).length,
    all: appointments.length,
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <FilterButton
            active={filter === 'upcoming'}
            onClick={() => setFilter('upcoming')}
            count={counts.upcoming}
          >
            Próximos
          </FilterButton>
          <FilterButton
            active={filter === 'pending'}
            onClick={() => setFilter('pending')}
            count={counts.pending}
          >
            Pendientes
          </FilterButton>
          <FilterButton
            active={filter === 'past'}
            onClick={() => setFilter('past')}
            count={counts.past}
          >
            Pasados
          </FilterButton>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={counts.all}
          >
            Todos
          </FilterButton>
        </div>
      </div>

      {/* Lista de turnos */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-12 text-center">
          <svg
            className="w-12 h-12 text-slate-200 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-slate-500">No hay turnos en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancelClick={handleCancelClick}
              isCancelling={cancellingId === appointment.id}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              ¿Cancelar turno?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              ¿Estás seguro que deseas cancelar el turno del{' '}
              {format(parseISO(selectedAppointment.date), "d 'de' MMMM", {
                locale: es,
              })}{' '}
              a las {selectedAppointment.time} hs?
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-800">
                Si cancelás, deberás solicitar un nuevo turno.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setSelectedAppointment(null)
                }}
                disabled={!!cancellingId}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors text-sm"
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={!!cancellingId}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                {cancellingId ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children} <span className={active ? 'opacity-75' : 'text-slate-400'}>({count})</span>
    </button>
  )
}

function AppointmentCard({
  appointment,
  onCancelClick,
  isCancelling,
}: {
  appointment: Appointment
  onCancelClick: (appointment: Appointment) => void
  isCancelling: boolean
}) {
  const aptDate = parseISO(`${appointment.date}T${appointment.time}:00`)
  const isUpcoming = !isPast(aptDate)
  const canCancel =
    isUpcoming && appointment.status !== 'cancelled' && appointment.status !== 'completed'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header con fecha y estado */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900 text-sm capitalize">
              {format(aptDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <p className="text-base font-bold text-blue-600 mt-0.5">
              {appointment.time} hs
            </p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-2.5">
        {/* Profesional */}
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-0.5">
            Profesional
          </p>
          <p className="font-semibold text-slate-900 text-sm">
            {appointment.professional.name}
          </p>
          <p className="text-xs text-slate-500">
            {appointment.professional.specialty}
          </p>
        </div>

        {/* Notas */}
        {appointment.notes && (
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-0.5">
              Notas
            </p>
            <p className="text-sm text-slate-600">{appointment.notes}</p>
          </div>
        )}

        {/* Contacto */}
        {appointment.professional.phone && (
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-0.5">
              Contacto
            </p>
            <a
              href={`tel:${appointment.professional.phone}`}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {appointment.professional.phone}
            </a>
          </div>
        )}

        {/* Acciones */}
        {canCancel && (
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onCancelClick(appointment)}
              disabled={isCancelling}
              className="w-full px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar turno'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-600 border-red-200' },
    completed: { label: 'Completado', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  }

  const statusConfig = config[status] || config.pending

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  )
}

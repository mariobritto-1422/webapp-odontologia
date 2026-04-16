'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, Clock, Search, CalendarX } from 'lucide-react'
import Link from 'next/link'

type Appointment = {
  id: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  patient: {
    id: string
    name: string
    email: string
    phone: string
  }
}

type AppointmentsListProps = {
  appointments: Appointment[]
  patients: any[]
  professionalId: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => /^[A-Za-záéíóúÁÉÍÓÚñÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const statusBadge: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-amber-50 text-amber-700' },
  confirmed: { label: 'Confirmado', className: 'bg-emerald-50 text-emerald-700' },
  completed: { label: 'Completado', className: 'bg-slate-100 text-slate-600' },
  cancelled: { label: 'Cancelado',  className: 'bg-red-50 text-red-700' },
}

export default function AppointmentsList({
  appointments,
  patients,
  professionalId,
}: AppointmentsListProps) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Filtrar turnos
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter = filter === 'all' || appointment.status === filter
    const matchesSearch =
      appointment.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      appointment.patient.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Agrupar turnos por estado
  const stats = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  const filterTabs = [
    { key: 'all',       label: 'Todos',      count: stats.all },
    { key: 'pending',   label: 'Pendientes', count: stats.pending },
    { key: 'confirmed', label: 'Confirmados',count: stats.confirmed },
    { key: 'completed', label: 'Completados',count: stats.completed },
    { key: 'cancelled', label: 'Cancelados', count: stats.cancelled },
  ]

  return (
    <div className="space-y-4">

      {/* Barra de búsqueda + filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtros por estado */}
        <div className="flex gap-2 flex-wrap">
          {filterTabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label} <span className="opacity-70">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <CalendarX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            {search ? 'Sin resultados para esa búsqueda' : 'No hay turnos en esta categoría'}
          </p>
          {!search && (
            <Link
              href="/dashboard/professional/turnos/nuevo"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              + Crear primer turno
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              professionalId={professionalId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AppointmentCard({
  appointment,
  professionalId,
}: {
  appointment: Appointment
  professionalId: string
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const actionConfig: Record<string, string[]> = {
    pending:   ['confirm', 'cancel'],
    confirmed: ['complete', 'cancel'],
    completed: [],
    cancelled: [],
  }

  const actions = actionConfig[appointment.status] ?? []
  const badge = statusBadge[appointment.status]

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/appointments/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          status: newStatus,
        }),
      })
      if (response.ok) {
        window.location.reload()
      } else {
        alert('Error al actualizar el turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el turno')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que querés eliminar este turno?')) return
    setIsUpdating(true)
    try {
      const response = await fetch('/api/appointments/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: appointment.id }),
      })
      if (response.ok) {
        window.location.reload()
      } else {
        alert('Error al eliminar el turno')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el turno')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
          {getInitials(appointment.patient.name)}
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-slate-900">{appointment.patient.name}</p>
              <p className="text-sm text-slate-400">{appointment.patient.email}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <CalendarDays className="w-3.5 h-3.5" />
              {format(parseISO(appointment.date), "d 'de' MMMM yyyy", { locale: es })}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {appointment.time} hs
            </span>
          </div>

          {appointment.notes && (
            <p className="text-sm text-slate-400 mt-1 truncate">{appointment.notes}</p>
          )}
        </div>
      </div>

      {/* Acciones */}
      {(actions.length > 0) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
          {actions.includes('confirm') && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              Confirmar
            </button>
          )}
          {actions.includes('complete') && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              Completar
            </button>
          )}
          {actions.includes('cancel') && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="ml-auto px-3 py-1.5 text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}

      {/* Eliminar si no hay otras acciones */}
      {actions.length === 0 && (
        <div className="flex justify-end mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="px-3 py-1.5 text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

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
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros por estado */}
          <div className="flex gap-2 flex-wrap">
            <FilterButton
              label={`Todos (${stats.all})`}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <FilterButton
              label={`Pendientes (${stats.pending})`}
              active={filter === 'pending'}
              onClick={() => setFilter('pending')}
              color="yellow"
            />
            <FilterButton
              label={`Confirmados (${stats.confirmed})`}
              active={filter === 'confirmed'}
              onClick={() => setFilter('confirmed')}
              color="green"
            />
            <FilterButton
              label={`Completados (${stats.completed})`}
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
              color="gray"
            />
            <FilterButton
              label={`Cancelados (${stats.cancelled})`}
              active={filter === 'cancelled'}
              onClick={() => setFilter('cancelled')}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Lista de turnos */}
      <div className="bg-white rounded-lg shadow">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No se encontraron turnos</p>
            <p className="text-sm mt-2">
              {search
                ? 'Intenta con otra búsqueda'
                : 'Crea un nuevo turno para comenzar'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                professionalId={professionalId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterButton({
  label,
  active,
  onClick,
  color = 'blue',
}: {
  label: string
  active: boolean
  onClick: () => void
  color?: string
}) {
  const colors = {
    blue: active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    yellow: active ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    green: active ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100',
    gray: active ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
    red: active ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100',
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        colors[color as keyof typeof colors]
      }`}
    >
      {label}
    </button>
  )
}

function AppointmentRow({
  appointment,
  professionalId,
}: {
  appointment: Appointment
  professionalId: string
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const statusConfig: Record<string, {
    label: string
    color: string
    actions: string[]
  }> = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800',
      actions: ['confirm', 'cancel'],
    },
    confirmed: {
      label: 'Confirmado',
      color: 'bg-green-100 text-green-800',
      actions: ['complete', 'cancel'],
    },
    completed: {
      label: 'Completado',
      color: 'bg-gray-100 text-gray-800',
      actions: [],
    },
    cancelled: {
      label: 'Cancelado',
      color: 'bg-red-100 text-red-800',
      actions: [],
    },
  }

  const config = statusConfig[appointment.status]

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
    if (!confirm('¿Estás seguro de que querés eliminar este turno?')) {
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch('/api/appointments/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
        }),
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
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Paciente */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Paciente</p>
            <p className="font-semibold text-gray-900">
              {appointment.patient.name}
            </p>
            <p className="text-sm text-gray-600">{appointment.patient.email}</p>
            <p className="text-sm text-gray-600">{appointment.patient.phone}</p>
          </div>

          {/* Fecha y hora */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
            <p className="font-medium text-gray-900">
              {format(parseISO(appointment.date), "EEEE d 'de' MMMM", {
                locale: es,
              })}
            </p>
            <p className="text-sm text-gray-600">{appointment.time} hs</p>
          </div>

          {/* Estado */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          {/* Notas */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Notas</p>
            <p className="text-sm text-gray-700">
              {appointment.notes || 'Sin notas'}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="ml-4 flex gap-2">
          {config.actions.includes('confirm') && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              disabled={isUpdating}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar
            </button>
          )}
          {config.actions.includes('complete') && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Completar
            </button>
          )}
          {config.actions.includes('cancel') && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={isUpdating}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

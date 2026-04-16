'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'

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

type Patient = {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  dni?: string
}

type Appointment = {
  id: string
  date: string
  time: string
  status: string
  notes?: string
  cancellation_reason?: string
}

type Stats = {
  total: number
  completed: number
  upcoming: number
  cancelled: number
}

type Props = {
  patient: Patient
  appointments: Appointment[]
  stats: Stats
}

const tabs = ['Turnos', 'Datos', 'Odontograma'] as const
type Tab = typeof tabs[number]

export default function PatientDetailClient({ patient, appointments, stats }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Turnos')

  return (
    <div className="space-y-5">

      {/* Back */}
      <Link
        href="/dashboard/professional/pacientes"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Pacientes
      </Link>

      {/* Header tarjeta */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 text-xl font-bold flex items-center justify-center flex-shrink-0">
              {getInitials(patient.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{patient.email}</p>
              {patient.phone && <p className="text-sm text-slate-400">{patient.phone}</p>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/dashboard/professional/pacientes/${patient.id}/odontograma`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              Odontograma
            </Link>
            <Link
              href={`/dashboard/professional/turnos/nuevo?patientId=${patient.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              + Nuevo Turno
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <StatPill label="Totales"    value={stats.total}     color="text-blue-600" />
          <StatPill label="Completados" value={stats.completed} color="text-emerald-600" />
          <StatPill label="Próximos"   value={stats.upcoming}  color="text-violet-600" />
          <StatPill label="Cancelados" value={stats.cancelled} color="text-red-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Turnos */}
      {activeTab === 'Turnos' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Sin turnos registrados</p>
              <Link
                href={`/dashboard/professional/turnos/nuevo?patientId=${patient.id}`}
                className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                Crear primer turno →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((appt) => {
                const badge = statusBadge[appt.status] ?? { label: appt.status, className: 'bg-slate-100 text-slate-600' }
                return (
                  <div key={appt.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {format(parseISO(appt.date), "d 'de' MMMM yyyy", { locale: es })}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {appt.time} hs
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="text-xs text-slate-400">{appt.notes}</p>
                        )}
                        {appt.status === 'cancelled' && appt.cancellation_reason && (
                          <p className="text-xs text-red-500">Motivo: {appt.cancellation_reason}</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Datos */}
      {activeTab === 'Datos' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
          <DataRow label="Nombre completo" value={patient.name} />
          <DataRow label="Email"           value={patient.email} />
          <DataRow label="Teléfono"        value={patient.phone || '—'} />
          {patient.dni && <DataRow label="DNI" value={patient.dni} />}
          <DataRow
            label="Fecha de registro"
            value={format(parseISO(patient.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
          />
        </div>
      )}

      {/* Tab: Odontograma */}
      {activeTab === 'Odontograma' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Visualizá y editá el odontograma interactivo del paciente.
          </p>
          <Link
            href={`/dashboard/professional/pacientes/${patient.id}/odontograma`}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-5 py-2.5 transition-colors text-sm"
          >
            Abrir Odontograma →
          </Link>
        </div>
      )}

    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-sm text-slate-400 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  )
}

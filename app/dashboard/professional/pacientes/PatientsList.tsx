'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, Users, ChevronRight, CalendarDays } from 'lucide-react'

type Patient = {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  totalAppointments: number
  upcomingAppointments: number
}

type PatientsListProps = {
  patients: Patient[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => /^[A-Za-záéíóúÁÉÍÓÚñÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function PatientsList({ patients }: PatientsListProps) {
  const [search, setSearch] = useState('')

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter((patient) => {
    const searchLower = search.toLowerCase()
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      (patient.phone && patient.phone.includes(search))
    )
  })

  return (
    <div className="space-y-4">

      {/* Barra superior: búsqueda + contador */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-slate-400 md:ml-auto">
          {filteredPatients.length} de {patients.length} pacientes
        </p>
      </div>

      {/* Lista */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            {search ? 'Sin resultados para esa búsqueda' : 'No tenés pacientes todavía'}
          </p>
          {!search && (
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Los pacientes se registran usando tu código QR o link personalizado
            </p>
          )}
          {!search && (
            <Link
              href="/dashboard/professional/qr"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            >
              Ver mi código QR
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/dashboard/professional/pacientes/${patient.id}`}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {getInitials(patient.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{patient.name}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-sm text-slate-500 truncate">{patient.email}</span>
                  {patient.phone && (
                    <span className="text-sm text-slate-400">{patient.phone}</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Turnos</p>
                  <p className="text-sm font-semibold text-slate-900">{patient.totalAppointments}</p>
                </div>
                {patient.upcomingAppointments > 0 && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <CalendarDays className="w-3 h-3" />
                    {patient.upcomingAppointments} próximo{patient.upcomingAppointments !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-slate-400">Desde</p>
                  <p className="text-xs text-slate-600">
                    {format(parseISO(patient.created_at), 'd MMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>

              {/* Flecha */}
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}

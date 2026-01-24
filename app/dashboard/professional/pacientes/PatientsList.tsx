'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

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
    <div className="space-y-6">
      {/* Búsqueda y estadísticas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Búsqueda */}
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Estadística */}
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            <p className="text-sm text-gray-600">Pacientes totales</p>
          </div>
        </div>
      </div>

      {/* Lista de pacientes */}
      <div className="bg-white rounded-lg shadow">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">
              {search ? 'No se encontraron pacientes' : 'No tenés pacientes registrados todavía'}
            </p>
            <p className="text-sm mt-2">
              {search
                ? 'Intenta con otra búsqueda'
                : 'Los pacientes se registrarán usando tu código QR o link personalizado'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/dashboard/professional/pacientes/${patient.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Nombre y contacto */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      {patient.phone && (
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      )}
                    </div>

                    {/* Estadísticas */}
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Turnos totales</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {patient.totalAppointments}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Próximos turnos</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {patient.upcomingAppointments}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registrado</p>
                        <p className="text-sm text-gray-900">
                          {format(parseISO(patient.created_at), "d MMM yyyy", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Indicador de link */}
                  <div className="text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

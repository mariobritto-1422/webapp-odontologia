import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function PatientDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const patientId = session.user.id

  // Obtener información del profesional
  const { data: patient } = await supabase
    .from('patients')
    .select('*, professional:professionals(id, name, specialty, phone, address)')
    .eq('id', patientId)
    .single()

  // Obtener próximos turnos
  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .gte('date', new Date().toISOString().split('T')[0])
    .neq('status', 'cancelled')
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(3)

  // Contar turnos pendientes
  const { count: pendingCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .eq('status', 'pending')

  return (
    <div className="space-y-6 pb-6">
      {/* Bienvenida */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          ¡Hola, {session.user.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-600 mt-1">
          Bienvenido a tu panel de turnos
        </p>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/patient/nuevo-turno"
          className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold text-lg">Nuevo Turno</span>
            <span className="text-sm text-blue-100 mt-1">Solicitar turno</span>
          </div>
        </Link>

        <Link
          href="/dashboard/patient/turnos"
          className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow hover:border-blue-500 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <svg className="w-12 h-12 mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-lg text-gray-900">Mis Turnos</span>
            <span className="text-sm text-gray-600 mt-1">Ver todos</span>
          </div>
        </Link>
      </div>

      {/* Turnos Pendientes Alert */}
      {pendingCount && pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Tenés {pendingCount} turno{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de confirmación
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                El profesional debe confirmar tu solicitud
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Turnos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Próximos Turnos</h3>
        </div>

        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {format(parseISO(appointment.date), "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.time} hs
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 mb-4">No tenés turnos próximos</p>
            <Link
              href="/dashboard/patient/nuevo-turno"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Solicitar Turno
            </Link>
          </div>
        )}

        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/dashboard/patient/turnos"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos los turnos →
            </Link>
          </div>
        )}
      </div>

      {/* Info del Profesional */}
      {patient?.professional && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Tu Odontólogo</h3>
          <div className="space-y-2">
            <div>
              <p className="text-lg font-medium text-gray-900">
                {patient.professional.name}
              </p>
              <p className="text-sm text-gray-600">
                {patient.professional.specialty}
              </p>
            </div>
            {patient.professional.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {patient.professional.phone}
              </div>
            )}
            {patient.professional.address && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {patient.professional.address}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    confirmed: {
      label: 'Confirmado',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    cancelled: {
      label: 'Cancelado',
      color: 'bg-red-100 text-red-800 border-red-200',
    },
    completed: {
      label: 'Completado',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  }

  const statusConfig = config[status as keyof typeof config] || config.pending

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  )
}

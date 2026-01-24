import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener información del paciente
  const { data: patient, error: patientError } = await supabaseAdmin
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .eq('professional_id', professionalId)
    .single()

  if (patientError || !patient) {
    redirect('/dashboard/professional/pacientes')
  }

  // Obtener todos los turnos del paciente
  const { data: appointments, error: appointmentsError } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError)
  }

  // Calcular estadísticas
  const totalAppointments = appointments?.length || 0
  const completedAppointments =
    appointments?.filter((a) => a.status === 'completed').length || 0
  const cancelledAppointments =
    appointments?.filter((a) => a.status === 'cancelled').length || 0
  const upcomingAppointments =
    appointments?.filter(
      (a) =>
        a.status !== 'cancelled' &&
        a.status !== 'completed' &&
        parseISO(a.date) >= new Date()
    ).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/professional/pacientes"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Volver a Pacientes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Perfil del Paciente
        </h1>
      </div>

      {/* Información del paciente */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {patient.name}
            </h2>
            <div className="space-y-1">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {patient.email}
              </p>
              {patient.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Teléfono:</span> {patient.phone}
                </p>
              )}
              <p className="text-gray-600">
                <span className="font-medium">Registrado:</span>{' '}
                {format(parseISO(patient.created_at), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/professional/turnos/nuevo?patientId=${patient.id}`}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Turno
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <StatCard
            label="Turnos Totales"
            value={totalAppointments}
            color="blue"
          />
          <StatCard
            label="Completados"
            value={completedAppointments}
            color="green"
          />
          <StatCard
            label="Próximos"
            value={upcomingAppointments}
            color="purple"
          />
          <StatCard
            label="Cancelados"
            value={cancelledAppointments}
            color="red"
          />
        </div>
      </div>

      {/* Historial de turnos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Historial de Turnos
          </h2>
        </div>

        {appointments && appointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Este paciente no tiene turnos registrados</p>
            <p className="text-sm mt-2">
              Crea un nuevo turno para comenzar su historial
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  const colors = {
    blue: 'border-l-4 border-blue-500',
    green: 'border-l-4 border-green-500',
    purple: 'border-l-4 border-purple-500',
    red: 'border-l-4 border-red-500',
  }

  return (
    <div
      className={`p-4 bg-gray-50 rounded-lg ${colors[color as keyof typeof colors]}`}
    >
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function AppointmentRow({ appointment }: { appointment: any }) {
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800',
    },
    confirmed: {
      label: 'Confirmado',
      color: 'bg-green-100 text-green-800',
    },
    completed: {
      label: 'Completado',
      color: 'bg-gray-100 text-gray-800',
    },
    cancelled: {
      label: 'Cancelado',
      color: 'bg-red-100 text-red-800',
    },
  }

  const config = statusConfig[appointment.status as keyof typeof statusConfig]

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Fecha y hora */}
          <div className="mb-2">
            <p className="font-semibold text-gray-900">
              {format(parseISO(appointment.date), "EEEE d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </p>
            <p className="text-sm text-gray-600">{appointment.time} hs</p>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Notas:</span> {appointment.notes}
            </p>
          )}

          {/* Razón de cancelación */}
          {appointment.status === 'cancelled' &&
            appointment.cancellation_reason && (
              <p className="text-sm text-red-600 mt-2">
                <span className="font-medium">Motivo de cancelación:</span>{' '}
                {appointment.cancellation_reason}
              </p>
            )}
        </div>

        {/* Estado */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
        >
          {config.label}
        </span>
      </div>
    </div>
  )
}

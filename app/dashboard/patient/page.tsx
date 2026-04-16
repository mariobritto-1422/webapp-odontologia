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
    <div className="space-y-5 pb-6">
      {/* Bienvenida */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hola, {session.user.name?.split(' ')[0]}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Acción principal */}
      <Link
        href="/dashboard/patient/nuevo-turno"
        className="block bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">Solicitar turno</p>
            <p className="text-sm text-blue-100 mt-0.5">Elegí día y horario en 3 pasos</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Turnos Pendientes Alert */}
      {pendingCount && pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {pendingCount} turno{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de confirmación
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                El profesional debe confirmar tu solicitud
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Turnos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-semibold text-slate-900 text-sm">Próximos turnos</p>
          <Link href="/dashboard/patient/turnos" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Ver todos →
          </Link>
        </div>

        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm capitalize">
                      {format(parseISO(appointment.date), "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">
                      {appointment.time} hs
                    </p>
                    {appointment.notes && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
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
          <div className="py-10 text-center">
            <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-500">No tenés turnos próximos</p>
          </div>
        )}
      </div>

      {/* Info del Profesional */}
      {patient?.professional && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Tu odontólogo</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {patient.professional.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900">{patient.professional.name}</p>
              <p className="text-xs text-slate-500">{patient.professional.specialty}</p>
              {patient.professional.phone && (
                <p className="text-xs text-slate-500 mt-1">{patient.professional.phone}</p>
              )}
              {patient.professional.address && (
                <p className="text-xs text-slate-400 mt-0.5">{patient.professional.address}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-600 border-red-200' },
    completed: { label: 'Completado', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  }

  const statusConfig = config[status as keyof typeof config] || config.pending

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  )
}

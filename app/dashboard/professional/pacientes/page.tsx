import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import PatientsList from './PatientsList'
import Link from 'next/link'

export default async function PatientsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener todos los pacientes del profesional
  const { data: patients, error } = await supabaseAdmin
    .from('patients')
    .select('*')
    .eq('professional_id', professionalId)
    .order('name', { ascending: true })

  console.error('DEBUG PACIENTES:', {
    count: patients?.length,
    error: error?.message,
    professionalId,
    hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  })

  if (error) {
    console.error('Error fetching patients:', error)
  }

  // Obtener el conteo de turnos por paciente
  const patientsWithStats = await Promise.all(
    (patients || []).map(async (patient) => {
      const { count: totalAppointments } = await supabaseAdmin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', patient.id)

      const { count: upcomingAppointments } = await supabaseAdmin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', patient.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .neq('status', 'cancelled')

      return {
        ...patient,
        totalAppointments: totalAppointments || 0,
        upcomingAppointments: upcomingAppointments || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pacientes</h1>
        <Link
          href="/dashboard/professional/qr"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          + Nuevo Paciente
        </Link>
      </div>

      {/* Lista de pacientes */}
      <PatientsList patients={patientsWithStats} />
    </div>
  )
}

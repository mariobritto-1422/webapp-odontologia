import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PatientsList from './PatientsList'

export default async function PatientsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener todos los pacientes del profesional
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*')
    .eq('professional_id', professionalId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching patients:', error)
  }

  // Obtener el conteo de turnos por paciente
  const patientsWithStats = await Promise.all(
    (patients || []).map(async (patient) => {
      const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', patient.id)

      const { count: upcomingAppointments } = await supabase
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Base de Datos de Pacientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona la información de tus pacientes
          </p>
        </div>
      </div>

      {/* Lista de pacientes */}
      <PatientsList patients={patientsWithStats} />
    </div>
  )
}

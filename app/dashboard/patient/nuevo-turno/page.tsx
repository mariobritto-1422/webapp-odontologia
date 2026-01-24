import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewAppointmentFlow from './NewAppointmentFlow'

export default async function NewAppointmentPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const patientId = session.user.id

  // Obtener información del paciente y profesional
  const { data: patient } = await supabase
    .from('patients')
    .select('*, professional:professionals(id, name, schedule, appointment_duration, blocked_dates)')
    .eq('id', patientId)
    .single()

  if (!patient || !patient.professional) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: No se pudo cargar la información del profesional</p>
      </div>
    )
  }

  // Obtener turnos ya tomados del profesional
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('date, time')
    .eq('professional_id', patient.professional.id)
    .neq('status', 'cancelled')
    .gte('date', new Date().toISOString().split('T')[0])

  return (
    <div className="pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Solicitar Turno</h2>
        <p className="text-gray-600 mt-1">
          Selecciona día y horario en solo 3 pasos
        </p>
      </div>

      <NewAppointmentFlow
        patientId={patientId}
        professional={patient.professional}
        existingAppointments={existingAppointments || []}
      />
    </div>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AppointmentsList from './AppointmentsList'

export default async function PatientAppointmentsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const patientId = session.user.id

  // Obtener todos los turnos del paciente
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, professional:professionals(name, specialty, phone)')
    .eq('patient_id', patientId)
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  return (
    <div className="pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mis Turnos</h2>
        <p className="text-gray-600 mt-1">
          Gestiona tus citas médicas
        </p>
      </div>

      <AppointmentsList
        appointments={appointments || []}
        patientId={patientId}
      />
    </div>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { parseISO } from 'date-fns'
import PatientDetailClient from './PatientDetailClient'

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
  const appts = appointments || []
  const stats = {
    total:     appts.length,
    completed: appts.filter((a) => a.status === 'completed').length,
    cancelled: appts.filter((a) => a.status === 'cancelled').length,
    upcoming:  appts.filter(
      (a) =>
        a.status !== 'cancelled' &&
        a.status !== 'completed' &&
        parseISO(a.date) >= new Date()
    ).length,
  }

  return (
    <PatientDetailClient
      patient={patient}
      appointments={appts}
      stats={stats}
    />
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AppointmentsList from './AppointmentsList'
import Link from 'next/link'

export default async function AppointmentsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener todos los turnos
  const { data: appointments, error } = await supabaseAdmin
    .from('appointments')
    .select(`
      *,
      patient:patients(id, name, email, phone)
    `)
    .eq('professional_id', professionalId)
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (error) {
    console.error('Error fetching appointments:', error)
  }

  // Obtener todos los pacientes para el formulario de crear turno
  const { data: patients } = await supabaseAdmin
    .from('patients')
    .select('id, name, email')
    .eq('professional_id', professionalId)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Turnos</h1>
        <Link
          href="/dashboard/professional/turnos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          + Nuevo Turno
        </Link>
      </div>

      {/* Lista de turnos con filtros */}
      <AppointmentsList
        appointments={appointments || []}
        patients={patients || []}
        professionalId={professionalId}
      />
    </div>
  )
}

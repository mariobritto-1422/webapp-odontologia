import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NotificationsManager from './NotificationsManager'
import { addDays, format } from 'date-fns'

export default async function NotificationsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const in3Days = addDays(today, 3)

  // Obtener profesional para configuración
  const { data: professional } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', professionalId)
    .single()

  // Obtener turnos confirmados próximos (siguientes 7 días) para recordatorios
  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(id, name, email, phone)
    `)
    .eq('professional_id', professionalId)
    .eq('status', 'confirmed')
    .gte('date', tomorrow.toISOString().split('T')[0])
    .lte('date', addDays(today, 7).toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  // Obtener turnos de mañana específicamente
  const { data: tomorrowAppointments } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(id, name, email, phone)
    `)
    .eq('professional_id', professionalId)
    .eq('status', 'confirmed')
    .eq('date', tomorrow.toISOString().split('T')[0])
    .order('time', { ascending: true })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Notificaciones y Recordatorios
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona los recordatorios de turnos para tus pacientes
        </p>
      </div>

      <NotificationsManager
        professional={professional}
        upcomingAppointments={upcomingAppointments || []}
        tomorrowAppointments={tomorrowAppointments || []}
      />
    </div>
  )
}

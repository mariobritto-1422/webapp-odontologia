import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProfileForm from './ProfileForm'

export default async function PatientProfilePage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const patientId = session.user.id

  // Obtener información del paciente
  const { data: patient } = await supabase
    .from('patients')
    .select('*, professional:professionals(id, name, specialty, phone, email, address)')
    .eq('id', patientId)
    .single()

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: No se pudo cargar tu perfil</p>
      </div>
    )
  }

  return (
    <div className="pb-6 space-y-5">
      <div className="mb-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mi perfil</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Gestioná tu información personal
        </p>
      </div>

      <ProfileForm patient={patient} />
    </div>
  )
}

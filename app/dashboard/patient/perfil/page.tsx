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
    <div className="pb-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 mt-1">
          Gestiona tu información personal
        </p>
      </div>

      <ProfileForm patient={patient} />
    </div>
  )
}

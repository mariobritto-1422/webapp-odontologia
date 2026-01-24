import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewAppointmentForm from './NewAppointmentForm'
import Link from 'next/link'

export default async function NewAppointmentPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener todos los pacientes del profesional
  const { data: patients, error } = await supabase
    .from('patients')
    .select('id, name, email, phone')
    .eq('professional_id', professionalId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching patients:', error)
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/professional/turnos"
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
        >
          ← Volver a Turnos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Crear Nuevo Turno
        </h1>
        <p className="text-gray-600 mt-1">
          Agenda un nuevo turno para uno de tus pacientes
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow p-6">
        {patients && patients.length > 0 ? (
          <NewAppointmentForm
            patients={patients}
            professionalId={professionalId}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No tenés pacientes registrados todavía.
            </p>
            <Link
              href="/dashboard/professional/qr"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Genera un código QR para que tus pacientes se registren →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import OdontogramEditor from './OdontogramEditor'

export default async function OdontogramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  // Verificar autenticación
  if (!session) {
    redirect('/auth/login')
  }

  // Verificar que sea un profesional
  if (session.user.role !== 'professional') {
    redirect('/dashboard')
  }

  const { id: patientId } = await params

  // Obtener datos del paciente
  const { data: patient, error: patientError } = await supabaseAdmin
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .eq('professional_id', session.user.id)
    .single()

  if (patientError || !patient) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header sticky */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/dashboard/professional/pacientes/${patientId}`}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Volver al Paciente
          </Link>

          <h1 className="text-xl font-bold text-gray-900">
            Odontograma Interactivo
          </h1>

          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <OdontogramEditor
          patientId={patient.id}
          patientName={patient.name}
          initialOdontogram={patient.odontogram}
        />
      </main>
    </div>
  )
}

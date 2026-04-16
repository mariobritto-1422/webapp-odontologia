import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/professional/pacientes/${patientId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Paciente
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Odontograma</h1>
        <div className="w-32" />
      </div>

      {/* Editor */}
      <OdontogramEditor
        patientId={patient.id}
        patientName={patient.name}
        initialOdontogram={patient.odontogram}
      />
    </div>
  )
}

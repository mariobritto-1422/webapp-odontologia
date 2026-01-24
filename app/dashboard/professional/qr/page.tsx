import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import QRCodeGenerator from './QRCodeGenerator'

export default async function QRCodePage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener el slug del profesional
  const { data: professional, error } = await supabase
    .from('professionals')
    .select('slug, name')
    .eq('id', professionalId)
    .single()

  if (error || !professional) {
    console.error('Error fetching professional:', error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el código QR</p>
          <p className="text-gray-600 text-sm">Por favor, intenta cerrar sesión y volver a iniciar sesión</p>
        </div>
      </div>
    )
  }

  // Generar la URL completa de registro
  // TODO: Cambiar por la URL real de producción
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const registrationUrl = `${baseUrl}/auth/register/patient?professional=${professional.slug}`

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Código QR para Pacientes
        </h1>
        <p className="text-gray-600 mt-1">
          Compartí este código QR para que tus pacientes se registren fácilmente
        </p>
      </div>

      {/* Explicación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          ¿Cómo funciona?
        </h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Descargá el código QR o copiá el link</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Compartilo con tus pacientes (WhatsApp, email, redes sociales, impreso en consultorio)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Tus pacientes escanean el QR o acceden al link</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>Se registran automáticamente como tus pacientes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">5.</span>
            <span>Pueden empezar a solicitar turnos inmediatamente</span>
          </li>
        </ul>
      </div>

      {/* QR Generator Component */}
      <QRCodeGenerator
        registrationUrl={registrationUrl}
        professionalName={professional.name}
      />
    </div>
  )
}

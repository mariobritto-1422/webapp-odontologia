import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ConfigurationTabs from './ConfigurationTabs'

export default async function ConfigurationPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Obtener información completa del profesional
  const { data: professional, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', professionalId)
    .single()

  if (error || !professional) {
    console.error('Error fetching professional:', error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar la configuración</p>
          <p className="text-gray-600 text-sm">Por favor, intenta cerrar sesión y volver a iniciar sesión</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Configuración
        </h1>
        <p className="text-gray-600 mt-1">
          Configura tu perfil, horarios y preferencias
        </p>
      </div>

      {/* Tabs de configuración */}
      <ConfigurationTabs professional={professional} />
    </div>
  )
}

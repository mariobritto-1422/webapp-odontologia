import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import RecetasClient from './RecetasClient'

export default async function RecetasPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const professionalId = session.user.id

  const { data: patients } = await supabaseAdmin
    .from('patients')
    .select('id, name, dni')
    .eq('professional_id', professionalId)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recetas</h1>
        <p className="text-gray-500 mt-1">Emití recetas y descargalas en PDF</p>
      </div>
      <RecetasClient patients={patients || []} />
    </div>
  )
}

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener estado activo del profesional
    const { data: professional, error } = await supabaseAdmin
      .from('professionals')
      .select('is_active')
      .eq('id', session.user.id)
      .single()

    if (error || !professional) {
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      isActive: professional.is_active
    })
  } catch (error) {
    console.error('Error checking active status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

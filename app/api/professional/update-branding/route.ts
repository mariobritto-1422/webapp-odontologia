import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { professionalId, branding } = body

    // Verificar que el profesional es el usuario actual
    if (professionalId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Actualizar el profesional
    const { data, error } = await supabase
      .from('professionals')
      .update({
        branding,
        updated_at: new Date().toISOString(),
      })
      .eq('id', professionalId)
      .select()
      .single()

    if (error) {
      console.error('Error updating branding:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el branding' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in update branding:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

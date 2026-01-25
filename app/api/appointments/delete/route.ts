import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { appointmentId } = body

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Falta el ID del turno' },
        { status: 400 }
      )
    }

    // Verificar que el turno pertenece al profesional
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .eq('professional_id', session.user.id)
      .single()

    if (fetchError || !appointment) {
      console.error('Error fetching appointment:', fetchError)
      return NextResponse.json(
        { error: 'Turno no encontrado o no tienes permisos' },
        { status: 404 }
      )
    }

    // Eliminar el turno
    const { error } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('professional_id', session.user.id)

    if (error) {
      console.error('Error deleting appointment:', error)
      return NextResponse.json(
        { error: 'Error al eliminar el turno' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete appointment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

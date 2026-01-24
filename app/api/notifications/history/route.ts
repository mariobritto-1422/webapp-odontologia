import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const professionalId = session.user.id

    // Obtener historial de notificaciones con datos del paciente y turno
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        patient:patients(id, name, email),
        appointment:appointments(id, date, time)
      `)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json(
        { error: 'Error al obtener el historial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      notifications: notifications || [],
    })
  } catch (error: any) {
    console.error('Error in notifications history API:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

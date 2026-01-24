import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { isPast, parseISO } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { appointmentId, patientId } = body

    // Validaciones básicas
    if (!appointmentId || !patientId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el paciente es el usuario actual
    if (patientId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener el turno
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .eq('patient_id', patientId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el turno no esté ya cancelado o completado
    if (appointment.status === 'cancelled') {
      return NextResponse.json(
        { error: 'El turno ya está cancelado' },
        { status: 400 }
      )
    }

    if (appointment.status === 'completed') {
      return NextResponse.json(
        { error: 'No se puede cancelar un turno completado' },
        { status: 400 }
      )
    }

    // Verificar que el turno no sea del pasado
    const appointmentDate = parseISO(`${appointment.date}T${appointment.time}:00`)
    if (isPast(appointmentDate)) {
      return NextResponse.json(
        { error: 'No se puede cancelar un turno pasado' },
        { status: 400 }
      )
    }

    // Cancelar el turno
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling appointment:', error)
      return NextResponse.json(
        { error: 'Error al cancelar el turno' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error in cancel appointment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

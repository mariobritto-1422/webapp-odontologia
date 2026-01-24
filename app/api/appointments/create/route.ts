import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { professionalId, patientId, date, time, notes, status } = body

    // Validaciones
    if (!professionalId || !patientId || !date || !time) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el profesional es el usuario actual
    if (professionalId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Verificar que el paciente pertenece al profesional
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('professional_id', professionalId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que no haya otro turno en el mismo horario
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .single()

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Ya existe un turno en ese horario' },
        { status: 400 }
      )
    }

    // Crear el turno
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        professional_id: professionalId,
        patient_id: patientId,
        date,
        time,
        notes: notes || null,
        status: status || 'confirmed',
        created_by: 'professional',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return NextResponse.json(
        { error: 'Error al crear el turno' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in create appointment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

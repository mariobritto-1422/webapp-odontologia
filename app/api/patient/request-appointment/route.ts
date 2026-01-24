import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { patientId, professionalId, date, time, notes } = body

    // Validaciones
    if (!patientId || !professionalId || !date || !time) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el paciente es el usuario actual
    if (patientId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Verificar que el paciente pertenece al profesional
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('professional_id', professionalId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado o no pertenece a este profesional' },
        { status: 404 }
      )
    }

    // Verificar que no haya otro turno en el mismo horario
    const { data: existingAppointment } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .single()

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Este horario ya está ocupado' },
        { status: 400 }
      )
    }

    // Crear el turno con estado pending
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        professional_id: professionalId,
        patient_id: patientId,
        date,
        time,
        datetime: `${date}T${time}:00`,
        notes: notes || null,
        status: 'pending', // Pendiente de confirmación
        created_by: 'patient',
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
    console.error('Error in request appointment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const professionalId = session.user.id

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`*, patients (id, name, dni)`)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching prescriptions:', error)
      return NextResponse.json({ error: 'Error al obtener recetas' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in GET prescriptions:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await request.json()
    const { patientId, medications, diagnosis, notes } = body

    if (!patientId || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: 'Paciente y al menos un medicamento son requeridos' }, { status: 400 })
    }

    const professionalId = session.user.id

    // Verificar que el paciente pertenece al profesional
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('professional_id', professionalId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        professional_id: professionalId,
        patient_id: patientId,
        medications,
        diagnosis: diagnosis || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating prescription:', error)
      return NextResponse.json({ error: 'Error al crear la receta' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST prescriptions:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Obtener el odontograma de un paciente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await auth()

    // Verificar autenticación
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que sea un profesional
    if (session.user.role !== 'professional') {
      return NextResponse.json(
        { error: 'Solo profesionales pueden acceder a odontogramas' },
        { status: 403 }
      )
    }

    const { patientId } = await params

    // Obtener el paciente y verificar que pertenezca al profesional
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('id, name, odontogram, professional_id')
      .eq('id', patientId)
      .eq('professional_id', session.user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      patientId: patient.id,
      patientName: patient.name,
      odontogram: patient.odontogram || null,
    })
  } catch (error) {
    console.error('Error in GET /api/odontogram/[patientId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT: Actualizar el odontograma de un paciente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const session = await auth()

    // Verificar autenticación
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que sea un profesional
    if (session.user.role !== 'professional') {
      return NextResponse.json(
        { error: 'Solo profesionales pueden modificar odontogramas' },
        { status: 403 }
      )
    }

    const { patientId } = await params
    const body = await request.json()
    const { odontogram } = body

    if (!odontogram) {
      return NextResponse.json(
        { error: 'Odontogram data is required' },
        { status: 400 }
      )
    }

    // Verificar que el paciente pertenezca al profesional
    const { data: patient, error: verifyError } = await supabaseAdmin
      .from('patients')
      .select('professional_id')
      .eq('id', patientId)
      .single()

    if (verifyError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    if (patient.professional_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este paciente' },
        { status: 403 }
      )
    }

    // Actualizar el odontograma
    const { error: updateError } = await supabaseAdmin
      .from('patients')
      .update({
        odontogram,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patientId)

    if (updateError) {
      console.error('Error updating odontogram:', updateError)
      return NextResponse.json(
        { error: 'Error al guardar el odontograma' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Odontograma guardado correctamente',
    })
  } catch (error) {
    console.error('Error in PUT /api/odontogram/[patientId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

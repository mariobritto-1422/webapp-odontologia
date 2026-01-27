import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generateOdontogramPDF } from '@/lib/pdf-generator'

export async function POST(
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
        { error: 'Solo profesionales pueden exportar odontogramas' },
        { status: 403 }
      )
    }

    const { patientId } = await params
    const body = await request.json()
    const { odontogramImageBase64 } = body

    if (!odontogramImageBase64) {
      return NextResponse.json(
        { error: 'Se requiere la imagen del odontograma' },
        { status: 400 }
      )
    }

    // Obtener datos del paciente
    const { data: patient, error: patientError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('professional_id', session.user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el paciente tenga un odontograma
    if (!patient.odontogram) {
      return NextResponse.json(
        { error: 'El paciente no tiene un odontograma registrado' },
        { status: 404 }
      )
    }

    // Obtener datos del profesional
    const { data: professional, error: professionalError } = await supabaseAdmin
      .from('professionals')
      .select('name, specialty, email, phone, branding')
      .eq('id', session.user.id)
      .single()

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: 'Error al obtener datos del profesional' },
        { status: 500 }
      )
    }

    // Generar PDF
    const pdfBuffer = await generateOdontogramPDF({
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
      },
      professional: {
        name: professional.name,
        specialty: professional.specialty,
        email: professional.email,
        phone: professional.phone,
        branding: professional.branding,
      },
      odontogram: patient.odontogram,
      odontogramImageBase64,
    })

    // Retornar el PDF (convertir Buffer a Uint8Array)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="odontograma-${patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error in POST /api/odontogram/[patientId]/export-pdf:', error)
    return NextResponse.json(
      { error: 'Error al generar el PDF' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import PrescriptionDocument from './PrescriptionDocument'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de receta requerido' }, { status: 400 })
    }

    const professionalId = session.user.id

    // Obtener receta con datos del paciente
    const { data: prescription, error: prescError } = await supabase
      .from('prescriptions')
      .select(`*, patients (id, name, dni)`)
      .eq('id', id)
      .eq('professional_id', professionalId)
      .single()

    if (prescError || !prescription) {
      return NextResponse.json({ error: 'Receta no encontrada' }, { status: 404 })
    }

    // Obtener datos del profesional
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('name, specialty, matricula, address, work_phone')
      .eq('id', professionalId)
      .single()

    if (profError || !professional) {
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 })
    }

    const patient = prescription.patients as { name: string; dni: string | null }

    const buffer = await renderToBuffer(
      createElement(PrescriptionDocument, {
        prescription: {
          id: prescription.id,
          medications: prescription.medications,
          diagnosis: prescription.diagnosis,
          notes: prescription.notes,
          created_at: prescription.created_at,
        },
        professional,
        patient,
      })
    )

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receta-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Error al generar el PDF' }, { status: 500 })
  }
}

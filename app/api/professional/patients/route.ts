import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'professional') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const professionalId = session.user.id

  const body = await request.json()
  const name = String(body.name || '').trim()
  const email = body.email ? String(body.email).trim().toLowerCase() : null
  const phone = body.phone ? String(body.phone).trim() : null
  const dni = body.dni ? String(body.dni).trim() : null

  if (!name) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('patients')
      .select('id')
      .ilike('email', email)
      .eq('professional_id', professionalId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ya existe un paciente con ese email' }, { status: 409 })
    }
  }

  const { data: patient, error } = await supabaseAdmin
    .from('patients')
    .insert({
      name,
      email,
      phone,
      dni,
      professional_id: professionalId,
      accepted_terms: false,
      accepted_privacy: false,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error al crear paciente manual:', error)
    return NextResponse.json({ error: 'Error al crear el paciente' }, { status: 500 })
  }

  return NextResponse.json({ id: patient.id }, { status: 201 })
}

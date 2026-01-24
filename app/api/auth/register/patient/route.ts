import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      professionalSlug,
      acceptedTerms,
      acceptedPrivacy,
    } = body

    // Validaciones básicas
    if (!email || !password || !name || !professionalSlug) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }

    // Validar aceptación de términos
    if (!acceptedTerms || !acceptedPrivacy) {
      return NextResponse.json(
        { error: 'Debes aceptar los términos y la política de privacidad' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar el profesional por slug
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, is_active')
      .eq('slug', professionalSlug)
      .maybeSingle()

    if (profError || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      )
    }

    if (!professional.is_active) {
      return NextResponse.json(
        { error: 'El profesional no está activo en este momento' },
        { status: 400 }
      )
    }

    // Verificar si el paciente ya existe para este profesional
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email)
      .eq('professional_id', professional.id)
      .maybeSingle()

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Ya estás registrado con este profesional' },
        { status: 409 }
      )
    }

    // Hashear la contraseña
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Crear el paciente en la base de datos
    const { data: newPatient, error: insertError } = await supabase
      .from('patients')
      .insert({
        email,
        password_hash,
        name,
        phone: phone || null,
        professional_id: professional.id,
        accepted_terms: true,
        accepted_privacy: true,
        accepted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error al crear paciente:', insertError)
      return NextResponse.json(
        { error: 'Error al crear la cuenta' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cuenta creada exitosamente',
        patient: {
          id: newPatient.id,
          email: newPatient.email,
          name: newPatient.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro de paciente:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

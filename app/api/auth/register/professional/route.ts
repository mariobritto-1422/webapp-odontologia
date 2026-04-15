import { NextResponse } from 'next/server'
import { hasSupabaseServiceRoleKey, supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    if (!hasSupabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'Configuración incompleta del servidor' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const normalizedEmail = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const name = String(body.name || '').trim()
    const specialty = String(body.specialty || '').trim()
    const phone = body.phone ? String(body.phone).trim() : null

    // Validaciones básicas
    if (!normalizedEmail || !password || !name || !specialty) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
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

    // Verificar si el email ya existe
    const { data: existingProfessional } = await supabaseAdmin
      .from('professionals')
      .select('id')
      .ilike('email', normalizedEmail)
      .maybeSingle()

    if (existingProfessional) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Generar slug único basado en el nombre
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres especiales con guiones
      .replace(/^-+|-+$/g, '')          // Remover guiones al inicio y final

    // Verificar si el slug existe y agregar número si es necesario
    let slug = baseSlug
    let counter = 1
    let slugExists = true

    while (slugExists) {
      const { data } = await supabaseAdmin
        .from('professionals')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (!data) {
        slugExists = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Hashear la contraseña
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Crear el profesional en la base de datos con solo los campos requeridos
    const { data: newProfessional, error: insertError } = await supabaseAdmin
      .from('professionals')
      .insert({
        email: normalizedEmail,
        password_hash,
        name,
        specialty,
        phone,
        slug,
        subscription_plan: 'pro',
        subscription_status: 'trialing',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error al crear profesional:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        {
          error: 'Error al crear la cuenta',
          details: insertError.message || 'Error desconocido'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cuenta creada exitosamente',
        professional: {
          id: newProfessional.id,
          email: newProfessional.email,
          name: newProfessional.name,
          slug: newProfessional.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro de profesional:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

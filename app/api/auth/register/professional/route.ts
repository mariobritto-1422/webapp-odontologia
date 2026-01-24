import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, specialty, phone } = body

    // Validaciones básicas
    if (!email || !password || !name || !specialty) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
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

    // Verificar si el email ya existe
    const { data: existingProfessional } = await supabase
      .from('professionals')
      .select('id')
      .eq('email', email)
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
      const { data } = await supabase
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

    // Crear el profesional en la base de datos
    const { data: newProfessional, error: insertError } = await supabase
      .from('professionals')
      .insert({
        email,
        password_hash,
        name,
        specialty,
        phone: phone || null,
        slug,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error al crear profesional:', insertError)
      return NextResponse.json(
        { error: 'Error al crear la cuenta' },
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
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

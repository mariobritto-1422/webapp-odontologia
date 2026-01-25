import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('Testing login for:', email)

    // Buscar usuario en professionals
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    console.log('Professional query result:', { professional, profError })

    if (profError) {
      return NextResponse.json({
        success: false,
        error: 'Error querying database',
        details: profError.message
      })
    }

    if (!professional) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      })
    }

    if (!professional.password_hash) {
      return NextResponse.json({
        success: false,
        error: 'No password hash found'
      })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, professional.password_hash)

    console.log('Password valid:', isValidPassword)

    return NextResponse.json({
      success: isValidPassword,
      message: isValidPassword ? 'Login successful' : 'Invalid password',
      userId: professional.id
    })
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

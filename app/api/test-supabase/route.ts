import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Verificar que supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key exists:', !!supabaseKey)

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Variables de entorno no configuradas',
        url: supabaseUrl,
        hasKey: !!supabaseKey
      })
    }

    // Test 2: Intentar conectar a Supabase
    const { data, error } = await supabase
      .from('professionals')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Error al conectar con Supabase',
        details: error.message,
        code: error.code,
        hint: error.hint
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexión a Supabase exitosa',
      recordsFound: data?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error inesperado',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

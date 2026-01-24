import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug es requerido' },
        { status: 400 }
      )
    }

    // Buscar el profesional por slug (solo profesionales activos)
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('id, name, specialty, slug, branding, is_active, terms, privacy_policy')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !professional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      professional,
    })
  } catch (error) {
    console.error('Error al obtener profesional:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { PreApproval } from 'mercadopago'
import { auth } from '@/lib/auth'
import { mpClient, PLANS } from '@/lib/mercadopago'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlanId } from '@/lib/mercadopago'

export async function POST(request: Request) {
  try {
    // 1. Usuario autenticado y con rol profesional
    const session = await auth()
    if (!session || session.user.role !== 'professional') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Validar body
    const body = await request.json()
    const { plan } = body as { plan: PlanId }

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
    }

    const professionalId = session.user.id

    // 3. Obtener email del profesional desde BD
    const { data: professional, error: dbError } = await supabaseAdmin
      .from('professionals')
      .select('email')
      .eq('id', professionalId)
      .single()

    if (dbError || !professional) {
      return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 })
    }

    const planDef = PLANS[plan]
    const baseUrl = process.env.NEXTAUTH_URL

    // 4. Crear preapproval (suscripción recurrente) en MercadoPago
    const preapproval = new PreApproval(mpClient)
    const response = await preapproval.create({
      body: {
        back_url: `${baseUrl}/dashboard/professional/suscripcion?success=true`,
        reason: `SonrisApp - Plan ${planDef.name}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: planDef.price,
          currency_id: 'ARS',
        },
        payer_email: professional.email,
        // external_reference identifica al profesional y plan en el webhook
        external_reference: `${professionalId}|${plan}`,
        status: 'pending',
      },
    })

    if (!response.init_point) {
      console.error('MP create-subscription: sin init_point en respuesta', response)
      return NextResponse.json({ error: 'Error al crear suscripción' }, { status: 500 })
    }

    // 5. Retornar URL de checkout — la BD se actualiza únicamente vía webhook
    return NextResponse.json({ url: response.init_point })
  } catch (error) {
    console.error('Error en create-subscription MP:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

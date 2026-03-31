import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { PreApproval, Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlanId } from '@/lib/mercadopago'

// MP firma los webhooks con HMAC-SHA256
// Header x-signature: "ts=TIMESTAMP,v1=HASH"
// Manifest: "id:{dataId};request-id:{xRequestId};ts:{ts};"
function verifySignature(xSignature: string, xRequestId: string, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // Sin secret configurado: pasar (solo dev)

  const parts: Record<string, string> = {}
  for (const part of xSignature.split(',')) {
    const idx = part.indexOf('=')
    if (idx !== -1) parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
  }

  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')
  return expected === v1
}

// ------------------------------------------------------------
// Handlers por tipo de notificación
// ------------------------------------------------------------

async function handlePreapproval(preapprovalId: string) {
  const preapproval = new PreApproval(mpClient)
  const data = await preapproval.get({ id: preapprovalId })

  const externalRef = data.external_reference ?? ''
  const [professionalId, plan] = externalRef.split('|')

  if (!professionalId || !plan) {
    console.error('Webhook MP preapproval: external_reference inválido', externalRef)
    return
  }

  const statusMap: Record<string, string> = {
    authorized: 'active',
    pending:    'trialing',
    cancelled:  'cancelled',
    paused:     'past_due',
  }
  const mappedStatus = statusMap[data.status ?? ''] ?? 'expired'

  await supabaseAdmin
    .from('professionals')
    .update({
      subscription_plan:       plan as PlanId,
      subscription_status:     mappedStatus,
      stripe_subscription_id:  preapprovalId, // reutilizamos columna para MP preapproval_id
    })
    .eq('id', professionalId)

  console.log(`Webhook MP preapproval ${preapprovalId}: profesional ${professionalId} → plan ${plan}, status ${mappedStatus}`)
}

async function handlePayment(paymentId: string) {
  const payment = new Payment(mpClient)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await payment.get({ id: paymentId }) as any

  // Solo procesar pagos asociados a una suscripción
  if (!data.subscription_id) return

  const preapprovalId = String(data.subscription_id)

  // Buscar profesional por preapproval_id (guardado en stripe_subscription_id)
  const { data: professional } = await supabaseAdmin
    .from('professionals')
    .select('id')
    .eq('stripe_subscription_id', preapprovalId)
    .single()

  if (!professional) {
    console.error('Webhook MP payment: profesional no encontrado para preapproval', preapprovalId)
    return
  }

  if (data.status === 'approved') {
    await supabaseAdmin
      .from('professionals')
      .update({
        subscription_status:  'active',
        grace_period_ends_at: null,
      })
      .eq('id', professional.id)

    console.log(`Webhook MP payment approved: profesional ${professional.id} → active`)
  } else if (data.status === 'rejected' || data.status === 'cancelled') {
    const gracePeriodEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

    await supabaseAdmin
      .from('professionals')
      .update({
        subscription_status:  'past_due',
        grace_period_ends_at: gracePeriodEndsAt,
      })
      .eq('id', professional.id)

    console.log(`Webhook MP payment failed: profesional ${professional.id} → past_due, gracia hasta ${gracePeriodEndsAt}`)
  }
}

// ------------------------------------------------------------
// Handler principal
// ------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = JSON.parse(rawBody) as any

    const xSignature = request.headers.get('x-signature') ?? ''
    const xRequestId = request.headers.get('x-request-id') ?? ''
    const dataId = String(body?.data?.id ?? '')

    // Verificar firma HMAC-SHA256
    if (xSignature && !verifySignature(xSignature, xRequestId, dataId)) {
      console.error('Webhook MP: firma inválida')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const type: string = body?.type ?? ''

    if (type === 'subscription_preapproval') {
      await handlePreapproval(dataId)
    } else if (type === 'payment') {
      await handlePayment(dataId)
    } else {
      console.log(`Webhook MP: tipo ignorado → ${type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    // Siempre responder 200 para que MP no reintente indefinidamente
    console.error('Webhook MP: error procesando notificación', error)
    return NextResponse.json({ received: true })
  }
}

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSubscriptionData } from '@/lib/subscription'
import { PLANS, formatPriceARS } from '@/lib/mercadopago'
import Link from 'next/link'

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== 'professional') redirect('/auth/login')

  const sub = await getSubscriptionData(session.user.id)
  if (!sub) redirect('/auth/login')

  const params = await searchParams
  const pagoExitoso = params.success === 'true'
  const plan = PLANS[sub.plan]

  const statusLabels: Record<string, { label: string; color: string }> = {
    trialing:  { label: 'Trial activo',   color: 'text-amber-700 bg-amber-50 border-amber-200' },
    active:    { label: 'Activo',         color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    past_due:  { label: 'Pago pendiente', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    cancelled: { label: 'Cancelado',      color: 'text-gray-600 bg-gray-50 border-gray-200' },
    expired:   { label: 'Expirado',       color: 'text-red-700 bg-red-50 border-red-200' },
  }

  const statusDisplay = statusLabels[sub.status] ?? statusLabels['expired']

  return (
    <div className="max-w-lg mx-auto py-12 space-y-6">

      {/* Banner éxito post-pago */}
      {pagoExitoso && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h2 className="text-lg font-semibold text-emerald-800">¡Pago confirmado!</h2>
          <p className="text-sm text-emerald-700 mt-1">
            Tu suscripción está siendo activada. Puede tardar unos segundos en reflejarse.
          </p>
        </div>
      )}

      {/* Estado actual */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Tu suscripción</h1>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Plan actual</p>
            <p className="text-lg font-bold text-gray-900">{plan.name}</p>
            <p className="text-sm text-gray-500">{formatPriceARS(plan.price)}/mes</p>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>

        {sub.trialEndsAt && sub.status === 'trialing' && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            Trial vence el {new Date(sub.trialEndsAt).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        )}

        {sub.subscriptionEndsAt && sub.status === 'active' && (
          <p className="text-sm text-gray-600">
            Próxima renovación:{' '}
            {new Date(sub.subscriptionEndsAt).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        )}

        {sub.status === 'past_due' && (
          <p className="text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2">
            Tu último pago falló. Ingresá a MercadoPago para actualizar tu método de pago.
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/professional/planes"
          className="w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Ver todos los planes
        </Link>
        <Link
          href="/dashboard/professional"
          className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}

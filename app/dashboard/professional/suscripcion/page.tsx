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
    cancelled: { label: 'Cancelado',      color: 'text-slate-600 bg-slate-100 border-slate-200' },
    expired:   { label: 'Expirado',       color: 'text-red-700 bg-red-50 border-red-200' },
  }

  const statusDisplay = statusLabels[sub.status] ?? statusLabels['expired']

  return (
    <div className="max-w-lg mx-auto py-10 space-y-5">

      {/* Banner éxito post-pago */}
      {pagoExitoso && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-emerald-800">¡Pago confirmado!</h2>
          <p className="text-sm text-emerald-700 mt-1">
            Tu suscripción está siendo activada. Puede tardar unos segundos en reflejarse.
          </p>
        </div>
      )}

      {/* Estado actual */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tu suscripción</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">{plan.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">{formatPriceARS(plan.price)}/mes</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>

        {sub.trialEndsAt && sub.status === 'trialing' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-amber-800">
              Trial vence el {new Date(sub.trialEndsAt).toLocaleDateString('es-AR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        )}

        {sub.subscriptionEndsAt && sub.status === 'active' && (
          <p className="text-sm text-slate-500">
            Próxima renovación:{' '}
            <span className="text-slate-700 font-medium">
              {new Date(sub.subscriptionEndsAt).toLocaleDateString('es-AR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </p>
        )}

        {sub.status === 'past_due' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-orange-700">
              Tu último pago falló. Ingresá a MercadoPago para actualizar tu método de pago.
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2.5">
        <Link
          href="/dashboard/professional/planes"
          className="w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Ver todos los planes
        </Link>
        <Link
          href="/dashboard/professional"
          className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}

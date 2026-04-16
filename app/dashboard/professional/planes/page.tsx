import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PLANS, formatPriceARS } from '@/lib/mercadopago'
import type { PlanId } from '@/lib/mercadopago'
import { getSubscriptionData, evaluateAccess, canUseFeature } from '@/lib/subscription'
import type { Feature } from '@/lib/subscription'
import SubscriptionButton from './SubscriptionButton'

// Features en orden de visualización con etiqueta legible
const FEATURE_LABELS: Record<Feature, string> = {
  unlimited_patients:        'Pacientes ilimitados',
  unlimited_email_reminders: 'Recordatorios sin límite',
  odontogram:                'Odontograma interactivo FDI',
  pdf_export:                'Exportación a PDF profesional',
  custom_branding:           'Branding personalizado',
  advanced_dashboard:        'Dashboard avanzado con gráficos',
  multiple_professionals:    'Hasta 5 profesionales',
  priority_support:          'Soporte prioritario',
}

const ORDERED_FEATURES: Feature[] = [
  'unlimited_patients',
  'unlimited_email_reminders',
  'odontogram',
  'pdf_export',
  'custom_branding',
  'advanced_dashboard',
  'multiple_professionals',
  'priority_support',
]

function getPlanFeatureRows(planId: PlanId) {
  const plan = PLANS[planId]

  const baseRows = [
    plan.patientLimit
      ? `Hasta ${plan.patientLimit} pacientes`
      : 'Pacientes ilimitados',
    plan.emailLimit
      ? `${plan.emailLimit} emails/mes`
      : 'Emails ilimitados',
  ]

  const flagRows = ORDERED_FEATURES
    .filter((f) => !['unlimited_patients', 'unlimited_email_reminders'].includes(f))
    .map((feature) => ({
      label: FEATURE_LABELS[feature],
      included: canUseFeature(planId, feature),
    }))

  return { baseRows, flagRows }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  trialing:  { label: 'Trial activo',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  active:    { label: 'Activo',         color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  past_due:  { label: 'Pago pendiente', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  cancelled: { label: 'Cancelado',      color: 'bg-slate-100 text-slate-600 border-slate-200' },
  expired:   { label: 'Expirado',       color: 'bg-red-50 text-red-700 border-red-200' },
}

const PLAN_BUTTON_VARIANT: Record<PlanId, 'outline' | 'primary' | 'dark'> = {
  starter: 'outline',
  pro:     'primary',
  clinica: 'dark',
}

export default async function PlanesPage() {
  const session = await auth()
  if (!session || session.user.role !== 'professional') redirect('/auth/login')

  const sub = await getSubscriptionData(session.user.id)
  if (!sub) redirect('/auth/login')

  const access = evaluateAccess(sub)
  const statusDisplay = STATUS_LABELS[sub.status] ?? { label: sub.status, color: 'bg-slate-100 text-slate-600 border-slate-200' }
  const planOrder: PlanId[] = ['starter', 'pro', 'clinica']

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── Banner de estado actual ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-1">Suscripción actual</p>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">Plan {PLANS[sub.plan].name}</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>
          {access.daysRemaining !== null && (
            <p className="text-xs text-slate-500 mt-1">
              {sub.status === 'trialing' && `${access.daysRemaining} días restantes de prueba`}
              {sub.status === 'past_due' && `Período de gracia: ${access.daysRemaining} días`}
              {sub.status === 'cancelled' && `Acceso hasta: ${access.daysRemaining} días`}
            </p>
          )}
        </div>
      </div>

      {/* ── Avisos ── */}
      {sub.status === 'trialing' && access.daysRemaining !== null && access.daysRemaining <= 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          Tu prueba vence en {access.daysRemaining} día{access.daysRemaining !== 1 ? 's' : ''}.
          Elegí un plan para continuar sin interrupciones.
        </div>
      )}
      {sub.status === 'past_due' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          Tu último pago falló. Ingresá a MercadoPago para actualizar tu método de pago.
        </div>
      )}

      {/* ── Título ── */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Planes disponibles</h3>
        <p className="text-sm text-slate-500 mt-1">
          Todos los planes incluyen 14 días de prueba gratuita con acceso Pro completo.
        </p>
      </div>

      {/* ── Cards de planes ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planOrder.map((planId) => {
          const plan = PLANS[planId]
          const { baseRows, flagRows } = getPlanFeatureRows(planId)
          const isCurrent = sub.plan === planId && sub.status !== 'expired'
          const isRecommended = plan.highlight
          const nameColor = isRecommended ? 'text-blue-600' : 'text-slate-500'

          return (
            <div
              key={planId}
              className={`relative bg-white rounded-xl flex flex-col gap-5 p-6 ${
                isRecommended
                  ? 'border-2 border-blue-600 shadow-md'
                  : 'border border-slate-200'
              }`}
            >
              {/* Badge "Más popular" — solo en Pro */}
              {isRecommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Más popular
                </span>
              )}

              {/* Badge "Tu plan actual" */}
              {isCurrent && (
                <span className="absolute -top-3 right-4 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  Tu plan actual
                </span>
              )}

              {/* Nombre y precio */}
              <div>
                <p className={`text-sm font-bold uppercase tracking-wide ${nameColor}`}>{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{formatPriceARS(plan.price)}</span>
                  <span className="text-sm text-slate-400">/mes</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {baseRows.map((row) => (
                  <li key={row} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    {row}
                  </li>
                ))}
                {flagRows.map(({ label, included }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-2 text-sm ${included ? 'text-slate-700' : 'text-slate-400'}`}
                  >
                    {included
                      ? <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <MinusIcon className="w-4 h-4 text-slate-300 shrink-0" />
                    }
                    {label}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                {isCurrent ? (
                  <div className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center bg-slate-100 text-slate-400 cursor-default">
                    Plan actual
                  </div>
                ) : (
                  <SubscriptionButton
                    mode="checkout"
                    plan={planId}
                    label={sub.status === 'trialing' ? `Comenzar con ${plan.name}` : `Cambiar a ${plan.name}`}
                    variant={PLAN_BUTTON_VARIANT[planId]}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-center text-slate-400">
        Podés cambiar o cancelar tu plan en cualquier momento desde MercadoPago.
        Los pagos son procesados de forma segura por MercadoPago.
      </p>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { PLANS, formatPriceARS } from '@/lib/mercadopago'
import type { PlanId } from '@/lib/mercadopago'

export const metadata: Metadata = {
  title: 'SonrisApp — Gestión odontológica inteligente',
  description: 'Turnos online, odontogramas digitales y recetas electrónicas para tu consultorio. 14 días gratis, sin tarjeta de crédito.',
}

// ─── Features ────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Turnos online 24/7',
    desc: 'Los pacientes reservan con tu código QR personalizado, sin llamadas.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Odontograma digital',
    desc: 'Registrá el estado de cada pieza y exportá el historial clínico en PDF.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Gestión de pacientes',
    desc: 'Historial completo, datos de contacto y seguimiento de tratamientos.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Recordatorios automáticos',
    desc: 'WhatsApp y email automáticos para reducir ausencias.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3m2 4H1m11-8V3M9 4V3m0 18v-1M5 20H3m12-4v2m0 0h2m-2 0h-2" />
      </svg>
    ),
    title: 'Código QR propio',
    desc: 'Tu página de turnos personalizada para redes, tarjetas o consultorio.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Recetas electrónicas',
    desc: 'Generá y enviá recetas digitales firmadas directamente desde la plataforma.',
  },
]

// ─── Pricing ──────────────────────────────────────────────────

const planOrder: PlanId[] = ['starter', 'pro', 'clinica']

const PLAN_STYLES: Record<PlanId, {
  wrapper: string
  badge?: string
  nameColor: string
  btnClass: string
}> = {
  starter: {
    wrapper: 'bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5',
    nameColor: 'text-slate-500',
    btnClass: 'w-full py-2.5 px-4 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-center',
  },
  pro: {
    wrapper: 'relative bg-white border-2 border-blue-600 rounded-xl p-6 flex flex-col gap-5 shadow-md',
    badge: 'Más popular',
    nameColor: 'text-blue-600',
    btnClass: 'w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center',
  },
  clinica: {
    wrapper: 'bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5',
    nameColor: 'text-slate-500',
    btnClass: 'w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors text-center',
  },
}

const PLAN_FEATURES: Record<PlanId, string[]> = {
  starter: [
    'Hasta 50 pacientes',
    '50 emails/mes',
    'Turnos online 24/7',
    'Código QR personalizado',
    'Odontograma digital',
  ],
  pro: [
    'Pacientes ilimitados',
    'Emails ilimitados',
    'Turnos online 24/7',
    'Código QR personalizado',
    'Odontograma + PDF',
    'Recetas electrónicas',
    'Dashboard avanzado',
  ],
  clinica: [
    'Pacientes ilimitados',
    'Emails ilimitados',
    'Turnos online 24/7',
    'Código QR personalizado',
    'Odontograma + PDF',
    'Recetas electrónicas',
    'Hasta 5 profesionales',
    'Soporte prioritario',
  ],
}

// ─── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 h-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
              <rect width="32" height="32" rx="8" fill="#1A56DB" />
              <text x="16" y="22" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="system-ui">S</text>
              <path d="M10 26 Q16 22 22 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <span className="font-bold text-blue-600 text-lg">SonrisApp</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#funciones" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Funciones</a>
            <a href="#precios" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Precios</a>
            <a href="#contacto" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Contacto</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register/professional"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            Nuevo: Recetas Electrónicas →
          </span>

          {/* H1 */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Un consultorio moderno empieza con una agenda digital.
          </h1>

          {/* Subtítulo */}
          <p className="text-lg text-slate-500 max-w-xl mx-auto mt-4">
            Turnos online, odontogramas inteligentes, recetas electrónicas, todo en uno.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/auth/register/professional"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-colors"
            >
              Empezar prueba gratis
            </Link>
            <a
              href="#funciones"
              className="text-blue-600 hover:underline font-medium text-base"
            >
              Ver demo
            </a>
          </div>

          {/* Trust */}
          <p className="text-sm text-slate-400 mt-4">
            Sin tarjeta de crédito · 14 días gratis · Cancelá cuando quieras
          </p>
        </div>
      </section>

      {/* ── MÉTRICAS ── */}
      <section className="bg-slate-50 border-y border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-slate-900">2 min</p>
            <p className="text-sm text-slate-500 mt-1">para agendar un turno online</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">24/7</p>
            <p className="text-sm text-slate-500 mt-1">los pacientes reservan solos</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">100% cloud</p>
            <p className="text-sm text-slate-500 mt-1">sin instalación, desde cualquier dispositivo</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white py-16 px-4" id="funciones">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">
            Todo lo que necesita tu consultorio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="bg-slate-50 py-16 px-4" id="precios">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">
            Precio simple y transparente
          </h2>
          <p className="text-slate-500 text-center mt-2">
            14 días gratis en cualquier plan. Sin tarjeta de crédito.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {planOrder.map((planId) => {
              const plan = PLANS[planId]
              const styles = PLAN_STYLES[planId]
              const features = PLAN_FEATURES[planId]

              return (
                <div key={planId} className={styles.wrapper}>
                  {/* Badge "Más popular" */}
                  {styles.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {styles.badge}
                    </span>
                  )}

                  {/* Nombre y precio */}
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-wide ${styles.nameColor}`}>
                      {plan.name}
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {formatPriceARS(plan.price)}
                      </span>
                      <span className="text-sm text-slate-400">/mes</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/auth/register/professional" className={styles.btnClass}>
                    Empezar con {plan.name}
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-center text-slate-400 mt-8">
            Podés cambiar o cancelar tu plan en cualquier momento. Los pagos son procesados por MercadoPago.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-blue-600 py-16 px-4 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            Modernizá tu consultorio hoy
          </h2>
          <p className="text-blue-100 mt-3 text-base">
            Más de 14 días para probar todo sin costo. Sin compromisos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/auth/register/professional"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-base transition-colors"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/auth/login"
              className="border border-white/40 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-base transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            Sin tarjeta de crédito · 14 días gratis · Cancelá cuando quieras
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white py-10 px-4" id="contacto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Marca */}
            <div>
              <p className="font-bold text-lg">SonrisApp</p>
              <p className="text-slate-400 text-sm mt-1">Gestión odontológica inteligente</p>
              <p className="text-slate-400 text-xs mt-3">
                Desarrollado por{' '}
                <a href="https://cosasanta.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  Cosa Santa
                </a>
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-3">Legal</p>
              <div className="flex flex-col gap-2">
                <a href="/terminos" className="text-sm text-slate-400 hover:text-white transition-colors">Términos de uso</a>
                <a href="/privacidad" className="text-sm text-slate-400 hover:text-white transition-colors">Privacidad</a>
                <a href={`mailto:colaboradormariobritto@gmail.com`} className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </div>
            </div>

            {/* Soporte */}
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-3">Soporte</p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/542945415186"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  +54 294 541 5186
                </a>
                <a
                  href="mailto:colaboradormariobritto@gmail.com"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  colaboradormariobritto@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 text-center">
            <p className="text-slate-500 text-sm">
              © 2026 SonrisApp · Desarrollado por Cosa Santa ·{' '}
              <a href="https://cosasanta.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
                cosasanta.com
              </a>
            </p>
            <p className="flex items-center justify-center gap-1 mt-2 text-xs text-slate-500">
              <Shield size={12} />
              Base de datos registrada ante la DNPDP · Legajo Nº RL-2026-41889092-APN-DNPDP#AAIP
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

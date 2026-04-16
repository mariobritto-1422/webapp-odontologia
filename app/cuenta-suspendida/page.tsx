import Link from 'next/link'
import { AlertTriangle, Mail, Phone, Check } from 'lucide-react'

export default function CuentaSuspendidaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Cuenta Suspendida</h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Tu suscripción ha vencido o fue suspendida. Contactanos para reactivar tu acceso.
          </p>
        </div>

        {/* Card contacto */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Contacto de Soporte</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a href="mailto:colaboradormariobritto@gmail.com" className="hover:text-blue-600 transition-colors break-all">
                colaboradormariobritto@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a href="https://wa.me/542945415186" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">
                +542945415186
              </a>
            </div>
          </div>
        </div>

        {/* Card plan */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Plan Mensual</p>
          <ul className="space-y-2">
            {['Turnos ilimitados', 'Pacientes ilimitados', 'Notificaciones por email', 'Código QR personalizado'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-3xl font-bold text-slate-900">$30 USD</span>
            <span className="text-sm text-slate-400"> /mes</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <a
            href="mailto:colaboradormariobritto@gmail.com"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 font-semibold w-full text-center transition-colors text-sm"
          >
            Contactar por Email
          </a>
          <a
            href="https://wa.me/542945415186"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 font-semibold w-full text-center transition-colors text-sm"
          >
            Contactar por WhatsApp
          </a>
        </div>

        {/* Volver */}
        <div className="text-center pt-2">
          <Link href="/auth/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  )
}

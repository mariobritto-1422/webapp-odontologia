import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad — SonrisApp',
  description: 'Política de privacidad y protección de datos personales de SonrisApp.',
}

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
        <ShieldCheck className="text-emerald-600 mt-0.5 shrink-0" size={20} />
        <div>
          <p className="font-semibold text-emerald-800 text-sm">Datos protegidos por ley</p>
          <p className="text-emerald-700 text-sm mt-1">
            SonrisApp está registrada ante la Dirección Nacional de Protección de Datos Personales de la República Argentina.
            Legajo Nº RL-2026-41889092-APN-DNPDP#AAIP — Ley 25.326.
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-4">Política de Privacidad</h1>
      <p className="text-slate-600 text-sm">
        Esta política describe cómo SonrisApp recopila, usa y protege la información personal de sus usuarios,
        en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina.
      </p>
    </main>
  )
}

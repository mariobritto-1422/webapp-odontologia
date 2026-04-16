'use client'

import { useState } from 'react'
import type { PlanId } from '@/lib/mercadopago'

type Mode = 'checkout'

interface Props {
  mode: Mode
  plan: PlanId
  label: string
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'dark'
}

export default function SubscriptionButton({
  plan,
  label,
  disabled = false,
  variant = 'primary',
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/mercadopago/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Error inesperado')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const base = 'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    dark:    'bg-slate-900 text-white hover:bg-slate-800',
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${base} ${styles[variant]}`}
      >
        {loading ? 'Redirigiendo a MercadoPago...' : label}
      </button>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// Página de diagnóstico — solo para desarrollo
// Acceder en: http://localhost:3000/test-sistema
// ─────────────────────────────────────────────

interface StatusItem {
  label: string
  value: string
  ok: boolean
}

export default function TestSistema() {
  const [status, setStatus] = useState<StatusItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    verificarSistema()
  }, [])

  async function verificarSistema() {
    setLoading(true)
    setMensaje('')
    const resultados: StatusItem[] = []

    // 1. Verificar sesión
    try {
      const r = await fetch('/api/auth/session')
      const d = await r.json()
      if (d?.user) {
        resultados.push({ label: 'Sesión', value: `✓ Logueado como: ${d.user.name} (${d.user.role})`, ok: true })
      } else {
        resultados.push({ label: 'Sesión', value: '✗ Sin sesión activa — necesitás loguearte', ok: false })
      }
    } catch {
      resultados.push({ label: 'Sesión', value: '✗ Error al verificar sesión', ok: false })
    }

    // 2. Verificar base de datos + suscripción
    try {
      const r = await fetch('/api/check-active-status')
      if (r.ok) {
        const d = await r.json()
        resultados.push({
          label: 'Base de datos',
          value: `✓ Conectada — Plan: ${d.subscription_plan ?? '?'} | Estado: ${d.subscription_status ?? '?'}`,
          ok: true
        })
        if (d.trial_ends_at) {
          const dias = Math.ceil((new Date(d.trial_ends_at).getTime() - Date.now()) / 86400000)
          resultados.push({
            label: 'Trial',
            value: dias > 0 ? `✓ Activo — ${dias} días restantes` : '✗ Trial vencido',
            ok: dias > 0
          })
        }
      } else if (r.status === 401) {
        resultados.push({ label: 'Base de datos', value: '⚠ Sin sesión — loguéate primero', ok: false })
      } else {
        resultados.push({ label: 'Base de datos', value: '✗ Error de conexión', ok: false })
      }
    } catch {
      resultados.push({ label: 'Base de datos', value: '✗ No se pudo conectar', ok: false })
    }

    // 3. Verificar Stripe (solo si hay sesión)
    try {
      const r = await fetch('/api/stripe/subscription-status')
      if (r.ok) {
        const d = await r.json()
        resultados.push({ label: 'Stripe', value: `✓ Configurado — cliente: ${d.hasCustomer ? 'registrado' : 'no registrado aún'}`, ok: true })
      } else {
        resultados.push({ label: 'Stripe', value: '⚠ Sin suscripción Stripe todavía (normal al inicio)', ok: true })
      }
    } catch {
      resultados.push({ label: 'Stripe', value: '⚠ No se pudo verificar Stripe', ok: true })
    }

    setStatus(resultados)
    setLoading(false)
  }

  async function cerrarSesion() {
    setMensaje('Cerrando sesión...')
    await fetch('/api/auth/signout', { method: 'POST' })
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/')
    })
    setMensaje('Sesión cerrada y cookies eliminadas. Recargando...')
    setTimeout(() => window.location.reload(), 1000)
  }

  const acciones = [
    {
      titulo: '🔐 Ir al Login',
      descripcion: 'Abre la pantalla de inicio de sesión',
      color: 'bg-blue-600 hover:bg-blue-700',
      accion: () => window.open('/auth/login', '_self'),
    },
    {
      titulo: '🚪 Cerrar sesión + limpiar cookies',
      descripcion: 'Cierra la sesión actual y elimina todas las cookies del navegador',
      color: 'bg-red-600 hover:bg-red-700',
      accion: cerrarSesion,
    },
    {
      titulo: '📋 Dashboard profesional',
      descripcion: 'Abre el panel principal del profesional',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      accion: () => window.open('/dashboard/professional', '_self'),
    },
    {
      titulo: '💳 Página de Planes',
      descripcion: 'Abre la página con los planes de suscripción (Starter / Pro / Clínica)',
      color: 'bg-purple-600 hover:bg-purple-700',
      accion: () => window.open('/dashboard/professional/planes', '_self'),
    },
    {
      titulo: '🦷 Odontograma (primer paciente)',
      descripcion: 'Abre la lista de pacientes para acceder al odontograma',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      accion: () => window.open('/dashboard/professional/pacientes', '_self'),
    },
    {
      titulo: '📅 Turnos',
      descripcion: 'Abre el gestor de turnos del profesional',
      color: 'bg-orange-600 hover:bg-orange-700',
      accion: () => window.open('/dashboard/professional/turnos', '_self'),
    },
    {
      titulo: '🔄 Verificar sistema de nuevo',
      descripcion: 'Vuelve a chequear el estado de todos los componentes',
      color: 'bg-gray-600 hover:bg-gray-700',
      accion: verificarSistema,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Encabezado */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Diagnóstico</h1>
          <p className="text-gray-500 text-sm mt-1">
            Estado del sistema en tiempo real · <span className="font-mono text-xs">localhost:3000/test-sistema</span>
          </p>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Estado del sistema</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Verificando...</p>
          ) : (
            <ul className="space-y-2">
              {status.map((s, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm p-3 rounded-lg ${s.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                  <span className="font-semibold shrink-0 w-28">{s.label}</span>
                  <span>{s.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            {mensaje}
          </div>
        )}

        {/* Acciones */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Acciones de prueba</h2>
          <div className="space-y-3">
            {acciones.map((a, i) => (
              <button
                key={i}
                onClick={a.accion}
                className={`w-full text-left px-4 py-3 rounded-lg text-white transition-colors ${a.color}`}
              >
                <div className="font-semibold">{a.titulo}</div>
                <div className="text-sm opacity-80 mt-0.5">{a.descripcion}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tarjeta de prueba Stripe */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Tarjeta de prueba Stripe</h2>
          <p className="text-xs text-gray-500">Usá estos datos cuando Stripe te pida pagar:</p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1">
            <div><span className="text-gray-400">Número:</span> 4242 4242 4242 4242</div>
            <div><span className="text-gray-400">Vencimiento:</span> 12/28</div>
            <div><span className="text-gray-400">CVC:</span> 123</div>
            <div><span className="text-gray-400">Nombre:</span> cualquier nombre</div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Esta página solo existe en desarrollo · No aparece en producción
        </p>
      </div>
    </div>
  )
}

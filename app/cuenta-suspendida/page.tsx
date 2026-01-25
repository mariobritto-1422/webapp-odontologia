import Link from 'next/link'

export default function CuentaSuspendidaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icono */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cuenta Suspendida
          </h1>

          {/* Mensaje */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Tu suscripción ha vencido o fue suspendida.
            </p>
            <p className="text-gray-600 mb-6">
              Para reactivar tu cuenta y seguir gestionando tus turnos,
              por favor contacta con soporte para renovar tu suscripción.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contacto de Soporte
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">
                  Email: <a href="mailto:soporte@tudominio.com" className="text-blue-600 hover:underline font-medium">soporte@tudominio.com</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">
                  WhatsApp: <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-medium">+54 9 11 1234-5678</a>
                </span>
              </div>
            </div>
          </div>

          {/* Planes disponibles */}
          <div className="bg-green-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💳 Plan Mensual
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Turnos ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Pacientes ilimitados</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Notificaciones por email</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Código QR personalizado</span>
              </div>
            </div>
            <div className="text-center pt-4 border-t border-green-200">
              <div className="text-3xl font-bold text-gray-900 mb-1">$30 USD/mes</div>
              <div className="text-sm text-gray-600">o equivalente en tu moneda local</div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:soporte@tudominio.com"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Contactar por Email
            </a>
            <a
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              Contactar por WhatsApp
            </a>
          </div>

          {/* Link de cerrar sesión */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

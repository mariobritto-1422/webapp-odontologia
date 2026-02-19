import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Header con botones */}
        <div className="flex justify-end gap-4 mb-16">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register/professional"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow-lg"
          >
            Registrarse Gratis
          </Link>
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center text-white mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Gestión de Turnos
            <span className="block text-green-400">Simple y Profesional</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
            La plataforma completa para odontólogos. Gestiona turnos, pacientes y notificaciones desde un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register/professional"
              className="px-8 py-4 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-600 transition-all shadow-2xl transform hover:scale-105"
            >
              Comenzar Ahora - Gratis
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-lg hover:bg-gray-100 transition-all shadow-2xl"
            >
              Ver Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Todo lo que necesitas en una sola app
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Gestión de Turnos
              </h3>
              <p className="text-gray-600 text-lg">
                Crea, edita y administra turnos fácilmente. Vista de calendario intuitiva.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Código QR Único
              </h3>
              <p className="text-gray-600 text-lg">
                Tus pacientes se registran escaneando un QR. Simple, rápido, profesional.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Notificaciones Email
              </h3>
              <p className="text-gray-600 text-lg">
                Envía recordatorios y confirmaciones automáticas a tus pacientes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Base de Pacientes
              </h3>
              <p className="text-gray-600 text-lg">
                Toda la información de tus pacientes organizada y accesible.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Personalización
              </h3>
              <p className="text-gray-600 text-lg">
                Configura tu logo, colores y marca personal en la plataforma.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Estadísticas
              </h3>
              <p className="text-gray-600 text-lg">
                Dashboard con métricas de tu consultorio en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-xl text-blue-200">En la Nube</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-xl text-blue-200">Disponibilidad</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-xl text-blue-200">Turnos Ilimitados</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-12 max-w-4xl mx-auto text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para digitalizar tu consultorio?
          </h2>
          <p className="text-xl text-white mb-8">
            Únete a los profesionales que ya confían en nuestra plataforma
          </p>
          <Link
            href="/auth/register/professional"
            className="inline-block px-12 py-5 bg-white text-green-600 text-xl font-bold rounded-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
          >
            Comenzar Ahora - Es Gratis
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-white/80">
          <p className="text-lg mb-4">Sonrisapp - Sistema de Gestión Profesional</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <span>|</span>
            <Link href="/auth/register/professional" className="hover:text-white transition-colors">
              Registrarse
            </Link>
            <span>|</span>
            <Link href="/auth/register/patient" className="hover:text-white transition-colors">
              Soy Paciente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

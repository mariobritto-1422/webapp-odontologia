export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            WebApp Odontología
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de gestión de turnos multi-tenant
          </p>
        </div>

        <div className="card max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Proyecto Configurado Exitosamente
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Next.js 16 + TypeScript</h3>
                <p className="text-gray-600">Framework React con App Router</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">TailwindCSS 4</h3>
                <p className="text-gray-600">Framework CSS mobile-first</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Supabase</h3>
                <p className="text-gray-600">Base de datos PostgreSQL en la nube</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">NextAuth v5</h3>
                <p className="text-gray-600">Sistema de autenticación completo</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900">Estructura Modular</h3>
                <p className="text-gray-600">Componentes organizados y reutilizables</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl text-yellow-600">○</span>
              <div>
                <h3 className="font-semibold text-gray-900">Pendiente</h3>
                <p className="text-gray-600">Configurar variables de entorno</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Stack Tecnológico:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-blue-700">Next.js 16</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-blue-700">TypeScript</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-blue-700">TailwindCSS</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-green-700">Supabase</span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-purple-700">NextAuth</span>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-lg text-center">
                <span className="font-medium text-indigo-700">Vercel Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Listo para desarrollo</p>
        </div>
      </div>
    </div>
  )
}

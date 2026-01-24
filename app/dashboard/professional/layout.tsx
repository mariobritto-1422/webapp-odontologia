import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export default async function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'professional') {
    redirect('/dashboard/patient')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Odonto App</h1>
          <p className="text-sm text-gray-600 mt-1">Panel Profesional</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink href="/dashboard/professional" label="Panel Principal" />
          <NavLink href="/dashboard/professional/turnos" label="Turnos" />
          <NavLink href="/dashboard/professional/pacientes" label="Pacientes" />
          <NavLink href="/dashboard/professional/notificaciones" label="Notificaciones" />
          <NavLink href="/dashboard/professional/configuracion" label="Configuración" />
          <NavLink href="/dashboard/professional/qr" label="Código QR" />
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
    >
      {label}
    </Link>
  )
}

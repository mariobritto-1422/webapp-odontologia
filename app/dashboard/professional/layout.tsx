import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'
import SidebarNav from './_components/SidebarNav'

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => /^[A-Za-záéíóúÁÉÍÓÚñÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default async function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  if (!session.user?.role) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'professional') {
    redirect('/dashboard/patient')
  }

  const initials = getInitials(session.user.name ?? '')

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 fixed h-screen flex flex-col z-10">

        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="13" fill="#1A56DB"/>
              <text x="32" y="38" textAnchor="middle" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="30" fontWeight="800" fill="white" letterSpacing="-1">S</text>
              <path d="M18 47 Q32 56 46 47" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="text-lg font-bold text-blue-600">SonrisApp</span>
          </div>
          <p className="text-xs text-slate-400 pl-9">Gestión odontológica</p>
        </div>

        {/* Nav items */}
        <SidebarNav />

        {/* Usuario */}
        <div className="mt-auto border-t border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {initials || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate leading-tight">
                {session.user.name}
              </p>
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full leading-tight mt-0.5">
                Profesional
              </span>
            </div>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <button
              type="submit"
              className="text-sm text-slate-400 hover:text-red-500 transition-colors w-full text-left pl-1"
            >
              Cerrar sesión →
            </button>
          </form>
        </div>

      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1 p-6 md:p-8 min-h-screen">
        {children}
      </main>

    </div>
  )
}

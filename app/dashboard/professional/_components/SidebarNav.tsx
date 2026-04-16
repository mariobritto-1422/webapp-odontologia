'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Bell,
  Settings,
  QrCode,
  CreditCard,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard/professional',               label: 'Panel Principal',      Icon: LayoutDashboard, exact: true },
  { href: '/dashboard/professional/turnos',         label: 'Turnos',               Icon: CalendarDays },
  { href: '/dashboard/professional/pacientes',      label: 'Pacientes',            Icon: Users },
  { href: '/dashboard/professional/recetas',        label: 'Recetas',              Icon: FileText },
  { href: '/dashboard/professional/notificaciones', label: 'Notificaciones',       Icon: Bell },
  { href: '/dashboard/professional/configuracion',  label: 'Configuración',        Icon: Settings },
  { href: '/dashboard/professional/qr',             label: 'Código QR',            Icon: QrCode },
  { href: '/dashboard/professional/planes',         label: 'Planes y suscripción', Icon: CreditCard },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-2 space-y-0.5">
      {navItems.map(({ href, label, Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 transition-colors'
                : 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors'
            }
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

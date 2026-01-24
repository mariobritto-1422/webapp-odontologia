import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WebApp Odontología',
  description: 'Sistema de gestión de turnos odontológicos multi-tenant',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}

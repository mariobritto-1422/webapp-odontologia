import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sonrisapp',
  description: 'Sistema de gestión de turnos dental',
  icons: {
    icon: '/sonrisapp-favicon.svg',
  },
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

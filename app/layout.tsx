import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Inter } from 'next/font/google'
import './globals.css'
import UnregisterSW from '@/components/UnregisterSW'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SonrisApp — Agenda Digital para Odontólogos',
    template: '%s | SonrisApp',
  },
  description: 'Un consultorio moderno empieza con una agenda digital. Turnos online, odontogramas inteligentes, recetas electrónicas, todo en uno.',
  keywords: [
    'agenda odontológica',
    'turnos online dentista',
    'software consultorio dental',
    'odontograma digital',
    'gestión pacientes odontología',
  ],
  openGraph: {
    title: 'SonrisApp — Agenda Digital para Odontólogos',
    description: 'Un consultorio moderno empieza con una agenda digital. Turnos online, odontogramas inteligentes, recetas electrónicas, todo en uno.',
    url: 'https://sonrisapp.com',
    siteName: 'SonrisApp',
    locale: 'es_AR',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable} ${inter.variable}`}>
      <body className="antialiased"><UnregisterSW />{children}</body>
    </html>
  )
}

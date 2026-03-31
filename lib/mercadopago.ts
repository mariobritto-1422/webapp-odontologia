import { MercadoPagoConfig } from 'mercadopago'

// ------------------------------------------------------------
// Cliente MercadoPago (solo server-side)
// ------------------------------------------------------------

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// ------------------------------------------------------------
// Definición de planes
// ------------------------------------------------------------

export type PlanId = 'starter' | 'pro' | 'clinica'

export interface PlanDefinition {
  id: PlanId
  name: string
  price: number              // ARS/mes
  description: string
  highlight: boolean         // Mostrar como "Recomendado"
  patientLimit: number | null // null = ilimitado
  emailLimit: number | null   // null = ilimitado
  professionalLimit: number
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 15000,
    description: 'Para odontólogos que recién comienzan',
    highlight: false,
    patientLimit: 50,
    emailLimit: 50,
    professionalLimit: 1,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 25000,
    description: 'Para consultorios consolidados',
    highlight: true,
    patientLimit: null,
    emailLimit: null,
    professionalLimit: 1,
  },
  clinica: {
    id: 'clinica',
    name: 'Clínica',
    price: 39900,
    description: 'Para clínicas con múltiples profesionales',
    highlight: false,
    patientLimit: null,
    emailLimit: null,
    professionalLimit: 5,
  },
}

// Formatea precio ARS: 15000 → "$15.000"
export function formatPriceARS(price: number): string {
  return `$${price.toLocaleString('es-AR')}`
}

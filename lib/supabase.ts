import { createClient } from '@supabase/supabase-js'

// Validar que las variables de entorno existan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

// Cliente de Supabase para el navegador
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente de Supabase para el servidor (bypasea RLS)
// Solo usar en API routes o Server Components
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase // Fallback al cliente normal si no hay service key

// Tipos para la base de datos (se irán agregando según el esquema)
export type Professional = {
  id: string
  email: string
  name: string
  specialty: string
  phone: string
  slug: string
  branding: {
    logoUrl?: string
    primaryColor: string
    secondaryColor: string
    consultorioName: string
  }
  schedule: Record<string, any>
  appointmentDuration: number
  createdAt: string
  updatedAt: string
}

export type Patient = {
  id: string
  email: string
  name: string
  phone: string
  professionalId: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
  acceptedAt: string
  createdAt: string
  updatedAt: string
}

export type Appointment = {
  id: string
  professionalId: string
  patientId: string
  date: string
  time: string
  datetime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdBy: 'patient' | 'professional'
  cancellationReason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

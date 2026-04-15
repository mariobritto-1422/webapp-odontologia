import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { hasSupabaseServiceRoleKey, supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        const email = (credentials.email as string).trim().toLowerCase()
        const password = credentials.password as string

        console.log('Attempting login for:', email)

        try {
          if (!hasSupabaseServiceRoleKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is missing; credentials auth cannot bypass RLS in production')
            throw new Error('AUTH_SERVER_MISCONFIGURED')
          }

          // Buscar usuario en professionals
          const { data: professional, error: profError } = await supabaseAdmin
            .from('professionals')
            .select('*')
            .ilike('email', email)
            .maybeSingle()

          console.log('Professional query:', { professional, profError })

          if (profError) {
            throw new Error(`AUTH_PROFESSIONAL_QUERY_FAILED:${profError.message}`)
          }

          if (professional) {
            // Verificar contraseña con bcrypt
            if (!professional.password_hash) {
              console.log('Professional found but no password set')
              return null
            }

            const isValidPassword = await bcrypt.compare(
              password,
              professional.password_hash
            )

            if (!isValidPassword) {
              console.log('Invalid password for professional')
              return null
            }

            console.log('Professional authenticated successfully')
            return {
              id: professional.id,
              email: professional.email,
              name: professional.name,
              role: 'professional',
            }
          }

          // Si no es profesional, buscar en patients
          const { data: patient, error: patError } = await supabaseAdmin
            .from('patients')
            .select('*')
            .ilike('email', email)
            .maybeSingle()

          console.log('Patient query:', { patient, patError })

          if (patError) {
            throw new Error(`AUTH_PATIENT_QUERY_FAILED:${patError.message}`)
          }

          if (patient) {
            // Verificar contraseña con bcrypt
            if (!patient.password_hash) {
              console.log('Patient found but no password set')
              return null
            }

            const isValidPassword = await bcrypt.compare(
              password,
              patient.password_hash
            )

            if (!isValidPassword) {
              console.log('Invalid password for patient')
              return null
            }

            console.log('Patient authenticated successfully')
            return {
              id: patient.id,
              email: patient.email,
              name: patient.name,
              role: 'patient',
              professionalId: patient.professional_id,
            }
          }

          console.log('No user found')
          return null
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
})

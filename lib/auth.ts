import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { supabase } from './supabase'
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

        const email = credentials.email as string
        const password = credentials.password as string

        console.log('Attempting login for:', email)

        try {
          // Buscar usuario en professionals
          const { data: professional, error: profError } = await supabase
            .from('professionals')
            .select('*')
            .eq('email', email)
            .maybeSingle()

          console.log('Professional query:', { professional, profError })

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
          const { data: patient, error: patError } = await supabase
            .from('patients')
            .select('*')
            .eq('email', email)
            .maybeSingle()

          console.log('Patient query:', { patient, patError })

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
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.professionalId = user.professionalId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.professionalId = token.professionalId as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
})

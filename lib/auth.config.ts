import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    // ── Callbacks JWT/Session — funciones puras, Edge-compatibles ──────────
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
  providers: [], // Se agregan en auth.ts
} satisfies NextAuthConfig

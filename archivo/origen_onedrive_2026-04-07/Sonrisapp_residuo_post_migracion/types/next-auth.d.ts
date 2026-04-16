import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    role?: string
    professionalId?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      professionalId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    professionalId?: string
  }
}

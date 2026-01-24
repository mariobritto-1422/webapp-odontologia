import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Redirigir según el rol del usuario
  if (session.user.role === 'professional') {
    redirect('/dashboard/professional')
  } else if (session.user.role === 'patient') {
    redirect('/dashboard/patient')
  }

  return null
}

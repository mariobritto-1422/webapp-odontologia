import { auth } from '@/lib/auth'

export default async function DebugSessionPage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Debug de Sesión</h1>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Información de Sesión</h2>
            {session ? (
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Usuario ID:</strong> {session.user.id}</p>
                <p><strong>Nombre:</strong> {session.user.name}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Rol:</strong> {session.user.role}</p>
                <p><strong>Professional ID:</strong> {session.user.professionalId || 'N/A'}</p>
              </div>
            ) : (
              <p className="text-red-600">No hay sesión activa</p>
            )}
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">IDs Esperados</h2>
            <div className="bg-blue-50 p-4 rounded">
              <p><strong>Dr. Test:</strong> 97f470b1-69e1-4a57-85bc-562a22b67831</p>
              <p><strong>Dr. Juan Garcia:</strong> ceb3ff10-bdd9-4ad2-9bcb-3b9dfee78e97</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Verificación</h2>
            {session && (
              <div className="p-4 rounded">
                {session.user.id === 'ceb3ff10-bdd9-4ad2-9bcb-3b9dfee78e97' ? (
                  <p className="text-green-600 font-semibold">✅ Sesión correcta: Dr. Juan Garcia</p>
                ) : session.user.id === '97f470b1-69e1-4a57-85bc-562a22b67831' ? (
                  <p className="text-yellow-600 font-semibold">⚠️ Estás logueado como Dr. Test</p>
                ) : (
                  <p className="text-red-600 font-semibold">❌ ID no coincide con ningún profesional conocido</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4">
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

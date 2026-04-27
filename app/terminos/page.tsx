import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Uso — SonrisApp',
  description: 'Términos y condiciones de uso del servicio SonrisApp.',
}

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <FileText className="text-blue-600 mt-0.5 shrink-0" size={20} />
        <div>
          <p className="font-semibold text-blue-800 text-sm">Términos de uso del servicio</p>
          <p className="text-blue-700 text-sm mt-1">
            Al registrarse y utilizar SonrisApp, usted acepta los siguientes términos y condiciones.
            Última actualización: abril de 2026.
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Términos y Condiciones de Uso</h1>

      <div className="space-y-6 text-sm text-slate-600">
        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">1. Descripción del servicio</h2>
          <p>
            SonrisApp es una plataforma de gestión odontológica que permite a profesionales de la salud dental
            administrar turnos, historias clínicas y recetas electrónicas. El servicio es provisto por Cosa Santa,
            con domicilio en Posadas, Misiones, República Argentina.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">2. Registro y cuenta</h2>
          <p>
            Para utilizar SonrisApp es necesario registrarse con información verídica. El usuario es responsable
            de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas
            bajo su cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">3. Planes y facturación</h2>
          <p>
            SonrisApp ofrece planes de suscripción mensual. Los precios están expresados en pesos argentinos (ARS)
            e incluyen un período de prueba de 14 días sin cargo. La suscripción se renueva automáticamente
            al vencimiento de cada período. El usuario puede cancelar en cualquier momento desde su panel de control.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">4. Datos de pacientes y confidencialidad</h2>
          <p>
            Los datos de pacientes ingresados en SonrisApp son de propiedad exclusiva del profesional registrado.
            Cosa Santa actúa como encargado del tratamiento de datos conforme a la Ley 25.326 de Protección de
            Datos Personales. No compartimos información de pacientes con terceros sin consentimiento expreso.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">5. Disponibilidad del servicio</h2>
          <p>
            Nos esforzamos por mantener SonrisApp disponible de forma continua, pero no garantizamos disponibilidad
            ininterrumpida. Podemos suspender el servicio temporalmente por mantenimiento o circunstancias fuera de
            nuestro control, sin que ello genere derecho a compensación.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">6. Limitación de responsabilidad</h2>
          <p>
            SonrisApp es una herramienta de gestión. Las decisiones clínicas son responsabilidad exclusiva del
            profesional de la salud. Cosa Santa no se responsabiliza por errores derivados de un uso incorrecto
            de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos con previo aviso por correo electrónico.
            El uso continuado del servicio tras la notificación implica aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">8. Jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia,
            las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad de Posadas,
            provincia de Misiones.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">9. Contacto</h2>
          <p>
            Consultas sobre estos términos:{' '}
            <a href="mailto:colaboradormariobritto@gmail.com" className="text-blue-600 hover:underline">
              colaboradormariobritto@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}

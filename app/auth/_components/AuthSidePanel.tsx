import { Check } from 'lucide-react'

const bullets = [
  'Turnos online 24/7',
  'Odontograma digital',
  'Recetas electrónicas',
]

export default function AuthSidePanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col justify-center px-12 py-16 text-white">
      <div className="mb-10">
        <span className="text-3xl font-bold tracking-tight">SonrisApp</span>
      </div>
      <p className="text-lg leading-relaxed text-white/80 mb-10 max-w-xs">
        Un consultorio moderno empieza con una agenda digital.
      </p>
      <ul className="space-y-4">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-3 text-white/90 text-sm font-medium">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

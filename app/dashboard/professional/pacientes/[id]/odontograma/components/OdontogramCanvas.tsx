'use client'

import QuadrantSection from './QuadrantSection'
import { FDI_PERMANENT, FDI_TEMPORARY, type Tooth, type SurfaceName } from '@/types/odontogram'

interface OdontogramCanvasProps {
  dentitionType: 'permanent' | 'temporary'
  teeth: Record<string, Tooth>
  onSurfaceClick: (toothNumber: number, surface: SurfaceName) => void
}

export default function OdontogramCanvas({
  dentitionType,
  teeth,
  onSurfaceClick,
}: OdontogramCanvasProps) {
  // Determinar cuadrantes según tipo de dentición
  const quadrants = dentitionType === 'permanent'
    ? { q1: 1, q2: 2, q3: 3, q4: 4 }
    : { q1: 5, q2: 6, q3: 7, q4: 8 }

  const fdiSystem = dentitionType === 'permanent' ? FDI_PERMANENT : FDI_TEMPORARY

  return (
    <div id="odontogram-canvas" className="space-y-6">
      {/* Sección Superior */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg">
            SUPERIOR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cuadrante 1: Superior Derecho */}
          <QuadrantSection
            quadrantNumber={quadrants.q1}
            toothNumbers={fdiSystem[quadrants.q1 as keyof typeof fdiSystem]}
            quadrantLabel="Superior Derecho"
            teeth={teeth}
            onSurfaceClick={onSurfaceClick}
          />

          {/* Cuadrante 2: Superior Izquierdo */}
          <QuadrantSection
            quadrantNumber={quadrants.q2}
            toothNumbers={fdiSystem[quadrants.q2 as keyof typeof fdiSystem]}
            quadrantLabel="Superior Izquierdo"
            teeth={teeth}
            onSurfaceClick={onSurfaceClick}
          />
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t-4 border-gray-300"></div>

      {/* Sección Inferior */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg">
            INFERIOR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cuadrante 4: Inferior Derecho (desde perspectiva del profesional = izquierda) */}
          <QuadrantSection
            quadrantNumber={quadrants.q4}
            toothNumbers={fdiSystem[quadrants.q4 as keyof typeof fdiSystem]}
            quadrantLabel="Inferior Derecho"
            teeth={teeth}
            onSurfaceClick={onSurfaceClick}
          />

          {/* Cuadrante 3: Inferior Izquierdo (desde perspectiva del profesional = derecha) */}
          <QuadrantSection
            quadrantNumber={quadrants.q3}
            toothNumbers={fdiSystem[quadrants.q3 as keyof typeof fdiSystem]}
            quadrantLabel="Inferior Izquierdo"
            teeth={teeth}
            onSurfaceClick={onSurfaceClick}
          />
        </div>
      </div>
    </div>
  )
}

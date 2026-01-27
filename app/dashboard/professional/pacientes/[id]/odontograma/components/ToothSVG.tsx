'use client'

import { type SurfaceName, getMappedSurfaceName } from '@/types/odontogram'

interface ToothSVGProps {
  toothNumber: number
  quadrant: number
  surfaces: Record<string, { color: string; status: string }>
  onSurfaceClick: (toothNumber: number, surface: SurfaceName) => void
  className?: string
}

// Transformaciones matriciales SVG para cada cuadrante
const QUADRANT_TRANSFORMS = {
  1: { transform: '' }, // Superior Derecho - sin transformación
  2: { transform: 'scale(-1, 1) translate(-100, 0)' }, // Superior Izquierdo - espejo horizontal
  3: { transform: '' }, // Inferior Izquierdo - sin transformación
  4: { transform: 'scale(-1, 1) translate(-100, 0)' }, // Inferior Derecho - espejo horizontal
}

export default function ToothSVG({
  toothNumber,
  quadrant,
  surfaces,
  onSurfaceClick,
  className = '',
}: ToothSVGProps) {
  // Obtener el color de una superficie, o blanco por defecto
  const getSurfaceColor = (surfaceName: string): string => {
    const mappedSurface = getMappedSurfaceName(surfaceName, quadrant)
    return surfaces[mappedSurface]?.color || '#FFFFFF'
  }

  // Manejar el click en una superficie
  const handleSurfaceClick = (surfaceName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const mappedSurface = getMappedSurfaceName(surfaceName, quadrant)
    onSurfaceClick(toothNumber, mappedSurface)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Número del diente */}
      <div className="text-center text-xs font-semibold text-gray-700 mb-1">
        {toothNumber}
      </div>

      {/* SVG del diente */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-auto border border-gray-300 rounded-lg bg-white"
        style={{ maxWidth: '80px', minHeight: '80px' }}
      >
        <g {...QUADRANT_TRANSFORMS[quadrant as keyof typeof QUADRANT_TRANSFORMS]}>
          {/* Vestibular (superficie superior/anterior) */}
          <polygon
            points="10,10 90,10 80,35 20,35"
            fill={getSurfaceColor('vestibular')}
            stroke="#374151"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={(e) => handleSurfaceClick('vestibular', e)}
          />

          {/* Mesial (lado hacia línea media) */}
          <polygon
            points="10,10 20,35 20,65 10,90"
            fill={getSurfaceColor('mesial')}
            stroke="#374151"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={(e) => handleSurfaceClick('mesial', e)}
          />

          {/* Distal (lado alejado de línea media) */}
          <polygon
            points="90,10 80,35 80,65 90,90"
            fill={getSurfaceColor('distal')}
            stroke="#374151"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={(e) => handleSurfaceClick('distal', e)}
          />

          {/* Oclusal (superficie masticatoria central) */}
          <polygon
            points="20,35 80,35 80,65 20,65"
            fill={getSurfaceColor('oclusal')}
            stroke="#374151"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={(e) => handleSurfaceClick('oclusal', e)}
          />

          {/* Lingual (superficie inferior/posterior) */}
          <polygon
            points="20,65 80,65 90,90 10,90"
            fill={getSurfaceColor('lingual')}
            stroke="#374151"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity hover:opacity-80"
            onClick={(e) => handleSurfaceClick('lingual', e)}
          />
        </g>
      </svg>
    </div>
  )
}

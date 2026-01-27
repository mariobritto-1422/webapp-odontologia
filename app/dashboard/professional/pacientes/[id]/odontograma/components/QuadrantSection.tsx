'use client'

import ToothSVG from './ToothSVG'
import { type SurfaceName, type Tooth } from '@/types/odontogram'

interface QuadrantSectionProps {
  quadrantNumber: number
  toothNumbers: readonly number[]
  quadrantLabel: string
  teeth: Record<string, Tooth>
  onSurfaceClick: (toothNumber: number, surface: SurfaceName) => void
}

export default function QuadrantSection({
  quadrantNumber,
  toothNumbers,
  quadrantLabel,
  teeth,
  onSurfaceClick,
}: QuadrantSectionProps) {
  // Construir las superficies del diente para el componente ToothSVG
  const getToothSurfaces = (toothNumber: number) => {
    const tooth = teeth[toothNumber.toString()]
    if (!tooth) return {}

    const surfaces: Record<string, { color: string; status: string }> = {}

    if (tooth.surfaces.vestibular) {
      surfaces.vestibular = {
        color: tooth.surfaces.vestibular.color,
        status: tooth.surfaces.vestibular.status,
      }
    }
    if (tooth.surfaces.lingual) {
      surfaces.lingual = {
        color: tooth.surfaces.lingual.color,
        status: tooth.surfaces.lingual.status,
      }
    }
    if (tooth.surfaces.mesial) {
      surfaces.mesial = {
        color: tooth.surfaces.mesial.color,
        status: tooth.surfaces.mesial.status,
      }
    }
    if (tooth.surfaces.distal) {
      surfaces.distal = {
        color: tooth.surfaces.distal.color,
        status: tooth.surfaces.distal.status,
      }
    }
    if (tooth.surfaces.oclusal) {
      surfaces.oclusal = {
        color: tooth.surfaces.oclusal.color,
        status: tooth.surfaces.oclusal.status,
      }
    }

    return surfaces
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Título del cuadrante */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Cuadrante {quadrantNumber}
        </h3>
        <p className="text-sm text-gray-600">{quadrantLabel}</p>
      </div>

      {/* Grid de dientes */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {toothNumbers.map((toothNumber) => (
          <ToothSVG
            key={toothNumber}
            toothNumber={toothNumber}
            quadrant={quadrantNumber}
            surfaces={getToothSurfaces(toothNumber)}
            onSurfaceClick={onSurfaceClick}
          />
        ))}
      </div>
    </div>
  )
}

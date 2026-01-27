// Tipos para el Odontograma Interactivo

export type ToothStatus = 'healthy' | 'caries' | 'restoration' | 'missing' | 'crown' | 'fracture' | 'implant'

export type SurfaceName = 'vestibular' | 'lingual' | 'palatino' | 'mesial' | 'distal' | 'oclusal' | 'incisal'

export interface ToothSurface {
  status: ToothStatus
  color: string
  notes?: string
}

export interface Tooth {
  surfaces: {
    vestibular?: ToothSurface
    lingual?: ToothSurface
    palatino?: ToothSurface
    mesial?: ToothSurface
    distal?: ToothSurface
    oclusal?: ToothSurface
    incisal?: ToothSurface
  }
  wholeTooth?: { status: 'missing' | 'implant'; reason?: string; date?: string } | null
}

export interface Odontogram {
  lastUpdated: string
  dentitionType: 'permanent' | 'temporary'
  teeth: Record<string, Tooth> // Key = FDI number
}

// Constantes FDI - Sistema de numeración dental internacional
export const FDI_PERMANENT = {
  1: [18, 17, 16, 15, 14, 13, 12, 11], // Superior Derecho
  2: [21, 22, 23, 24, 25, 26, 27, 28], // Superior Izquierdo
  3: [38, 37, 36, 35, 34, 33, 32, 31], // Inferior Izquierdo
  4: [41, 42, 43, 44, 45, 46, 47, 48], // Inferior Derecho
} as const

export const FDI_TEMPORARY = {
  5: [55, 54, 53, 52, 51], // Superior Derecho
  6: [61, 62, 63, 64, 65], // Superior Izquierdo
  7: [75, 74, 73, 72, 71], // Inferior Izquierdo
  8: [81, 82, 83, 84, 85], // Inferior Derecho
} as const

// Herramientas disponibles para marcar el odontograma
export const TOOTH_TOOLS = [
  { id: 'healthy', label: 'Sano', color: '#FFFFFF', icon: 'CheckCircleIcon' },
  { id: 'caries', label: 'Caries', color: '#EF4444', icon: 'ExclamationTriangleIcon' },
  { id: 'restoration', label: 'Restauración', color: '#3B82F6', icon: 'WrenchScrewdriverIcon' },
  { id: 'crown', label: 'Corona', color: '#F59E0B', icon: 'SparklesIcon' },
  { id: 'fracture', label: 'Fractura', color: '#DC2626', icon: 'BoltIcon' },
  { id: 'missing', label: 'Ausente', color: '#6B7280', icon: 'XCircleIcon' },
  { id: 'implant', label: 'Implante', color: '#10B981', icon: 'CubeIcon' },
] as const

export type ToolType = typeof TOOTH_TOOLS[number]

// Mapeo de superficies para espejo anatómico
export function getMappedSurfaceName(surface: string, quadrant: number): SurfaceName {
  // En cuadrantes 2 y 4, invertir mesial/distal para correcta anatomía
  if (quadrant === 2 || quadrant === 4) {
    if (surface === 'mesial') return 'distal'
    if (surface === 'distal') return 'mesial'
  }
  return surface as SurfaceName
}

// Obtener el color de un estado
export function getStatusColor(status: ToothStatus): string {
  const tool = TOOTH_TOOLS.find(t => t.id === status)
  return tool?.color || '#FFFFFF'
}

// Obtener el label de un estado
export function getStatusLabel(status: ToothStatus): string {
  const tool = TOOTH_TOOLS.find(t => t.id === status)
  return tool?.label || 'Desconocido'
}

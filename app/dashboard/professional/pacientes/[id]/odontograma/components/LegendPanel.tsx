'use client'

import { TOOTH_TOOLS } from '@/types/odontogram'

export default function LegendPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Leyenda</h3>

      <div className="space-y-2">
        {TOOTH_TOOLS.map((tool) => (
          <div key={tool.id} className="flex items-center gap-3">
            {/* Color box */}
            <div
              className="w-6 h-6 rounded border-2 border-gray-400 flex-shrink-0"
              style={{ backgroundColor: tool.color }}
            />

            {/* Label */}
            <span className="text-sm text-gray-700">{tool.label}</span>
          </div>
        ))}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Instrucciones
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>1. Selecciona una herramienta</li>
          <li>2. Haz clic en la superficie del diente</li>
          <li>3. La superficie cambiará de color</li>
          <li>4. Guarda los cambios cuando termines</li>
        </ul>
      </div>

      {/* Info del sistema FDI */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Sistema FDI
        </h4>
        <p className="text-xs text-gray-600">
          Sistema de numeración dental internacional (Fédération Dentaire Internationale).
          Cada diente tiene un número único de 2 dígitos.
        </p>
      </div>
    </div>
  )
}

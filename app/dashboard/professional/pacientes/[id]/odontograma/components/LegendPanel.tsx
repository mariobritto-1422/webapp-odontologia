'use client'

import { TOOTH_TOOLS } from '@/types/odontogram'

export default function LegendPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">

      {/* Leyenda de colores */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Leyenda</p>
        <div className="space-y-1.5">
          {TOOTH_TOOLS.map((tool) => (
            <div key={tool.id} className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-sm border border-slate-300 flex-shrink-0"
                style={{ backgroundColor: tool.color }}
              />
              <span className="text-xs text-slate-600">{tool.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cómo usar</p>
        <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
          <li>Seleccioná una herramienta</li>
          <li>Hacé clic en la superficie</li>
          <li>Guardá al terminar</li>
        </ol>
      </div>

      {/* FDI */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Sistema FDI</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Numeración dental internacional. Cada diente tiene un número único de 2 dígitos.
        </p>
      </div>

    </div>
  )
}

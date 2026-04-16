'use client'

import { TOOTH_TOOLS, type ToolType } from '@/types/odontogram'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BoltIcon,
  XCircleIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'

interface ToolbarProps {
  selectedTool: ToolType
  onToolSelect: (tool: ToolType) => void
}

const iconMap = {
  CheckCircleIcon: CheckCircleIcon,
  ExclamationTriangleIcon: ExclamationTriangleIcon,
  WrenchScrewdriverIcon: WrenchScrewdriverIcon,
  SparklesIcon: SparklesIcon,
  BoltIcon: BoltIcon,
  XCircleIcon: XCircleIcon,
  CubeIcon: CubeIcon,
}

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        Herramientas
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {TOOTH_TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon as keyof typeof iconMap]
          const isSelected = selectedTool.id === tool.id

          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool)}
              title={tool.label}
              className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isSelected ? '#1d4ed8' : (tool.color === '#FFFFFF' ? '#64748b' : tool.color) }}
              />
              <span className={`text-[11px] font-medium text-center leading-tight ${
                isSelected ? 'text-blue-700' : 'text-slate-600'
              }`}>
                {tool.label}
              </span>
              {tool.wholeTooth && (
                <span className="text-[9px] text-violet-500 font-semibold">1 clic</span>
              )}
              <div
                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-slate-300"
                style={{ backgroundColor: tool.color }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

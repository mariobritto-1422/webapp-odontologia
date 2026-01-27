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
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Herramientas
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
        {TOOTH_TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon as keyof typeof iconMap]
          const isSelected = selectedTool.id === tool.id

          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }
              `}
              title={tool.label}
            >
              {/* Icono */}
              <Icon
                className="w-8 h-8 mb-2"
                style={{ color: tool.color === '#FFFFFF' ? '#000000' : tool.color }}
              />

              {/* Label */}
              <span className="text-xs font-medium text-gray-700 text-center">
                {tool.label}
              </span>

              {/* Indicador de diente completo */}
              {tool.wholeTooth && (
                <span className="text-[10px] text-purple-600 font-semibold mt-1">
                  1 clic
                </span>
              )}

              {/* Color indicator */}
              <div
                className="absolute top-2 right-2 w-4 h-4 rounded-full border border-gray-400"
                style={{ backgroundColor: tool.color }}
              />

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

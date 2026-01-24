'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type AppointmentsByDay = {
  day: string
  count: number
}

type AppointmentsByStatus = {
  name: string
  value: number
  color: string
}

type AppointmentsByMonth = {
  month: string
  count: number
}

type AppointmentsByTime = {
  hour: string
  count: number
}

export function AppointmentsByDayChart({ data }: { data: AppointmentsByDay[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Turnos por Día de la Semana (últimos 30 días)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" name="Turnos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AppointmentsByStatusChart({ data }: { data: AppointmentsByStatus[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribución por Estado
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AppointmentsByMonthChart({ data }: { data: AppointmentsByMonth[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendencia de Turnos (últimos 6 meses)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2}
            name="Turnos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AppointmentsByTimeChart({ data }: { data: AppointmentsByTime[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Horarios Más Solicitados
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="hour" type="category" width={60} />
          <Tooltip />
          <Bar dataKey="count" fill="#8b5cf6" name="Turnos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatCardWithTrend({
  title,
  value,
  trend,
  trendLabel,
  color,
  icon,
}: {
  title: string
  value: number | string
  trend?: number
  trendLabel?: string
  color: string
  icon: React.ReactNode
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
  }

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600'
  const trendIcon =
    trend && trend > 0 ? (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
    )

  return (
    <div
      className={`rounded-lg border-2 p-6 ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend !== undefined && trendLabel && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              {trendIcon}
              <span className="text-sm font-medium">
                {Math.abs(trend)}% {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-white ${
            iconColorClasses[color as keyof typeof iconColorClasses]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

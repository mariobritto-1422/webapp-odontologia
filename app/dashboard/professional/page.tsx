import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import {
  AppointmentsByDayChart,
  AppointmentsByStatusChart,
  AppointmentsByMonthChart,
  AppointmentsByTimeChart,
  StatCardWithTrend,
} from './DashboardCharts'
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
  subDays,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ProfessionalDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const professionalId = session.user.id

  // Fechas para cálculos
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)
  const lastMonthStart = startOfMonth(subMonths(today, 1))
  const lastMonthEnd = endOfMonth(subMonths(today, 1))
  const thisMonthStart = startOfMonth(today)

  // Obtener todos los datos necesarios
  const [
    { count: totalPatients },
    { count: totalAppointments },
    { count: thisMonthAppointments },
    { count: lastMonthAppointments },
    { count: pendingCount },
    { data: todayAppointments },
    { data: upcomingAppointments },
    { data: last30DaysAppointments },
    { data: last6MonthsAppointments },
  ] = await Promise.all([
    // Total de pacientes
    supabaseAdmin
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId),

    // Total de turnos
    supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId),

    // Turnos este mes
    supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId)
      .gte('date', thisMonthStart.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]),

    // Turnos mes pasado
    supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId)
      .gte('date', lastMonthStart.toISOString().split('T')[0])
      .lte('date', lastMonthEnd.toISOString().split('T')[0]),

    // Turnos pendientes
    supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId)
      .eq('status', 'pending')
      .gte('date', today.toISOString().split('T')[0]),

    // Turnos de hoy
    supabaseAdmin
      .from('appointments')
      .select(`
        *,
        patient:patients(name, email, phone)
      `)
      .eq('professional_id', professionalId)
      .eq('date', today.toISOString().split('T')[0])
      .order('time', { ascending: true }),

    // Próximos turnos (siguiente semana)
    supabaseAdmin
      .from('appointments')
      .select(`
        *,
        patient:patients(name, email, phone)
      `)
      .eq('professional_id', professionalId)
      .gte('date', today.toISOString().split('T')[0])
      .lte(
        'date',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      )
      .order('datetime', { ascending: true })
      .limit(5),

    // Últimos 30 días para gráficos
    supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]),

    // Últimos 6 meses
    supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .gte('date', subMonths(today, 6).toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]),
  ])

  // Calcular tendencia del mes
  const monthTrend =
    lastMonthAppointments && lastMonthAppointments > 0
      ? Math.round(
          ((thisMonthAppointments! - lastMonthAppointments) /
            lastMonthAppointments) *
            100
        )
      : 0

  // Procesar datos para gráficos
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const appointmentsByDay = dayNames.map((day) => {
    const count =
      last30DaysAppointments?.filter((apt) => {
        const aptDate = new Date(apt.date)
        const dayOfWeek = aptDate.getDay()
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        return dayNames[dayIndex] === day
      }).length || 0
    return { day, count }
  })

  const appointmentsByStatus = [
    {
      name: 'Pendiente',
      value:
        last30DaysAppointments?.filter((apt) => apt.status === 'pending')
          .length || 0,
      color: '#eab308',
    },
    {
      name: 'Confirmado',
      value:
        last30DaysAppointments?.filter((apt) => apt.status === 'confirmed')
          .length || 0,
      color: '#10b981',
    },
    {
      name: 'Completado',
      value:
        last30DaysAppointments?.filter((apt) => apt.status === 'completed')
          .length || 0,
      color: '#6b7280',
    },
    {
      name: 'Cancelado',
      value:
        last30DaysAppointments?.filter((apt) => apt.status === 'cancelled')
          .length || 0,
      color: '#ef4444',
    },
  ].filter((item) => item.value > 0)

  // Turnos por mes (últimos 6 meses)
  const appointmentsByMonth = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(today, 5 - i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const count =
      last6MonthsAppointments?.filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate >= monthStart && aptDate <= monthEnd
      }).length || 0
    return {
      month: format(monthDate, 'MMM', { locale: es }),
      count,
    }
  })

  // Turnos por horario (agrupar por hora)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = `${String(i).padStart(2, '0')}:00`
    const count =
      last30DaysAppointments?.filter((apt) => {
        const aptHour = parseInt(apt.time.split(':')[0])
        return aptHour === i
      }).length || 0
    return { hour, count }
  }).filter((slot) => slot.count > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
          <p className="text-gray-600 mt-1">Bienvenido, {session.user.name}</p>
        </div>
        {pendingCount && pendingCount > 0 && (
          <Link
            href="/dashboard/professional/turnos"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium">
              {pendingCount} turno{pendingCount > 1 ? 's' : ''} pendiente
              {pendingCount > 1 ? 's' : ''}
            </span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardWithTrend
          title="Pacientes Registrados"
          value={totalPatients || 0}
          color="blue"
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCardWithTrend
          title="Total de Turnos"
          value={totalAppointments || 0}
          color="green"
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCardWithTrend
          title="Turnos Este Mes"
          value={thisMonthAppointments || 0}
          trend={monthTrend}
          trendLabel="vs mes anterior"
          color="purple"
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
        <StatCardWithTrend
          title="Turnos Hoy"
          value={todayAppointments?.length || 0}
          color="yellow"
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsByDayChart data={appointmentsByDay} />
        {appointmentsByStatus.length > 0 ? (
          <AppointmentsByStatusChart data={appointmentsByStatus} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Estado
            </h3>
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-600 mb-2">Sin datos todavía</p>
                <p className="text-sm text-gray-500">
                  Los datos aparecerán cuando tengas turnos confirmados
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsByMonthChart data={appointmentsByMonth} />
        {timeSlots.length > 0 ? (
          <AppointmentsByTimeChart data={timeSlots} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Horarios Más Solicitados
            </h3>
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 mb-2">Sin datos todavía</p>
                <p className="text-sm text-gray-500">
                  Los datos aparecerán cuando tengas turnos en diferentes horarios
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Turnos de Hoy ({todayAppointments?.length || 0})
          </h2>
        </div>
        {todayAppointments && todayAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {todayAppointments.map((appointment: any) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              No hay turnos programados para hoy
            </p>
            <Link
              href="/dashboard/professional/turnos/nuevo"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Turno
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Próximos Turnos (7 días)
          </h2>
          <Link
            href="/dashboard/professional/turnos"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>
        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment: any) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hay turnos próximos</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Completado',
  }

  return (
    <Link
      href={`/dashboard/professional/pacientes/${appointment.patient_id}`}
      className="p-6 hover:bg-gray-50 transition-colors block"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="font-semibold text-gray-900 text-lg">
              {appointment.patient?.name || 'Sin nombre'}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[appointment.status as keyof typeof statusColors]
              }`}
            >
              {statusLabels[appointment.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {appointment.patient?.email}
          </p>
          {appointment.patient?.phone && (
            <p className="text-sm text-gray-600">
              {appointment.patient.phone}
            </p>
          )}
          {appointment.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">
              Nota: {appointment.notes}
            </p>
          )}
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-blue-600">
            {appointment.time}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {format(parseISO(appointment.date), "d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>
    </Link>
  )
}

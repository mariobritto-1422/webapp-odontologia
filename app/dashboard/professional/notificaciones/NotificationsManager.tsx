'use client'

import { useState, useEffect } from 'react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

type Appointment = {
  id: string
  date: string
  time: string
  notes: string | null
  patient: {
    id: string
    name: string
    email: string | null
    phone: string | null
  }
}

type Professional = {
  id: string
  name: string
  specialty: string
  address: string | null
  phone: string | null
}

type Notification = {
  id: string
  type: 'reminder' | 'confirmation' | 'cancellation' | 'status_update'
  channel: 'email' | 'whatsapp' | 'sms'
  status: 'pending' | 'sent' | 'failed'
  subject: string | null
  message: string
  sent_at: string | null
  error_message: string | null
  created_at: string
  patient: {
    id: string
    name: string
    email: string | null
  }
  appointment: {
    id: string
    date: string
    time: string
  }
}

type NotificationsManagerProps = {
  professional: Professional | null
  upcomingAppointments: Appointment[]
  tomorrowAppointments: Appointment[]
}

export default function NotificationsManager({
  professional,
  upcomingAppointments,
  tomorrowAppointments,
}: NotificationsManagerProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'settings' | 'history'>('upcoming')
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Configuración de recordatorios automáticos (simulado, se podría guardar en DB)
  const [autoReminderEnabled, setAutoReminderEnabled] = useState(false)
  const [reminderDaysBefore, setReminderDaysBefore] = useState(1)
  const [reminderTime, setReminderTime] = useState('10:00')

  // Plantilla de mensaje
  const [messageTemplate, setMessageTemplate] = useState(
    `Hola {paciente}, te recordamos tu turno con ${professional?.name || 'el consultorio'} el día {fecha} a las {hora}. ${professional?.address ? `Dirección: ${professional.address}` : ''} ¡Te esperamos!`
  )

  // Cargar historial cuando se cambia a la pestaña de historial
  useEffect(() => {
    if (activeTab === 'history' && notificationHistory.length === 0) {
      loadNotificationHistory()
    }
  }, [activeTab])

  const loadNotificationHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/notifications/history')
      if (response.ok) {
        const data = await response.json()
        setNotificationHistory(data.notifications)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSendReminder = async (appointment: Appointment) => {
    // Verificar que el paciente tenga email
    if (!appointment.patient.email) {
      setErrorMessage(
        `${appointment.patient.name} no tiene email registrado. Por favor, actualiza sus datos primero.`
      )
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setSendingIds((prev) => new Set(prev).add(appointment.id))
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const formattedMessage = messageTemplate
        .replace('{paciente}', appointment.patient.name)
        .replace(
          '{fecha}',
          format(parseISO(appointment.date), "EEEE d 'de' MMMM", {
            locale: es,
          })
        )
        .replace('{hora}', appointment.time)

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patient.id,
          type: 'reminder',
          subject: `Recordatorio de Turno - ${professional?.name}`,
          message: formattedMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el recordatorio')
      }

      setSuccessMessage(
        `✓ Recordatorio enviado a ${appointment.patient.name} exitosamente`
      )
      setTimeout(() => setSuccessMessage(''), 5000)

      // Recargar historial si está en esa pestaña
      if (activeTab === 'history') {
        loadNotificationHistory()
      }
    } catch (error: any) {
      console.error('Error sending reminder:', error)
      setErrorMessage(
        `Error al enviar recordatorio: ${error.message || 'Error desconocido'}`
      )
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSendingIds((prev) => {
        const next = new Set(prev)
        next.delete(appointment.id)
        return next
      })
    }
  }

  const handleSendMultiple = async () => {
    if (tomorrowAppointments.length === 0) return

    // Filtrar solo los que tienen email
    const appointmentsWithEmail = tomorrowAppointments.filter(
      (apt) => apt.patient.email
    )

    if (appointmentsWithEmail.length === 0) {
      setErrorMessage('Ningún paciente tiene email registrado')
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setSendingIds(new Set(appointmentsWithEmail.map((apt) => apt.id)))
    setErrorMessage('')
    setSuccessMessage('')

    let successCount = 0
    let failCount = 0

    try {
      // Enviar recordatorios secuencialmente
      for (const appointment of appointmentsWithEmail) {
        try {
          const formattedMessage = messageTemplate
            .replace('{paciente}', appointment.patient.name)
            .replace(
              '{fecha}',
              format(parseISO(appointment.date), "EEEE d 'de' MMMM", {
                locale: es,
              })
            )
            .replace('{hora}', appointment.time)

          const response = await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointmentId: appointment.id,
              patientId: appointment.patient.id,
              type: 'reminder',
              subject: `Recordatorio de Turno - ${professional?.name}`,
              message: formattedMessage,
            }),
          })

          if (response.ok) {
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
          console.error('Error sending to', appointment.patient.name, error)
        }
      }

      if (successCount > 0) {
        setSuccessMessage(
          `✓ Recordatorios enviados: ${successCount} exitosos${
            failCount > 0 ? `, ${failCount} fallidos` : ''
          }`
        )
      } else {
        setErrorMessage('No se pudo enviar ningún recordatorio')
      }

      setTimeout(() => {
        setSuccessMessage('')
        setErrorMessage('')
      }, 5000)

      // Recargar historial si está en esa pestaña
      if (activeTab === 'history') {
        loadNotificationHistory()
      }
    } catch (error) {
      setErrorMessage('Error al enviar recordatorios')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSendingIds(new Set())
    }
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">
              ✓ Sistema de Notificaciones por Email Activo
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Los recordatorios se envían automáticamente por email usando Resend.
              Asegurate de configurar RESEND_API_KEY en las variables de entorno.
              WhatsApp se agregará en la versión 2.0.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Próximos Turnos ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historial
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {/* Quick Action: Tomorrow's Appointments */}
          {tomorrowAppointments.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Recordatorios para Mañana
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {tomorrowAppointments.length} paciente
                    {tomorrowAppointments.length > 1 ? 's' : ''} con turno mañana
                  </p>
                </div>
                <button
                  onClick={handleSendMultiple}
                  disabled={sendingIds.size > 0}
                  className="px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {sendingIds.size > 0
                    ? 'Enviando...'
                    : 'Enviar Todos los Recordatorios'}
                </button>
              </div>
            </div>
          )}

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                Próximos Turnos Confirmados
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Envía recordatorios individuales a tus pacientes
              </p>
            </div>

            {upcomingAppointments.length === 0 ? (
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
                <p className="text-gray-600">
                  No hay turnos confirmados próximos
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => {
                  const daysUntil = differenceInDays(
                    parseISO(appointment.date),
                    new Date()
                  )
                  const isSending = sendingIds.has(appointment.id)

                  return (
                    <div
                      key={appointment.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900 text-lg">
                              {appointment.patient.name}
                            </p>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              En {daysUntil} día{daysUntil !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              📅{' '}
                              {format(
                                parseISO(appointment.date),
                                "EEEE d 'de' MMMM",
                                { locale: es }
                              )}{' '}
                              a las {appointment.time} hs
                            </p>
                            {appointment.patient.email && (
                              <p>✉️ {appointment.patient.email}</p>
                            )}
                            {appointment.patient.phone && (
                              <p>📱 {appointment.patient.phone}</p>
                            )}
                            {appointment.notes && (
                              <p className="text-gray-500 italic">
                                Nota: {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSendReminder(appointment)}
                          disabled={isSending || sendingIds.size > 0}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {isSending ? (
                            <>
                              <svg
                                className="animate-spin w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Enviando...
                            </>
                          ) : (
                            <>
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
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              Enviar Recordatorio
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Auto Reminders Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recordatorios Automáticos
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Configura el envío automático de recordatorios antes de cada turno
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Habilitar recordatorios automáticos
                  </p>
                  <p className="text-sm text-gray-500">
                    Los recordatorios se enviarán automáticamente
                  </p>
                </div>
                <button
                  onClick={() => setAutoReminderEnabled(!autoReminderEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoReminderEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoReminderEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {autoReminderEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enviar recordatorio con cuántos días de anticipación
                    </label>
                    <select
                      value={reminderDaysBefore}
                      onChange={(e) =>
                        setReminderDaysBefore(parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 día antes</option>
                      <option value="2">2 días antes</option>
                      <option value="3">3 días antes</option>
                      <option value="7">1 semana antes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario de envío
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Message Template */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plantilla de Mensaje
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Personaliza el mensaje de recordatorio. Usa: {'{paciente}'},{' '}
              {'{fecha}'}, {'{hora}'}
            </p>

            <textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Vista Previa
              </p>
              <p className="text-sm text-gray-700">
                {messageTemplate
                  .replace('{paciente}', 'María López')
                  .replace('{fecha}', 'Jueves 25 de Enero')
                  .replace('{hora}', '14:00')}
              </p>
            </div>

            <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Historial de Notificaciones
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Últimas 100 notificaciones enviadas
              </p>
            </div>
            <button
              onClick={loadNotificationHistory}
              disabled={loadingHistory}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loadingHistory ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          {loadingHistory ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          ) : notificationHistory.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 mb-2">
                No hay notificaciones enviadas aún
              </p>
              <p className="text-sm text-gray-500">
                Cuando envíes recordatorios, aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notificationHistory.map((notification) => {
                const statusColors = {
                  sent: 'bg-green-100 text-green-800',
                  failed: 'bg-red-100 text-red-800',
                  pending: 'bg-yellow-100 text-yellow-800',
                }

                const statusLabels = {
                  sent: 'Enviado',
                  failed: 'Fallido',
                  pending: 'Pendiente',
                }

                const typeLabels = {
                  reminder: 'Recordatorio',
                  confirmation: 'Confirmación',
                  cancellation: 'Cancelación',
                  status_update: 'Actualización',
                }

                return (
                  <div
                    key={notification.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[notification.status]
                          }`}
                        >
                          {statusLabels[notification.status]}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {typeLabels[notification.type]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            parseISO(notification.created_at),
                            "d 'de' MMMM yyyy, HH:mm",
                            { locale: es }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {notification.patient.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {notification.patient.email}
                        </p>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          📅 Turno:{' '}
                          {format(
                            parseISO(notification.appointment.date),
                            "EEEE d 'de' MMMM",
                            { locale: es }
                          )}{' '}
                          a las {notification.appointment.time} hs
                        </p>
                      </div>

                      {notification.subject && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">
                            {notification.subject}
                          </p>
                        </div>
                      )}

                      {notification.error_message && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <span className="font-medium">Error:</span>{' '}
                            {notification.error_message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Estados de turnos
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

// Roles de usuarios
export const USER_ROLES = {
  PROFESSIONAL: 'professional',
  PATIENT: 'patient',
} as const

// Duración por defecto de turnos (en minutos)
export const DEFAULT_APPOINTMENT_DURATION = 30

// Días de la semana
export const WEEKDAYS = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_EMAIL: 'El email ingresado no es válido',
    WRONG_PASSWORD: 'La contraseña es incorrecta',
    USER_NOT_FOUND: 'No existe un usuario con ese email',
    EMAIL_IN_USE: 'Ya existe una cuenta con ese email',
    WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  },
  APPOINTMENT: {
    SLOT_NOT_AVAILABLE: 'El horario seleccionado ya no está disponible',
    INVALID_DATE: 'La fecha seleccionada no es válida',
    PAST_DATE: 'No puedes solicitar turnos en fechas pasadas',
  },
} as const

// Colores por defecto para branding
export const DEFAULT_BRANDING = {
  primaryColor: '#1E40AF',
  secondaryColor: '#10B981',
}

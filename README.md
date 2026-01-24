# 🦷 WebApp Odontología - Sistema de Gestión de Turnos

Sistema multi-tenant para que odontólogos gestionen turnos con sus pacientes de forma simple y profesional.

**🚀 Estado:** Listo para Producción (v1.1)
**📅 Última actualización:** 24 de Enero 2026

## 📊 Progreso: 95% Completado ✅

### ✅ Completado:

**Core del Sistema**
- ✅ Sistema de autenticación (profesional/paciente)
- ✅ Dashboard del profesional con estadísticas y gráficos
- ✅ Gestión completa de turnos
- ✅ Base de datos de pacientes con historial
- ✅ Dashboard del paciente
- ✅ Solicitud de turnos por pacientes

**Configuración**
- ✅ Perfil profesional editable
- ✅ Horarios de atención personalizables
- ✅ Branding (colores, logo, nombre consultorio)
- ✅ Duración de turnos configurable

**Comunicación y Marketing** 🆕
- ✅ **Sistema de notificaciones por email**
  - Envío individual y masivo de recordatorios
  - Plantillas personalizables
  - Historial completo
  - Integración con Resend
- ✅ **Código QR para registro de pacientes**
  - Generación automática
  - Descarga y compartir
  - Funciona en cualquier móvil

**Deploy** 🆕
- ✅ **Configuración para Vercel**
  - Build verificado exitosamente
  - Variables de entorno documentadas
  - Guía completa de deployment

### ⏳ Pendiente (5%):
- ⏳ Confirmar/Rechazar turnos pendientes desde dashboard
- ⏳ WhatsApp notifications (v2.0)
- ⏳ Recordatorios automáticos programados (v2.0)

## 🏗️ Estructura del Proyecto

```
webapp/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── appointments/  # CRUD de turnos
│   │   ├── auth/          # Autenticación
│   │   └── professional/  # Configuración profesional
│   ├── auth/              # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   └── dashboard/         # Dashboards
│       └── professional/  # Dashboard del profesional
│           ├── turnos/
│           ├── pacientes/
│           ├── configuracion/
│           └── qr/
├── database/              # Schemas y migraciones SQL
├── lib/                   # Utilidades y configuración
│   ├── auth.ts           # NextAuth config
│   ├── supabase.ts       # Cliente Supabase
│   └── constants.ts
├── types/                 # Type definitions
└── public/               # Assets estáticos
```

## 🚀 Instalación y Desarrollo

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env.local` (ver `.env.example`):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Base URL (para QR y links públicos)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Resend (para notificaciones por email)
# Obtener en: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here
```

### 3. Configurar base de datos
Ejecutar en Supabase SQL Editor (en orden):
```bash
1. database/schema.sql
2. database/migration-add-password.sql
3. database/migration-notifications.sql  # NUEVO: Para sistema de notificaciones
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🧪 Usuarios de Prueba

### Profesional:
- Email: `juan@garcia.com`
- Contraseña: `123456`
- Dashboard: http://localhost:3000/dashboard/professional

### Paciente:
- Email: `maria@lopez.com`
- Contraseña: `123456`

## 📚 Stack Tecnológico

- **Framework:** Next.js 16 (App Router) con Turbopack
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS 4
- **Base de Datos:** Supabase (PostgreSQL)
- **Auth:** NextAuth v5
- **Emails:** Resend 🆕
- **Gráficos:** Recharts
- **Iconos:** Heroicons
- **Fechas:** date-fns
- **QR:** qrcode.react

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 salt rounds)
- Row Level Security (RLS) en Supabase
- Sesiones seguras con NextAuth
- Validación de datos en cliente y servidor

## 📝 Documentación

### Documentos Principales

- **`RESUMEN_ACTUALIZACION.md`** - Resumen completo de las últimas actualizaciones ⭐
- **`ESTADO_PROYECTO.md`** - Estado detallado del proyecto y progreso
- **`GUIA_DEPLOY_VERCEL.md`** - Guía paso a paso para deploy en Vercel 🚀
- **`CONFIGURACION_NOTIFICACIONES.md`** - Setup del sistema de notificaciones 📧
- **`GUIA_QR_MOVIL.md`** - Guía completa del sistema de QR 📱
- **`TESTING_COMPLETO_V1.md`** - Checklist de testing
- **`GUIA_PRODUCCION.md`** - Preparación para producción

### Scripts Útiles

- **`debug-appointments.js`** - Ver turnos en la base de datos
- **`check-rls.js`** - Verificar estado de RLS
- **`delete-test-professional.js`** - Limpiar datos de prueba

## 🚀 Deploy a Producción

Para deployar en Vercel, sigue la guía detallada en **`GUIA_DEPLOY_VERCEL.md`**

Resumen rápido:
1. Ejecutar migración de notificaciones en Supabase
2. Crear cuenta en Resend y obtener API key
3. Subir código a GitHub
4. Importar proyecto en Vercel
5. Configurar variables de entorno
6. Deploy

**Tiempo estimado:** 30-45 minutos

## 💰 Costos

Todos los servicios tienen plan gratuito generoso:
- **Vercel:** Gratis (100 GB bandwidth/mes)
- **Supabase:** Gratis (500 MB DB, 2 GB storage)
- **Resend:** Gratis (3,000 emails/mes)

**Total:** $0 USD/mes para empezar ✅

---

**Versión:** 1.1
**Estado:** ✅ Listo para Producción
**Última actualización:** 24 de Enero 2026
# Deploy trigger

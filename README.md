# Sonrisapp - Sistema de Gestión de Turnos

Sistema multi-tenant para que odontólogos gestionen turnos con sus pacientes de forma simple y profesional.

**🚀 Estado:** EN PRODUCCIÓN ✅
**🌐 URL:** https://www.sonrisapp.com
**📅 Deploy:** 25 de Enero 2026
**📅 Última actualización:** 27 de Enero 2026 - Odontograma Implementado
**🖼 Logo:** `public/sonrisapp-logo.svg` | Favicon: `public/sonrisapp-favicon.svg`

## 📊 Progreso: 100% Completado ✅

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

**Comunicación y Marketing**
- ✅ **Sistema de notificaciones por email**
  - Envío individual y masivo de recordatorios
  - Plantillas personalizables
  - Historial completo
  - Integración con Resend
- ✅ **Código QR para registro de pacientes**
  - Generación automática
  - Descarga y compartir
  - Funciona en cualquier móvil

**Odontograma Interactivo** 🆕 ⭐
- ✅ **Sistema profesional de registro dental**
  - Interfaz visual interactiva con SVG
  - Sistema FDI internacional (permanente y temporaria)
  - 7 estados: Sano, Caries, Restauración, Corona, Fractura, Ausente, Implante
  - 5 superficies por diente: Vestibular, Lingual, Mesial, Distal, Oclusal
  - Persistencia en Supabase (JSONB optimizado)
  - Exportación a PDF profesional
  - Responsive en todos los dispositivos
  - Validación de permisos por profesional

**Deploy** ✅
- ✅ **En Producción en Netlify Pro**
  - URL: https://www.sonrisapp.com
  - Build automatizado desde GitHub
  - Variables de entorno configuradas
  - SSL/HTTPS activo
  - Edge Functions y Serverless Functions desplegadas
  - Login y registro funcionando al 100%

### ⏳ Pendiente para v2.0 (opcional):
- ⏳ Confirmar/Rechazar turnos pendientes desde dashboard
- ⏳ WhatsApp notifications
- ⏳ Recordatorios automáticos programados
- ⏳ Dominio personalizado

## 🏗️ Estructura del Proyecto

```
webapp/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── appointments/  # CRUD de turnos
│   │   ├── auth/          # Autenticación
│   │   ├── odontogram/    # Odontograma (GET/PUT/Export PDF) 🆕
│   │   └── professional/  # Configuración profesional
│   ├── auth/              # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   └── dashboard/         # Dashboards
│       └── professional/  # Dashboard del profesional
│           ├── turnos/
│           ├── pacientes/
│           │   └── [id]/
│           │       └── odontograma/  # Odontograma interactivo 🆕
│           ├── configuracion/
│           ├── notificaciones/
│           └── qr/
├── database/              # Schemas y migraciones SQL
│   ├── migration-add-odontogram.sql  # Migración odontograma 🆕
│   └── README.md         # Instrucciones de migraciones 🆕
├── lib/                   # Utilidades y configuración
│   ├── auth.ts           # NextAuth config
│   ├── supabase.ts       # Cliente Supabase
│   ├── pdf-generator.tsx # Generador de PDF 🆕
│   └── constants.ts
├── types/                 # Type definitions
│   └── odontogram.ts     # Tipos del odontograma 🆕
├── docs/                  # Documentación 🆕
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
3. database/migration-notifications.sql
4. database/migration-add-odontogram.sql  # 🆕 Para odontograma interactivo
```

Ver instrucciones detalladas en: `database/README.md`

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
- **Emails:** Resend
- **PDF:** @react-pdf/renderer 🆕
- **Canvas:** html2canvas 🆕
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

- **`ODONTOGRAMA.md`** ⭐ - Guía completa del Odontograma Interactivo 🆕
- **`IMPLEMENTACION_COMPLETADA.md`** - Resumen técnico del odontograma 🆕
- **`database/README.md`** - Instrucciones de migraciones SQL 🆕
- **`docs/README.md`** - Índice de documentación completa

### Documentación Histórica

La carpeta `docs/archive/` contiene documentación de versiones anteriores que se mantiene como referencia.

## 🚀 Deploy en Producción

**✅ Aplicación desplegada en Netlify Pro**

### 🌐 URLs de Acceso:
- **Producción:** https://www.sonrisapp.com
- **Login:** https://www.sonrisapp.com/auth/login
- **Registro Profesional:** https://www.sonrisapp.com/auth/register/professional
- **Registro Paciente:** https://www.sonrisapp.com/auth/register/patient

### 📚 Guías de Deploy:
- **`GUIA_DEPLOY_NETLIFY.md`** - Guía completa para Netlify ⭐
- **`ESTADO_DEPLOY_ACTUAL.md`** - Estado del deploy actual
- **`GUIA_DEPLOY_VERCEL.md`** - Alternativa en Vercel

### 🔑 Variables de Entorno Configuradas:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_BASE_URL
RESEND_API_KEY
```

## 💰 Costos de Producción

- **Netlify Pro:** $19 USD/mes (plan activo)
- **Supabase:** Gratis (500 MB DB, 2 GB storage)
- **Resend:** Gratis (3,000 emails/mes)

**Total:** $19 USD/mes

---

## 🎯 Información del Proyecto

**Versión:** 1.3 (Odontograma Implementado) 🆕
**Estado:** ✅ EN PRODUCCIÓN - FUNCIONANDO 100%
**Plataforma:** Netlify Pro
**URL Producción:** https://www.sonrisapp.com
**Repositorio:** https://github.com/mariobritto-1422/sonrisapp
**Deploy:** 25 de Enero 2026 - 14:00 hs
**Última actualización:** 27 de Enero 2026 - Odontograma Interactivo Implementado

---

**Desarrollado con ❤️ por Mario Britto y Claude Code**

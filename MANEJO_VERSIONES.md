# 🔄 Manejo de Versiones y Múltiples Clientes

## 🎯 Versión 2.0 - ¿Carpeta Nueva o Misma?

### **RESPUESTA: MISMA CARPETA** ✅

La versión 2.0 se desarrolla en el **mismo proyecto**, no en una carpeta nueva.

---

## 📦 Estrategia de Versionado

### **Opción Recomendada: Git Branches + Tags**

```bash
# Estructura de branches:
main (producción actual - v1.1)
├── develop (desarrollo activo)
├── feature/whatsapp-notifications (v2.0)
├── feature/auto-reminders (v2.0)
└── hotfix/email-bug (parche urgente)

# Tags para releases:
v1.0.0 - Release inicial
v1.1.0 - Notificaciones + QR
v2.0.0 - WhatsApp + Recordatorios automáticos
```

### **Workflow de Desarrollo:**

#### 1. Trabajar en v2.0 sin afectar producción

```bash
cd C:/Users/mario/ClaudeProjects/WebApp-Odontologia/webapp

# Crear branch de desarrollo
git checkout -b develop

# Crear feature branches
git checkout -b feature/whatsapp-notifications
git checkout -b feature/auto-reminders
git checkout -b feature/multiple-professionals
```

#### 2. Desarrollar features

```bash
# Trabajar en whatsapp
git checkout feature/whatsapp-notifications
# ... código ...
git add .
git commit -m "feat: add WhatsApp notifications"

# Merge a develop cuando esté listo
git checkout develop
git merge feature/whatsapp-notifications
```

#### 3. Cuando v2.0 esté completa

```bash
# Merge develop a main
git checkout main
git merge develop

# Tag the release
git tag -a v2.0.0 -m "Release v2.0 - WhatsApp + Auto Reminders"
git push origin main --tags
```

#### 4. Deploy automático

Vercel detecta el push a `main` y hace deploy automático de v2.0 🚀

---

## 🏢 Manejo de Múltiples Clientes

### **Escenario: Multi-Tenant (Recomendado)**

#### **Estructura de Directorios:**

```
C:/Users/mario/ClaudeProjects/
└── WebApp-Odontologia/
    └── webapp/                  ← UN SOLO PROYECTO
        ├── .git/
        ├── app/
        ├── database/
        └── README.md

# Deployed en:
https://turnos-dental.vercel.app

# Clientes acceden:
https://turnos-dental.vercel.app → Dr. García
https://turnos-dental.vercel.app → Dra. López
https://turnos-dental.vercel.app → Dr. Martínez
```

**Todos usan la misma instalación.**

---

### **Escenario: Licencias Individuales**

Si decides dar una copia a cada cliente (NO recomendado):

#### **Estructura de Directorios:**

```
C:/Users/mario/ClaudeProjects/
├── WebApp-Odontologia-Template/  ← TEMPLATE BASE
│   └── webapp/
│
├── Cliente-DrGarcia/              ← COPIA 1
│   └── webapp/
│       ├── .git/                  (repo separado)
│       └── .env.local             (Supabase 1)
│
├── Cliente-DraLopez/              ← COPIA 2
│   └── webapp/
│       ├── .git/                  (repo separado)
│       └── .env.local             (Supabase 2)
│
└── Cliente-DrMartinez/            ← COPIA 3
    └── webapp/
        ├── .git/                  (repo separado)
        └── .env.local             (Supabase 3)
```

#### **Proceso para Nuevo Cliente:**

```bash
# 1. Clonar template
cd C:/Users/mario/ClaudeProjects/
cp -r WebApp-Odontologia-Template Cliente-DrPerez

# 2. Inicializar Git
cd Cliente-DrPerez/webapp
rm -rf .git
git init

# 3. Configurar Supabase
# - Crear nuevo proyecto en Supabase
# - Ejecutar schema.sql
# - Actualizar .env.local

# 4. Configurar GitHub
# - Crear nuevo repo: webapp-dr-perez
git remote add origin https://github.com/tu-usuario/webapp-dr-perez.git
git add .
git commit -m "Initial setup for Dr. Perez"
git push -u origin main

# 5. Deploy en Vercel
# - Importar repo desde GitHub
# - Configurar variables de entorno
# - Deploy
```

#### **URLs Resultantes:**

```
Cliente 1: https://dr-garcia-turnos.vercel.app
Cliente 2: https://dra-lopez-turnos.vercel.app
Cliente 3: https://dr-martinez-turnos.vercel.app
Cliente 4: https://dr-perez-turnos.vercel.app
```

#### **Mantener Actualizaciones:**

```bash
# Cuando sacas v2.0, debes actualizar TODAS las copias:

# Actualizar template
cd WebApp-Odontologia-Template/webapp
git pull origin main

# Actualizar cliente 1
cd Cliente-DrGarcia/webapp
git remote add upstream https://github.com/tu-usuario/webapp-template.git
git fetch upstream
git merge upstream/main
# Resolver conflictos si hay
git push origin main

# Repetir para cliente 2, 3, 4... N
# → MUCHO TRABAJO 😫
```

---

## 📊 Comparación Final

| Aspecto | Multi-Tenant | Licencias Individuales |
|---------|--------------|------------------------|
| **Carpetas** | 1 | N (una por cliente) |
| **Repositorios Git** | 1 | N |
| **Proyectos Supabase** | 1 | N |
| **Proyectos Vercel** | 1 | N |
| **Actualizar a v2.0** | 1 deploy | N deploys |
| **Costo mensual (10 clientes)** | $66 | $660 (10 × $66) |
| **Tiempo de mantenimiento** | 1 hora/mes | 10+ horas/mes |
| **Escalabilidad** | ∞ | ~20 máximo |

---

## 🎯 Mi Recomendación

### Para Versión 2.0:
✅ **Desarrollar en la misma carpeta usando Git branches**

```bash
# Crear branch para v2.0
git checkout -b develop

# Trabajar en features nuevas
# Cuando esté lista, merge a main y deploy
```

### Para Múltiples Clientes:
✅ **Usar Multi-Tenant (todos en la misma app)**

**Razones:**
1. **Escala infinitamente** - De 1 a 1,000 clientes sin cambios
2. **Actualizaciones instantáneas** - Deploy una vez, todos actualizados
3. **Costos bajos** - Un solo juego de servicios
4. **Menos trabajo** - Mantener 1 app vs N apps
5. **Modelo de negocio moderno** - SaaS con ingresos recurrentes

---

## 🛠️ Setup Inicial Recomendado

### Paso 1: Convertir a Multi-Tenant (si aún no lo es)

La webapp YA es multi-tenant por diseño. Solo agregar sistema de pagos:

```bash
# Instalar Stripe
npm install stripe @stripe/stripe-js

# Agregar campos de suscripción a BD (ver MODELO_NEGOCIO_MULTITENANT.md)
```

### Paso 2: Configurar Git para Versiones

```bash
cd C:/Users/mario/ClaudeProjects/WebApp-Odontologia/webapp

# Branch principal (producción)
git checkout -b main

# Branch de desarrollo
git checkout -b develop

# Estructura:
# main → lo que está en producción (v1.1)
# develop → desarrollo de v2.0
```

### Paso 3: Deploy

```bash
# Deploy main a Vercel
# Todos los clientes usan: https://turnos-dental.vercel.app
```

---

## 🚀 Roadmap Sugerido

### v1.1 (Actual) ✅
- Sistema completo de turnos
- Notificaciones email
- QR de registro
- Dashboard profesional

### v1.2 (1 mes) 🎯
- Sistema de suscripción con Stripe
- Planes: Básico, Pro, Enterprise
- Límites por plan
- Página de precios

### v2.0 (3 meses)
- Notificaciones WhatsApp
- Recordatorios automáticos
- Confirmar/Rechazar turnos UI
- Reportes exportables
- Múltiples profesionales por consultorio

### v2.5 (6 meses)
- App móvil (React Native)
- Videoconsulta
- Pagos online
- Integraciones (Google Calendar)

---

## 📝 Resumen Ejecutivo

**Pregunta:** ¿Carpeta nueva para v2.0?
**Respuesta:** ❌ NO. Misma carpeta, usar Git branches.

**Pregunta:** ¿Copia por cliente?
**Respuesta:** ❌ NO. Un solo deploy, todos comparten (multi-tenant).

**Pregunta:** ¿Cómo evitar que compartan cuenta?
**Respuesta:** ✅ Sistema de suscripción + límites + detección de uso.

**Estrategia ganadora:**
1. Una sola webapp multi-tenant
2. Sistema de suscripción mensual
3. Git branches para versiones
4. Escalable a miles de clientes
5. Mantenimiento simple

---

**Última actualización:** 24 de Enero 2026

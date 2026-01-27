# 🚀 Guía Completa de Deploy a Producción

## 📋 Índice

1. [Opciones de Hosting](#opciones-de-hosting)
2. [Configuración de Base de Datos](#configuración-de-base-de-datos)
3. [Variables de Entorno](#variables-de-entorno)
4. [Deploy en Vercel (Recomendado)](#deploy-en-vercel)
5. [Deploy en Otras Plataformas](#deploy-en-otras-plataformas)
6. [Configuración de Dominio](#configuración-de-dominio)
7. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
8. [Costos Estimados](#costos-estimados)
9. [Checklist Final](#checklist-final)
10. [FAQ](#faq)

---

## 🌐 Opciones de Hosting

### Opción 1: Vercel (⭐ RECOMENDADO)

**Pros:**
- ✅ Deploy automático con Git
- ✅ Optimizado para Next.js
- ✅ SSL gratuito
- ✅ CDN global automático
- ✅ Preview deployments
- ✅ Tier gratuito generoso
- ✅ Configuración simple

**Cons:**
- ⚠️ Límite de 100GB bandwidth/mes en plan gratuito
- ⚠️ Necesita tarjeta para plan Pro ($20/mes)

**Plan Gratuito Incluye:**
- Bandwidth: 100GB/mes
- Builds: 6000 minutos/mes
- Invocaciones: 100,000/mes
- Dominios custom ilimitados

### Opción 2: Netlify

**Pros:**
- ✅ Similar a Vercel
- ✅ Tier gratuito
- ✅ Forms incluidos

**Cons:**
- ⚠️ Menos optimizado para Next.js
- ⚠️ Límite de 300 minutos build/mes

### Opción 3: Railway

**Pros:**
- ✅ Soporta Docker
- ✅ Base de datos incluida
- ✅ $5 gratis mensual

**Cons:**
- ⚠️ Más complejo de configurar
- ⚠️ Sin tier gratuito permanente

### Opción 4: DigitalOcean / AWS / Azure

**Pros:**
- ✅ Control total
- ✅ Escalabilidad

**Cons:**
- ⚠️ Requiere configuración avanzada
- ⚠️ Costos desde $5/mes mínimo
- ⚠️ Mantenimiento manual

**Recomendación: Vercel para empezar, escalar después si es necesario**

---

## 🗄️ Configuración de Base de Datos

### Supabase en Producción

**Tienes 2 opciones:**

#### Opción A: Usar el mismo proyecto (Desarrollo + Producción)
**Pros:**
- No requiere crear nuevo proyecto
- Datos de prueba ya existen

**Cons:**
- ⚠️ Mezcla datos de desarrollo con producción
- ⚠️ NO RECOMENDADO para producción real

#### Opción B: Crear proyecto nuevo de Supabase (✅ RECOMENDADO)

**Pasos:**

1. **Crear nuevo proyecto en Supabase:**
   - Ir a https://supabase.com/dashboard
   - Click "New Project"
   - Nombre: `webapp-odontologia-prod`
   - Región: South America (São Paulo) - más cercana a Argentina
   - Database Password: Generar uno fuerte
   - Plan: Free tier (hasta 500MB)

2. **Obtener credenciales del nuevo proyecto:**
   - Project Settings → API
   - Copiar: `Project URL` (SUPABASE_URL)
   - Copiar: `anon/public` key (SUPABASE_ANON_KEY)

3. **Ejecutar migrations:**
   ```bash
   # En tu proyecto local
   # Cambiar temporalmente .env.local a la DB de producción
   # Luego ejecutar el SQL del schema
   ```

4. **Aplicar el Schema:**
   - Ir a SQL Editor en Supabase Dashboard
   - Copiar todo el contenido de tu schema SQL inicial
   - Ejecutar
   - Verificar que se crearon todas las tablas

5. **Habilitar RLS Policies:**
   - Ya deberían estar en el schema
   - Verificar en Authentication → Policies

**Límites del Plan Gratuito de Supabase:**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 2 GB/mes
- Filas: 50,000 (aprox)

**Upgrade si necesitas:**
- Pro: $25/mes (8GB DB, 100GB storage, 50GB bandwidth)

---

## 🔑 Variables de Entorno

### Variables Requeridas

Crea archivo `.env.production` (NO commitear):

```bash
# Supabase - PRODUCCIÓN
SUPABASE_URL=https://tu-proyecto-prod.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon-de-produccion

# NextAuth - PRODUCCIÓN
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-secret-super-fuerte-de-64-caracteres-minimo

# (Opcional para v2.0)
# Email Service (SendGrid, Resend, etc.)
# EMAIL_API_KEY=
# EMAIL_FROM=

# WhatsApp Service (Twilio)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_WHATSAPP_NUMBER=
```

### Generar NEXTAUTH_SECRET

```bash
# Opción 1: Con OpenSSL
openssl rand -base64 32

# Opción 2: Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online
# https://generate-secret.vercel.app/32
```

**IMPORTANTE:** Cada entorno debe tener su propio NEXTAUTH_SECRET

---

## 🚀 Deploy en Vercel (Paso a Paso)

### Preparación Previa

1. **Subir código a GitHub:**
   ```bash
   cd C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp

   # Inicializar git si no está
   git init

   # Agregar .gitignore si no existe
   echo "node_modules" >> .gitignore
   echo ".env*" >> .gitignore
   echo ".next" >> .gitignore
   echo "out" >> .gitignore

   # Commit inicial
   git add .
   git commit -m "feat: initial commit - webapp odontologia v1.0"

   # Crear repo en GitHub y conectar
   # (desde GitHub.com: New Repository)
   git remote add origin https://github.com/TU-USUARIO/webapp-odontologia.git
   git branch -M main
   git push -u origin main
   ```

2. **Verificar build local:**
   ```bash
   npm run build
   # Debe completar sin errores
   ```

### Deploy en Vercel

1. **Crear cuenta en Vercel:**
   - Ir a https://vercel.com/signup
   - Sign up con GitHub (recomendado)

2. **Importar proyecto:**
   - Click "Add New..." → "Project"
   - Seleccionar repositorio de GitHub
   - Click "Import"

3. **Configurar proyecto:**
   - **Framework Preset:** Next.js (auto-detectado)
   - **Root Directory:** `./` (o `webapp` si está en subcarpeta)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Agregar Variables de Entorno:**
   - Antes de deploy, click "Environment Variables"
   - Agregar una por una:
     ```
     SUPABASE_URL = https://tu-proyecto-prod.supabase.co
     SUPABASE_ANON_KEY = tu-clave-anon-de-produccion
     NEXTAUTH_URL = https://tu-proyecto.vercel.app
     NEXTAUTH_SECRET = tu-secret-generado
     ```
   - Aplicar a: Production

5. **Deploy:**
   - Click "Deploy"
   - Esperar 2-5 minutos
   - ✅ Deploy completo

6. **Probar:**
   - Vercel te dará una URL: `https://tu-proyecto.vercel.app`
   - Probar login, crear turno, etc.

### Deploys Automáticos

Cada vez que hagas `git push` a la rama `main`:
- Vercel detecta el cambio
- Ejecuta build automáticamente
- Deploy si el build es exitoso
- Te notifica por email

---

## 🌐 Configuración de Dominio

### Opción 1: Usar subdominio de Vercel (Gratis)

Ya tienes: `https://webapp-odontologia.vercel.app`

**Pros:**
- ✅ Gratis
- ✅ SSL automático
- ✅ Listo para usar

**Cons:**
- ⚠️ No es tu marca

### Opción 2: Dominio Custom (Recomendado)

**Comprar dominio:**
- Namecheap: $10-15/año
- GoDaddy: $15-20/año
- Google Domains: $12/año
- NIC.ar (para .com.ar): $300 ARS/año

**Conectar dominio a Vercel:**

1. **En Vercel:**
   - Project Settings → Domains
   - Add Domain: `tudominio.com`
   - Vercel te dará registros DNS

2. **En tu registrador de dominio:**
   - Agregar registros CNAME o A:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com

     Type: A
     Name: @
     Value: 76.76.21.21
     ```

3. **Esperar propagación:**
   - 10 minutos a 48 horas
   - SSL se configura automáticamente

4. **Actualizar NEXTAUTH_URL:**
   - En variables de entorno de Vercel
   - Cambiar a: `https://tudominio.com`
   - Redeploy

---

## 📊 Monitoreo y Mantenimiento

### Analytics

**Vercel Analytics (Recomendado):**
- Gratis hasta 100k eventos/mes
- Integración automática
- Dashboard → Analytics

**Google Analytics:**
```bash
# Instalar
npm install @next/third-parties

# En app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### Logging y Errores

**Sentry (Recomendado):**
- Captura errores automáticamente
- Plan gratuito: 5k eventos/mes
- https://sentry.io

```bash
# Instalar
npm install @sentry/nextjs

# Configurar
npx @sentry/wizard -i nextjs
```

### Backups

**Base de Datos (Supabase):**
- Plan Free: Backups automáticos por 7 días
- Plan Pro: Backups automáticos por 30 días
- Manual: SQL Editor → Export Database

**Código:**
- GitHub es tu backup
- Tags para versiones: `git tag v1.0.0`

---

## 💰 Costos Estimados

### Setup Inicial (Mes 1)

| Servicio | Plan | Costo |
|----------|------|-------|
| Hosting (Vercel) | Free | $0 |
| Base de Datos (Supabase) | Free | $0 |
| Dominio | .com | $10-15 (anual) |
| SSL | Incluido | $0 |
| **TOTAL MES 1** | | **$1-2/mes** |

### Costos Mensuales (Producción Ligera)

**Escenario: 10 profesionales, 500 turnos/mes**

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Vercel | Free | $0 |
| Supabase | Free | $0 |
| Dominio | Prorrateo | $1-2 |
| **TOTAL** | | **$1-2/mes** |

### Costos al Escalar (50+ profesionales)

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Dominio | Prorrateo | $1-2 |
| **TOTAL** | | **~$46/mes** |

### Costos Versión 2.0 (Con Notificaciones)

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| SendGrid (Email) | Free | $0 (100 emails/día) |
| Twilio (WhatsApp) | Pay-as-go | $0.005/msg (~$5-50) |
| Dominio | Prorrateo | $1-2 |
| **TOTAL** | | **$51-96/mes** |

---

## ✅ Checklist Final Pre-Deploy

### Código
- [ ] Build de producción exitoso localmente
- [ ] Sin console.logs innecesarios
- [ ] Sin errores de TypeScript
- [ ] Sin warnings críticos
- [ ] .env.local NO commiteado

### Supabase
- [ ] Proyecto de producción creado
- [ ] Schema aplicado
- [ ] RLS policies habilitadas
- [ ] Credenciales copiadas

### GitHub
- [ ] Repositorio creado
- [ ] Código pusheado
- [ ] .gitignore correcto
- [ ] README actualizado

### Vercel
- [ ] Proyecto importado
- [ ] Variables de entorno configuradas
- [ ] NEXTAUTH_SECRET generado (fuerte)
- [ ] Build exitoso

### Testing Post-Deploy
- [ ] Login profesional funciona
- [ ] Login paciente funciona
- [ ] Crear turno funciona
- [ ] Dashboard con gráficos carga
- [ ] Código QR funciona
- [ ] Registro de paciente por QR funciona
- [ ] Todas las páginas cargan

### Opcional
- [ ] Dominio custom configurado
- [ ] Analytics configurado
- [ ] Monitoreo de errores (Sentry)
- [ ] Backup strategy definido

---

## ❓ FAQ - Preguntas Frecuentes

### ¿Necesito tarjeta de crédito?

**Para empezar: NO**
- Vercel Free: No requiere tarjeta
- Supabase Free: No requiere tarjeta
- Solo necesitas para dominio custom

### ¿Cuántos usuarios soporta el plan gratuito?

**Estimado conservador:**
- 20-50 profesionales
- 1000-2000 turnos/mes
- 100-200 pacientes por profesional

**Límites reales:**
- Supabase: 50k filas (puedes tener 10k turnos fácilmente)
- Vercel: 100GB bandwidth (suficiente para miles de visitas)

### ¿Qué pasa si supero los límites gratuitos?

**Supabase:**
- Te notifica por email
- Proyecto se pausa temporalmente
- Upgrade a Pro ($25/mes)

**Vercel:**
- Te notifica por email
- Puedes seguir sirviendo con límite reducido
- Upgrade a Pro ($20/mes)

### ¿Puedo cambiar de Vercel a otro hosting después?

**SÍ, totalmente.**
- Es Next.js estándar
- Puedes exportar y mover a:
  - Netlify
  - Railway
  - AWS
  - Tu propio servidor
- Solo cambias variables de entorno

### ¿Los datos están seguros?

**SÍ:**
- Supabase está en AWS con backups automáticos
- SSL/HTTPS obligatorio
- RLS policies protegen datos
- Contraseñas hasheadas con bcrypt
- Cumple con estándares de seguridad

### ¿Necesito saber DevOps?

**NO para Vercel:**
- Todo automático
- Zero configuration
- Deploy con un click

**SÍ para AWS/Azure:**
- Requiere conocimientos avanzados
- No recomendado para empezar

### ¿Cómo hago updates después del deploy?

**Súper simple:**
```bash
# 1. Hacer cambios en el código
# 2. Commit
git add .
git commit -m "fix: corregir bug en dashboard"

# 3. Push
git push

# 4. Vercel auto-deploya
# ✅ Listo en 2 minutos
```

### ¿Puedo tener staging y producción?

**SÍ, con Vercel:**
- `main` branch → Producción
- `develop` branch → Staging
- Preview deployments automáticos
- Variables de entorno por ambiente

### ¿Qué pasa si Vercel cae?

**Uptime de Vercel: 99.99%**
- Incidents muy raros
- Puedes ver status: https://vercel-status.com
- Si cae, puedes cambiar DNS a otro hosting rápidamente

### ¿Cómo escalo a 1000 profesionales?

**Necesitarás:**
1. Upgrade Vercel Pro ($20/mes)
2. Upgrade Supabase Pro o Team ($25-599/mes)
3. Potencialmente CDN adicional
4. Monitoreo profesional
5. Considerar multi-región

**Pero para 1000 profesionales, estarás facturando lo suficiente para pagar esto fácilmente**

### ¿Cómo monetizo esto?

**Opciones:**
1. **SaaS - Subscripción mensual:**
   - $10-30/mes por profesional
   - Con Stripe o Mercado Pago

2. **One-time purchase:**
   - $200-500 por instalación
   - Deploy privado para cada cliente

3. **Freemium:**
   - Básico gratis
   - Premium con features avanzadas

4. **White-label:**
   - Vender a empresas de software dental
   - Personalización por cliente

---

## 📞 Soporte Post-Deploy

### Si algo falla:

1. **Revisar logs en Vercel:**
   - Dashboard → Deployment → View Function Logs

2. **Revisar logs en Supabase:**
   - Dashboard → Logs

3. **Errores comunes:**
   - Variables de entorno mal configuradas
   - NEXTAUTH_URL incorrecto
   - Schema no aplicado en DB de producción

### Recursos útiles:

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Community: Discord de Next.js, Supabase

---

## 🎯 Siguiente Paso

**¿Listo para deploy?**

1. Probar todo localmente primero (ver TESTING_COMPLETO_V1.md)
2. Crear proyecto Supabase de producción
3. Subir código a GitHub
4. Deploy en Vercel
5. Probar en producción
6. ¡Lanzar! 🚀

**¿Tienes más preguntas?**
Pregunta todo lo que necesites saber antes de hacer el deploy.

---

**Guía creada:** 23 de Enero 2026
**Versión:** 1.0
**Para:** WebApp Odontología

# 🚀 Guía de Deploy en Vercel

Esta guía te llevará paso a paso para deployar tu aplicación de gestión odontológica en Vercel.

---

## ✅ Pre-requisitos

Antes de empezar, asegúrate de tener:

- ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
- ✅ Cuenta en [GitHub](https://github.com) (gratis)
- ✅ Proyecto Supabase configurado y funcionando
- ✅ API Key de Resend para notificaciones
- ✅ Código en un repositorio de Git

---

## 📋 Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git (si no lo hiciste)

```bash
cd C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp
git init
git add .
git commit -m "Initial commit - WebApp Odontología"
```

### 1.2 Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (ej: `webapp-odontologia`)
3. **NO** inicialices con README, .gitignore o licencia

### 1.3 Subir el Código

```bash
git remote add origin https://github.com/TU_USUARIO/webapp-odontologia.git
git branch -M main
git push -u origin main
```

---

## 🔧 Paso 2: Aplicar Migración de Base de Datos

**IMPORTANTE:** Antes de deployar, ejecuta la migración de notificaciones en Supabase.

1. Ve a tu dashboard de Supabase
2. Navega a **SQL Editor**
3. Copia el contenido de `database/migration-notifications.sql`
4. Ejecuta el script
5. Verifica que la tabla `notifications` exista:

```sql
SELECT * FROM notifications LIMIT 1;
```

---

## 🎯 Paso 3: Deployar en Vercel

### 3.1 Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **Import Git Repository**
3. Selecciona tu repositorio de GitHub
4. Haz clic en **Import**

### 3.2 Configurar el Proyecto

**Framework Preset:** Next.js (detectado automáticamente)

**Root Directory:** `./` (dejar por defecto)

**Build Command:** `npm run build` (por defecto)

**Output Directory:** `.next` (por defecto)

### 3.3 Configurar Variables de Entorno

Antes de hacer el deploy, agrega todas las variables de entorno:

1. En la página de import, expande **Environment Variables**
2. Agrega las siguientes variables:

#### Variables de Supabase

```
NEXT_PUBLIC_SUPABASE_URL
Valor: https://fewfewlmbaqgbxzzlrjx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: (tu anon key de Supabase)

SUPABASE_SERVICE_ROLE_KEY
Valor: (tu service role key de Supabase)
```

#### Variables de NextAuth

```
NEXTAUTH_SECRET
Valor: (tu secret actual o genera uno nuevo con: openssl rand -base64 32)

NEXTAUTH_URL
Valor: https://tu-app.vercel.app
(Vercel te dará este URL después del primer deploy)
```

#### Variable de Base URL

```
NEXT_PUBLIC_BASE_URL
Valor: https://tu-app.vercel.app
(Usar el mismo que NEXTAUTH_URL)
```

#### Variable de Resend

```
RESEND_API_KEY
Valor: re_tu_api_key_de_resend
```

### 3.4 Deploy Inicial

1. Haz clic en **Deploy**
2. Espera 2-3 minutos mientras Vercel construye y deploya tu app
3. ✅ Una vez completado, verás el URL de tu aplicación

---

## 🔄 Paso 4: Actualizar Variables de Entorno

Después del primer deploy, Vercel te asigna un URL (ej: `webapp-odontologia.vercel.app`).

Debes actualizar dos variables:

1. Ve a tu proyecto en Vercel
2. Navega a **Settings → Environment Variables**
3. Edita estas variables con tu URL real:

```
NEXTAUTH_URL = https://webapp-odontologia.vercel.app
NEXT_PUBLIC_BASE_URL = https://webapp-odontologia.vercel.app
```

4. Haz un **Redeploy** para aplicar los cambios:
   - Ve a **Deployments**
   - Haz clic en los 3 puntos del último deployment
   - Selecciona **Redeploy**

---

## ✅ Paso 5: Verificar el Deploy

### 5.1 Acceder a la Aplicación

1. Visita tu URL de Vercel: `https://tu-app.vercel.app`
2. Deberías ver la página de login

### 5.2 Probar Funcionalidades Críticas

- ✅ Login profesional
- ✅ Login paciente
- ✅ Dashboard profesional (estadísticas, gráficos)
- ✅ Crear turnos
- ✅ Ver pacientes
- ✅ Enviar notificaciones
- ✅ Generar QR (debe mostrar el URL de producción)
- ✅ Registro de paciente desde QR

### 5.3 Verificar QR Code

1. Ve a Dashboard Profesional → QR
2. El QR debe mostrar: `https://tu-app.vercel.app/auth/register/patient?professional=tu-slug`
3. Escanea el QR con tu móvil
4. Debe abrir la página de registro correctamente

---

## 🎨 Paso 6: Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: `turnos.tudominio.com`):

1. Ve a **Settings → Domains**
2. Haz clic en **Add Domain**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS
5. Una vez verificado, actualiza las variables:
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_BASE_URL`

---

## 🔐 Paso 7: Configuración de Seguridad

### 7.1 RLS en Supabase

Actualmente RLS está deshabilitado. Para habilitarlo en producción:

1. Ve a Supabase Dashboard
2. Ejecuta las políticas de `RLS_POLICIES.sql`
3. Prueba que todo siga funcionando
4. Ver `NOTA_RLS_PRODUCCION.md` para más detalles

### 7.2 Variables de Entorno Seguras

- ✅ NUNCA subas `.env.local` a Git (ya está en .gitignore)
- ✅ Usa secretos diferentes para dev y prod
- ✅ Regenera NEXTAUTH_SECRET para producción
- ✅ No compartas las service role keys

---

## 📊 Paso 8: Monitoreo

### 8.1 Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Navega a **Analytics**
3. Activa el plan gratuito
4. Verás:
   - Visitas
   - Performance
   - Web Vitals

### 8.2 Logs

Para ver errores y logs:

1. Ve a **Deployments**
2. Haz clic en un deployment
3. Ve a la pestaña **Functions**
4. Revisa los logs de cada función

### 8.3 Resend Dashboard

Monitorea tus emails en:
- [https://resend.com/emails](https://resend.com/emails)

---

## 🔄 Paso 9: Deployments Automáticos

Vercel hace deploy automático en cada push a tu rama principal.

### Workflow

```bash
# Hacer cambios en local
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin main

# Vercel detecta el push y hace deploy automático
# Recibirás notificación por email cuando termine
```

### Preview Deployments

Para probar cambios sin afectar producción:

1. Crea una rama:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Haz cambios y push:
```bash
git push origin feature/nueva-funcionalidad
```

3. Vercel crea un **Preview Deployment** con URL única
4. Prueba los cambios
5. Si está OK, merge a main:
```bash
git checkout main
git merge feature/nueva-funcionalidad
git push origin main
```

---

## 🐛 Troubleshooting

### Build Failed

**Error:** `Module not found` o `Type error`

**Solución:**
```bash
# Limpia y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build

# Si funciona en local, haz commit y push
```

### Variables de Entorno No Funcionan

**Síntomas:**
- Supabase no conecta
- NextAuth no funciona
- Emails no se envían

**Solución:**
1. Verifica que todas las variables estén en Vercel Dashboard
2. Las variables con `NEXT_PUBLIC_` deben tener ese prefijo
3. Después de cambiar variables, haz un Redeploy

### QR Muestra localhost

**Problema:** El QR sigue mostrando `http://localhost:3000`

**Solución:**
1. Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado en Vercel
2. Haz un Redeploy
3. Limpia caché del navegador

### Emails No Se Envían en Producción

**Problema:** Las notificaciones fallan en producción

**Solución:**
1. Verifica que `RESEND_API_KEY` esté en Vercel
2. Revisa los logs en Vercel Functions
3. Verifica el dashboard de Resend para ver errores

---

## 📝 Checklist de Deploy

Usa este checklist antes de considerar el deploy como completo:

- [ ] Código en repositorio de GitHub
- [ ] Migración de base de datos ejecutada en Supabase
- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Primer deploy exitoso
- [ ] URLs de producción actualizados (NEXTAUTH_URL, BASE_URL)
- [ ] Redeploy con URLs correctos
- [ ] Login profesional funciona
- [ ] Login paciente funciona
- [ ] Dashboard carga correctamente
- [ ] Turnos se pueden crear
- [ ] Notificaciones se envían correctamente
- [ ] QR muestra URL de producción
- [ ] QR escaneable desde móvil funciona
- [ ] Registro de paciente desde QR funciona
- [ ] Todos los links internos funcionan
- [ ] Responsive design verificado en móvil
- [ ] Performance acceptable (< 3s carga inicial)

---

## 🎓 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/projects/domains)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard
2. Revisa la consola del navegador (F12)
3. Verifica las variables de entorno
4. Contacta al equipo de soporte de Vercel

---

**Última actualización:** 24 de Enero 2026

**¡Felicitaciones! Tu app está en producción 🎉**

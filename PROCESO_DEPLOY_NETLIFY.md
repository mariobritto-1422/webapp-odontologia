# 🚀 Proceso de Deploy en Netlify - Paso a Paso

## ✅ Lo que ya está listo:

1. ✅ Código en GitHub actualizado
2. ✅ Archivo `netlify.toml` configurado
3. ✅ Supabase funcionando con todas las tablas
4. ✅ API Key de Resend lista

---

## 🎯 Ahora solo necesitas:

### Paso 1: Ir a Netlify
👉 https://app.netlify.com

**Si no tienes cuenta:**
- Click en "Sign up"
- Usa tu cuenta de GitHub para registrarte (es más rápido)

---

### Paso 2: Crear nuevo sitio

1. Click en **"Add new site"** (botón verde)
2. Selecciona **"Import an existing project"**
3. Click en **"Deploy with GitHub"**
4. Autoriza a Netlify si te lo pide
5. Busca y selecciona: **`mariobritto-1422/webapp-odontologia`**

---

### Paso 3: Configurar el proyecto

Netlify detectará automáticamente:
- **Framework:** Next.js
- **Build command:** `npm run build`
- **Publish directory:** `.next`

**¡NO HAGAS CLICK EN DEPLOY TODAVÍA!**

---

### Paso 4: Agregar Variables de Entorno

Antes de deploy, busca la sección **"Environment variables"** y click en **"Add environment variables"**.

Copia y pega estas 7 variables (una por una):

#### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://truczkguokmaztnlrcku.supabase.co
```

#### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWN6a2d1b2ttYXp0bmxyY2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNDYzNDcsImV4cCI6MjA4NDgyMjM0N30.C4_heAJr33xISwTHDiw4aakOHrILzIb59lQ0kzmlGbg
```

#### Variable 3:
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWN6a2d1b2ttYXp0bmxyY2t1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NjM0NywiZXhwIjoyMDg0ODIyMzQ3fQ.yT6MnIdmEDC2Cp5nwQYSrvXifvLi4XpyVLg7Egj4Rw8
```

#### Variable 4:
```
Key: NEXTAUTH_SECRET
Value: fetndn3lQHT1NaIeig8JE76LXMrskhKwP59+KipLRVI=
```

#### Variable 5:
```
Key: NEXTAUTH_URL
Value: https://placeholder.netlify.app
```
*Nota: Esto lo actualizaremos después con tu URL real*

#### Variable 6:
```
Key: NEXT_PUBLIC_BASE_URL
Value: https://placeholder.netlify.app
```
*Nota: Esto lo actualizaremos después con tu URL real*

#### Variable 7:
```
Key: RESEND_API_KEY
Value: re_eM5D8G3K_7MxApb2mbgEgKXyRbQgoBZEH
```

---

### Paso 5: Deploy

1. Una vez agregadas las 7 variables, click en **"Deploy"**
2. Espera 3-5 minutos mientras Netlify construye tu app
3. 🎉 Una vez completado, tendrás tu URL (ejemplo: `https://nombre-aleatorio-123.netlify.app`)

---

### Paso 6: Actualizar URLs (IMPORTANTE)

Después del primer deploy:

1. Copia tu URL de Netlify
2. En Netlify, ve a: **"Site settings"** → **"Environment variables"**
3. Edita estas 2 variables con tu URL real:
   - `NEXTAUTH_URL` → Reemplaza con tu URL
   - `NEXT_PUBLIC_BASE_URL` → Reemplaza con tu URL
4. Guarda los cambios
5. Ve a **"Deploys"** → Click en **"Trigger deploy"** → **"Clear cache and deploy"**
6. Espera 2-3 minutos

---

### Paso 7: Configurar URLs en Supabase

1. Ve a: https://supabase.com/dashboard/project/truczkguokmaztnlrcku
2. Click en **"Authentication"** (menú izquierdo)
3. Click en **"URL Configuration"**
4. En **"Site URL"**, pega tu URL de Netlify
5. En **"Redirect URLs"**, agrega estas 2 líneas (reemplaza con tu URL):
   ```
   https://TU-URL.netlify.app/api/auth/callback/credentials
   https://TU-URL.netlify.app/*
   ```
6. Click en **"Save"**

---

## 🎉 ¡Listo!

Tu app está en producción. Abre tu URL de Netlify y deberías ver la pantalla de login.

---

## 🧪 Probar la App

1. Abre tu URL de Netlify
2. Click en "Registrarse como Profesional"
3. Completa el formulario
4. Ingresa al dashboard
5. ¡Explora tu app en producción!

---

## 📱 Próximos Pasos (Opcional)

### Cambiar el nombre del sitio
1. En Netlify: **"Site settings"** → **"Site details"**
2. Click en **"Change site name"**
3. Elige un nombre personalizado (ejemplo: `mi-odonto-app`)
4. Tu nueva URL será: `https://mi-odonto-app.netlify.app`
5. **Recuerda actualizar las URLs en variables de entorno y Supabase**

### Configurar dominio personalizado
1. En Netlify: **"Site settings"** → **"Domain management"**
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar DNS

---

## 🐛 Si algo no funciona:

1. Verifica que las 7 variables estén configuradas correctamente
2. Asegúrate de haber actualizado las URLs después del primer deploy
3. Revisa los logs del deploy en Netlify: **"Deploys"** → Click en el último deploy → Ver logs

---

## 📞 ¿Necesitas ayuda?

Avísame en qué paso estás y te ayudo a continuar.

---

**Fecha:** 24 de Enero 2026
**Plataforma:** Netlify
**Tiempo estimado total:** 10-15 minutos

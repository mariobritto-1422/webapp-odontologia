# 🚀 Guía de Deploy en Netlify

## 📋 Prerequisitos

- ✅ Código en GitHub: https://github.com/mariobritto-1422/webapp-odontologia
- ✅ Cuenta de Netlify (crear en https://netlify.com)
- ✅ Supabase configurado
- ✅ API Key de Resend

---

## 🎯 Opción 1: Deploy desde la Web (Recomendado)

### Paso 1: Crear sitio en Netlify

1. Ve a https://app.netlify.com
2. Click en "Add new site" → "Import an existing project"
3. Selecciona "GitHub"
4. Autoriza a Netlify a acceder a tu GitHub
5. Busca y selecciona: `mariobritto-1422/webapp-odontologia`
6. Netlify detectará automáticamente que es un proyecto Next.js

### Paso 2: Configurar el Build

Netlify debería detectar automáticamente:
- **Build command:** `npm run build`
- **Publish directory:** `.next`

Si no, configúralo manualmente.

### Paso 3: Configurar Variables de Entorno

Antes de hacer el deploy, click en "Advanced" → "New variable" y agrega estas 7 variables:

```
1. NEXT_PUBLIC_SUPABASE_URL
   = https://truczkguokmaztnlrcku.supabase.co

2. NEXT_PUBLIC_SUPABASE_ANON_KEY
   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWN6a2d1b2ttYXp0bmxyY2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNDYzNDcsImV4cCI6MjA4NDgyMjM0N30.C4_heAJr33xISwTHDiw4aakOHrILzIb59lQ0kzmlGbg

3. SUPABASE_SERVICE_ROLE_KEY
   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWN6a2d1b2ttYXp0bmxyY2t1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI0NjM0NywiZXhwIjoyMDg0ODIyMzQ3fQ.yT6MnIdmEDC2Cp5nwQYSrvXifvLi4XpyVLg7Egj4Rw8

4. NEXTAUTH_SECRET
   = fetndn3lQHT1NaIeig8JE76LXMrskhKwP59+KipLRVI=

5. NEXTAUTH_URL
   = https://TU-SITIO.netlify.app
   (Nota: Después del primer deploy, actualiza esto con tu URL real)

6. NEXT_PUBLIC_BASE_URL
   = https://TU-SITIO.netlify.app
   (Nota: Después del primer deploy, actualiza esto con tu URL real)

7. RESEND_API_KEY
   = re_eM5D8G3K_7MxApb2mbgEgKXyRbQgoBZEH
```

### Paso 4: Deploy

1. Click en "Deploy site"
2. Espera 3-5 minutos mientras Netlify construye la app
3. Una vez completado, verás tu URL (ejemplo: `https://nombre-aleatorio-123.netlify.app`)

### Paso 5: Actualizar URLs

1. Copia tu URL de Netlify
2. Ve a "Site settings" → "Environment variables"
3. Edita `NEXTAUTH_URL` y `NEXT_PUBLIC_BASE_URL` con tu URL real
4. Click en "Deploys" → "Trigger deploy" → "Clear cache and deploy"

---

## 🎯 Opción 2: Deploy con Netlify CLI

### Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Login en Netlify

```bash
netlify login
```

### Deploy

```bash
# Desde la carpeta webapp
cd ClaudeProjects/WebApp-Odontologia/webapp

# Build local
npm run build

# Deploy
netlify deploy --prod

# Sigue las instrucciones para vincular con tu sitio
```

---

## 🔧 Configuración de Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Ve a "Site settings" → "Domain management"
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar los DNS
4. Actualiza `NEXTAUTH_URL` y `NEXT_PUBLIC_BASE_URL` con tu dominio

---

## ⚙️ Configurar en Supabase

Una vez que tengas tu URL de Netlify, configura las URLs permitidas:

1. Ve a https://supabase.com/dashboard/project/truczkguokmaztnlrcku
2. Navega a "Authentication" → "URL Configuration"
3. En "Site URL", agrega: `https://tu-sitio.netlify.app`
4. En "Redirect URLs", agrega:
   - `https://tu-sitio.netlify.app/api/auth/callback/credentials`
   - `https://tu-sitio.netlify.app/*`

---

## 📊 Verificar el Deploy

1. Abre tu URL de Netlify
2. Deberías ver la pantalla de login
3. Prueba crear un usuario profesional
4. Verifica que todo funcione correctamente

---

## 🐛 Troubleshooting

### Error: "NEXTAUTH_URL is not set"
- Verifica que hayas configurado `NEXTAUTH_URL` en las variables de entorno
- Asegúrate de haber hecho un redeploy después de agregar las variables

### Error: "Supabase connection failed"
- Verifica que las URLs y Keys de Supabase sean correctas
- Asegúrate de que las URLs permitidas estén configuradas en Supabase

### Error: "Build failed"
- Revisa los logs del build en Netlify
- Verifica que todas las dependencias estén en `package.json`

---

## 🔗 Links Útiles

- **Netlify Dashboard:** https://app.netlify.com
- **Netlify Docs:** https://docs.netlify.com
- **Next.js on Netlify:** https://docs.netlify.com/frameworks/next-js/

---

## ✅ Checklist de Deploy

- [ ] Sitio creado en Netlify
- [ ] Repositorio GitHub vinculado
- [ ] 7 variables de entorno configuradas
- [ ] Primer deploy completado
- [ ] URLs actualizadas (NEXTAUTH_URL y NEXT_PUBLIC_BASE_URL)
- [ ] Segundo deploy (con URLs correctas)
- [ ] URLs configuradas en Supabase
- [ ] Prueba de login exitosa
- [ ] App funcionando en producción

---

**Fecha:** 24 de Enero 2026
**Plataforma:** Netlify
**Tipo:** Deploy de producción

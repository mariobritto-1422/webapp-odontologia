# 🚀 Guía Completa de Deploy en Netlify Pro

## ✅ Deploy Exitoso - WebApp Odontología

**📅 Fecha del Deploy:** 25 de Enero 2026
**🌐 URL de Producción:** https://thriving-lolly-96b349.netlify.app
**✅ Estado:** FUNCIONANDO COMPLETAMENTE

Esta guía documenta el proceso exacto que se siguió para deployar exitosamente la aplicación en Netlify Pro.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta de Netlify Pro activa
- ✅ Código en GitHub (https://github.com/mariobritto-1422/webapp-odontologia)
- ✅ Proyecto de Supabase configurado
- ✅ API Key de Resend
- ✅ Node.js y npm instalados localmente

---

## 🔧 Paso 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

Verifica la instalación:
```bash
netlify --version
```

---

## 🔐 Paso 2: Autenticarse en Netlify

Desde el directorio del proyecto:

```bash
cd webapp
netlify login
```

Esto abrirá tu navegador para autenticarte. Una vez completado, verifica tu cuenta:

```bash
netlify status
```

Deberías ver tu nombre y email de Netlify.

---

## 🔗 Paso 3: Vincular el Proyecto

Si ya tienes un sitio de Netlify creado:

```bash
netlify link --id TU-SITE-ID
```

O lista tus sitios existentes:

```bash
netlify sites:list
```

En nuestro caso, vinculamos el sitio `thriving-lolly-96b349`:

```bash
netlify link --id a2b3e0e2-e600-460e-a6f5-ca21e95634ad
```

---

## 🔑 Paso 4: Configurar Variables de Entorno

Configura las 7 variables de entorno necesarias:

```bash
# Supabase
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://fewfewlmbaqgbxzzlrjx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "sb_publishable_PMnbfgaMSd8Ut8gLwxYLVg_-PGx5Haf"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "sb_secret_vjj3nKBczA9HuAElGWzVlQ_XLd_tmxN"

# NextAuth
netlify env:set NEXTAUTH_SECRET "fetndn3lQHT1NaIeig8JE76LXMrskhKwP59+KipLRVI="
netlify env:set NEXTAUTH_URL "https://thriving-lolly-96b349.netlify.app"

# Base URL
netlify env:set NEXT_PUBLIC_BASE_URL "https://thriving-lolly-96b349.netlify.app"

# Resend
netlify env:set RESEND_API_KEY "re_eM5D8G3K_7MxApb2mbgEgKXyRbQgoBZEH"
```

**Importante:** Reemplaza las URLs con tu URL específica de Netlify.

---

## 📝 Paso 5: Configurar netlify.toml

Crea o verifica el archivo `netlify.toml` en la raíz del proyecto:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build]
  command = "npm run build"
```

**Nota Importante:** NO agregues `publish = ".next"` ni `NEXT_PRIVATE_TARGET`. Estas configuraciones causan errores con Next.js 16.

---

## 🔧 Paso 6: Configurar NextAuth para Producción

**CRÍTICO:** NextAuth v5 requiere `trustHost: true` en plataformas como Netlify.

En `lib/auth.ts`, asegúrate de tener:

```typescript
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true, // ← CRÍTICO para Netlify/Vercel
  providers: [
    // ... tus providers
  ],
  // ... resto de configuración
})
```

---

## 🚀 Paso 7: Deploy a Producción

Ejecuta el deploy:

```bash
netlify deploy --prod
```

Este comando:
1. Ejecuta `npm run build`
2. Genera las páginas estáticas y dinámicas
3. Empaqueta las funciones serverless
4. Empaqueta las edge functions
5. Sube todo a Netlify
6. Publica en producción

**Tiempo aproximado:** 1-2 minutos

---

## 🔧 Paso 8: Configurar Supabase

### 8.1 Redirect URLs

Ve a: Supabase Dashboard → Authentication → URL Configuration

En **Redirect URLs**, agrega estas 6 URLs:

```
http://localhost:3000/*
http://localhost:3000/api/auth/callback/credentials
http://localhost:3000/auth/login
https://thriving-lolly-96b349.netlify.app/*
https://thriving-lolly-96b349.netlify.app/api/auth/callback/credentials
https://thriving-lolly-96b349.netlify.app/auth/login
```

**Nota:** Si ves el mensaje "URL already exists in the allow list", significa que ya están configuradas. ¡Perfecto!

### 8.2 Site URL

Intenta configurar (si te deja):
```
https://thriving-lolly-96b349.netlify.app
```

Si no te permite editarlo, no es crítico.

---

## ✅ Paso 9: Verificar el Deploy

### 9.1 Verificar que el sitio carga

Abre: https://thriving-lolly-96b349.netlify.app

### 9.2 Probar el registro

Ve a: https://thriving-lolly-96b349.netlify.app/auth/register/professional

Completa el formulario y regístrate.

### 9.3 Probar el login

Ve a: https://thriving-lolly-96b349.netlify.app/auth/login

Ingresa con las credenciales que acabas de crear.

### 9.4 Endpoints de debug

- **Test Supabase:** `/api/test-supabase` - Debe mostrar `{"success":true}`
- **Check ENV:** `/api/check-env` - Debe mostrar las variables configuradas
- **Test Login:** `/api/test-login` - Endpoint de debug de autenticación

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "Server error" en las páginas

**Causa:** Configuración incorrecta de `netlify.toml`
**Solución:** Remover `publish = ".next"` y `NEXT_PRIVATE_TARGET`

### Problema 2: Login no funciona

**Causa:** Falta `trustHost: true` en NextAuth
**Solución:** Agregar `trustHost: true` en `lib/auth.ts`

### Problema 3: "URL already exists" en Supabase

**Causa:** URLs ya configuradas previamente
**Solución:** No duplicarlas, mantener las existentes

### Problema 4: Variables de entorno no se cargan

**Causa:** Variables no configuradas o mal escritas
**Solución:** Verificar con `netlify env:list` y reconfigurar si es necesario

---

## 📊 Estructura del Deploy

El deploy genera:

- **38 páginas** (estáticas y dinámicas)
- **21 API endpoints**
- **1 Middleware** (Edge Function para autenticación)
- **1 Server Handler** (Función serverless para Next.js)

### Build Output:

```
Route (app)
├── ○ / (static)
├── ○ /auth/login (static)
├── ○ /auth/register/professional (static)
├── ƒ /api/auth/[...nextauth] (dynamic)
├── ƒ /dashboard/professional (dynamic)
└── ... 33 rutas más
```

---

## 🔄 Deployar Cambios Futuros

Cada vez que hagas cambios:

```bash
# 1. Commit y push a GitHub
git add .
git commit -m "Descripción del cambio"
git push

# 2. Deploy a producción
netlify deploy --prod
```

O configura **deploys automáticos** desde GitHub:
- En Netlify Dashboard → Site settings → Build & deploy
- Conecta tu repositorio de GitHub
- Cada push a `main` deployará automáticamente

---

## 📱 Personalización (Opcional)

### Cambiar nombre del sitio

En Netlify Dashboard:
- Site settings → Site details → Change site name
- Ejemplo: cambiar `thriving-lolly-96b349` por `mi-consultorio-odonto`

**IMPORTANTE:** Si cambias el nombre, actualiza:
1. Variables de entorno `NEXTAUTH_URL` y `NEXT_PUBLIC_BASE_URL`
2. Redirect URLs en Supabase
3. Redeploya con `netlify deploy --prod`

### Agregar dominio personalizado

En Netlify Dashboard:
- Site settings → Domain management
- Add custom domain
- Sigue las instrucciones de DNS

---

## 📈 Métricas del Deploy

- **Tiempo de build:** ~1 minuto
- **Tiempo de deploy:** ~1-2 minutos
- **Tiempo total:** ~2-3 minutos
- **Tamaño del bundle:** Optimizado por Next.js
- **Edge locations:** Global CDN de Netlify

---

## 🔗 Links Útiles

- **Netlify Dashboard:** https://app.netlify.com/sites/thriving-lolly-96b349
- **Build Logs:** https://app.netlify.com/projects/thriving-lolly-96b349/deploys
- **Function Logs:** https://app.netlify.com/projects/thriving-lolly-96b349/logs/functions
- **GitHub Repo:** https://github.com/mariobritto-1422/webapp-odontologia
- **Supabase Dashboard:** https://supabase.com/dashboard/project/fewfewlmbaqgbxzzlrjx

---

## ✅ Checklist de Deploy

Antes de cada deploy, verifica:

- [ ] Código commiteado y pusheado a GitHub
- [ ] Variables de entorno configuradas
- [ ] `netlify.toml` correcto (sin `publish` ni `NEXT_PRIVATE_TARGET`)
- [ ] `trustHost: true` en `lib/auth.ts`
- [ ] Redirect URLs configuradas en Supabase
- [ ] Build local exitoso (`npm run build`)

---

## 🎯 Deploy Alternativo: Desde la Web (Sin CLI)

Si prefieres no usar CLI:

1. Ve a https://app.netlify.com
2. Click en "Add new site" → "Import an existing project"
3. Selecciona GitHub y autoriza
4. Busca `mariobritto-1422/webapp-odontologia`
5. Configura variables de entorno antes del deploy
6. Click en "Deploy site"

---

**🎉 ¡Deploy Exitoso!**

**Fecha:** 25 de Enero 2026
**Plataforma:** Netlify Pro
**URL:** https://thriving-lolly-96b349.netlify.app
**Estado:** FUNCIONANDO COMPLETAMENTE

# Checklist Pre-Deploy — SonrisApp

Ejecutar ANTES de cada push a producción. Sin excepciones.

---

## 1. Build local limpio

```bash
npm run build
```

- Tiene que terminar sin errores TypeScript ni errores de compilación.
- Si falla: corregir antes de pushear. Nunca pushear un build roto.

---

## 2. Archivos sin commitear

```bash
git status
```

- Si aparece algo en `??` (untracked) o `M` (modificado): revisar si es parte del trabajo de la sesión.
- Si lo es: `git add` + commit antes de cerrar.
- Regla: **no cerrar sesión con trabajo sin commitear**.

---

## 3. Variables de entorno

Si tocaste `.env`, `netlify.toml` o las variables en Netlify:

- Verificar que `NEXTAUTH_URL` apunta al dominio correcto (hoy: `https://mi-consultorio-odonto.netlify.app`)
- Verificar que `NEXT_PUBLIC_BASE_URL` coincide con `NEXTAUTH_URL`
- Si cambiaste dominio custom: verificar SSL antes de depurar auth (ver punto 5)

---

## 4. Prueba de login en producción

Después de cada deploy:

1. Abrir el sitio en **ventana incógnita**
2. Registrar o iniciar sesión con usuario de prueba
3. Verificar que llega al dashboard correcto (professional → `/dashboard/professional`, patient → `/dashboard/patient`)
4. No hay redirect loop ni pantalla en blanco

---

## 5. SSL del dominio custom (si tocaste dominios)

```bash
openssl s_client -connect sonrisapp.com:443 -servername sonrisapp.com 2>&1 | grep "CN="
```

- Debe mostrar `CN=sonrisapp.com` (o Let's Encrypt), NO `CN=*.netlify.app`
- Si muestra `*.netlify.app`: el cert no está provisionado → las cookies seguras van a fallar → login roto
- Fix: Netlify > Domain management > HTTPS > Renew certificate. Si falla con `certificate parameter is required`: abrir ticket a soporte.

---

## 6. Grep de URLs hardcodeadas (si tocaste auth o links)

```bash
grep -r "netlify.app" app/
```

- No debe haber URLs hardcodeadas de producción en el código.
- Si aparece algo: reemplazar por `/ruta-relativa` o variable de entorno.

---

## Resumen rápido (checklist de bolsillo)

| # | Verificación | Comando |
|---|---|---|
| 1 | Build sin errores | `npm run build` |
| 2 | Nada sin commitear | `git status` |
| 3 | Variables de entorno correctas | revisar Netlify UI |
| 4 | Login funciona en incógnito | manual |
| 5 | SSL del dominio | `openssl s_client ...` |
| 6 | Sin URLs hardcodeadas | `grep -r "netlify.app" app/` |

---

## Historial de breaks que originaron este checklist

| Fecha | Break | Causa raíz |
|---|---|---|
| 2026-04-14 | Login roto | URLs hardcodeadas a netlify.app en `app/page.tsx` |
| 2026-04-15 | Login roto en dominio custom | SSL no provisionado en Netlify |
| 2026-04-15 | Redirect loop post-login | `role` ausente en callbacks jwt/session |
| 2026-04-15 | 404 en /recetas | Archivos nuevos sin commitear |

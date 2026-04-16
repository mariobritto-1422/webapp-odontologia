# CLAUDE.md — SonrisApp
# Última actualización: 2026-03-18

## PROYECTO
SaaS de gestión para consultorios odontológicos. 3 planes Stripe con trial 14 días.

**Ruta:** `C:\Users\mario\sonrisapp\`
**Estado:** 🟡 En desarrollo activo (local)
**Supabase:** `fewfewlmbaqgbxzzlrjx.supabase.co`

---

## ENTORNOS
- Desarrollo: http://localhost:3000 (siempre probar acá primero)
- Producción: https://sonrisapp.com (solo después de git push)

---

## STACK
```
Next.js 16 · NextAuth v5 (beta.30) · Supabase · Stripe · TypeScript · TailwindCSS 3 · Resend
```

## ESTRUCTURA
```
sonrisapp/
├── app/
│   ├── api/
│   │   ├── appointments/     (create, delete, update)
│   │   ├── auth/             (NextAuth + register)
│   │   ├── patient/          (perfil, turnos, cancelar)
│   │   ├── professional/     (branding, perfil, agenda)
│   │   └── stripe/           (create-checkout, portal, webhook)
│   ├── auth/                 (login, register/patient, register/professional)
│   ├── dashboard/
│   │   ├── patient/          (nuevo-turno, perfil, turnos)
│   │   └── professional/     (config, notificaciones, pacientes, planes, qr, suscripcion, turnos)
│   └── cuenta-suspendida/
├── lib/
│   ├── auth.config.ts        ← Edge-compatible (callbacks, pages)
│   ├── auth.ts               ← Node.js (providers, bcryptjs, supabaseAdmin)
│   ├── stripe.ts             ← PLANS + getPlanByPriceId()
│   └── subscription.ts       ← canUseFeature(), evaluateAccess()
└── middleware.ts             ← usa NextAuth(authConfig) NUNCA lib/auth.ts
```

## SCRIPTS
```bash
npm run dev     # desarrollo local (puerto 3000)
npm run build   # build producción
npm run start   # servidor producción
npm run lint    # linting
```

## VARIABLES DE ENTORNO (.env.example disponible)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## REGLAS ARQUITECTÓNICAS CRÍTICAS
1. **`supabaseAdmin` obligatorio** en TODAS las API routes — el cliente anon es bloqueado por RLS
2. **Middleware (Edge Runtime):** NUNCA importar de `lib/auth.ts` (tiene bcryptjs). Usar `NextAuth(authConfig)` desde `lib/auth.config.ts`
3. **Callbacks jwt/session** van en `lib/auth.config.ts` (Edge-compatible), NO en `lib/auth.ts`
4. **Stripe CLI** debe estar corriendo antes de probar pagos:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
5. **Supabase compartida** con WebApp-Odontologia (`fewfewlmbaqgbxzzlrjx`). Cualquier cambio en tablas afecta ambos proyectos.

## PLANES STRIPE (mode: test)
| Plan | Precio | Price ID mensual |
|---|---|---|
| Starter | $9/mes | price_1T6ENm7PXUqpQlXik8b4vOuc |
| Pro | $19/mes | price_1T6Erh7PXUqpQlXiLvrJFXL3 |
| Clínica | $39/mes | price_1T6Evk7PXUqpQlXiDJXL7cFE |

## MODELO DE SUSCRIPCIÓN
- Default al registrarse: `subscription_plan='pro'` + `subscription_status='trialing'` + 14 días
- Webhook `checkout.session.completed` actualiza plan/status/stripe_subscription_id
- Grace period: 3 días tras pago fallido (`grace_period_ends_at`)

## ALERTAS ACTIVAS
- ⚠️ Netlify: `mi-consultorio-odonto.netlify.app` redirige a `/auth/login` (dominio de WebApp-Odontologia archivada)
- Cuando vaya a producción: necesita su propio dominio Netlify
- RESEND_API_KEY disponible pero emails de notificación aún no implementados

## PENDIENTES
- [ ] Emails de notificación de turnos (Resend)
- [ ] Landing page CTAs → `/auth/register/professional`
- [ ] Verificar diseño `/cuenta-suspendida`
- [ ] Deploy a producción (dominio propio)

## MODO DE TRABAJO
Actúa como desarrollador senior especializado en SaaS y webapps comerciales.
Antes de escribir código: analizar → plan → confirmar → implementar.
Código simple, mantenible. Este software se vende a clientes reales.

## IDIOMA
Comunicarse SIEMPRE en español. El código puede estar en inglés técnico.

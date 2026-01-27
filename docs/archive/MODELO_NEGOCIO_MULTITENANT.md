# 💼 Modelo de Negocio Multi-Tenant

## 🎯 Recomendación: Sistema Multi-Tenant con Suscripción

Esta es la arquitectura **más escalable y rentable** para tu negocio.

---

## 🏗️ Arquitectura

### Una Sola Instalación
```
https://turnos-dental.vercel.app
│
├── Dr. García (slug: dr-garcia)
│   ├── 120 pacientes
│   ├── 450 turnos
│   └── Plan: Pro ($25/mes)
│
├── Dra. López (slug: dra-lopez)
│   ├── 80 pacientes
│   ├── 200 turnos
│   └── Plan: Básico ($10/mes)
│
└── Dr. Martínez (slug: dr-martinez)
    ├── 200 pacientes
    ├── 800 turnos
    └── Plan: Enterprise ($50/mes)
```

### Bases de Datos
```
Supabase (1 proyecto):
├── professionals (tabla)
│   ├── id: "uuid-garcia"
│   ├── id: "uuid-lopez"
│   └── id: "uuid-martinez"
│
├── patients (tabla)
│   ├── professional_id: "uuid-garcia" → Solo García los ve
│   ├── professional_id: "uuid-lopez" → Solo López los ve
│   └── professional_id: "uuid-martinez" → Solo Martínez los ve
│
└── appointments (tabla)
    └── professional_id separa los turnos
```

---

## 💰 Planes de Suscripción Sugeridos

### Plan Básico - $10 USD/mes
- ✅ Hasta 100 pacientes
- ✅ Turnos ilimitados
- ✅ Dashboard y estadísticas
- ✅ QR de registro
- ✅ Notificaciones email (100/mes)
- ✅ Soporte por email

### Plan Pro - $25 USD/mes ⭐ (Más Popular)
- ✅ **Pacientes ilimitados**
- ✅ Turnos ilimitados
- ✅ Dashboard avanzado
- ✅ QR de registro
- ✅ Notificaciones email (500/mes)
- ✅ Branding personalizado (colores, logo)
- ✅ Soporte prioritario
- ✅ Reportes exportables

### Plan Enterprise - $50 USD/mes
- ✅ Todo lo de Pro
- ✅ Notificaciones WhatsApp (200/mes)
- ✅ Múltiples profesionales (equipo)
- ✅ API access
- ✅ Integraciones custom
- ✅ Soporte telefónico
- ✅ Dominio personalizado

### Plan Anual (20% descuento)
- Básico: $96/año (vs $120)
- Pro: $240/año (vs $300)
- Enterprise: $480/año (vs $600)

---

## 🔐 Sistema de Control de Acceso

### 1. Agregar Campos a la Tabla `professionals`

```sql
-- Migración: Agregar campos de suscripción
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'trial';
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS patient_limit INTEGER DEFAULT 100;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS email_limit INTEGER DEFAULT 100;

-- Valores posibles:
-- subscription_plan: 'trial', 'basic', 'pro', 'enterprise'
-- subscription_status: 'active', 'cancelled', 'expired', 'suspended'
```

### 2. Middleware de Verificación

```typescript
// lib/subscription.ts
export async function checkSubscription(professionalId: string) {
  const { data: professional } = await supabase
    .from('professionals')
    .select('subscription_plan, subscription_status, subscription_expires_at')
    .eq('id', professionalId)
    .single()

  // Verificar si está activo
  if (professional.subscription_status !== 'active') {
    throw new Error('Suscripción inactiva. Por favor renueva tu plan.')
  }

  // Verificar si expiró
  if (new Date(professional.subscription_expires_at) < new Date()) {
    // Actualizar a expirado
    await supabase
      .from('professionals')
      .update({ subscription_status: 'expired' })
      .eq('id', professionalId)

    throw new Error('Tu suscripción ha expirado.')
  }

  return professional
}

export async function checkPatientLimit(professionalId: string) {
  const { count } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', professionalId)

  const { data: professional } = await supabase
    .from('professionals')
    .select('patient_limit')
    .eq('id', professionalId)
    .single()

  if (count >= professional.patient_limit) {
    throw new Error(`Límite de ${professional.patient_limit} pacientes alcanzado. Actualiza tu plan.`)
  }
}
```

### 3. Proteger API Routes

```typescript
// app/api/patients/create/route.ts
import { checkSubscription, checkPatientLimit } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  const session = await auth()

  // Verificar suscripción
  await checkSubscription(session.user.id)

  // Verificar límite de pacientes
  await checkPatientLimit(session.user.id)

  // Continuar con la creación...
}
```

---

## 💳 Sistema de Pagos con Stripe

### 1. Instalar Stripe

```bash
npm install stripe @stripe/stripe-js
```

### 2. Configurar Stripe

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export const plans = {
  basic: {
    priceId: 'price_xxxxx', // Obtener de Stripe Dashboard
    name: 'Plan Básico',
    price: 10,
    features: ['100 pacientes', '100 emails/mes']
  },
  pro: {
    priceId: 'price_yyyyy',
    name: 'Plan Pro',
    price: 25,
    features: ['Pacientes ilimitados', '500 emails/mes', 'Branding']
  }
}
```

### 3. Crear Checkout

```typescript
// app/api/create-checkout/route.ts
import { stripe, plans } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const { plan } = await request.json()
  const session = await auth()

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: plans[plan].priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/professional?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/professional/planes`,
    metadata: {
      professionalId: session.user.id,
      plan: plan,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

### 4. Webhook para Actualizar Suscripción

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Activar suscripción
      await supabase
        .from('professionals')
        .update({
          subscription_plan: session.metadata.plan,
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 días
          patient_limit: session.metadata.plan === 'basic' ? 100 : 999999,
          email_limit: session.metadata.plan === 'basic' ? 100 : 500,
        })
        .eq('id', session.metadata.professionalId)
      break

    case 'customer.subscription.deleted':
      // Cancelar suscripción
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('professionals')
        .update({ subscription_status: 'cancelled' })
        .eq('stripe_customer_id', subscription.customer)
      break
  }

  return NextResponse.json({ received: true })
}
```

---

## 📊 Proyección de Ingresos

### Escenario Conservador (6 meses)

| Mes | Básico ($10) | Pro ($25) | Total Clientes | MRR | ARR |
|-----|--------------|-----------|----------------|-----|-----|
| 1   | 5            | 2         | 7              | $100 | $1,200 |
| 2   | 10           | 5         | 15             | $225 | $2,700 |
| 3   | 15           | 10        | 25             | $400 | $4,800 |
| 4   | 20           | 15        | 35             | $575 | $6,900 |
| 5   | 25           | 20        | 45             | $750 | $9,000 |
| 6   | 30           | 25        | 55             | $925 | $11,100 |

**MRR = Monthly Recurring Revenue (Ingreso mensual recurrente)**
**ARR = Annual Recurring Revenue (Ingreso anual recurrente)**

### Escenario Optimista (1 año)

- 150 clientes en Plan Básico = $1,500/mes
- 100 clientes en Plan Pro = $2,500/mes
- 10 clientes en Plan Enterprise = $500/mes
- **Total: $4,500/mes = $54,000/año** 💰

### Costos Operativos

| Servicio | Costo Mensual | Para Cuántos Clientes |
|----------|---------------|----------------------|
| Vercel Pro | $20 | Ilimitado |
| Supabase Pro | $25 | ~1,000 clientes |
| Resend (50k emails) | $20 | ~100 clientes |
| Dominio | $1 | - |
| **Total** | **~$66/mes** | 100 clientes |

**Margen:** $925 - $66 = **$859/mes de ganancia (93% de margen)** ✅

---

## 🚀 Plan de Lanzamiento

### Fase 1: MVP (Ahora)
- ✅ Funcionalidad completa
- ✅ Plan "Trial" gratuito por 30 días
- ✅ Sin pagos todavía
- ✅ Registrar primeros 10 clientes manualmente

### Fase 2: Stripe (1 mes)
- [ ] Integrar Stripe
- [ ] Crear planes de pago
- [ ] Página de precios
- [ ] Sistema de límites
- [ ] Webhooks

### Fase 3: Marketing (2 meses)
- [ ] Landing page profesional
- [ ] SEO
- [ ] Google Ads
- [ ] Redes sociales
- [ ] Testimonios de clientes

### Fase 4: Escalar (6 meses)
- [ ] 100 clientes pagos
- [ ] Contratar soporte
- [ ] Agregar features Enterprise
- [ ] WhatsApp notifications
- [ ] App móvil

---

## 🛡️ Protección Contra Compartir Cuenta

### Detección de Uso Sospechoso

```typescript
// lib/fraud-detection.ts
export async function detectAnomalies(professionalId: string) {
  // 1. Múltiples IPs en corto tiempo
  const recentLogins = await supabase
    .from('login_logs')
    .select('ip_address, created_at')
    .eq('professional_id', professionalId)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Última hora

  const uniqueIPs = new Set(recentLogins.map(l => l.ip_address))

  if (uniqueIPs.size > 3) {
    // Alerta: Posible cuenta compartida
    await sendAlertEmail(professionalId, 'Múltiples IPs detectadas')
  }

  // 2. Actividad concurrente
  const activeNow = await supabase
    .from('active_sessions')
    .select('*')
    .eq('professional_id', professionalId)
    .gte('last_activity', new Date(Date.now() - 300000).toISOString()) // Últimos 5 min

  if (activeNow.length > 1) {
    // Limitar a 1 sesión activa
    throw new Error('Ya hay una sesión activa. Las cuentas no pueden compartirse.')
  }
}
```

### Términos de Servicio

```markdown
3.2 Uso de la Cuenta
- La cuenta es personal e intransferible.
- No está permitido compartir credenciales.
- Detectamos y bloqueamos el uso simultáneo desde múltiples ubicaciones.
- El incumplimiento resulta en suspensión inmediata sin reembolso.
```

---

## ✅ Resumen: ¿Qué Elegir?

### Para ti como desarrollador/empresa:

**SI quieres:**
- Escalar a 100+ clientes
- Ingresos recurrentes
- Mantenimiento simple
- Actualizaciones centralizadas

**→ Elige: Multi-Tenant con Suscripción** 🌟

**SI quieres:**
- Trabajar con 5-10 clientes grandes
- Cobrar licencia única alta ($1,000+)
- Personalización extrema por cliente

**→ Elige: Licencias Individuales**

---

**Mi recomendación:** Multi-Tenant es el futuro. Es cómo funcionan todos los SaaS exitosos (Calendly, Notion, etc.)


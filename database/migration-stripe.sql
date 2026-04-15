-- ============================================================
-- MIGRACIÓN: Sistema de Suscripciones Stripe
-- ============================================================
-- Ajustes de diseño:
--   1. Trial = subscription_plan='pro' + status='trialing'
--      (el trial otorga acceso Pro completo, no es un plan separado)
--   2. grace_period_ends_at: permite pago fallido sin bloqueo inmediato
--   3. Feature flags definidos aquí como referencia canónica
--      (implementados en lib/subscription.ts via canUseFeature())
-- ============================================================

-- ------------------------------------------------------------
-- SECCIÓN 1: Agregar campos de suscripción
-- ------------------------------------------------------------

ALTER TABLE professionals
  -- Plan contratado. Valores: 'starter' | 'pro' | 'clinica'
  -- Durante trial el plan es 'pro' (acceso completo mientras evalúan)
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'pro',

  -- Estado del ciclo de vida. Valores:
  --   'trialing'  → en período de prueba gratuita (14 días)
  --   'active'    → suscripción paga y corriente
  --   'past_due'  → pago fallido, en período de gracia
  --   'cancelled' → cancelado manualmente, acceso hasta subscription_ends_at
  --   'expired'   → sin acceso (trial o suscripción vencidos)
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trialing',

  -- Fin del período de prueba (seteado en el registro)
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- Fin del período de suscripción paga (seteado por webhook de Stripe)
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE,

  -- Fin del período de gracia tras pago fallido (invoice.payment_failed)
  -- El profesional mantiene acceso durante este período antes del bloqueo
  -- Valor típico: 3 días después del primer fallo de pago
  ADD COLUMN IF NOT EXISTS grace_period_ends_at TIMESTAMP WITH TIME ZONE,

  -- IDs de Stripe para vincular al cliente y suscripción
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;


-- ------------------------------------------------------------
-- SECCIÓN 2: Constraints de validación
-- ------------------------------------------------------------

ALTER TABLE professionals
  ADD CONSTRAINT chk_subscription_plan
    CHECK (subscription_plan IN ('starter', 'pro', 'clinica')),

  ADD CONSTRAINT chk_subscription_status
    CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'cancelled', 'expired'));


-- ------------------------------------------------------------
-- SECCIÓN 3: Índices para webhooks y lookups frecuentes
-- ------------------------------------------------------------

-- Webhook de Stripe busca por stripe_customer_id en cada evento
CREATE INDEX IF NOT EXISTS idx_professionals_stripe_customer
  ON professionals(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Middleware verifica subscription_status en cada request del dashboard
CREATE INDEX IF NOT EXISTS idx_professionals_subscription_status
  ON professionals(subscription_status);


-- ------------------------------------------------------------
-- SECCIÓN 4: Inicializar datos en profesionales existentes
-- ------------------------------------------------------------
-- Los profesionales ya registrados no deben quedar bloqueados.
-- Reciben 30 días de trial extendido para que puedan suscribirse.

UPDATE professionals
SET
  subscription_plan   = 'pro',
  subscription_status = 'trialing',
  trial_ends_at       = NOW() + INTERVAL '30 days'
WHERE
  trial_ends_at IS NULL;  -- Solo afecta a los pre-existentes sin trial seteado


-- ------------------------------------------------------------
-- SECCIÓN 5: Referencia canónica de Feature Flags
-- ------------------------------------------------------------
-- Esta sección es solo documentación.
-- La implementación real está en lib/subscription.ts → canUseFeature()
--
-- PLAN         | FEATURE                      | VALOR
-- -------------|------------------------------|--------
-- starter      | patient_limit                | 50
-- pro          | patient_limit                | unlimited
-- clinica      | patient_limit                | unlimited
--              |                              |
-- starter      | odontogram                   | false
-- pro          | odontogram                   | true
-- clinica      | odontogram                   | true
--              |                              |
-- starter      | pdf_export                   | false
-- pro          | pdf_export                   | true
-- clinica      | pdf_export                   | true
--              |                              |
-- starter      | custom_branding              | false
-- pro          | custom_branding              | true
-- clinica      | custom_branding              | true
--              |                              |
-- starter      | email_reminders_limit        | 50
-- pro          | email_reminders_limit        | unlimited
-- clinica      | email_reminders_limit        | unlimited
--              |                              |
-- starter      | advanced_dashboard           | false
-- pro          | advanced_dashboard           | true
-- clinica      | advanced_dashboard           | true
--              |                              |
-- starter      | multiple_professionals       | false
-- pro          | multiple_professionals       | false
-- clinica      | multiple_professionals       | true   (hasta 5)
--              |                              |
-- starter      | priority_support             | false
-- pro          | priority_support             | false
-- clinica      | priority_support             | true
-- ============================================================

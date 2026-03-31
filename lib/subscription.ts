import { supabaseAdmin } from './supabase'
import type { PlanId } from './mercadopago'

// ------------------------------------------------------------
// Tipos
// ------------------------------------------------------------

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'

export type Feature =
  | 'odontogram'
  | 'pdf_export'
  | 'custom_branding'
  | 'advanced_dashboard'
  | 'unlimited_patients'
  | 'unlimited_email_reminders'
  | 'multiple_professionals'
  | 'priority_support'

export interface SubscriptionData {
  plan: PlanId
  status: SubscriptionStatus
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
  gracePeriodEndsAt: string | null
  mpPayerId: string | null        // stripe_customer_id en BD (reutilizado)
  mpPreapprovalId: string | null  // stripe_subscription_id en BD (reutilizado)
}

export interface AccessResult {
  allowed: boolean
  reason: 'active' | 'trialing' | 'grace_period' | 'trial_expired' | 'subscription_expired' | 'cancelled' | 'past_due_hard'
  daysRemaining: number | null
}

// ------------------------------------------------------------
// Feature flags — fuente de verdad canónica
// Toda lógica de acceso a features debe pasar por canUseFeature()
// ------------------------------------------------------------

const FEATURE_MAP: Record<Feature, PlanId[]> = {
  odontogram:                ['pro', 'clinica'],
  pdf_export:                ['pro', 'clinica'],
  custom_branding:           ['pro', 'clinica'],
  advanced_dashboard:        ['pro', 'clinica'],
  unlimited_patients:        ['pro', 'clinica'],
  unlimited_email_reminders: ['pro', 'clinica'],
  multiple_professionals:    ['clinica'],
  priority_support:          ['clinica'],
}

/**
 * Verifica si un plan tiene acceso a un feature.
 * Función pura — no requiere llamada a BD.
 */
export function canUseFeature(plan: PlanId, feature: Feature): boolean {
  return FEATURE_MAP[feature].includes(plan)
}

/**
 * Devuelve el límite de pacientes para un plan.
 * null = ilimitado.
 */
export function getPatientLimit(plan: PlanId): number | null {
  const limits: Record<PlanId, number | null> = {
    starter: 50,
    pro: null,
    clinica: null,
  }
  return limits[plan]
}

/**
 * Devuelve el límite de emails por mes para un plan.
 * null = ilimitado.
 */
export function getEmailLimit(plan: PlanId): number | null {
  const limits: Record<PlanId, number | null> = {
    starter: 50,
    pro: null,
    clinica: null,
  }
  return limits[plan]
}

/**
 * Devuelve la cantidad máxima de profesionales para un plan.
 */
export function getProfessionalLimit(plan: PlanId): number {
  const limits: Record<PlanId, number> = {
    starter: 1,
    pro: 1,
    clinica: 5,
  }
  return limits[plan]
}

// ------------------------------------------------------------
// Lógica de acceso
// ------------------------------------------------------------

/**
 * Determina si un profesional tiene acceso al dashboard
 * basándose en su estado de suscripción y fechas.
 */
export function evaluateAccess(sub: SubscriptionData): AccessResult {
  const now = new Date()

  switch (sub.status) {
    case 'trialing': {
      if (!sub.trialEndsAt) {
        return { allowed: true, reason: 'trialing', daysRemaining: null }
      }
      const trialEnd = new Date(sub.trialEndsAt)
      if (trialEnd > now) {
        const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / 86_400_000)
        return { allowed: true, reason: 'trialing', daysRemaining }
      }
      return { allowed: false, reason: 'trial_expired', daysRemaining: 0 }
    }

    case 'active':
      return { allowed: true, reason: 'active', daysRemaining: null }

    case 'past_due': {
      if (sub.gracePeriodEndsAt && new Date(sub.gracePeriodEndsAt) > now) {
        const daysRemaining = Math.ceil(
          (new Date(sub.gracePeriodEndsAt).getTime() - now.getTime()) / 86_400_000
        )
        return { allowed: true, reason: 'grace_period', daysRemaining }
      }
      return { allowed: false, reason: 'past_due_hard', daysRemaining: 0 }
    }

    case 'cancelled': {
      if (sub.subscriptionEndsAt && new Date(sub.subscriptionEndsAt) > now) {
        const daysRemaining = Math.ceil(
          (new Date(sub.subscriptionEndsAt).getTime() - now.getTime()) / 86_400_000
        )
        return { allowed: true, reason: 'cancelled', daysRemaining }
      }
      return { allowed: false, reason: 'subscription_expired', daysRemaining: 0 }
    }

    case 'expired':
      return { allowed: false, reason: 'subscription_expired', daysRemaining: 0 }

    default:
      return { allowed: false, reason: 'subscription_expired', daysRemaining: 0 }
  }
}

// ------------------------------------------------------------
// Consulta a base de datos
// ------------------------------------------------------------

/**
 * Obtiene los datos de suscripción de un profesional desde Supabase.
 * Nota: stripe_customer_id → mpPayerId, stripe_subscription_id → mpPreapprovalId
 */
export async function getSubscriptionData(professionalId: string): Promise<SubscriptionData | null> {
  const { data, error } = await supabaseAdmin
    .from('professionals')
    .select(
      'subscription_plan, subscription_status, trial_ends_at, subscription_ends_at, grace_period_ends_at, stripe_customer_id, stripe_subscription_id'
    )
    .eq('id', professionalId)
    .single()

  if (error || !data) return null

  return {
    plan: data.subscription_plan as PlanId,
    status: data.subscription_status as SubscriptionStatus,
    trialEndsAt: data.trial_ends_at,
    subscriptionEndsAt: data.subscription_ends_at,
    gracePeriodEndsAt: data.grace_period_ends_at,
    mpPayerId: data.stripe_customer_id,
    mpPreapprovalId: data.stripe_subscription_id,
  }
}

/**
 * Verifica acceso completo de un profesional.
 */
export async function checkProfessionalAccess(professionalId: string): Promise<AccessResult | null> {
  const sub = await getSubscriptionData(professionalId)
  if (!sub) return null
  return evaluateAccess(sub)
}

-- ============================================================
-- MIGRACIÓN: Módulo Recetas
-- ============================================================

-- Agregar matrícula al profesional (nullable)
ALTER TABLE professionals
  ADD COLUMN IF NOT EXISTS matricula TEXT;

-- Agregar DNI al paciente (nullable)
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS dni TEXT;

-- Tabla de recetas
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medications JSONB NOT NULL DEFAULT '[]',
  -- Cada ítem: { name: string, dose: string, quantity: string, instructions: string }
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_prescriptions_professional ON prescriptions(professional_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created ON prescriptions(created_at DESC);

-- RLS
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view their prescriptions"
  ON prescriptions FOR SELECT
  USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can insert prescriptions"
  ON prescriptions FOR INSERT
  WITH CHECK (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can delete their prescriptions"
  ON prescriptions FOR DELETE
  USING (auth.uid()::text = professional_id::text);

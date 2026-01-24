-- ============================================
-- MIGRACIÓN: Tabla de Notificaciones
-- ============================================

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Referencias
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,

  -- Tipo y canal
  type TEXT CHECK (type IN ('reminder', 'confirmation', 'cancellation', 'status_update')) NOT NULL,
  channel TEXT CHECK (channel IN ('email', 'whatsapp', 'sms')) NOT NULL,

  -- Estado del envío
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',

  -- Contenido
  subject TEXT,
  message TEXT NOT NULL,

  -- Metadatos del envío
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,

  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_notifications_appointment ON notifications(appointment_id);
CREATE INDEX idx_notifications_patient ON notifications(patient_id);
CREATE INDEX idx_notifications_professional ON notifications(professional_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Trigger para updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Professionals can view their notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can update their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::text = professional_id::text);

-- Comentarios
COMMENT ON TABLE notifications IS 'Historial de notificaciones enviadas a pacientes';
COMMENT ON COLUMN notifications.type IS 'Tipo: reminder, confirmation, cancellation, status_update';
COMMENT ON COLUMN notifications.channel IS 'Canal: email, whatsapp, sms';
COMMENT ON COLUMN notifications.status IS 'Estado: pending, sent, failed';

-- ============================================
-- ESQUEMA DE BASE DE DATOS - SUPABASE
-- WebApp Odontología Multi-Tenant
-- ============================================

-- Tabla de Profesionales (Odontólogos)
-- ============================================
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  phone TEXT,
  slug TEXT UNIQUE NOT NULL,

  -- Información profesional (NUEVO según prompt actualizado)
  address TEXT,                    -- Domicilio laboral
  work_email TEXT,                -- Email laboral
  work_phone TEXT,                -- Teléfono laboral
  social_media JSONB DEFAULT '{}', -- Redes sociales {facebook, instagram, linkedin, etc}
  cv_url TEXT,                    -- URL del CV
  profile_image_url TEXT,         -- Foto de perfil
  cover_image_url TEXT,           -- Foto de portada

  -- Branding personalizado
  branding JSONB DEFAULT '{
    "logoUrl": null,
    "primaryColor": "#1E40AF",
    "secondaryColor": "#10B981",
    "consultorioName": ""
  }',

  -- Textos legales editables
  terms TEXT,
  privacy_policy TEXT,
  legal_updated_at TIMESTAMP WITH TIME ZONE,

  -- Configuración de horarios
  schedule JSONB DEFAULT '{
    "monday": {"enabled": true, "slots": [{"start": "09:00", "end": "13:00"}, {"start": "15:00", "end": "19:00"}]},
    "tuesday": {"enabled": true, "slots": [{"start": "09:00", "end": "13:00"}, {"start": "15:00", "end": "19:00"}]},
    "wednesday": {"enabled": true, "slots": [{"start": "09:00", "end": "13:00"}, {"start": "15:00", "end": "19:00"}]},
    "thursday": {"enabled": true, "slots": [{"start": "09:00", "end": "13:00"}, {"start": "15:00", "end": "19:00"}]},
    "friday": {"enabled": true, "slots": [{"start": "09:00", "end": "13:00"}, {"start": "15:00", "end": "19:00"}]},
    "saturday": {"enabled": false, "slots": []},
    "sunday": {"enabled": false, "slots": []}
  }',

  appointment_duration INTEGER DEFAULT 30, -- Duración de cada turno en minutos
  blocked_dates TEXT[] DEFAULT '{}',       -- Fechas bloqueadas (vacaciones, feriados)

  -- Notificaciones
  notifications JSONB DEFAULT '{
    "emailEnabled": true,
    "whatsappEnabled": false,
    "notifyOnNewAppointment": true
  }',

  -- Metadatos
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Pacientes
-- ============================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,

  -- Aceptación legal
  accepted_terms BOOLEAN DEFAULT FALSE,
  accepted_privacy BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMP WITH TIME ZONE,

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un paciente puede estar asociado a UN solo profesional (multi-tenant)
  UNIQUE(email, professional_id)
);

-- Tabla de Turnos
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,

  -- Fecha y hora
  date DATE NOT NULL,
  time TIME NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Estado del turno
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',

  -- ¿Quién lo creó?
  created_by TEXT CHECK (created_by IN ('patient', 'professional')) NOT NULL,

  -- Cancelación
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by TEXT CHECK (cancelled_by IN ('patient', 'professional')),

  -- Notas opcionales del profesional
  notes TEXT,

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
-- ============================================
CREATE INDEX idx_appointments_professional_date ON appointments(professional_id, date);
CREATE INDEX idx_appointments_patient_status ON appointments(patient_id, status);
CREATE INDEX idx_appointments_datetime ON appointments(datetime);
CREATE INDEX idx_patients_professional ON patients(professional_id);
CREATE INDEX idx_professionals_slug ON professionals(slug);
CREATE INDEX idx_professionals_email ON professionals(email);

-- Función para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
-- ============================================
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
-- ============================================
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas para professionals
CREATE POLICY "Professionals can view their own data"
  ON professionals FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Professionals can update their own data"
  ON professionals FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can view active professionals (for public pages)"
  ON professionals FOR SELECT
  USING (is_active = TRUE);

-- Políticas para patients
CREATE POLICY "Patients can view their own data"
  ON patients FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Patients can update their own data"
  ON patients FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Professionals can view their patients"
  ON patients FOR SELECT
  USING (auth.uid()::text = professional_id::text);

-- Políticas para appointments
CREATE POLICY "Professionals can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Patients can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Patients can update their appointments (cancel)"
  ON appointments FOR UPDATE
  USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Professionals can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid()::text = professional_id::text);

-- ============================================
-- DATOS DE EJEMPLO (Opcional, para testing)
-- ============================================

-- Insertar un profesional de ejemplo
-- INSERT INTO professionals (email, name, specialty, slug, address, work_email, work_phone)
-- VALUES (
--   'dr.garcia@example.com',
--   'Dr. Juan García',
--   'Odontología General',
--   'dr-garcia',
--   'Av. Corrientes 1234, CABA',
--   'consultorio@drgarcia.com',
--   '+5491112345678'
-- );

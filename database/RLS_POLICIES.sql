-- ============================================
-- RLS POLICIES PARA WEBAPP ODONTOLOGIA
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Paso 1: Habilitar RLS en la tabla appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Paso 2: Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Patients can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can cancel their own appointments" ON appointments;
DROP POLICY IF EXISTS "Professionals can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Professionals can manage their appointments" ON appointments;

-- ============================================
-- POLÍTICAS PARA PACIENTES
-- ============================================

-- Permitir a pacientes CREAR turnos (INSERT)
CREATE POLICY "Patients can create their own appointments"
ON appointments
FOR INSERT
TO authenticated
WITH CHECK (
  patient_id = auth.uid()
);

-- Permitir a pacientes VER sus propios turnos (SELECT)
CREATE POLICY "Patients can view their own appointments"
ON appointments
FOR SELECT
TO authenticated
USING (
  patient_id = auth.uid()
);

-- Permitir a pacientes ACTUALIZAR sus propios turnos (UPDATE)
-- Solo pueden cambiar el status a 'cancelled' (cancelar)
CREATE POLICY "Patients can cancel their own appointments"
ON appointments
FOR UPDATE
TO authenticated
USING (
  patient_id = auth.uid()
)
WITH CHECK (
  patient_id = auth.uid()
);

-- ============================================
-- POLÍTICAS PARA PROFESIONALES
-- ============================================

-- Permitir a profesionales VER todos sus turnos (SELECT)
CREATE POLICY "Professionals can view their appointments"
ON appointments
FOR SELECT
TO authenticated
USING (
  professional_id = auth.uid()
);

-- Permitir a profesionales CREAR turnos para sus pacientes (INSERT)
CREATE POLICY "Professionals can create appointments"
ON appointments
FOR INSERT
TO authenticated
WITH CHECK (
  professional_id = auth.uid()
);

-- Permitir a profesionales ACTUALIZAR todos sus turnos (UPDATE)
CREATE POLICY "Professionals can update their appointments"
ON appointments
FOR UPDATE
TO authenticated
USING (
  professional_id = auth.uid()
)
WITH CHECK (
  professional_id = auth.uid()
);

-- Permitir a profesionales ELIMINAR sus turnos (DELETE)
CREATE POLICY "Professionals can delete their appointments"
ON appointments
FOR DELETE
TO authenticated
USING (
  professional_id = auth.uid()
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'appointments';

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'appointments';

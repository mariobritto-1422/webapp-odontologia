-- ============================================
-- MIGRACIÓN: Agregar campo password_hash
-- Fecha: 2026-01-23
-- ============================================
--
-- INSTRUCCIONES:
-- 1. Abrí Supabase Dashboard: https://fewfewlmbaqgbxzzlrjx.supabase.co
-- 2. Andá a "SQL Editor"
-- 3. Copiá y pegá este script completo
-- 4. Hacé clic en "Run"
--
-- ============================================

-- Agregar columna password_hash a professionals
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Agregar columna password_hash a patients
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Opcional: Si querés que sea NOT NULL después de agregar las contraseñas,
-- descomentá estas líneas después de que todos los usuarios tengan contraseñas:
--
-- ALTER TABLE professionals
-- ALTER COLUMN password_hash SET NOT NULL;
--
-- ALTER TABLE patients
-- ALTER COLUMN password_hash SET NOT NULL;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecutá esto para verificar que se agregaron las columnas:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name IN ('professionals', 'patients')
-- AND column_name = 'password_hash';

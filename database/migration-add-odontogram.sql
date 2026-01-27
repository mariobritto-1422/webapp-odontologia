-- Migración: Agregar soporte para Odontograma en la tabla patients
-- Fecha: 2026-01-27
-- Descripción: Agrega columna JSONB para almacenar el estado del odontograma de cada paciente

-- Agregar columna odontogram a la tabla patients
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS odontogram JSONB DEFAULT NULL;

-- Crear índice GIN para búsquedas eficientes en el campo JSONB
CREATE INDEX IF NOT EXISTS idx_patients_odontogram
ON patients USING GIN (odontogram);

-- Agregar comentario descriptivo a la columna
COMMENT ON COLUMN patients.odontogram IS 'Estado del odontograma en formato JSON con sistema FDI (Fédération Dentaire Internationale). Almacena el estado de cada diente y sus superficies (vestibular, lingual, mesial, distal, oclusal).';

-- Verificación: Consultar la estructura de la tabla
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'patients' AND column_name = 'odontogram';

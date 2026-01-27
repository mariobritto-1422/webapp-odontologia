# Migraciones de Base de Datos

Este directorio contiene las migraciones SQL necesarias para el proyecto.

## Migración: Agregar Odontograma

**Archivo**: `migration-add-odontogram.sql`

**Descripción**: Agrega soporte para odontogramas interactivos en la aplicación.

### Instrucciones de Ejecución

1. Accede a tu dashboard de Supabase
2. Ve a la sección "SQL Editor"
3. Crea una nueva query
4. Copia y pega el contenido de `migration-add-odontogram.sql`
5. Ejecuta la query
6. Verifica que la columna `odontogram` se haya agregado correctamente a la tabla `patients`

### Verificación

Puedes verificar que la migración se ejecutó correctamente con la siguiente query:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'patients' AND column_name = 'odontogram';
```

Deberías ver un resultado similar a:

| column_name | data_type | is_nullable | column_default |
|-------------|-----------|-------------|----------------|
| odontogram  | jsonb     | YES         | NULL           |

### Rollback (Opcional)

Si necesitas revertir esta migración:

```sql
-- Eliminar el índice
DROP INDEX IF EXISTS idx_patients_odontogram;

-- Eliminar la columna
ALTER TABLE patients DROP COLUMN IF EXISTS odontogram;
```

## Estructura del Odontograma

El campo `odontogram` almacena un objeto JSON con la siguiente estructura:

```json
{
  "lastUpdated": "2026-01-27T10:30:00.000Z",
  "dentitionType": "permanent",
  "teeth": {
    "11": {
      "surfaces": {
        "vestibular": {
          "status": "healthy",
          "color": "#FFFFFF",
          "notes": ""
        },
        "oclusal": {
          "status": "caries",
          "color": "#EF4444",
          "notes": ""
        }
      }
    },
    "16": {
      "wholeTooth": {
        "status": "missing",
        "reason": "Extracción",
        "date": "2025-12-15"
      }
    }
  }
}
```

### Campos:

- **lastUpdated**: Timestamp de la última modificación
- **dentitionType**: Tipo de dentición (`permanent` o `temporary`)
- **teeth**: Objeto con los dientes modificados, usando el sistema FDI como clave
  - **surfaces**: Superficies individuales del diente
    - **vestibular**: Cara anterior/exterior
    - **lingual**: Cara posterior/interior
    - **mesial**: Cara hacia la línea media
    - **distal**: Cara alejada de la línea media
    - **oclusal**: Superficie masticatoria
  - **wholeTooth**: Cuando el diente completo tiene un estado (ausente, implante)

### Estados Posibles:

- `healthy`: Sano (blanco)
- `caries`: Caries (rojo)
- `restoration`: Restauración (azul)
- `crown`: Corona (ámbar)
- `fracture`: Fractura (rojo oscuro)
- `missing`: Ausente (gris)
- `implant`: Implante (verde)

## Sistema de Numeración FDI

El odontograma utiliza el sistema FDI (Fédération Dentaire Internationale):

### Dentición Permanente:
- **Cuadrante 1** (Superior Derecho): 11-18
- **Cuadrante 2** (Superior Izquierdo): 21-28
- **Cuadrante 3** (Inferior Izquierdo): 31-38
- **Cuadrante 4** (Inferior Derecho): 41-48

### Dentición Temporaria:
- **Cuadrante 5** (Superior Derecho): 51-55
- **Cuadrante 6** (Superior Izquierdo): 61-65
- **Cuadrante 7** (Inferior Izquierdo): 71-75
- **Cuadrante 8** (Inferior Derecho): 81-85

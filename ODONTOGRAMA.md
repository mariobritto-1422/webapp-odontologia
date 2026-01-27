# Odontograma Interactivo - Documentación

## Descripción General

El Odontograma Interactivo es una herramienta profesional que permite a los odontólogos registrar y visualizar el estado dental de sus pacientes de manera digital, utilizando el sistema de numeración FDI (Fédération Dentaire Internationale).

## Características Principales

### ✅ Completadas

1. **Visualización Interactiva**
   - Representación gráfica de todos los dientes usando SVG
   - 5 superficies por diente: Vestibular, Lingual, Mesial, Distal, Oclusal
   - Sistema de cuadrantes anatómicamente correcto
   - Transformaciones matriciales para espejo anatómico

2. **Herramientas de Marcado**
   - 7 estados disponibles: Sano, Caries, Restauración, Corona, Fractura, Ausente, Implante
   - Código de colores profesional
   - Click directo en superficies para aplicar estados

3. **Sistema FDI Completo**
   - Dentición permanente (32 dientes)
   - Dentición temporaria (20 dientes)
   - Toggle entre tipos de dentición

4. **Persistencia de Datos**
   - Almacenamiento en Supabase (JSONB)
   - Solo guarda dientes modificados (optimización)
   - Validación de permisos (solo el profesional dueño puede editar)

5. **Exportación a PDF**
   - Generación profesional con @react-pdf/renderer
   - Incluye imagen del odontograma
   - Datos del paciente y profesional
   - Lista de hallazgos clínicos
   - Leyenda de colores

6. **Interfaz Responsive**
   - Funciona en desktop, tablet y móvil
   - Layout adaptativo
   - Estados de loading y mensajes de éxito/error

7. **Seguridad**
   - Solo profesionales pueden acceder
   - Validación de propiedad del paciente
   - Confirmación antes de salir con cambios sin guardar

## Estructura de Archivos

```
webapp/
├── types/
│   └── odontogram.ts                    # Tipos TypeScript e interfaces
│
├── lib/
│   ├── supabase.ts                       # Cliente Supabase (actualizado)
│   └── pdf-generator.ts                  # Generador de PDF
│
├── database/
│   ├── migration-add-odontogram.sql     # Migración SQL
│   └── README.md                         # Instrucciones de migración
│
├── app/
│   ├── api/
│   │   └── odontogram/
│   │       └── [patientId]/
│   │           ├── route.ts              # GET/PUT endpoints
│   │           └── export-pdf/
│   │               └── route.ts          # POST endpoint para PDF
│   │
│   └── dashboard/
│       └── professional/
│           └── pacientes/
│               └── [id]/
│                   ├── page.tsx          # Página del paciente (modificada)
│                   └── odontograma/
│                       ├── page.tsx      # Página principal del odontograma
│                       ├── OdontogramEditor.tsx  # Editor principal
│                       └── components/
│                           ├── ToothSVG.tsx      # SVG individual del diente
│                           ├── QuadrantSection.tsx  # Sección de cuadrante
│                           ├── OdontogramCanvas.tsx  # Canvas principal
│                           ├── Toolbar.tsx        # Barra de herramientas
│                           └── LegendPanel.tsx    # Panel de leyenda
│
└── ODONTOGRAMA.md                        # Esta documentación
```

## Instalación

### 1. Migración de Base de Datos

Ejecuta el script SQL en Supabase:

```bash
# El archivo está en: database/migration-add-odontogram.sql
```

Ver instrucciones detalladas en `database/README.md`

### 2. Dependencias

Las dependencias ya están instaladas:
- `@react-pdf/renderer` - Generación de PDF
- `html2canvas` - Captura de canvas como imagen

### 3. Variables de Entorno

No se requieren variables adicionales. Usa las existentes de Supabase.

## Uso

### Para Profesionales

1. **Acceder al Odontograma**
   - Ve a "Pacientes" en el dashboard
   - Selecciona un paciente
   - Click en el botón "Odontograma"

2. **Marcar Superficies**
   - Selecciona una herramienta de la barra superior
   - Click en la superficie del diente que deseas marcar
   - La superficie cambiará al color de la herramienta

3. **Cambiar Tipo de Dentición**
   - Usa el toggle "Permanente / Temporaria" en el header
   - El odontograma se actualizará automáticamente

4. **Guardar Cambios**
   - Click en el botón "Guardar"
   - Aparecerá un mensaje de confirmación

5. **Exportar PDF**
   - Click en el botón "Exportar PDF"
   - El archivo se descargará automáticamente

6. **Salir**
   - Click en "Volver"
   - Si hay cambios sin guardar, aparecerá una confirmación

## Arquitectura Técnica

### Sistema de Numeración FDI

El odontograma usa el estándar FDI:

**Permanente:**
```
      18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
      48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
```

**Temporaria:**
```
      55 54 53 52 51 | 61 62 63 64 65
      85 84 83 82 81 | 71 72 73 74 75
```

### Transformaciones Anatómicas

Los cuadrantes 2 y 4 (izquierdos) usan transformación de espejo:
```typescript
scale(-1, 1) translate(-100, 0)
```

Las superficies Mesial/Distal se invierten automáticamente en estos cuadrantes.

### Estructura de Datos

```typescript
interface Odontogram {
  lastUpdated: string
  dentitionType: 'permanent' | 'temporary'
  teeth: Record<string, Tooth>
}

interface Tooth {
  surfaces: {
    vestibular?: ToothSurface
    lingual?: ToothSurface
    mesial?: ToothSurface
    distal?: ToothSurface
    oclusal?: ToothSurface
  }
  wholeTooth?: {
    status: 'missing' | 'implant'
    reason?: string
    date?: string
  }
}
```

### Optimización

- Solo se guardan dientes con modificaciones
- JSONB con índice GIN para búsquedas eficientes
- Lazy loading de componentes cuando sea posible

## API Endpoints

### GET /api/odontogram/[patientId]

Obtiene el odontograma de un paciente.

**Respuesta:**
```json
{
  "patientId": "uuid",
  "patientName": "Juan Pérez",
  "odontogram": { ... }
}
```

### PUT /api/odontogram/[patientId]

Actualiza el odontograma de un paciente.

**Body:**
```json
{
  "odontogram": { ... }
}
```

### POST /api/odontogram/[patientId]/export-pdf

Genera y descarga un PDF del odontograma.

**Body:**
```json
{
  "odontogramImageBase64": "data:image/png;base64,..."
}
```

**Respuesta:** Archivo PDF

## Testing

### Checklist de Funcionalidad

- [ ] Click en superficie cambia color según herramienta seleccionada
- [ ] Espejo anatómico: Mesial/Distal invertidos en cuadrantes 2 y 4
- [ ] Toggle Permanente/Temporaria renderiza dientes correctos
- [ ] Guardar persiste en base de datos
- [ ] Cargar recupera estado guardado
- [ ] Exportar PDF genera archivo descargable
- [ ] PDF contiene imagen y datos correctos
- [ ] Confirmación antes de salir con cambios sin guardar

### Checklist de Seguridad

- [ ] Solo profesional dueño puede ver/editar odontograma
- [ ] Paciente de otro profesional → 403 Forbidden
- [ ] Usuario no autenticado → 401 Unauthorized
- [ ] JSONB se guarda correctamente sin inyecciones

### Checklist de Responsive

- [ ] Funciona en móvil (320px-767px)
- [ ] Funciona en tablet (768px-1023px)
- [ ] Funciona en desktop (1024px+)
- [ ] Toolbar se adapta (múltiples filas si es necesario)
- [ ] Dientes son clickeables en todas las resoluciones

## Troubleshooting

### El odontograma no carga

1. Verifica que la migración SQL se ejecutó correctamente
2. Revisa los logs del navegador (F12 → Console)
3. Verifica que el usuario tiene permisos

### Los clicks no funcionan

1. Verifica que JavaScript está habilitado
2. Revisa el estado de la herramienta seleccionada
3. Verifica que no hay errores de renderizado en console

### El PDF no se genera

1. Verifica que las dependencias están instaladas
2. Revisa los logs del servidor
3. Verifica que el canvas tiene contenido

### Errores de permisos

1. Verifica que el usuario es un profesional
2. Verifica que el paciente pertenece al profesional
3. Revisa la sesión de NextAuth

## Próximas Mejoras (Opcional)

1. **Notas por superficie**: Modal con textarea para notas detalladas
2. **Historial de cambios**: Versionado del odontograma con timeline
3. **Imágenes adjuntas**: Upload de fotos intraorales vinculadas a dientes
4. **Tratamientos planificados**: Capa adicional para plan vs realizado
5. **Comparación temporal**: Ver cambios entre fechas
6. **Templates predefinidos**: Plantillas para casos comunes
7. **Exportación DICOM**: Formato estándar odontológico

## Soporte

Para reportar bugs o solicitar features:
1. Abre un issue en el repositorio
2. Incluye screenshots si es posible
3. Describe los pasos para reproducir el problema

## Licencia

Este módulo es parte del sistema de gestión odontológica y está sujeto a la misma licencia del proyecto principal.

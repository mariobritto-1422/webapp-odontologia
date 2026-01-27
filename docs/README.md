# Documentación del Proyecto

Este directorio contiene toda la documentación del sistema de gestión odontológica.

## 📁 Estructura

### 🎯 Material de Ventas (NUEVO)

- **[presentacion-ventas.html](./presentacion-ventas.html)** ⭐ - Presentación interactiva profesional (16 slides)
- **[GUIA_PRESENTACION.md](./GUIA_PRESENTACION.md)** - Cómo usar la presentación
- **[pitch-comercial.md](./pitch-comercial.md)** - Scripts de venta, objeciones, estrategia

### Documentación Activa (Raíz del Proyecto)

- **[../README.md](../README.md)** - Documentación principal del proyecto
- **[../ODONTOGRAMA.md](../ODONTOGRAMA.md)** - Guía completa del Odontograma Interactivo
- **[../IMPLEMENTACION_COMPLETADA.md](../IMPLEMENTACION_COMPLETADA.md)** - Resumen de la implementación del odontograma

### Base de Datos

- **[../database/README.md](../database/README.md)** - Instrucciones de migraciones
- **[../database/migration-add-odontogram.sql](../database/migration-add-odontogram.sql)** - Migración del odontograma
- **[RLS_POLICIES.sql](./RLS_POLICIES.sql)** - Políticas de seguridad Row Level Security

### Archivos Adicionales

- **[flyer-redes-sociales.html](./flyer-redes-sociales.html)** - Plantilla de flyer para marketing

### Documentación Histórica

La carpeta `archive/` contiene documentación de versiones anteriores y guías históricas que se mantienen como referencia pero que pueden estar desactualizadas.

---

## 🚀 Para empezar rápido

1. Lee el [README principal](../README.md)
2. Configura las variables de entorno según `.env.example`
3. Ejecuta las migraciones de base de datos
4. Inicia el proyecto con `npm run dev`

---

## 📋 Documentación por Módulo

### Odontograma Interactivo
- Guía completa: [ODONTOGRAMA.md](../ODONTOGRAMA.md)
- Detalles técnicos: [IMPLEMENTACION_COMPLETADA.md](../IMPLEMENTACION_COMPLETADA.md)
- Migración SQL: [database/migration-add-odontogram.sql](../database/migration-add-odontogram.sql)

### Sistema de Turnos
Ver documentación en README principal

### Gestión de Pacientes
Ver documentación en README principal

### Notificaciones
Ver documentación en README principal

---

## 🔧 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

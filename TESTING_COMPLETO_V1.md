# 🧪 Testing Completo - Versión 1.0

## 📋 Checklist de Testing Pre-Producción

Fecha: 23 de Enero 2026

---

## 🔐 PRUEBAS DE AUTENTICACIÓN

### Registro de Profesional
- [ ] Ir a: http://localhost:3000/auth/register/professional
- [ ] Probar registro con email nuevo
- [ ] Verificar validaciones:
  - [ ] Email válido requerido
  - [ ] Nombre requerido
  - [ ] Contraseña mínimo 6 caracteres
  - [ ] Especialidad requerida
- [ ] Verificar redirección a dashboard después de registro
- [ ] Verificar que NO se puede registrar con email duplicado

### Login Profesional
- [ ] Ir a: http://localhost:3000/auth/login
- [ ] Login con: `juan@garcia.com` / `123456`
- [ ] Verificar redirección a `/dashboard/professional`
- [ ] Probar con contraseña incorrecta (debe fallar)
- [ ] Probar con email inexistente (debe fallar)

### Registro de Paciente
- [ ] Obtener QR del profesional en `/dashboard/professional/qr`
- [ ] Copiar link de registro
- [ ] Abrir en ventana incógnito
- [ ] Registrar paciente nuevo
- [ ] Verificar que queda asociado al profesional correcto

### Login Paciente
- [ ] Login con: `maria@lopez.com` / `123456`
- [ ] Verificar redirección a `/dashboard/patient`
- [ ] Verificar que muestra info del profesional correcto

---

## 📊 DASHBOARD PROFESIONAL

### Panel Principal (NUEVO - Con Gráficos)
- [ ] Ir a: http://localhost:3000/dashboard/professional
- [ ] Verificar 4 tarjetas de estadísticas:
  - [ ] Pacientes Registrados (con icono azul)
  - [ ] Total de Turnos (con icono verde)
  - [ ] Turnos Este Mes (con tendencia vs mes anterior)
  - [ ] Turnos Hoy (con icono amarillo)
- [ ] Verificar badge de turnos pendientes en header (si hay)
- [ ] Verificar gráficos:
  - [ ] **Gráfico de Barras:** Turnos por día de la semana
  - [ ] **Gráfico Circular:** Distribución por estado
  - [ ] **Gráfico de Línea:** Tendencia últimos 6 meses
  - [ ] **Gráfico de Barras Horizontal:** Horarios más solicitados
- [ ] Verificar lista de turnos de hoy
- [ ] Verificar lista de próximos turnos (7 días)
- [ ] Click en un turno → debe ir a perfil del paciente

### Gestión de Turnos
- [ ] Ir a: `/dashboard/professional/turnos`
- [ ] Verificar filtros funcionan:
  - [ ] Todos
  - [ ] Pendientes
  - [ ] Confirmados
  - [ ] Completados
  - [ ] Cancelados
- [ ] Probar búsqueda por nombre de paciente
- [ ] Probar acciones sobre un turno:
  - [ ] Confirmar turno pendiente
  - [ ] Completar turno confirmado
  - [ ] Cancelar turno
  - [ ] Eliminar turno (con confirmación)

### Crear Nuevo Turno
- [ ] Ir a: `/dashboard/professional/turnos/nuevo`
- [ ] Seleccionar un paciente
- [ ] Seleccionar fecha
- [ ] Verificar que solo muestra horas disponibles
- [ ] Seleccionar hora
- [ ] Agregar notas opcionales
- [ ] Crear turno
- [ ] Verificar que aparece en la lista

### Base de Datos de Pacientes
- [ ] Ir a: `/dashboard/professional/pacientes`
- [ ] Verificar lista de pacientes
- [ ] Probar búsqueda por nombre
- [ ] Click en un paciente
- [ ] Verificar página de detalle:
  - [ ] Info del paciente
  - [ ] Estadísticas (turnos totales, próximos, etc.)
  - [ ] Historial completo de turnos
  - [ ] Botón crear nuevo turno

### Sistema de Notificaciones (NUEVO)
- [ ] Ir a: `/dashboard/professional/notificaciones`
- [ ] **Tab Próximos Turnos:**
  - [ ] Ver lista de turnos confirmados
  - [ ] Verificar indicador de días restantes
  - [ ] Click en "Enviar Recordatorio" individual
  - [ ] Verificar animación de carga
  - [ ] Verificar mensaje de éxito
  - [ ] Si hay turnos mañana: probar "Enviar Todos"
- [ ] **Tab Configuración:**
  - [ ] Habilitar recordatorios automáticos
  - [ ] Cambiar días de anticipación
  - [ ] Cambiar horario de envío
  - [ ] Editar plantilla de mensaje
  - [ ] Verificar vista previa actualiza en tiempo real
  - [ ] Verificar variables {paciente}, {fecha}, {hora}
- [ ] **Tab Historial:**
  - [ ] Verificar placeholder para v2.0

### Configuración
- [ ] Ir a: `/dashboard/professional/configuracion`
- [ ] **Tab Perfil:**
  - [ ] Editar nombre
  - [ ] Editar especialidad
  - [ ] Agregar teléfono
  - [ ] Agregar email laboral
  - [ ] Agregar dirección
  - [ ] Guardar → verificar mensaje de éxito
- [ ] **Tab Horarios:**
  - [ ] Habilitar/deshabilitar días
  - [ ] Agregar franja horaria
  - [ ] Eliminar franja horaria
  - [ ] Cambiar duración de turnos
  - [ ] Guardar → verificar mensaje de éxito
- [ ] **Tab Branding:**
  - [ ] Cambiar nombre del consultorio
  - [ ] Probar paletas predefinidas
  - [ ] Cambiar colores personalizados
  - [ ] Verificar vista previa actualiza
  - [ ] Guardar → verificar mensaje de éxito

### Código QR
- [ ] Ir a: `/dashboard/professional/qr`
- [ ] Verificar QR se muestra correctamente
- [ ] Click en "Descargar QR" → verificar descarga PNG
- [ ] Click en "Copiar Link" → verificar notificación
- [ ] Click en "Compartir" → verificar Web Share API (en móvil)

---

## 📱 PANEL DEL PACIENTE

### Dashboard Principal
- [ ] Login como paciente: `maria@lopez.com` / `123456`
- [ ] Ir a: http://localhost:3000/dashboard/patient
- [ ] Verificar header con info del profesional
- [ ] Verificar botones de acción rápida
- [ ] Verificar alerta de turnos pendientes (si hay)
- [ ] Verificar próximos 3 turnos
- [ ] Verificar info del profesional en la parte inferior
- [ ] Verificar navegación inferior fija (4 botones)

### Solicitar Turno (3 Clics)
- [ ] Ir a: `/dashboard/patient/nuevo-turno`
- [ ] **Paso 1 - Seleccionar Fecha:**
  - [ ] Verificar muestra fechas disponibles
  - [ ] Verificar solo muestra días habilitados del profesional
  - [ ] Click en una fecha
- [ ] **Paso 2 - Seleccionar Hora:**
  - [ ] Verificar muestra horas disponibles para esa fecha
  - [ ] Verificar NO muestra horas ocupadas
  - [ ] Click en una hora
  - [ ] Probar "Cambiar fecha" → debe volver al paso 1
- [ ] **Paso 3 - Confirmar:**
  - [ ] Verificar resumen del turno
  - [ ] Agregar notas opcionales
  - [ ] Click en "Confirmar Turno"
  - [ ] Verificar redirección con mensaje de éxito
  - [ ] Probar "Volver" → debe volver al paso 2

### Mis Turnos
- [ ] Ir a: `/dashboard/patient/turnos`
- [ ] Verificar filtros funcionan:
  - [ ] Próximos
  - [ ] Pendientes
  - [ ] Pasados
  - [ ] Todos
- [ ] Verificar contadores en filtros
- [ ] Verificar cada turno muestra:
  - [ ] Fecha y hora
  - [ ] Estado con badge de color
  - [ ] Datos del profesional
  - [ ] Notas
  - [ ] Teléfono clickeable
- [ ] Probar cancelar un turno futuro:
  - [ ] Click en "Cancelar turno"
  - [ ] Verificar modal de confirmación
  - [ ] Confirmar cancelación
  - [ ] Verificar mensaje de éxito
  - [ ] Verificar turno actualizado

### Perfil del Paciente
- [ ] Ir a: `/dashboard/patient/perfil`
- [ ] **Editar Información:**
  - [ ] Click en "Editar"
  - [ ] Cambiar nombre
  - [ ] Cambiar teléfono
  - [ ] Verificar email NO es editable
  - [ ] Guardar → verificar mensaje de éxito
- [ ] **Cambiar Contraseña:**
  - [ ] Click en "Cambiar"
  - [ ] Ingresar contraseña actual
  - [ ] Ingresar nueva contraseña
  - [ ] Confirmar nueva contraseña
  - [ ] Guardar → verificar mensaje de éxito
  - [ ] Probar contraseña actual incorrecta (debe fallar)
  - [ ] Probar contraseñas no coinciden (debe fallar)
- [ ] Verificar info del profesional se muestra correctamente
- [ ] Probar "Cerrar Sesión" → debe volver a login

---

## 🌐 RESPONSIVE DESIGN

### Desktop (1920x1080)
- [ ] Dashboard profesional con gráficos en grid 2x2
- [ ] Sidebar fijo de 256px
- [ ] Tarjetas en grid de 4 columnas
- [ ] Tablas completas visibles

### Tablet (768x1024)
- [ ] Grid de gráficos se adapta a 1 columna
- [ ] Tarjetas en grid de 2 columnas
- [ ] Sidebar se mantiene

### Mobile (375x667)
- [ ] Panel paciente con navegación inferior
- [ ] Tarjetas en 1 columna
- [ ] Botones touch-friendly
- [ ] Texto legible sin zoom

---

## 🔄 FLUJOS COMPLETOS E2E

### Flujo Profesional: Crear y Gestionar Turno
1. [ ] Login como profesional
2. [ ] Ir a crear turno
3. [ ] Seleccionar paciente, fecha, hora
4. [ ] Crear turno (queda pendiente si lo crea paciente, o confirmado si lo crea profesional)
5. [ ] Ver turno en dashboard principal
6. [ ] Ir a lista de turnos
7. [ ] Confirmar turno (si estaba pendiente)
8. [ ] Enviar recordatorio desde notificaciones
9. [ ] Marcar como completado
10. [ ] Ver en historial del paciente

### Flujo Paciente: Solicitar Turno
1. [ ] Login como paciente
2. [ ] Dashboard → Click "Nuevo Turno"
3. [ ] Seleccionar fecha → hora → confirmar (3 clics)
4. [ ] Ver turno en "Mis Turnos" con estado "Pendiente"
5. [ ] Esperar a que profesional confirme
6. [ ] Ver turno actualizado a "Confirmado"
7. [ ] Recibir recordatorio (simulado)
8. [ ] Ir al turno
9. [ ] Ver turno como "Completado"

### Flujo Completo: Nuevo Profesional Setup
1. [ ] Registro de nuevo profesional
2. [ ] Completar configuración:
   - [ ] Perfil (nombre, especialidad, contacto)
   - [ ] Horarios de atención
   - [ ] Branding (colores, nombre consultorio)
3. [ ] Descargar código QR
4. [ ] Registrar primer paciente usando QR
5. [ ] Crear primer turno
6. [ ] Configurar notificaciones automáticas

---

## 🐛 CASOS EDGE Y VALIDACIONES

### Validaciones de Datos
- [ ] No se puede crear turno en horario ocupado
- [ ] No se puede crear turno en día no laborable
- [ ] No se puede crear turno en el pasado
- [ ] No se puede cancelar turno pasado
- [ ] No se puede registrar con email duplicado
- [ ] Contraseñas deben tener mínimo 6 caracteres

### Estados Vacíos (Empty States)
- [ ] Dashboard sin turnos de hoy
- [ ] Dashboard sin turnos próximos
- [ ] Dashboard sin pacientes
- [ ] Lista de turnos vacía
- [ ] Lista de pacientes vacía
- [ ] Notificaciones sin turnos próximos
- [ ] Paciente sin turnos

### Manejo de Errores
- [ ] Error de red en login → mensaje claro
- [ ] Error al crear turno → mensaje y no se limpia form
- [ ] Error al enviar notificación → mensaje rojo
- [ ] Sesión expirada → redirige a login

---

## ⚡ RENDIMIENTO Y OPTIMIZACIÓN

### Tiempos de Carga
- [ ] Dashboard profesional carga en < 2 segundos
- [ ] Panel paciente carga en < 1 segundo
- [ ] Gráficos se renderizan sin lag
- [ ] Búsquedas responden instantáneamente

### Queries de Base de Datos
- [ ] No hay N+1 queries
- [ ] Todas las relaciones (joins) funcionan
- [ ] Filtros se aplican en DB, no en cliente

### UX
- [ ] Todos los botones muestran estados de carga
- [ ] Mensajes de éxito desaparecen automáticamente
- [ ] Navegación fluida sin recargas innecesarias
- [ ] Forms se limpian después de submit exitoso

---

## 🔒 SEGURIDAD

### Autenticación y Autorización
- [ ] Rutas protegidas requieren autenticación
- [ ] Profesional NO puede acceder a dashboard de otro profesional
- [ ] Paciente NO puede acceder a dashboard profesional
- [ ] Paciente solo ve sus propios turnos
- [ ] Profesional solo ve sus propios pacientes
- [ ] API endpoints validan permisos

### Datos Sensibles
- [ ] Contraseñas hasheadas con bcrypt
- [ ] No se exponen contraseñas en respuestas API
- [ ] Sessions seguras con NextAuth
- [ ] Variables de entorno no expuestas

---

## 📱 COMPATIBILIDAD

### Navegadores Desktop
- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)

### Navegadores Mobile
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

### Resoluciones Probadas
- [ ] 1920x1080 (Desktop FHD)
- [ ] 1366x768 (Laptop común)
- [ ] 768x1024 (Tablet)
- [ ] 375x667 (iPhone SE)
- [ ] 414x896 (iPhone 11)

---

## 🎨 DISEÑO Y UI

### Consistencia Visual
- [ ] Colores consistentes en toda la app
- [ ] Tipografía consistente
- [ ] Espaciado uniforme
- [ ] Iconos del mismo set
- [ ] Botones con mismo estilo

### Accesibilidad Básica
- [ ] Contraste de texto suficiente
- [ ] Botones con tamaño mínimo touch (44x44px)
- [ ] Forms con labels claras
- [ ] Mensajes de error descriptivos

---

## 📊 CHECKLIST FINAL

### Pre-Deploy
- [ ] ✅ Build de producción exitoso
- [ ] ✅ Sin errores de TypeScript
- [ ] ✅ Sin warnings críticos
- [ ] ✅ Todas las variables de entorno documentadas
- [ ] ✅ README actualizado
- [ ] ✅ ESTADO_ACTUAL.md actualizado
- [ ] ✅ .env.example creado

### Testing Manual Completado
- [ ] Autenticación (profesional y paciente)
- [ ] Dashboard profesional con gráficos
- [ ] Sistema de notificaciones
- [ ] Gestión de turnos
- [ ] Base de datos de pacientes
- [ ] Panel del paciente
- [ ] Configuración
- [ ] Código QR

### Flujos E2E Probados
- [ ] Setup inicial profesional
- [ ] Registro y primer turno de paciente
- [ ] Ciclo completo de turno (crear → confirmar → completar)
- [ ] Envío de notificaciones

---

## 🚀 PREPARACIÓN PARA PRODUCCIÓN

### Lista Final de Verificación

**Código:**
- [ ] Sin console.logs innecesarios
- [ ] Sin código comentado
- [ ] Sin TODOs críticos pendientes
- [ ] Tipos TypeScript completos

**Configuración:**
- [ ] Variables de entorno de producción configuradas
- [ ] SUPABASE_URL de producción
- [ ] SUPABASE_ANON_KEY de producción
- [ ] NEXTAUTH_SECRET generado (fuerte)
- [ ] NEXTAUTH_URL apuntando a dominio de producción

**Base de Datos:**
- [ ] Migrations aplicadas en Supabase producción
- [ ] RLS policies habilitadas
- [ ] Indexes creados para queries frecuentes
- [ ] Backup strategy definido

**Deploy:**
- [ ] Plataforma elegida (Vercel recomendado)
- [ ] Dominio configurado
- [ ] SSL/HTTPS habilitado
- [ ] Variables de entorno en plataforma
- [ ] Build de producción testeado localmente

---

## ✅ RESULTADO ESPERADO

Al completar todos estos tests, deberías tener:

1. ✅ Sistema completamente funcional sin bugs críticos
2. ✅ Todas las features implementadas probadas
3. ✅ Performance aceptable en todas las páginas
4. ✅ Diseño responsive en todos los dispositivos
5. ✅ Seguridad básica verificada
6. ✅ UX fluida y sin errores
7. ✅ Listo para deploy a producción

---

**Documento de Testing:** 23 de Enero 2026
**Versión:** 1.0
**Estado:** En Testing

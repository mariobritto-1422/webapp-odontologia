# 🧪 Guía de Testing - WebApp Odontología

---

## 🚀 Servidor Activo

**URL:** http://localhost:3000
**Estado:** ✅ Corriendo sin errores

---

## 📝 Credenciales de Prueba

### Profesional:
- **Email:** `juan@garcia.com`
- **Password:** `123456`
- **Slug:** `dr-juan-garcia`

### Paciente:
- **Email:** `maria@lopez.com`
- **Password:** `123456`

---

## 🎯 PLAN DE TESTING - PASO A PASO

### **PARTE 1: Autenticación**

#### Test 1.1 - Login como Profesional
1. Abre: http://localhost:3000/auth/login
2. Ingresa:
   - Email: `juan@garcia.com`
   - Password: `123456`
3. Click en "Iniciar Sesión"
4. ✅ Deberías ser redirigido a `/dashboard/professional`

#### Test 1.2 - Ver Dashboard Principal
1. Una vez logueado, verifica que veas:
   - ✅ Sidebar con navegación (Panel Principal, Turnos, Pacientes, Configuración, Código QR)
   - ✅ Nombre del profesional en el sidebar
   - ✅ Tarjetas de estadísticas (Pacientes, Turnos totales, Turnos hoy)
   - ✅ Sección "Turnos de Hoy" (puede estar vacía)
   - ✅ Sección "Próximos Turnos" (puede estar vacía)

---

### **PARTE 2: Gestión de Turnos**

#### Test 2.1 - Ver Lista de Turnos
1. Click en "Turnos" en el sidebar
2. Deberías ver:
   - ✅ Botón "+ Nuevo Turno"
   - ✅ Buscador
   - ✅ Filtros por estado (Todos, Pendientes, Confirmados, Completados, Cancelados)
   - ✅ Lista de turnos (puede estar vacía si no hay turnos)

#### Test 2.2 - Crear Nuevo Turno
1. Click en "+ Nuevo Turno"
2. Si no tienes pacientes:
   - ✅ Deberías ver mensaje "No tenés pacientes registrados todavía"
   - ✅ Link para generar código QR
3. Si tienes pacientes:
   - Selecciona un paciente
   - Selecciona una fecha
   - Selecciona una hora
   - Agrega notas (opcional)
   - Click en "Crear Turno"
   - ✅ Deberías ser redirigido a la lista de turnos
   - ✅ El turno debería aparecer en la lista

#### Test 2.3 - Filtrar Turnos
1. En la lista de turnos, prueba:
   - ✅ Buscar por nombre de paciente
   - ✅ Filtrar por estado (Pendientes, Confirmados, etc.)
   - ✅ Los turnos se filtran correctamente

#### Test 2.4 - Acciones en Turnos
Si tienes turnos creados, prueba:
1. Turno Pendiente:
   - ✅ Botón "Confirmar" → cambia a Confirmado
   - ✅ Botón "Cancelar" → cambia a Cancelado
2. Turno Confirmado:
   - ✅ Botón "Completar" → cambia a Completado
   - ✅ Botón "Cancelar" → cambia a Cancelado
3. ✅ Botón "Eliminar" en cualquier turno

---

### **PARTE 3: Base de Datos de Pacientes**

#### Test 3.1 - Ver Lista de Pacientes
1. Click en "Pacientes" en el sidebar
2. Deberías ver:
   - ✅ Contador de pacientes totales
   - ✅ Buscador
   - ✅ Lista de pacientes (si hay)
   - ✅ Estadísticas por paciente (turnos totales, próximos)

#### Test 3.2 - Buscar Paciente
1. En el buscador, escribe:
   - Nombre del paciente
   - Email
   - Teléfono
2. ✅ Los resultados se filtran en tiempo real

#### Test 3.3 - Ver Detalle de Paciente
1. Click en cualquier paciente de la lista
2. Deberías ver:
   - ✅ Información completa del paciente (nombre, email, teléfono)
   - ✅ Fecha de registro
   - ✅ Estadísticas (turnos totales, completados, próximos, cancelados)
   - ✅ Historial completo de turnos
   - ✅ Botón "+ Nuevo Turno" para ese paciente

---

### **PARTE 4: Configuración**

#### Test 4.1 - Configurar Perfil Profesional
1. Click en "Configuración" en el sidebar
2. Tab "Perfil Profesional":
   - ✅ Ver datos actuales del profesional
   - ✅ Editar nombre completo
   - ✅ Editar especialidad
   - ✅ Agregar teléfonos (personal y laboral)
   - ✅ Agregar email laboral
   - ✅ Agregar dirección del consultorio
   - ✅ Click en "Guardar Cambios"
   - ✅ Mensaje de éxito

#### Test 4.2 - Configurar Horarios
1. Tab "Horarios":
   - ✅ Seleccionar duración de turnos (15, 30, 45, 60, 90, 120 min)
   - ✅ Para cada día de la semana:
     - Activar/desactivar día
     - Configurar horarios (inicio y fin)
     - Agregar múltiples franjas horarias
     - Eliminar franjas horarias
   - ✅ Click en "Guardar Horarios"
   - ✅ Mensaje de éxito

#### Test 4.3 - Configurar Branding
1. Tab "Branding":
   - ✅ Ver paletas de colores predefinidas
   - ✅ Click en una paleta → colores se aplican
   - ✅ Editar nombre del consultorio
   - ✅ Cambiar color primario manualmente
   - ✅ Cambiar color secundario manualmente
   - ✅ Vista previa en tiempo real con botones
   - ✅ Click en "Guardar Branding"
   - ✅ Mensaje de éxito

---

### **PARTE 5: Código QR**

#### Test 5.1 - Ver y Generar QR
1. Click en "Código QR" en el sidebar
2. Deberías ver:
   - ✅ Explicación de cómo funciona el QR
   - ✅ Código QR generado con URL del profesional
   - ✅ URL completa visible
   - ✅ Botón "Descargar QR"
   - ✅ Botón "Copiar Link"
   - ✅ Botón "Compartir"
   - ✅ Sugerencias de uso del QR

#### Test 5.2 - Probar Acciones del QR
1. Click en "Copiar Link":
   - ✅ Link copiado al portapapeles
   - ✅ Mensaje "Link Copiado"
2. Click en "Descargar QR":
   - ✅ Se descarga imagen PNG del QR
3. Click en "Compartir":
   - ✅ Abre menú de compartir (si el navegador lo soporta)
   - ✅ O copia al portapapeles como fallback

---

### **PARTE 6: Registro de Pacientes (URL del QR)**

#### Test 6.1 - Probar URL de Registro
1. Copia la URL del QR (o usa):
   ```
   http://localhost:3000/auth/register/patient?professional=dr-juan-garcia
   ```
2. Abre en nueva pestaña (o cierra sesión primero)
3. Deberías ver:
   - ✅ Formulario de registro para pacientes
   - ✅ Mensaje "Te estás registrando con: Dr. Juan García"
   - ✅ Campos: nombre, email, teléfono, contraseña
   - ✅ Checkboxes de términos y privacidad (obligatorios)

#### Test 6.2 - Registrar Nuevo Paciente
1. Completa el formulario:
   - Nombre: `Pedro Gómez`
   - Email: `pedro@gomez.com`
   - Teléfono: `+54 9 11 5555-5555`
   - Contraseña: `123456`
   - Confirmar contraseña: `123456`
   - ✅ Acepto términos
   - ✅ Acepto privacidad
2. Click en "Crear Cuenta"
3. ✅ Deberías ser redirigido al login
4. ✅ Mensaje de éxito

---

### **PARTE 7: Cerrar Sesión**

#### Test 7.1 - Logout
1. Scroll al final del sidebar
2. Click en "Cerrar Sesión"
3. ✅ Deberías ser redirigido a `/auth/login`
4. ✅ Ya no deberías tener acceso al dashboard

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error: "No autorizado" o redirección al login
**Solución:** Vuelve a iniciar sesión con las credenciales correctas

### Error: Estilos no se cargan correctamente
**Solución:**
1. Detener servidor (Ctrl+C)
2. Ejecutar: `npm run dev`
3. Refrescar navegador (Ctrl+F5)

### Error: No aparecen los turnos/pacientes
**Causa:** Base de datos vacía
**Solución:** Crea turnos y pacientes usando el formulario de "Nuevo Turno"

### Error: No se puede crear turno sin pacientes
**Solución:**
1. Genera el código QR
2. Registra pacientes usando la URL del QR
3. Luego podrás crear turnos

---

## ✅ CHECKLIST COMPLETO DE FUNCIONALIDADES

### Autenticación:
- [ ] Login como profesional funciona
- [ ] Dashboard carga correctamente
- [ ] Logout funciona

### Dashboard:
- [ ] Se muestran estadísticas
- [ ] Se muestran turnos de hoy
- [ ] Se muestran próximos turnos
- [ ] Navegación del sidebar funciona

### Gestión de Turnos:
- [ ] Ver lista de turnos
- [ ] Filtrar turnos por estado
- [ ] Buscar turnos por paciente
- [ ] Crear nuevo turno
- [ ] Confirmar turno
- [ ] Cancelar turno
- [ ] Completar turno
- [ ] Eliminar turno

### Pacientes:
- [ ] Ver lista de pacientes
- [ ] Buscar pacientes
- [ ] Ver detalle de paciente
- [ ] Ver historial de turnos del paciente
- [ ] Crear turno desde perfil del paciente

### Configuración:
- [ ] Editar perfil profesional
- [ ] Configurar horarios de atención
- [ ] Agregar múltiples franjas horarias
- [ ] Cambiar duración de turnos
- [ ] Personalizar branding (colores)
- [ ] Cambiar nombre del consultorio

### Código QR:
- [ ] Ver QR generado
- [ ] Copiar link de registro
- [ ] Descargar QR como imagen
- [ ] Compartir QR

### Registro de Pacientes:
- [ ] URL del QR funciona
- [ ] Formulario de registro muestra profesional correcto
- [ ] Validaciones de formulario funcionan
- [ ] Registro exitoso redirige al login

---

## 📊 RESULTADO ESPERADO

Al completar todos los tests:
- ✅ Sistema de autenticación funcional
- ✅ Dashboard completo del profesional
- ✅ CRUD de turnos completo
- ✅ Base de datos de pacientes navegable
- ✅ Configuración totalmente funcional
- ✅ QR generado y descargable
- ✅ Registro de pacientes operativo

---

## 📞 ¿ENCONTRASTE UN ERROR?

Si encuentras algún error durante el testing:
1. Anota la URL donde ocurrió
2. Anota qué acción estabas haciendo
3. Copia el mensaje de error (si hay)
4. Avísame para corregirlo

---

**✨ ¡Feliz Testing! ✨**

**Última actualización:** 23 de Enero 2026 - 20:00 hs

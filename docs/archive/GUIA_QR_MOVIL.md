# 📱 Guía de QR para Registro de Pacientes

## ✅ Estado Actual

El sistema de QR está **100% implementado y funcional**. Incluye:

- ✅ Generación de QR único por profesional
- ✅ Descarga del QR en formato PNG
- ✅ Compartir QR por redes sociales/WhatsApp
- ✅ Copiar link de registro
- ✅ Página de registro pública (sin login)
- ✅ Responsive design para móviles
- ✅ Asociación automática paciente-profesional

---

## 🎯 Cómo Funciona el QR

### 1. El Profesional Genera su QR

1. El profesional inicia sesión
2. Va a **Dashboard → QR**
3. El sistema genera automáticamente:
   - Un código QR único
   - Un link de registro personalizado
   - Formato: `https://tu-app.vercel.app/auth/register/patient?professional=dr-garcia`

### 2. El Profesional Comparte el QR

Puede compartir de varias formas:
- 📱 **Descargar** el QR como imagen PNG
- 📋 **Copiar** el link al portapapeles
- 📤 **Compartir** directamente desde el navegador

### 3. El Paciente Escanea el QR

1. El paciente escanea el QR con su móvil
2. Se abre el navegador automáticamente
3. Ve la página de registro con:
   - El nombre del profesional
   - Su especialidad
   - Formulario de registro

### 4. El Paciente Se Registra

1. Completa sus datos:
   - Nombre completo
   - Email
   - Teléfono (opcional)
   - Contraseña
2. Acepta términos y privacidad
3. Se crea la cuenta
4. Queda automáticamente asociado al profesional
5. Puede iniciar sesión y solicitar turnos inmediatamente

---

## 📱 Compatibilidad Móvil

### Dispositivos Compatibles

✅ **iOS (iPhone/iPad)**
- Safari (nativo)
- Chrome
- Firefox
- Cámara nativa de iOS (escaneo de QR)

✅ **Android**
- Chrome (nativo)
- Samsung Internet
- Firefox
- Google Lens
- Cámara nativa (en modelos recientes)

✅ **Otros**
- Tablets
- Cualquier dispositivo con cámara y navegador

### Cómo Escanear el QR

#### iPhone / iPad

**Método 1: Cámara Nativa**
1. Abrir app **Cámara**
2. Apuntar al QR
3. Aparece notificación en la parte superior
4. Tocar la notificación
5. Se abre Safari con la página de registro

**Método 2: Google Lens**
1. Mantener presionado el ícono de Google
2. Seleccionar **Lens**
3. Apuntar al QR
4. Tocar el link que aparece

#### Android

**Método 1: Cámara Nativa (Android 9+)**
1. Abrir app **Cámara**
2. Apuntar al QR
3. Tocar la notificación
4. Se abre Chrome

**Método 2: Google Lens**
1. Abrir **Google Photos** o **Google App**
2. Tocar ícono de Lens
3. Apuntar al QR
4. Tocar el link

**Método 3: Chrome**
1. Abrir **Chrome**
2. Tocar los 3 puntos (menú)
3. Seleccionar **Escanear código QR**
4. Apuntar al QR

---

## 🧪 Testing del QR

### Test Local (Desarrollo)

El QR en desarrollo usa `http://localhost:3000`, por lo que **solo funciona en tu red local**.

Para probar en tu móvil:

1. Asegúrate que tu PC y móvil estén en la misma WiFi
2. Encuentra la IP de tu PC:
   ```bash
   # Windows
   ipconfig
   # Buscar "Dirección IPv4"

   # Mac/Linux
   ifconfig
   # Buscar "inet"
   ```
3. Actualiza `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=http://192.168.1.X:3000
   ```
4. Reinicia el servidor: `npm run dev`
5. Genera el QR nuevamente
6. Escanea desde tu móvil

### Test en Producción

Una vez deployed en Vercel, el QR funciona desde **cualquier lugar del mundo**:

1. Ve a tu app en Vercel: `https://tu-app.vercel.app`
2. Inicia sesión como profesional
3. Ve a **Dashboard → QR**
4. Descarga el QR o copia el link
5. Envía el link por WhatsApp a un amigo/familiar
6. Pídeles que lo abran o escaneen el QR
7. Deberían poder registrarse exitosamente

---

## 📤 Formas de Compartir el QR

### 1. WhatsApp

**Opción A: Compartir Link**
1. En Dashboard → QR, clic en **Copiar Link**
2. Abrir WhatsApp
3. Pegar el link en el chat
4. El paciente hace clic y se abre el registro

**Opción B: Compartir Imagen**
1. Clic en **Descargar QR**
2. Abrir WhatsApp
3. Adjuntar imagen (📎)
4. Seleccionar el QR descargado
5. Enviar
6. El paciente escanea con su cámara

**Opción C: Botón Compartir**
1. Clic en **Compartir**
2. Seleccionar **WhatsApp**
3. Elegir contacto
4. Enviar

### 2. Instagram / Facebook

1. Descargar el QR
2. Crear un post/story
3. Subir la imagen del QR
4. Agregar texto explicativo:
   ```
   📱 Pedí tu turno fácilmente
   Escaneá el QR o hacé clic en el link de mi bio
   ```

### 3. Email

1. Copiar el link
2. Componer email
3. Pegar el link con texto:
   ```
   Estimado paciente,

   A partir de ahora podés registrarte y solicitar turnos
   de forma online haciendo clic en este link:

   https://tu-app.vercel.app/auth/register/patient?professional=tu-slug

   ¡Te esperamos!
   ```

### 4. Imprimir en Consultorio

1. Descargar el QR en alta calidad
2. Opcional: Editar en Canva/Photoshop agregando:
   - Logo del consultorio
   - Texto: "Escaneá para registrarte"
   - Horarios de atención
   - Teléfono de contacto
3. Imprimir en:
   - A4 (para poster)
   - Tarjeta personal (10x5cm)
   - Adhesivo (para vidrieras)
4. Colocar en:
   - Recepción
   - Sala de espera
   - Vidrieras
   - Tarjetas personales

---

## ⚠️ Solución de Problemas

### El QR muestra localhost en producción

**Problema:** El QR generado muestra `http://localhost:3000`

**Solución:**
1. Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado en Vercel
2. El valor debe ser: `https://tu-app.vercel.app`
3. Haz un Redeploy en Vercel
4. Limpia caché del navegador (Ctrl+F5)
5. Genera el QR nuevamente

### El móvil no reconoce el QR

**Problema:** Al escanear no pasa nada

**Causas posibles:**
- Poca luz → Iluminar mejor
- QR borroso → Descargar en alta calidad
- QR muy chico → Imprimir más grande (mínimo 3x3cm)
- Cámara desenfocada → Limpiar lente

**Solución:** Compartir el link directo por WhatsApp

### Error "Profesional no encontrado"

**Problema:** Al abrir el link aparece error

**Causas posibles:**
1. El slug del profesional es incorrecto
2. El profesional está inactivo (`is_active = false`)
3. El profesional fue eliminado

**Solución:**
1. Verificar en Supabase:
   ```sql
   SELECT id, name, slug, is_active
   FROM professionals
   WHERE slug = 'tu-slug';
   ```
2. Asegurar que `is_active = true`

### El paciente no puede registrarse

**Problema:** El formulario no funciona

**Causas posibles:**
- Email ya registrado con otro profesional
- Contraseña muy corta (< 6 caracteres)
- No aceptó términos y condiciones
- Error de conexión a Supabase

**Solución:** Ver mensaje de error específico y seguir instrucciones

---

## 📊 Estadísticas de Uso

### Monitorear Registros desde QR

Puedes ver cuántos pacientes se registraron:

```sql
-- Pacientes nuevos por mes
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_patients
FROM patients
WHERE professional_id = 'tu-id'
GROUP BY month
ORDER BY month DESC;

-- Total de pacientes
SELECT COUNT(*) as total_patients
FROM patients
WHERE professional_id = 'tu-id';
```

---

## 💡 Mejores Prácticas

### Diseño del QR Impreso

✅ **Recomendaciones:**
- Tamaño mínimo: 3x3 cm
- Margen blanco alrededor: 1cm
- Incluir texto: "Escaneá para registrarte"
- Incluir tu nombre/logo
- Buena calidad de impresión

❌ **Evitar:**
- QR muy pequeño (< 2cm)
- Colores oscuros de fondo
- Papel brillante (refleja luz)
- Lugares con poca luz

### Difusión del QR

✅ **Estrategias efectivas:**
- Enviar por WhatsApp a pacientes actuales
- Post en redes sociales 1 vez por semana
- Imprimir en tarjetas personales
- Póster en sala de espera
- Incluir en firma de email

❌ **Evitar:**
- Enviar spam masivo
- Compartir en grupos irrelevantes

---

## 📝 Textos Sugeridos para Compartir

### Para WhatsApp

```
¡Hola! 👋

A partir de ahora podés pedir tus turnos de forma online 📱

Registrate en mi sistema escaneando este QR
o haciendo clic en este link:

[LINK AQUÍ]

Es simple, rápido y seguro ✅

¡Nos vemos pronto! 🦷
```

### Para Instagram/Facebook Story

```
📱 NUEVO: Sistema de Turnos Online

Ahora podés:
✅ Pedir turnos 24/7
✅ Ver tus próximos turnos
✅ Historial completo

👇 Escaneá el QR o link en bio
```

### Para Email

```
Asunto: 🦷 Nuevo Sistema de Turnos Online

Estimado/a [NOMBRE],

Me complace informarte que ahora contamos con un sistema
de turnos online para mayor comodidad.

Beneficios:
✅ Pedí turnos 24/7 desde tu celular
✅ Recibí recordatorios automáticos
✅ Consultá tu historial

Para comenzar, registrate haciendo clic aquí:
[LINK]

O escaneá el QR adjunto.

¡Te esperamos!

[TU NOMBRE]
[TU CONSULTORIO]
```

---

## 🚀 Conclusión

El sistema de QR está **listo para producción** y funciona en cualquier dispositivo móvil moderno.

**Ventajas:**
- ✅ Sin necesidad de app
- ✅ Funciona en iOS y Android
- ✅ Registro en 2 minutos
- ✅ Link directo alternativo
- ✅ Totalmente responsive

**Próximos pasos:**
1. Deploy a producción en Vercel
2. Generar tu QR
3. Compartir con tus pacientes
4. ¡Empezar a recibir solicitudes de turnos!

---

**Última actualización:** 24 de Enero 2026

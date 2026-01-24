# 📧 Configuración del Sistema de Notificaciones

## ✅ Funcionalidades Implementadas

El sistema de notificaciones está **100% funcional** con las siguientes características:

- ✅ Envío de recordatorios individuales por email
- ✅ Envío masivo de recordatorios
- ✅ Plantillas de mensaje personalizables
- ✅ Historial completo de notificaciones enviadas
- ✅ Tracking de estado (enviado/fallido)
- ✅ Integración con Resend para emails profesionales

---

## 🚀 Configuración Paso a Paso

### 1. Crear tabla de notificaciones en Supabase

Ejecuta el script de migración en tu base de datos de Supabase:

1. Ve a Supabase Dashboard → SQL Editor
2. Copia y pega el contenido de `database/migration-notifications.sql`
3. Ejecuta el script
4. Verifica que la tabla `notifications` se haya creado correctamente

```sql
-- Verificar que la tabla existe
SELECT * FROM notifications LIMIT 1;
```

### 2. Obtener API Key de Resend

Resend es un servicio moderno y confiable para envío de emails transaccionales.

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita (incluye 3,000 emails/mes gratis)
3. Verifica tu dominio (opcional, pero recomendado para producción)
4. Ve a **API Keys** y crea una nueva key
5. Copia la key (empieza con `re_`)

### 3. Configurar Variables de Entorno

Agrega la API key de Resend a tu `.env.local`:

```bash
RESEND_API_KEY=re_tu_api_key_aqui
```

**Importante:** En producción (Vercel), también debes agregar esta variable en:
- Vercel Dashboard → Tu Proyecto → Settings → Environment Variables

### 4. Configurar Dominio de Envío (Opcional pero Recomendado)

Por defecto, los emails se envían desde `onboarding@resend.dev`. Para emails más profesionales:

1. En Resend Dashboard, ve a **Domains**
2. Agrega tu dominio (ej: `tudominio.com`)
3. Configura los registros DNS que te indican
4. Una vez verificado, actualiza el código en `app/api/notifications/send/route.ts`:

```typescript
from: `${professional.name} <notificaciones@tudominio.com>`,
```

---

## 📝 Cómo Funciona

### Flujo de Envío de Notificaciones

1. **Usuario hace clic en "Enviar Recordatorio"**
2. El frontend llama a `/api/notifications/send` con los datos
3. La API:
   - Valida que el paciente tenga email
   - Crea un registro en la tabla `notifications` (status: pending)
   - Intenta enviar el email con Resend
   - Actualiza el registro a `sent` o `failed`
4. El usuario ve confirmación o error
5. El historial se actualiza automáticamente

### Plantilla de Email

Los emails se envían con un diseño HTML responsive que incluye:
- Header con colores del branding del profesional
- Mensaje personalizado con variables: `{paciente}`, `{fecha}`, `{hora}`
- Footer con info del sistema
- Diseño optimizado para mobile y desktop

### Variables Disponibles en Plantillas

- `{paciente}` - Nombre del paciente
- `{fecha}` - Fecha del turno (formato: "Jueves 25 de Enero")
- `{hora}` - Hora del turno (formato: "14:00")

---

## 🧪 Testing

### Probar en Desarrollo

1. Asegúrate de tener configurado `RESEND_API_KEY`
2. Inicia el servidor: `npm run dev`
3. Ve a Dashboard Profesional → Notificaciones
4. Crea un turno con un paciente que tenga email
5. Envía un recordatorio de prueba
6. Verifica que llegue el email

### Verificar en Supabase

```sql
-- Ver todas las notificaciones
SELECT
  n.*,
  p.name as patient_name,
  a.date,
  a.time
FROM notifications n
JOIN patients p ON n.patient_id = p.id
JOIN appointments a ON n.appointment_id = a.id
ORDER BY n.created_at DESC
LIMIT 10;

-- Ver estadísticas
SELECT
  status,
  COUNT(*) as total,
  type
FROM notifications
GROUP BY status, type;
```

---

## 📊 Monitoreo en Resend

Resend provee un dashboard completo para monitorear tus emails:

1. Ve a [https://resend.com/emails](https://resend.com/emails)
2. Verás todas las notificaciones enviadas
3. Puedes ver:
   - Estado de entrega (delivered, bounced, etc.)
   - Tasa de apertura
   - Clicks
   - Errores

---

## 🔧 Troubleshooting

### Error: "RESEND_API_KEY no configurado"

**Solución:** Verifica que la variable esté en `.env.local` y reinicia el servidor.

### Error: "El paciente no tiene email registrado"

**Solución:** Asegúrate de que el paciente tenga un email válido en su perfil.

### Los emails no llegan

**Posibles causas:**
1. API key incorrecta o vencida → Verifica en Resend Dashboard
2. Email del paciente incorrecto → Verifica en la tabla `patients`
3. Email en spam → Configura un dominio verificado en Resend
4. Límite de emails excedido → Verifica tu plan en Resend (3000/mes gratis)

### Error: "Failed to send email"

**Solución:** Revisa los logs de la API y el dashboard de Resend para ver el error específico.

---

## 💰 Costos

### Plan Gratuito de Resend
- ✅ 3,000 emails/mes
- ✅ Dominio verificado
- ✅ API completa
- ✅ Dashboard con analytics

### Si superas los 3,000 emails/mes
- $20/mes por 50,000 emails adicionales
- Más info: [https://resend.com/pricing](https://resend.com/pricing)

**Estimación para consultorio típico:**
- 20 pacientes/día × 30 días = 600 turnos/mes
- 1 recordatorio por turno = 600 emails/mes
- ✅ Entra cómodamente en el plan gratuito

---

## 🚀 Próximas Mejoras (v2.0)

- [ ] Integración con WhatsApp Business API
- [ ] Recordatorios automáticos programados
- [ ] SMS como canal alternativo
- [ ] Plantillas múltiples
- [ ] A/B testing de mensajes
- [ ] Analytics avanzados

---

## 📚 Recursos Adicionales

- [Documentación de Resend](https://resend.com/docs)
- [API Reference de Resend](https://resend.com/docs/api-reference)
- [Verificar Dominio](https://resend.com/docs/dashboard/domains/introduction)

---

**Última actualización:** 24 de Enero 2026

# ⚠️ IMPORTANTE: RLS Deshabilitado

## Estado Actual

**RLS (Row Level Security) está DESHABILITADO en la tabla `appointments`**

Esto es **TEMPORAL para desarrollo local**.

## ¿Por qué?

- Nuestra app usa **NextAuth** para autenticación
- Supabase RLS usa **Supabase Auth** (`auth.uid()`)
- No son compatibles directamente

## Seguridad Actual

Las validaciones de seguridad están en el **código de la aplicación**:

### API Routes con Validación:

**✅ /api/patient/request-appointment/route.ts**
```typescript
// Línea 25: Verifica que el paciente es el usuario actual
if (patientId !== session.user.id) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
}
```

**✅ /api/patient/cancel-appointment/route.ts**
```typescript
// Línea 28: Verifica que el paciente es el usuario actual
if (patientId !== session.user.id) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
}
```

**✅ /api/appointments/create/route.ts**
```typescript
// Verifica que el profesional solo crea turnos para sus pacientes
```

**✅ /api/appointments/update/route.ts**
```typescript
// Verifica que el profesional solo actualiza sus propios turnos
```

**✅ Todas las queries en páginas usan:**
```typescript
.eq('professional_id', professionalId)
.eq('patient_id', patientId)
```

## Para Producción

Antes de deploy, elegir una de estas opciones:

### Opción A: Service Role Key (Recomendada para v1.0) ⭐

1. En Supabase Dashboard → Settings → API
2. Copiar `service_role` key
3. Crear variable de entorno separada:
   ```
   SUPABASE_SERVICE_KEY=tu_service_role_key
   ```
4. Usar en API routes server-side
5. Mantener validaciones de código

**Pros:**
- ✅ Fácil de implementar
- ✅ Las validaciones ya existen
- ✅ Funciona con NextAuth

**Cons:**
- ⚠️ Service key tiene permisos totales
- ⚠️ Solo usar server-side (nunca en cliente)

### Opción B: Configurar JWT Custom (Avanzado)

1. Configurar NextAuth para que genere JWTs compatibles con Supabase
2. Configurar Supabase para aceptar JWTs de NextAuth
3. Re-habilitar RLS con políticas actualizadas

**Pros:**
- ✅ Más seguro a nivel de base de datos
- ✅ RLS en todas las tablas

**Cons:**
- ⚠️ Configuración compleja
- ⚠️ Requiere mantener JWT config sincronizada

### Opción C: Migrar a Supabase Auth (Largo Plazo)

Reemplazar NextAuth con Supabase Auth completamente.

**Pros:**
- ✅ RLS nativo
- ✅ Mejor integración

**Cons:**
- ⚠️ Requiere reescribir autenticación
- ⚠️ Más tiempo de desarrollo

## Recomendación

Para **Versión 1.0**:
- ✅ Mantener RLS deshabilitado en development
- ✅ Mantener validaciones en código (ya existen)
- ✅ Para producción: Usar Service Role Key en API routes
- ✅ Nunca exponer Service Role Key al cliente

Para **Versión 2.0**:
- Considerar migrar a Supabase Auth
- O implementar JWT custom

## Checklist Pre-Deploy

- [ ] Verificar todas las API routes validan `session.user.id`
- [ ] Verificar queries usan `.eq()` con IDs correctos
- [ ] Service Role Key configurado (si se usa)
- [ ] Service Role Key solo en server-side
- [ ] Variables de entorno de producción configuradas
- [ ] Probar todas las operaciones CRUD

---

**Fecha:** 23 de Enero 2026
**Estado:** RLS Deshabilitado (Desarrollo)
**Seguridad:** Validaciones en Código ✅

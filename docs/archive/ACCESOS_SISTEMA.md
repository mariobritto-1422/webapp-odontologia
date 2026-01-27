# 🔐 Accesos al Sistema - WebApp Odontología

**Fecha:** 23 de Enero 2026

---

## 🌐 URL de la Aplicación

### Desarrollo Local:
```
http://localhost:3000
```

---

## 👨‍⚕️ Acceso Profesional

### Login:
```
URL: http://localhost:3000/auth/login
Email: juan@garcias.com
Contraseña: [Tu contraseña configurada]
```

### Dashboard Profesional:
```
http://localhost:3000/dashboard/professional
```

### Secciones disponibles:
- Panel Principal: `http://localhost:3000/dashboard/professional`
- Turnos: `http://localhost:3000/dashboard/professional/turnos`
- Pacientes: `http://localhost:3000/dashboard/professional/pacientes`
- Notificaciones: `http://localhost:3000/dashboard/professional/notificaciones`
- Configuración: `http://localhost:3000/dashboard/professional/configuracion`
- QR Code: `http://localhost:3000/dashboard/professional/qr`

---

## 👤 Acceso Paciente

### Login:
```
URL: http://localhost:3000/auth/login
Email: maria@lopez.com
Contraseña: [Contraseña del paciente]
```

### Dashboard Paciente:
```
http://localhost:3000/dashboard/patient
```

### Secciones disponibles:
- Panel Principal: `http://localhost:3000/dashboard/patient`
- Solicitar Turno: `http://localhost:3000/dashboard/patient/solicitar`
- Mis Turnos: `http://localhost:3000/dashboard/patient/turnos`
- Mi Perfil: `http://localhost:3000/dashboard/patient/perfil`

---

## 📝 Registro de Nuevos Pacientes

### URL de Registro:
```
http://localhost:3000/auth/register
```

### URL con QR (Registro automático para Dr. Juan Garcia):
```
http://localhost:3000/auth/register?slug=dr-juan-garcia
```

---

## 🗄️ Base de Datos (Supabase)

### Dashboard Supabase:
```
URL: https://app.supabase.com
Proyecto: fewfewlmbaqgbxzzlrjx
URL Base: https://fewfewlmbaqgbxzzlrjx.supabase.co
```

### IDs del Sistema:
```
Professional ID (Dr. Juan Garcia): ceb3ff10-bdd9-4ad2-9bcb-3b9dfee78e97
Patient ID (Maria Lopez): 0a809254-bcc2-46a1-bd50-83cb587df4eb
```

---

## 💻 Comandos de Desarrollo

### Iniciar el servidor:
```bash
cd C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp
npm run dev
```

### Ver contenido de la base de datos:
```bash
node debug-appointments.js
```

---

## 📁 Ubicación del Proyecto

```
C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp
```

---

## 📋 Para Continuar Mañana

1. **Iniciar el servidor:**
   ```bash
   cd C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp
   npm run dev
   ```

2. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

3. **Tareas pendientes:**
   - Sistema de Notificaciones (configuración y envío)
   - Confirmar/Rechazar turnos pendientes
   - Testing completo

4. **Documentos de referencia:**
   - `ESTADO_PROYECTO.md` - Estado actual del proyecto
   - `TESTING_COMPLETO_V1.md` - Checklist de testing
   - `GUIA_PRODUCCION.md` - Guía para deploy

---

## 🆘 En Caso de Problemas

### Si no aparecen los turnos:
```bash
# Verificar que el servidor esté usando Service Role Key
# Verificar en .env.local que SUPABASE_SERVICE_ROLE_KEY esté configurado
```

### Si hay errores de fecha:
```
Las fechas ya están corregidas usando parseISO de date-fns
```

### Si no funciona el login:
```
# Verificar que el email y contraseña sean correctos
# Verificar que Supabase esté accesible
```

---

**Última actualización:** 23 de Enero 2026 - 19:30 hs

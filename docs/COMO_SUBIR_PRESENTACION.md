# 🚀 Cómo Subir la Presentación a Internet

## 📍 Ubicación de los Archivos

La presentación lista para subir está en:
```
docs/presentacion-deploy/
├── index.html (tu presentación)
└── netlify.toml (configuración)
```

---

## 🌐 Método 1: Netlify Drop (MÁS FÁCIL) - 2 minutos

### Paso 1: Entra a Netlify Drop

1. Abre tu navegador
2. Ve a: **https://app.netlify.com/drop**
3. Inicia sesión (o crea cuenta gratis si no tenés)

### Paso 2: Arrastra la Carpeta

1. Abre el explorador de Windows
2. Navega a: `C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp\docs\presentacion-deploy`
3. **Arrastra toda la carpeta** `presentacion-deploy` al recuadro de Netlify Drop
4. ¡Listo! En 10 segundos tenés tu URL

### Paso 3: Conseguí tu URL

Netlify te da una URL tipo:
- `https://random-name-123456.netlify.app`

**Opcional:** Cambiar el nombre
1. Site settings → Change site name
2. Elige: `presentacion-odonto` o similar
3. Tu URL queda: `https://presentacion-odonto.netlify.app`

---

## 🌐 Método 2: Netlify con GitHub (Más Profesional)

Si querés que se actualice automáticamente cuando cambies la presentación:

### Paso 1: Crear Repositorio en GitHub

1. Ve a GitHub.com
2. New Repository
3. Nombre: `presentacion-odontologia`
4. Public
5. Create

### Paso 2: Subir los Archivos

```bash
cd "C:\Users\mario\ClaudeProjects\WebApp-Odontologia\webapp\docs\presentacion-deploy"
git init
git add .
git commit -m "Primera versión de la presentación"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/presentacion-odontologia.git
git push -u origin main
```

### Paso 3: Conectar con Netlify

1. Entra a Netlify: https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Conecta GitHub
4. Selecciona el repo `presentacion-odontologia`
5. Deploy!

**Ventaja:** Cada vez que actualices el archivo, se actualiza automáticamente online.

---

## 📱 Cómo Compartirlo Después

### Por WhatsApp:

**Mensaje simple:**
```
Hola Dr. [Nombre], te comparto la presentación del sistema:

https://presentacion-odonto.netlify.app

Navegá con las flechas del teclado o los botones de abajo.

¡Avisame si tenés alguna duda!
```

### Por Email:

**Asunto:** Sistema de Gestión Odontológica - Presentación

**Cuerpo:**
```
Estimado/a Dr./Dra. [Nombre],

Como hablamos, te comparto la presentación completa del Sistema de
Gestión Odontológica con Odontograma Digital:

🌐 Ver presentación: https://presentacion-odonto.netlify.app

Características destacadas:
✅ Gestión de turnos automática
✅ Base de datos de pacientes
✅ Odontograma interactivo con sistema FDI
✅ Notificaciones por email
✅ Exportación a PDF
✅ Código QR personalizado

Todo incluido por $30/mes

¿Te gustaría una demo personalizada?

Saludos,
[Tu nombre]
[Tu teléfono]
```

### En Redes Sociales (LinkedIn/Facebook):

**Post:**
```
🦷 Sistema de Gestión Odontológica para Profesionales

Sistema completo con Odontograma Digital Interactivo

✅ Turnos online 24/7
✅ Base de datos organizada
✅ Notificaciones automáticas
✅ Registro digital del estado dental
✅ Exportación a PDF profesional

Todo por $30/mes - Sin costos ocultos

📊 Ver presentación completa: [LINK]

#Odontología #GestiónDental #Odontograma #TransformaciónDigital
```

### En Stories de Instagram:

1. Captura de pantalla del Slide 1
2. Texto: "Sistema de Gestión Odontológica"
3. Sticker "Desliza hacia arriba" con el link
4. O usa el sticker de "Link" con tu URL

---

## 🎨 Crear QR para la Presentación

### Opción 1: QR Code Generator Online

1. Ve a: https://www.qr-code-generator.com
2. Pega tu URL de Netlify
3. Personaliza colores si querés
4. Descarga el QR

### Opción 2: Con tu Logo

1. Ve a: https://www.qrcode-monkey.com
2. Pega la URL
3. Sube tu logo en el centro
4. Ajusta colores
5. Descarga en alta calidad

### Dónde Usar el QR:

- ✅ Tarjetas personales
- ✅ Flyers impresos
- ✅ Pósters en consultorios
- ✅ Email signature
- ✅ Post en redes (imagen con QR)

---

## 📊 Seguimiento de Visitas (Opcional)

Si querés saber cuántas personas ven tu presentación:

### Opción 1: Netlify Analytics (Pago)
- $9/mes
- Dashboard con visitas, páginas vistas, etc.

### Opción 2: Google Analytics (Gratis)

Agregar esto ANTES de `</head>` en el HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Reemplaza `G-XXXXXXXXXX` con tu ID de Google Analytics.

---

## 🔄 Actualizar la Presentación

### Si usaste Netlify Drop:

1. Hace los cambios en `presentacion-ventas-v2.html`
2. Copia el archivo actualizado a `presentacion-deploy/index.html`
3. Arrastra toda la carpeta de nuevo a Netlify Drop
4. Se actualiza automáticamente

### Si usaste GitHub + Netlify:

1. Hace los cambios en el archivo
2. Git commit y git push
3. Netlify detecta el cambio y actualiza solo

---

## 💡 Tips para Compartir

### 1. Acorta la URL (Opcional)

Si tu URL es larga, acórtala con:
- Bitly: https://bitly.com
- TinyURL: https://tinyurl.com

Ejemplo:
- Antes: `https://presentacion-odonto-123abc.netlify.app`
- Después: `https://bit.ly/odonto-sistema`

### 2. Personaliza el Dominio (Avanzado)

Si querés tu propio dominio:
1. Compra dominio: `presentacion.tuempresa.com`
2. Conéctalo en Netlify → Domain settings
3. Costo: ~$10-15 USD/año

### 3. Protege con Contraseña (Si querés)

En Netlify:
1. Site settings → Access control
2. Password protection
3. Define contraseña
4. Solo quien tenga la clave puede ver

Útil si querés compartir solo con clientes potenciales.

---

## ✅ Checklist de Compartir

- [ ] Presentación subida a Netlify
- [ ] URL funcionando (abrila en tu celular para probar)
- [ ] URL guardada en tus notas
- [ ] QR generado (opcional)
- [ ] Mensaje de WhatsApp preparado
- [ ] Post de redes sociales redactado
- [ ] ¡Empezar a compartir!

---

## 🎯 Próximos Pasos

1. **Hoy:** Sube la presentación a Netlify (2 minutos)
2. **Esta semana:** Comparte con 5-10 contactos
3. **Este mes:** Mide cuántos la ven y qué feedback recibís

---

## ❓ Problemas Comunes

### "No se ve bien en el celular"

**Solución:** La presentación ES responsive, pero asegurate de:
- Abrir en navegador (Chrome, Safari, Firefox)
- No en WhatsApp Web preview
- Si no funciona, enviá el link "Abrir en navegador"

### "La URL es muy larga"

**Solución:**
- Cambia el nombre del sitio en Netlify
- O usa un acortador de URL (Bitly)

### "Quiero cambiar algo"

**Solución:**
- Edita el archivo HTML local
- Sube de nuevo a Netlify
- O usa Git para auto-actualizar

---

## 🎊 ¡Listo para Compartir!

Una vez subida, tu presentación:
- ✅ Funciona en cualquier dispositivo
- ✅ Se puede compartir con un link
- ✅ No requiere descargar nada
- ✅ Se ve profesional
- ✅ Está disponible 24/7

---

**¿Necesitas ayuda para subirla? Decime y te guío paso a paso.**

# 🎨 Avatar Generator con IA

Sistema completo de generación de avatares 3D estilo Pixar/Disney usando Inteligencia Artificial (OpenAI DALL-E 3).

## ✨ Características

- 🖼️ Subida de imágenes con drag & drop
- 📸 Captura de foto con cámara web integrada
- 🎨 Panel de personalización completo
  - Color de piel
  - Tipo y color de cabello
  - Color de ojos
  - Accesorios (gafas, audífonos, gorra)
  - Fondo personalizable
- 🤖 Generación con IA usando OpenAI DALL-E 3
- 💾 Descarga del avatar generado
- 📧 Envío de avatar por correo electrónico
- 🔄 Regeneración de avatares
- 📱 Diseño responsive
- ⚡ Interfaz moderna con TailwindCSS

## 🏗️ Arquitectura

### Backend
```
backend/
├── src/
│   ├── config/
│   │   └── openai.config.js          # Configuración de OpenAI
│   ├── controllers/
│   │   ├── avatarController.js       # Controladores de avatares
│   │   └── emailController.js        # Controlador de envío de emails
│   ├── services/
│   │   ├── openaiService.js          # Servicio de OpenAI
│   │   └── imageService.js           # Procesamiento de imágenes
│   ├── routes/
│   │   ├── avatarRoutes.js           # Rutas de avatares
│   │   └── emailRoutes.js            # Rutas de email
│   ├── middleware/
│   │   ├── uploadMiddleware.js       # Multer para uploads
│   │   └── errorHandler.js           # Manejo de errores
│   ├── utils/
│   │   └── promptBuilder.js          # Constructor de prompts
│   └── server.js                     # Punto de entrada
├── .env.example
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── AvatarModal.jsx           # Modal principal
│   │   ├── ImageUploader.jsx         # Subida de archivos
│   │   ├── AvatarEditPanel.jsx       # Panel de edición
│   │   ├── AvatarPreview.jsx         # Preview del avatar
│   │   ├── CustomSelect.jsx          # Select personalizado
│   │   └── LoadingSpinner.jsx        # Spinner de carga
│   ├── services/
│   │   └── avatarService.js          # Servicios HTTP
│   ├── utils/
│   │   └── constants.js              # Constantes
│   ├── App.jsx                       # Componente principal
│   ├── main.jsx                      # Punto de entrada
│   └── index.css                     # Estilos globales
├── index.html
├── tailwind.config.js
└── package.json
```

## 🚀 Instalación

### Requisitos previos
- Node.js v18 o superior
- npm o yarn
- Cuenta de OpenAI con API Key

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd Avatar
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
copy .env.example .env
```

Edita el archivo `.env` y agrega tu API Key de OpenAI:
```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
```

### Configurar envío de correos (opcional)

Para usar la funcionalidad de envío de avatares por email:

1. **Habilita 2FA** en tu cuenta de Google
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en dos pasos"

2. **Genera una contraseña de aplicación**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y tu dispositivo
   - Copia la contraseña de 16 caracteres generada

3. **Agrega las credenciales al archivo `.env`**
   ```env
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

**Nota:** Sin estas credenciales, el sistema usará un servicio de prueba (Ethereal) que genera un preview del correo sin enviarlo realmente.

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install
```

## ▶️ Ejecución

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor estará en `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
La aplicación estará en `http://localhost:3000`

### Modo Producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🔑 Obtener API Key de OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a API Keys en tu perfil
4. Crea una nueva API Key
5. Copia la key y agrégala al archivo `.env`

**Nota:** Necesitarás créditos en tu cuenta de OpenAI para usar DALL-E 3.

## 📡 Endpoints del API

### `GET /api/health`
Verifica el estado del servidor

### `POST /api/avatar`
Genera un avatar con IA

**Body (FormData):**
- `image`: Archivo de imagen (JPEG, PNG, WEBP, max 10MB)
- `skinTone`: claro | medio | oscuro
- `hairType`: corto | largo | rizado | ondulado
- `hairColor`: negro | castaño | rubio | rojo | gris
- `accessory`: ninguno | gafas | audífonos | gorra
- `eyeColor`: marrón | azul | verde | negro | avellana

**Response:**
```json
{
  "success": true,
  "data": {
    "image": "base64_string",
    "prompt": "revised_prompt_from_openai"
  }
}
```

### `POST /api/send-avatar-email`
Envía el avatar generado por correo electrónico

**Body (JSON):**
```json
{
  "email": "destinatario@ejemplo.com",
  "avatar": "base64_string_del_avatar"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar enviado correctamente",
  "messageId": "message-id"
}
```

## 🎨 Personalización

### Modificar estilos
Los estilos están en `frontend/src/index.css` usando TailwindCSS.

### Agregar nuevas opciones
1. Edita `frontend/src/utils/constants.js` para agregar opciones
2. Actualiza `backend/src/utils/promptBuilder.js` para el mapeo

### Cambiar modelo de IA
En `backend/src/services/openaiService.js`, modifica:
```javascript
model: "dall-e-3",  // Cambiar modelo aquí
size: "1024x1024",  // Cambiar tamaño aquí
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Multer** - Manejo de uploads
- **OpenAI SDK** - Integración con DALL-E 3
- **Nodemailer** - Envío de correos electrónicos
- **dotenv** - Variables de entorno

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Fetch API** - Peticiones HTTP

## ⚠️ Solución de Problemas

### Error: "400 Billing hard limit has been reached"
**Tu cuenta de OpenAI no tiene créditos disponibles.**

**Solución:**
1. Ve a [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Agrega un método de pago y compra créditos (mínimo $5 USD)
3. Espera unos minutos y vuelve a intentar

**Costo:** ~$0.04 USD por avatar generado

### Error: "OPENAI_API_KEY no está configurada"
- Verifica que el archivo `.env` existe en la carpeta `backend`
- Asegúrate de que la key es válida y sin espacios

### Error: "CORS"
- Verifica que `FRONTEND_URL` en `.env` coincida con tu URL del frontend
- Por defecto: `http://localhost:3000`

### Error al subir imagen
- Verifica que la imagen sea menor a 10MB
- Formatos permitidos: JPEG, PNG, WEBP

### El servidor no inicia
- Verifica que el puerto 5000 no esté en uso
- Ejecuta `npm install` en ambas carpetas

### Error al enviar correo: "Error de autenticación"
- Verifica que `EMAIL_USER` y `EMAIL_PASS` estén configurados correctamente en `.env`
- Asegúrate de usar una **contraseña de aplicación**, no tu contraseña normal de Gmail
- Confirma que la verificación en dos pasos (2FA) esté activada en tu cuenta de Google
- Reinicia el servidor backend después de modificar `.env`

### El correo no llega
- Revisa la carpeta de SPAM del destinatario
- Verifica que el email destino sea válido
- Comprueba los logs del servidor para ver si hay errores
- Si usas Gmail, verifica que no hayas alcanzado el límite diario de envíos

**📖 Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para más detalles**

## 📝 Próximas Mejoras

- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] Sistema de autenticación de usuarios
- [ ] Galería de avatares generados
- [ ] Compartir avatares en redes sociales
- [ ] Más opciones de personalización (ropa, expresiones)
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Historial de avatares enviados por email
- [ ] Soporte para otros proveedores de email (Outlook, SendGrid)

## 📄 Licencia

ISC

## 👨‍💻 Autor

Creado por Isabela Zapata usando React y OpenAI

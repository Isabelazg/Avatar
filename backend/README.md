# Backend - Avatar Generator

API REST para generación de avatares con IA usando OpenAI DALL-E 3 y envío por correo electrónico.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example`:

```env
OPENAI_API_KEY=tu_api_key_aqui
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
```

### Configurar Gmail para envío de correos

Para usar la funcionalidad de envío de correos:

1. **Habilita 2FA** en tu cuenta de Google: https://myaccount.google.com/security
2. **Genera una contraseña de aplicación**: https://myaccount.google.com/apppasswords
3. Agrega las credenciales en el archivo `.env`

**Nota:** Sin estas credenciales, el sistema usará modo de prueba (Ethereal Email).

## Ejecución

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

### Avatar Generation
- `GET /api/health` - Health check
- `POST /api/avatar` - Generar avatar (multipart/form-data)

### Email
- `POST /api/send-avatar-email` - Enviar avatar por correo electrónico
  - **Body (JSON):**
    - `email`: Correo del destinatario
    - `avatar`: String base64 del avatar
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Avatar enviado correctamente",
      "messageId": "message-id"
    }
    ```

## Estructura

- `src/config/` - Configuraciones (OpenAI)
- `src/controllers/` - Controladores (Avatar, Email)
- `src/services/` - Lógica de negocio
- `src/routes/` - Definición de rutas
- `src/middleware/` - Middlewares (Upload, Errors)
- `src/utils/` - Utilidades (Prompt builder)

## Dependencias principales

- `express` - Framework web
- `openai` - SDK de OpenAI
- `multer` - Manejo de uploads
- `nodemailer` - Envío de correos
- `dotenv` - Variables de entorno
- `cors` - CORS para frontend

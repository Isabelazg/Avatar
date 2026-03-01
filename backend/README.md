# Backend - Avatar Generator

API REST para generación de avatares con IA usando OpenAI DALL-E 3.

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
```

## Ejecución

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

- `GET /api/health` - Health check
- `POST /api/avatar` - Generar avatar (multipart/form-data)

## Estructura

- `src/config/` - Configuraciones
- `src/controllers/` - Controladores
- `src/services/` - Lógica de negocio
- `src/routes/` - Definición de rutas
- `src/middleware/` - Middlewares
- `src/utils/` - Utilidades

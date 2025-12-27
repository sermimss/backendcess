Pasos mínimos para desplegar en Render (Node + Postgres):

1) Configura en Render:
   - Service type: Web Service
   - Build Command: npm run build
   - Start Command: npm run start
   - Environment: Docker or Node (prefer Node)

2) Define Environment Variables (Settings → Env Vars):
   - DATABASE_URL -> (cadena de conexión a Postgres)
   - NODE_ENV=production
   - (opcional) PORT (Render asigna un puerto, pero la app usa process.env.PORT || 4000)
   - JWT_SECRET, u otras variables necesarias

3) Migraciones / Seed:
   - Agrega un `prisma:migrate` o ejecuta `npx prisma migrate deploy` en la fase de deploy si usas migraciones automáticas.

4) Health check:
   - App expone `/health` que responde 200 y hace ping a la base de datos.

5) Recomendaciones:
   - Usa variables secretas en Render (no subir .env con credenciales al repo)
   - Habilita alertas y monitorización
   - Para cambios en producción, prueba primero en un entorno staging.

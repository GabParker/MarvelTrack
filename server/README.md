Marveltrack-api.onrender.com/api/health

🚀 Instalación

Desde la raíz del repositorio, ejecuta:

cd server
npm install

⚙️ Variables de entorno

Crea un archivo .env dentro de la carpeta server, tomando como referencia .env.example.

Configura las siguientes variables:

PORT=3001
DATABASE_URL=mongodb://127.0.0.1:27017/marveltrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret

Reemplaza JWT_SECRET por una cadena aleatoria, larga y segura.

Asegúrate de tener MongoDB instalado y en ejecución, o configura una URI de conexión a MongoDB Atlas.

Importante: No compartas ni subas el archivo .env al repositorio.

▶️ Desarrollo

Para iniciar el servidor en modo desarrollo:

npm run dev

El backend estará disponible en:

http://localhost:3001

🗂️ Compilación de producción

Para compilar TypeScript:

npm run build

Para iniciar el servidor compilado:

npm start

🔗 Rutas principales de la API

Autenticación – /api/auth

Método

Ruta

Descripción

POST

/signup

Registrar usuario

POST

/signin

Iniciar sesión

GET

/me

Consultar usuario autenticado

PATCH

/me

Actualizar perfil

POST

/signout

Cerrar sesión desde el cliente

Favoritos – /api/favorites

Todas estas rutas requieren autenticación mediante JWT.

Método

Ruta

Descripción

GET

/

Consultar favoritos

POST

/

Agregar un favorito

DELETE

/:id

Eliminar un favorito

🛡️ Seguridad y manejo de errores

Las contraseñas se almacenan utilizando bcrypt.

Las rutas privadas requieren un token JWT válido.

Los favoritos están asociados al usuario autenticado.

Los endpoints de registro e inicio de sesión están protegidos mediante un límite de 10 solicitudes cada 15 minutos.

Las solicitudes que superan el límite reciben una respuesta HTTP 429.

El servidor cuenta con manejo centralizado de errores y respuestas JSON para rutas inexistentes.

❤️ Estado del servidor

Para comprobar que el servidor funciona correctamente, visita:

http://localhost:3001/api/health

En producción:

https://marveltrack-api.onrender.com/api/health

👨‍💻 Autor

Gabriel Martínez

GitHub: https://github.com/GabParker

📂 Repositorio

https://github.com/GabParker/MarvelTrack

MarvelTrack – Backend

API REST de MarvelTrack, desarrollada con Node.js, Express, TypeScript y MongoDB.

Este servidor administra la autenticación de usuarios, las sesiones mediante JSON Web Tokens (JWT) y la gestión de personajes favoritos.

✨ Funcionalidades

Registro de usuarios.

Inicio de sesión.

Autenticación mediante JWT.

Consulta y actualización del perfil del usuario.

Consulta de personajes favoritos.

Registro de personajes favoritos.

Eliminación de personajes favoritos.

Protección de rutas privadas.

Validación de datos y manejo de errores.

🛠️ Tecnologías

Node.js

Express

TypeScript

MongoDB

Mongoose

JSON Web Token (JWT)

bcrypt

🚀 Instalación

Desde la raíz del repositorio, ejecuta:

cd server
npm install

⚙️ Variables de entorno

Crea un archivo .env dentro de la carpeta server, tomando como referencia .env.example.

Configura las siguientes variables:

PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/marveltrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret

Reemplaza JWT_SECRET por una cadena aleatoria, larga y segura.

Asegúrate de tener MongoDB instalado y en ejecución, o configura una URI de conexión a MongoDB Atlas.

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

Todas estas rutas requieren autenticación.

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

❤️ Estado del servidor

Para comprobar que el servidor funciona correctamente, visita:

http://localhost:3001/api/health

👨‍💻 Autor

Gabriel Martínez

GitHub: https://github.com/GabParker

📂 Repositorio

https://github.com/GabParker/MarvelTrack

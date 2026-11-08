MarvelTrack 🦸

MarvelTrack es una aplicación web inspirada en el universo Marvel que permite explorar personajes, consultar sus características y descubrir los equipos a los que pertenecen.

La aplicación ofrece una experiencia intuitiva para descubrir héroes, villanos y personajes neutrales, con funciones de registro, inicio de sesión y gestión de personajes favoritos.

🚀 Aplicación desplegada

Visita MarvelTrack:

https://marveltrack-iota.vercel.app/

✨ Funcionalidades

Exploración de un catálogo de personajes.

Búsqueda de personajes por nombre o universo.

Filtros por alineación: héroes, villanos y neutrales.

Visualización de información y detalles de cada personaje.

Exploración de equipos del universo Marvel.

Registro de usuarios e inicio de sesión.

Autenticación mediante JWT.

Gestión del perfil de usuario.

Agregar y eliminar personajes favoritos.

Consulta de favoritos desde el perfil.

Diseño adaptable a diferentes tamaños de pantalla.

🛠️ Tecnologías utilizadas

Frontend

React 19

TypeScript

Vite

React Router

CSS

Backend

Node.js

Express

TypeScript

MongoDB

Mongoose

JSON Web Token (JWT)

bcrypt

Herramientas y despliegue

Git y GitHub

Vercel

Render

Fuente de datos

Superhero API

📂 Estructura del proyecto

MarvelTrack/
├── client/
│ ├── public/
│ ├── src/
│ ├── .env.example
│ └── package.json
│
├── server/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── models/
│ │ └── routes/
│ ├── .env.example
│ └── package.json
│
└── README.md

💻 Instalación y configuración

Requisitos previos

Node.js y npm.

MongoDB instalado y en ejecución, o una instancia de MongoDB Atlas.

Git.

1. Clonar el repositorio

git clone https://github.com/GabParker/MarvelTrack.git
cd MarvelTrack

2. Configurar el backend

cd server
npm install

Crea un archivo .env tomando como referencia server/.env.example.

Configura las siguientes variables:

PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/marveltrack
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret

Utiliza una cadena aleatoria, larga y segura para JWT_SECRET.

3. Configurar el frontend

Desde la raíz del proyecto:

cd client
npm install

Crea un archivo .env.local tomando como referencia client/.env.example.

Configura:

VITE_API_URL=http://localhost:3001

▶️ Ejecución en desarrollo

Para ejecutar MarvelTrack localmente se necesitan dos terminales abiertas.

Terminal 1 – Backend

Desde la raíz del proyecto:

npm run dev --prefix server

Terminal 2 – Frontend

Desde la raíz del proyecto:

npm run dev --prefix client

Abre la dirección que Vite muestra en la terminal, normalmente:

http://localhost:5173

Asegúrate de que MongoDB esté funcionando antes de iniciar el backend.

🗂️ Compilación

Para compilar el frontend:

npm run build --prefix client

Para compilar el backend:

npm run build --prefix server

🌐 Despliegue

Frontend: Vercel.

Backend: Render.

Base de datos: MongoDB.

Las variables de entorno de producción deben configurarse directamente en los servicios correspondientes.

👨‍💻 Autor

Gabriel Martínez

GitHub: https://github.com/GabParker

📂 Repositorio

https://github.com/GabParker/MarvelTrack

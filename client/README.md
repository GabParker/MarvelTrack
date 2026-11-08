MarvelTrack – Frontend ⚡

Aplicación frontend de MarvelTrack, desarrollada con React, TypeScript y Vite.

Este cliente permite explorar personajes del universo Marvel, consultar sus características, descubrir equipos y gestionar el acceso de usuarios y sus personajes favoritos.

✨ Funcionalidades

Catálogo de personajes.

Búsqueda de personajes por nombre o universo.

Filtros por alineación.

Visualización de detalles de personajes.

Exploración de equipos.

Registro e inicio de sesión.

Gestión del perfil de usuario.

Consulta y administración de personajes favoritos.

Navegación mediante React Router.

Interfaz responsive.

🛠️ Tecnologías

React 19

TypeScript

Vite

React Router

CSS

🚀 Instalación

Desde la raíz del repositorio, ejecuta:

cd client
npm install

⚙️ Variables de entorno

Crea un archivo .env.local dentro de la carpeta client, tomando como referencia .env.example.

Configura:

VITE_API_URL=http://localhost:3001

Esta variable indica la dirección del backend al que se conecta el frontend.

▶️ Desarrollo

Desde la carpeta client:

npm run dev

Vite iniciará el servidor de desarrollo. Abre la dirección que aparece en la terminal para visualizar la aplicación.

Importante: Para utilizar las funciones de autenticación, perfil y favoritos, el backend debe estar iniciado y conectado a MongoDB.

🗂️ Compilación de producción

Para generar los archivos de producción:

npm run build

🔍 Revisión de código

Para ejecutar ESLint:

npm run lint

🌐 Aplicación desplegada

https://marveltrack-iota.vercel.app/

👨‍💻 Autor

Gabriel Martínez

GitHub: https://github.com/GabParker

📂 Repositorio

https://github.com/GabParker/MarvelTrack

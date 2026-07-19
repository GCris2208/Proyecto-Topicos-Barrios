## API de Cryptos - Proyecto Tópicos Especiales

API REST desarrollada en Node.js, Express y MongoDB para la gestión de criptomonedas y alertas, aplicando metodologías TDD (Test-Driven Development) y flujos de trabajo con GitFlow.

##  Integrantes del Equipo
* Cristian Barrios V-31307655
* Carlos Pinto V-31307188
* Jose Ignacio Rueda V-31377585

## Tecnologías y Herramientas Utilizadas
* **Backend:** Node.js (LTS), Express.js, TypeScript.
* **Base de Datos:** MongoDB, Mongoose.
* **Testing:** Jest, Supertest (18 pruebas automatizadas superadas).
* **Documentación:** Swagger (OpenAPI 3.0).
* **Integraciones:** AlphaVantage, CoinGecko y más.
* **Control de Versiones:** Git, GitHub (Flujo GitFlow).

---

## Cómo correr este proyecto en local

Sigue estos pasos para levantar el entorno en tu máquina:

### 1. Clonar el repositorio
```bash
git clone <https://github.com/GCris2208/Proyecto-Topicos-Barrios>
cd <Proyecto-Topicos-Barrios>


### 2. Instalar Dependencias

npm install


### 3. Crear variable de entorno, el archivo.env

(cree un archivo .env en la raiz de la carpeta, a nivel de las carpetas src, tests y package.json)

PORT=3000
MONGODB_URI=mongodb+srv://cristianbarrios06_db_user:utVhlytl0pC8JGRP@clusterchistes.pifvce0.mongodb.net/?appName=ClusterChistes
ALPHA_VANTAGE_API_KEY=TO8ELWUX3A8EMJQR


### 4. Iniciar el servidor como Developer

(en terminal)

npm run dev


### 5. Ejecutar pruebas TDD

(en terminal, diferente de la anterior)

npm run test


### 6. Probar la página en si

(para poder probarlo debió ejecutar el paso 4 y que le devuelva que se está ejecutando exitosamente, y entrar a este link desde su navegador de confianza)

http://localhost:3000/api-docs

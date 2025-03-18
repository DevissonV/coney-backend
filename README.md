# Documentación tecnica

## Estructura del proyecto

```
┣ 📂.docker
┃ ┗ 📜Dockerfile.dev
┣ 📂logs
┃ ┣ 📜app-old.log
┃ ┗ 📜app-new.log
┣ 📂scripts
┃ ┗ 📜generate-module.js
┣ 📂src
┃ ┣ 📂core
┃ ┃ ┣ 📂base
┃ ┃ ┃ ┣ 📜base-controller.js
┃ ┃ ┃ ┗ 📜base-repository.js
┃ ┃ ┣ 📂config
┃ ┃ ┃ ┣ 📜cors-options.js
┃ ┃ ┃ ┣ 📜database.js
┃ ┃ ┃ ┗ 📜envs.js
┃ ┃ ┣ 📂filters
┃ ┃ ┃ ┗ 📂criteria
┃ ┃ ┃   ┗ 📜generic-criteria.js
┃ ┃ ┣ 📂middlewares
┃ ┃ ┃ ┣ 📜auth-middleware.js
┃ ┃ ┃ ┗ 📜error-middleware.js
┃ ┃ ┗ 📂utils
┃ ┃   ┣ 📂logger
┃ ┃   ┃ ┣ 📜log-manager.js
┃ ┃   ┃ ┗ 📜logger.js
┃ ┃   ┗ 📂response
┃ ┃     ┣ 📜api-response-templates.js
┃ ┃     ┣ 📜error-handler.js
┃ ┃     ┗ 📜response-handler.js
┃ ┣ 📂features
┃ ┃ ┣ 📂countries
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜country-routes.js
┃ ┃ ┃ ┣ 📂controllers
┃ ┃ ┃ ┃ ┗ 📜country-controller.js
┃ ┃ ┃ ┣ 📂dto
┃ ┃ ┃ ┃ ┗ 📜country-dto.js
┃ ┃ ┃ ┣ 📂migrations
┃ ┃ ┃ ┃ ┗ 📜20250225143122_create_countries_table.js
┃ ┃ ┃ ┣ 📂repositories
┃ ┃ ┃ ┃ ┗ 📜country-repository.js
┃ ┃ ┃ ┣ 📂seed
┃ ┃ ┃ ┃ ┗ 📜country-seeder.js
┃ ┃ ┃ ┣ 📂services
┃ ┃ ┃ ┃ ┗ 📜country-service.js
┃ ┃ ┃ ┗ 📂validations
┃ ┃ ┃   ┣ 📜country-criteria-validation.js
┃ ┃ ┃   ┗ 📜country-validation.js
┃ ┃ ┣ 📂health-checks
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜health-check-routes.js
┃ ┃ ┃ ┗ 📂controllers
┃ ┃ ┃   ┗ 📜health-check-controller.js
┃ ┃ ┣ 📂payments
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜payment-routes.js
┃ ┃ ┃ ┣ 📂controller
┃ ┃ ┃ ┃ ┗ 📜payment-controller.js
┃ ┃ ┃ ┣ 📂dto
┃ ┃ ┃ ┃ ┗ 📜payment-session-dto.js
┃ ┃ ┃ ┗ 📂services
┃ ┃ ┃   ┣ 📜channel-service.js
┃ ┃ ┃   ┣ 📜payment-container.js
┃ ┃ ┃   ┗ 📜payment-service.js
┃ ┃ ┣ 📂raffles
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜raffle-routes.js
┃ ┃ ┃ ┣ 📂controllers
┃ ┃ ┃ ┃ ┗ 📜raffle-controller.js
┃ ┃ ┃ ┣ 📂dto
┃ ┃ ┃ ┃ ┗ 📜raffle-dto.js
┃ ┃ ┃ ┣ 📂migrations
┃ ┃ ┃ ┃ ┗ 📜20250225031050_create_raffles_table.js
┃ ┃ ┃ ┣ 📂repositories
┃ ┃ ┃ ┃ ┗ 📜raffle-repository.js
┃ ┃ ┃ ┣ 📂services
┃ ┃ ┃ ┃ ┣ 📜raffle-dependencies.js
┃ ┃ ┃ ┃ ┣ 📜raffle-service.js
┃ ┃ ┃ ┃ ┗ 📜raffle-ticket-service.js
┃ ┃ ┃ ┗ 📂validations
┃ ┃ ┃   ┣ 📜raffle-create-validation.js
┃ ┃ ┃   ┣ 📜raffle-criteria-validation.js
┃ ┃ ┃   ┗ 📜raffle-update-validation.js
┃ ┃ ┣ 📂tickets
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜ticket-routes.js
┃ ┃ ┃ ┣ 📂controllers
┃ ┃ ┃ ┃ ┗ 📜ticket-controller.js
┃ ┃ ┃ ┣ 📂dto
┃ ┃ ┃ ┃ ┗ 📜ticket-dto.js
┃ ┃ ┃ ┣ 📂migrations
┃ ┃ ┃ ┃ ┗ 📜20250225163808_create_tickets_table.js
┃ ┃ ┃ ┣ 📂repositories
┃ ┃ ┃ ┃ ┗ 📜ticket-repository.js
┃ ┃ ┃ ┣ 📂services
┃ ┃ ┃ ┃ ┣ 📜ticket-management-service.js
┃ ┃ ┃ ┃ ┗ 📜ticket-service.js
┃ ┃ ┃ ┗ 📂validations
┃ ┃ ┃   ┣ 📜ticket-criteria-validation.js
┃ ┃ ┃   ┗ 📜ticket-validation.js
┃ ┃ ┣ 📂users
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┗ 📜user-routes.js
┃ ┃ ┃ ┣ 📂controllers
┃ ┃ ┃ ┃ ┗ 📜user-controller.js
┃ ┃ ┃ ┣ 📂dto
┃ ┃ ┃ ┃ ┗ 📜user-dto.js
┃ ┃ ┃ ┣ 📂migrations
┃ ┃ ┃ ┃ ┗ 📜20241206173037_create_users_table.js
┃ ┃ ┃ ┣ 📂repositories
┃ ┃ ┃ ┃ ┗ 📜user-repository.js
┃ ┃ ┃ ┣ 📂services
┃ ┃ ┃ ┃ ┣ 📜user-service.js
┃ ┃ ┃ ┃ ┗ 📜user-sesion-service.js
┃ ┃ ┃ ┗ 📂validations
┃ ┃ ┃   ┣ 📜user-create-validation.js
┃ ┃ ┃   ┣ 📜user-criteria-validation.js
┃ ┃ ┃   ┣ 📜user-login.js
┃ ┃ ┃   ┗ 📜user-update-validation.js
┃ ┃ ┗ 📂winners
┃ ┃   ┣ 📂api
┃ ┃   ┃ ┗ 📜winner-routes.js
┃ ┃   ┣ 📂controllers
┃ ┃   ┃ ┗ 📜winner-controller.js
┃ ┃   ┣ 📂dto
┃ ┃   ┃ ┗ 📜winner-dto.js
┃ ┃   ┣ 📂migrations
┃ ┃   ┃ ┗ 📜20250317161154_create_winners_table.js
┃ ┃   ┣ 📂repositories
┃ ┃   ┃ ┗ 📜winner-repository.js
┃ ┃   ┣ 📂services
┃ ┃   ┃ ┣ 📜winner-dependencies.js
┃ ┃   ┃ ┣ 📜winner-logic-service.js
┃ ┃   ┃ ┗ 📜winner-service.js
┃ ┃   ┗ 📂validations
┃ ┃     ┣ 📜winner-criteria-validation.js
┃ ┃     ┗ 📜winner-validation.js
┃ ┣ 📂routes
┃ ┃ ┗ 📜api-routes.js
┃ ┗ 📜server.js
┣ 📂tests
┃ ┣ 📂countries
┃ ┃ ┗ 📜country.spec.js
┃ ┣ 📂factories
┃ ┃ ┗ 📜auth-factory.js
┃ ┣ 📂health-checks
┃ ┃ ┗ 📜health-check.spec.js
┃ ┣ 📂raffles
┃ ┃ ┗ 📜raffle.spec.js
┃ ┣ 📂tickets
┃ ┃ ┗ 📜ticket.spec.js
┃ ┣ 📂users
┃ ┃ ┗ 📜user.spec.js
┃ ┗ 📂winners
┃   ┗ 📜winner.spec.js
┣ 📜.dockerignore
┣ 📜.env
┣ 📜.env-example
┣ 📜.gitignore
┣ 📜.prettierignore
┣ 📜.prettierrc
┣ 📜coney-collection.json
┣ 📜docker-compose.yml
┣ 📜eslint.config.js
┣ 📜jest.config.mjs
┣ 📜jsconfig.json
┣ 📜knexfile.js
┣ 📜LICENSE
┣ 📜package.json
┗ 📜README.md


```

## Requisitos previos

Antes de iniciar con la configuración del proyecto, asegúrate de cumplir con los siguientes requisitos:

- Tener instalado Node.js en la versión 20 o superior
- Tener una instancia activa de PostgreSQL en la versión 16.2.
- Copiar el archivo .env-example que se encuentra en la raíz del proyecto y renómbralo a .env
- Ajusta los valores en el archivo .env de acuerdo a tu entorno, como los datos de conexión a la base de datos y otras variables importantes.

Nota: Si vas a ejecutar el proyecto con Docker, basta con que tengas Docker instalado y tu archivo .env correctamente configurado. Docker Compose levantará la base de datos y el backend automáticamente.

## Instalación Backend

Para probar en local, (sin docker)

**Tener presente que se necesita una base de datos postgreSQL activa y tener sus datos de conexion en el archivo .env**

1. Instalar dependencias, ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```
npm install
```

2. Aplicar migraciones, Ejecuta este comando para crear las tablas necesarias en la base de datos mediante las migraciones:

```
npx knex migrate:latest
```

3. Iniciar el servidor, Puedes iniciar el servidor con cualquiera de los siguientes comandos:
   Con npm

```
npm run dev
```

## Levantar el proyecto con Docker

Si prefieres utilizar Docker para simplificar la ejecución del proyecto, sigue estos pasos:

### Requisitos previos

- Tener Docker y Docker desktop(opcional) instalados en tu sistema.
- Tener configurado el archivo .env en base al .env-example que esta en la raiz del proyecto

### Pasos de ejecución

1. Construir la imagen, ejecuta el siguiente comando para construir la imagen del contenedor:

```
docker-compose build
```

2. Levantar los contenedores

```
docker-compose up
```

## Crear nuevas tablas mediante migraciones

Si necesitas crear nuevas tablas, utiliza los siguientes comandos para generar los archivos de migración, ejemplo de las tablas existentes:

```
npx knex migrate:make create_users_table
npx knex migrate:make create_raffles_table
```

Estos comandos generarán archivos de migración en la carpeta correspondiente (migrations/), donde podrás definir la estructura de las tablas.

NOTA: esto solo es un dato informativo para generar nuevas migraciones, pero no es necesario para ejecutar por primera vez el sistema

## Pruebas unitarias

### Notas importantes

- Asegúrate de que el puerto por defecto del backend no esté en uso. Si tienes la aplicación corriendo mediante Docker, el contenedor ya ocupará el puerto, lo que puede causar fallos en las pruebas.
- Verifica que la base de datos esté activa antes de ejecutar las pruebas.

### Ejecutar las pruebas

Para ejecutar las pruebas de integración (usando Jest y Supertest), utiliza los siguientes comandos:

```
npm test auth/auth.spec.js
npm test raffles/raffle.spec.js
```

Cada comando ejecutará los tests definidos en los archivos especificados. Asegúrate de que las rutas de prueba sean correctas y estén configuradas para el entorno de desarrollo.

IMPORTANTE: tener presente que la ejecución de las pruebas puede afectar los datos del schema de BD al que este apuntando

### Consideraciones adicionales

- Docker: Si estás utilizando Docker para levantar la aplicación y la base de datos, verifica que los contenedores estén apagados antes de ejecutar las pruebas para evitar conflictos en los puertos.
- Base de datos: Asegúrate de que las migraciones estén actualizadas antes de ejecutar las pruebas para evitar errores relacionados con esquemas de tablas.

## Ejecución en Postman

Para facilitar la ejecución y prueba de las APIs en Postman:

- En la raíz del proyecto hay un archivo llamado `coney-collection.json`.
  Importa este archivo en Postman para cargar todas las rutas y configuraciones del proyecto.
- Ajusta las variables de entorno en Postman según tu configuración local o de Docker, variable `{{URL}}`.

## Generacion modulos nuevos

Para generar un modulo nuevo pararse en la raiz del proyecto y ejecutar:

```
npm run generate-module nameModule
```

Automaticamente se le generara el modulo con su estructura:

```
nameModule
┣ 📂api
┃ ┗ 📜nameModule-routes.js
┣ 📂controllers
┃ ┗ 📜nameModule-controller.js
┣ 📂dto
┃ ┗ 📜nameModule-dto.js
┣ 📂migrations
┃ ┗ 📜20250224210522_create_nameModule_table.js
┣ 📂repositories
┃ ┗ 📜nameModule-repository.js
┣ 📂services
┃ ┗ 📜nameModule-service.js
┗ 📂validations
  ┣ 📜nameModule-criteria-validation.js
  ┗ 📜nameModule-validation.js

```

TENER PRESENTE:

1. Agregar la nueva ruta creada en: src/routes/api-routes.js
2. Agregar las migraciones del nuevo modulo al diccionario de rutas, variable: directoryMigrations en el archivo: knexfile.js ubicado en la raiz del proyecto

## Formateador de codigo

Para realizar el análisis y formateo de código ejecutar: 
``` npm run lint ``` 
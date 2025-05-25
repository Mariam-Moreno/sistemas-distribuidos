# Sistemas Distribuidos
Aplicación distribuida basada en un modelo de tres capas que permite registrar grupos de alumnos, asignaturas y calificaciones de una escuela de nivel primaria, además de proporcionar diversos reportes estadísticos.

## Arquitectura

El sistema utiliza una arquitectura de tres capas:

1.  **Capa de Presentación (Frontend):** Interfaz de usuario web desarrollada con React.
2.  **Capa de Lógica de Negocio (Backend):** API REST desarrollada con Python y Flask.
3.  **Capa de Datos:** Base de datos MySQL para la persistencia de la información.

## Tecnologías Utilizadas

*   **Frontend:**
    *   HTML5, CSS3, JavaScript (ES6+)
    *   React.js
    *   React Router DOM (para la navegación)
    *   Axios (para peticiones HTTP)
*   **Backend (API):**
    *   Python 3
    *   Flask
    *   Flask-CORS
    *   mysql-connector-python
*   **Base de Datos:**
    *   MySQL

## Prerrequisitos

*   Node.js y npm (o Yarn) instalados (para el frontend).
*   Python 3 y pip instalados (para el backend).
*   Un servidor MySQL en ejecución.

## Configuración

### 1. Base de Datos (MySQL)

1.  Asegúrate de tener un servidor MySQL instalado y en ejecución.
2.  Crea una base de datos llamada `escuela_db`.
3.  Ejecuta el script SQL proporcionado en `backend_flask/db_schema.sql` para crear las tablas necesarias y, opcionalmente, insertar datos de ejemplo.
    *   Puedes usar una herramienta como MySQL Workbench, phpMyAdmin, o la línea de comandos de MySQL:
        ```bash
        mysql -u tu_usuario -p tu_contraseña < backend_flask/db_schema.sql
        ```
4.  **Importante:** Actualiza las credenciales de la base de datos en el archivo `backend_flask/db_config.py`:
    ```python
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'tu_usuario_mysql',      # Reemplaza con tu usuario de MySQL
        'password': 'tu_password_mysql',  # Reemplaza con tu contraseña
        'database': 'escuela_db'
    }
    ```

### 2. Backend (API Flask)

1.  Navega al directorio del backend:
    ```bash
    cd ruta/a/tu/proyecto/backend_flask
    ```
2.  (Recomendado) Crea y activa un entorno virtual:
    ```bash
    python -m venv venv
    # En Windows:
    .\venv\Scripts\activate
    # En macOS/Linux:
    source venv/bin/activate
    ```
3.  Instala las dependencias de Python:
    ```bash
    pip install -r requirements.txt
    ```

### 3. Frontend (React)

1.  Navega al directorio del frontend:
    ```bash
    cd ruta/a/tu/proyecto/frontend_react
    ```
2.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
    o si usas Yarn:
    ```bash
    yarn install
    ```

## Ejecución de la Aplicación

Debes ejecutar el backend y el frontend por separado, en dos terminales distintas.

### 1. Iniciar el Backend (API Flask)

1.  Abre una terminal.
2.  Navega al directorio `backend_flask`.
3.  Si creaste un entorno virtual, actívalo.
4.  Ejecuta el servidor Flask:
    ```bash
    python app.py
    ```
    Por defecto, el servidor backend se ejecutará en `http://127.0.0.1:5001`. Verás mensajes en la consola indicando que está corriendo.

### 2. Iniciar el Frontend (React)

1.  Abre una **nueva** terminal.
2.  Navega al directorio `frontend_react`.
3.  Ejecuta la aplicación React:
    ```bash
    npm start
    ```
    o si usas Yarn:
    ```bash
    yarn start
    ```
    Esto abrirá automáticamente la aplicación en tu navegador web, usualmente en `http://localhost:3000`.

Una vez que ambos servidores estén en ejecución, podrás interactuar con la aplicación a través de la interfaz web en `http://localhost:3000`.

## Funcionalidades Implementadas

1.  **Gestión de Alumnos:** Registro, consulta, modificación y eliminación.
2.  **Gestión de Asignaturas:** Registro, consulta, modificación y eliminación.
3.  **Registro de Calificaciones:** Asignación y consulta de calificaciones, con validación de rango y correspondencia de grado.
4.  **Generación de Reportes:**
    *   Boleta de calificación de un estudiante con Promedio General.
    *   Lista de calificaciones por asignatura con Promedio.
    *   Lista de Estudiantes Regulares (agrupados por grado).
    *   Lista de Estudiantes Irregulares (agrupados por grado, con número de reprobadas).

## Notas Adicionales

*   El umbral de aprobación para los reportes de alumnos regulares/irregulares está definido en `backend_flask/db_config.py` (variable `UMBRAL_APROBACION`, por defecto `60`).
*   La aplicación utiliza CORS para permitir la comunicación entre el frontend (localhost:3000) y el backend (localhost:5001).

# Bluetek – Monitoreo térmico en tiempo real y predicciones ML

Plataforma web interactiva para monitorear en tiempo real las condiciones térmicas de edificios climatizados y visualizar predicciones generadas por un modelo de machine learning, facilitando la gestión eficiente del consumo energético y la optimización del confort térmico por zona. Incluye:

- Backend en Django (API REST con autenticación por token, gestión de habitaciones, termostatos y mediciones; simulación de datos y soporte para integración de predicciones ML).
- Frontend en React + Vite (interfaz para login, registro, dashboard, detalle de sensores y visualización de métricas actuales y predicciones).

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
  - [Backend (Django)](#backend-django)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Guía de uso](#guía-de-uso)
- [API y ejemplos](#api-y-ejemplos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuraciones especiales](#configuraciones-especiales)
- [Variables de entorno (opcional)](#variables-de-entorno-opcional)
- [Casos de uso](#casos-de-uso)
- [Licencia](#licencia)
- [Soporte y contacto](#soporte-y-contacto)

---

## Descripción

Bluetek centraliza información de sensores y termostatos por habitación y zona dentro de oficinas, y está orientada a soportar decisiones operacionales en climatización. Permite:

- Registro y autenticación de usuarios con roles (ADMIN y COMUN).
- Gestión de entidades (habitaciones y termostatos) y sus mediciones.
- Visualización de métricas actuales e histórico de mediciones en gráficos (frontend).
- Simulación de mediciones de temperatura para pruebas.
- Integración planificada de predicciones (próximas horas/día) para optimizar consumo y confort.

El backend expone una API REST segura mediante `TokenAuthentication` de Django REST Framework; el frontend consume estas APIs y protege rutas con token almacenado en `localStorage`. La integración de predicciones ML puede realizarse mediante un microservicio externo o un módulo interno de Python, expuesto vía endpoints dedicados.

---

## Objetivo del proyecto

Desarrollar una plataforma web interactiva que permita:

- Monitorear en tiempo real las condiciones térmicas de edificios climatizados.
- Visualizar predicciones de temperatura y/o carga térmica generadas por un modelo de ML.
- Apoyar la gestión eficiente del consumo energético y la optimización del confort térmico en cada zona.

Notas de implementación:

- El repositorio incluye simulación de datos y endpoints REST. Para “tiempo real” se sugiere complementar con WebSockets/SSE (p. ej., Django Channels o Server-Sent Events) o con sondeos periódicos desde el frontend.
- Las predicciones ML pueden integrarse como un servicio HTTP (`ML_API_URL`) o como un módulo local cargado por el backend.

---

## Requisitos previos

- Sistemas operativos: Windows 10/11, macOS 12+, Linux (Ubuntu 20.04+)
- Software y versiones:
  - Python 3.10+ (recomendado 3.11/3.12)
  - Node.js 18+ y npm 9+
  - Django 5.0 (según `requirements.txt`)
  - Django REST Framework
  - mssql-django (si se usa SQL Server)
  - django-cors-headers
- Base de datos:
  - SQL Server (con `ODBC Driver 17 for SQL Server`) o SQLite (opcional para desarrollo)
- Herramientas recomendadas:
  - PowerShell (Windows) o bash/zsh (macOS/Linux)
  - Git

---

## Instalación y configuración

### Backend (Django)

1) Clonar repositorio y crear entorno virtual

```bash
git clone https://github.com/cltrejo/Bluetek.git
cd Bluetek

# Windows (PowerShell)
python -m venv env
./env/Scripts/Activate.ps1

# macOS/Linux
python3 -m venv env
source env/bin/activate
```

2) Instalar dependencias de Python

```bash
pip install -r requirements.txt
```

Contenido relevante de `requirements.txt`:

```text
django==5.0
mssql-django==1.4
djangorestframework
django-cors-headers
```

3) Configurar la base de datos

- Por defecto, el proyecto está configurado para SQL Server en `backend/backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'bluetek',
        'USER': 'sa',
        'PASSWORD': 'admin',
        'HOST': 'DESKTOP-A2T36MU',
        'PORT': '',
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server'
        }
    }
}
```

- Alternativa para desarrollo rápido con SQLite (descomentar el bloque correspondiente en `settings.py`):

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

4) Migraciones y usuario administrador

```bash
cd backend

# Generar y aplicar migraciones
py manage.py makemigrations core   # Windows (py)
py manage.py migrate

# macOS/Linux (si no usas py)
python manage.py makemigrations core
python manage.py migrate

# Crear superusuario
py manage.py createsuperuser

# Opcional: generar token para el usuario
python manage.py drf_create_token <usuario>
```

5) Ejecutar el servidor de desarrollo

```bash
py manage.py runserver           # Windows
# ó
python manage.py runserver       # macOS/Linux
```

El backend quedará disponible en `http://localhost:8000/`.

6) (Opcional) Integración de predicciones ML

- Microservicio externo: define `ML_API_URL` y `ML_API_TOKEN` (ver Variables de entorno) y crea endpoints en `core/views.py` que consulten ese servicio.
- Módulo local: incorpora dependencias como `numpy`, `pandas`, `scikit-learn` y carga el modelo (p. ej., `.pkl`) en vistas dedicadas.

### Frontend (React + Vite)

1) Instalar dependencias

```bash
cd ../frontend-o
npm install
```

2) Ejecutar entorno de desarrollo

```bash
npm run dev
```

El frontend quedará disponible típicamente en `http://localhost:5173/` y consumirá el backend en `http://localhost:8000/`.

3) Comandos adicionales

```bash
npm run build    # Compila para producción
npm run preview  # Previsualiza el build localmente
npm run lint     # Ejecuta ESLint
```

---

## Guía de uso

1) Accede al frontend en `http://localhost:5173/`.
2) Regístrate como usuario (mantención o común) o ingresa con credenciales existentes.
3) Al iniciar sesión, el token de acceso se guarda en `localStorage` y habilita el acceso a rutas protegidas:
   - `/home`: vista principal
   - `/dashboard`: panel con métricas
   - `/sensor/:id`: histórico de mediciones del termostato
4) Navega por el dashboard y entra al detalle de un termostato para ver sus gráficos de métricas actuales e histórico (Recharts).
5) Si la integración ML está activa, el dashboard mostrará curvas de predicción y recomendaciones operacionales (p. ej., ajustes de set‑point por zona).

Para pruebas con API directa (Postman/Yaak/cURL), autentícate con el header:

```http
Authorization: Token <token_value>
```

---

## API y ejemplos

Base URL: `http://localhost:8000/`

Rutas principales (todas bajo `core.urls`):

- `POST /api/registro/`

```json
{
  "username": "juanperez",
  "email": "juan@email.com",
  "password": "MiPassword123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "tipo_usuario": "COMUN"  
}
```

- `POST /api/login/`

```json
{
  "username": "juanperez",
  "password": "MiPassword123"
}
```

- `POST /api/verify-token/` (requiere header `Authorization: Token ...`)

```http
Authorization: Token <token_value>
```

- `GET | POST /api/lista_habitaciones/` (auth requerida)

Ejemplo `POST`:

```json
{
  "nombre": "Sala Norte",
  "descripcion": "Sala de reuniones 2do piso",
  "forma_svg": "<svg>...</svg>"
}
```

- `GET | PATCH | DELETE /api/detalle_habitacion/<id>` (auth requerida)

Ejemplo `PATCH`:

```json
{
  "descripcion": "Sala renovada con nuevo equipamiento"
}
```

- `GET | POST /api/lista_thermostatos/` (auth requerida)

Ejemplo `POST`:

```json
{
  "nombre": "T‑Norte‑01",
  "id_habitacion": 1
}
```

- `GET | POST /api/lista_mediciones/` (auth requerida)

Ejemplo `POST`:

```json
{
  "valor": 24.5,
  "unidad": "°C",
  "timestamp": "2025-01-01T12:00:00Z",
  "id_thermostato": 1
}
```

- `GET /api/thermostatos/<id>/mediciones/` (auth requerida)

Devuelve listado de mediciones del termostato con ID `<id>`.

- `GET /api/habitaciones/<id_habitacion>/sensores/` (auth requerida)

Devuelve termostatos asociados a la habitación.

- `POST /api/simular_temperatura/` (auth requerida)

Genera mediciones aleatorias controladas (18‑30 °C) para cada termostato:

```json
{
  "message": "Temperaturas simuladas para N sensores"
}
```

### Endpoints planificados para predicciones (ML)

Estos endpoints no están implementados en el código actual y sirven como guía para la integración:

- `GET /api/predicciones/thermostatos/<id>/` (auth requerida)

Respuesta esperada:

```json
{
  "id_thermostato": 1,
  "horizonte": "6h",
  "predicciones": [
    { "timestamp": "2025-01-01T12:00:00Z", "valor": 24.1 },
    { "timestamp": "2025-01-01T13:00:00Z", "valor": 24.6 }
  ]
}
```

- `POST /api/optimizar/zona/` (auth requerida)

Solicitud de ejemplo:

```json
{
  "id_zona": 10,
  "objetivo": "confort",
  "restricciones": { "consumo_max_kw": 12 }
}
```

Respuesta esperada:

```json
{
  "recomendaciones": [
    { "accion": "ajustar_setpoint", "valor": 22.0, "justificacion": "Reducir sobrecalentamiento" }
  ],
  "impacto_estimado": { "consumo_kw": -1.2, "confort": +0.15 }
}
```

---

## Estructura del proyecto

Raíz del repositorio:

- `backend/` – Proyecto Django
  - `backend/` – Configuración del proyecto (ASGI/WSGI, `settings.py`, `urls.py`)
  - `core/` – App principal (modelos, vistas, serializers, rutas)
  - `manage.py` – CLI de Django
  - `README.md` – Guía rápida backend
- `frontend-o/` – Proyecto React + Vite
  - `src/` – Código fuente (páginas: Login, RegisterMaintainer, RegisterUser, Home, Dashboard, DetalleSensor; `utils/PrivateRoute`; `services/` para clientes de API y futura integración ML)
  - `public/` – Archivos estáticos
  - `index.html` – HTML base (idioma `es`)
  - `package.json` – Scripts y dependencias
- `docs/` – Documentación del proyecto (Fase 1/2/3, diagramas, SQL, video)
- `requirements.txt` – Dependencias Python
- `.gitignore` – Ignora artefactos (envs, `db.sqlite3`, etc.)

---

## Configuraciones especiales

- Autenticación: `TokenAuthentication` de DRF (`rest_framework.authtoken`).
- Modelo de usuario: personalizado `core.USUARIO` con campo `tipo_usuario`.
- CORS: habilitado para todos los orígenes (`CORS_ALLOW_ALL_ORIGINS = True`).
- `ALLOWED_HOSTS`: incluye `localhost`, `127.0.0.1` y dominios de `devtunnels.ms` para pruebas remotas.
- Seguridad: `SECRET_KEY` definido en `settings.py` (mover a variables de entorno en producción).
- Tiempo real (opcional): usar WebSockets/SSE para feed en vivo; en el estado actual se sugiere sondeo (polling) periódico desde el frontend.
- Predicciones ML (opcional): integrar microservicio externo o módulo local con endpoints dedicados.

---

## Variables de entorno (opcional)

Aunque el proyecto trae configuración directa en `settings.py`, se recomienda usar variables de entorno en producción. Ejemplo de variables:

```bash
# Backend
DJANGO_SECRET_KEY="<clave-secreta>"
DJANGO_DEBUG="False"
DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1,misubdominio.com"

# Base de datos (SQL Server)
DB_ENGINE="mssql"
DB_NAME="bluetek"
DB_USER="sa"
DB_PASSWORD="<password>"
DB_HOST="<host>"
DB_PORT=""
DB_DRIVER="ODBC Driver 17 for SQL Server"

# Predicciones ML (si usas microservicio externo)
ML_API_URL="https://ml.mi-dominio.com"
ML_API_TOKEN="<token-ml>"
```

Para aplicarlas, adapta `settings.py` usando `os.environ.get(...)` según tus necesidades.

---

## Casos de uso

- Registro y login para obtener token de acceso.
- Crear habitaciones y termostatos, consultar su detalle y relacionarlos.
- Registrar mediciones manuales o usar el endpoint de simulación.
- Visualizar histórico por termostato y predicciones (si están habilitadas) en el frontend.
- Ajustar set‑points y programaciones apoyándose en recomendaciones del módulo ML.

Sugerencias para pruebas:

1) Crea una habitación (`POST /api/lista_habitaciones/`).
2) Crea un termostato vinculado (`POST /api/lista_thermostatos/`).
3) Genera mediciones (`POST /api/simular_temperatura/`) o crea una medición manual (`POST /api/lista_mediciones/`).
4) En el frontend, navega a `/sensor/<id_thermostato>` para ver el histórico y, si está habilitado, las curvas de predicción.

---

## Pruebas y cobertura

- Backend
  - Ejecuta: `py -m coverage run .\backend\manage.py test core` y `py -m coverage report`.
  - Alcance: `backend/core` y `backend/backend` (umbral 95% definido en `.coveragerc`).
  - Pruebas: `py .\backend\manage.py test core.test_core.TestCoreAPI`.
  - Notas: en tests se usa SQLite; tablas de `core` se crean automáticamente.

- Frontend
  - Ejecuta: `cd frontend-o && npm install && npm run test:coverage`.
  - Umbral: 95% para statements/branches/functions/lines (configurado en `vite.config.js`).
  - Reporte: `frontend-o/coverage/index.html`.
  - Notas: mocks de `fetch`/`isAuthenticated`; `ResizeObserver` está mockeado en `src/setupTests.js`.
  - Protección de rutas con `PrivateRoute` (redirección a `/login` o render seguro).
  - Flujo de login (errores con credenciales inválidas y guardado de token al autenticar).
  - Render del detalle de sensor y carga de datos.

Umbrales de cobertura frontend:
- Exigido: `statements/branches/functions/lines = 95`.
- Si alguna categoría queda por debajo, `npm run test:coverage` fallará.


---

## Soporte y contacto

- Abre un issue en GitHub con el detalle del problema o solicitud.
- Para soporte del entorno o despliegue, contacta al equipo mantenedor del proyecto.
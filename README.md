# 🏛️ Sistema de Clasificación de Trámites Municipales con IA
Este proyecto es una plataforma web diseñada para optimizar la gestión y evaluación de trámites de una municipalidad. Utiliza un modelo de Inteligencia Artificial desarrollado con TensorFlow/Keras (CNN) para clasificar de manera automática el nivel de riesgo de los documentos PDF adjuntos en cuatro categorías: Bajo, Medio, Alto y Crítico.

# 🚀 Arquitectura y Componentes
🖥️ Vistas Principales (Frontend)
Registrar Trámite: Formulario para el ingreso de nuevos expedientes y carga de documentos PDF.

Bandeja de Trámites: Tabla centralizada con filtros de búsqueda avanzados que muestra todos los trámites registrados con las siguientes columnas:
ID | Ciudadano | Área | N° Expediente | Estado | Prioridad | F. Ingreso | F. Límite | Creado | Actualizado | Acción

Sesión Actual: Vista temporal que muestra los registros actuales que el encargado está realizando en tiempo real. Nota: Los datos mostrados aquí se borrarán cuando se cierre o reinicie el servidor.

🛠️ Stack Tecnológico y Servicios (Docker)
El proyecto está completamente contenedorizado y levanta 3 servicios principales mediante Docker:

Backend: API REST construida con FastAPI que integra y sirve el modelo de Machine Learning.

Base de Datos (mariadb): Gestor de base de datos relacional para almacenar la información de los trámites.

Adminer: Interfaz gráfica web para la gestión y administración rápida de MariaDB.

📂 Repositorios del Proyecto
Frontend: frontend_machineLearning

Backend: backend_fastapi_machineLearning

Procesamiento y Modelo: procesamiento_dataset_y_modelo (Contiene la creación del dataset, análisis y el entrenamiento de la red neuronal)

# ⚙️ Instrucciones de Instalación y Despliegue
## 1. Requisitos Previos (Docker)
Descarga e instala Docker Desktop (AMD64) desde la página oficial: Docker Desktop.

Importante: Es obligatorio reiniciar el dispositivo cuando finalice la instalación.

Tras reiniciar, abre Docker Desktop e inicia sesión con una cuenta de Gmail.

## 2. Clonar los Repositorios
Mientras se instala Docker, clona los repositorios de la aplicación en carpetas distintas en tu equipo local:
 Clonar Backend
git clone https://github.com/MrSek18/backend_fastapi_machineLearning.git

Clonar Frontend (Ingresar a la cuenta principal para clonar el frontend correspondiente)
https://github.com/MrSek18

## 3. Despliegue del Backend y Base de Datos
Abre una terminal y dirígete a la carpeta del proyecto clonado backend_fastapi_machineLearning.

Ejecuta el siguiente comando para construir y levantar los contenedores en segundo plano:
docker compose up --build -d

Deja que cargue el proceso por completo hasta que la terminal te permita ingresar nuevos comandos.


#🗄️ Configuración e Importación de la Base de Datos (Adminer)
Abre Docker Desktop, despliega el contenedor padre del proyecto, busca el servicio de adminer y abre la URL provista.

En la pantalla de inicio de sesión de Adminer, rellena los campos con los siguientes datos:

Servidor: db

Usuario: root

Contraseña: admin

Una vez dentro, selecciona la base de datos llamada municipalidad_yau.

Haz clic en el botón Importar ubicado en la parte superior izquierda.

En la sección Elegir archivos, busca y selecciona el archivo SQL llamado municipalidad_yau_tablas.sql (ubicado dentro de la carpeta del frontend).

Haz clic en el botón Ejecutar y verifica visualmente en el panel que las tablas se hayan cargado de forma correcta.


## 4. Despliegue del Frontend
Abre una terminal nueva y dirígete a la carpeta del proyecto frontend_machineLearning.
Instala los módulos y dependencias de Node.js ejecutando:
npm install
Una vez terminada la instalación, arranca el servidor de desarrollo local con:
npm run dev

# 🧠 Procesamiento de Datos y Entrenamiento del Modelo
Si deseas trabajar en el repositorio de procesamiento_dataset_y_modelo para generar datos o reentrenar la Inteligencia Artificial (CNN), sigue estos pasos:

## Paso 0: Descargar el instalador correcto de Python
Entra al sitio web oficial: python.org.
Pasa el cursor por encima del menú Downloads y haz clic en Windows (No presiones el botón amarillo grande, ya que descargará una versión no compatible como la 3.12 o 3.13).
En la lista desplegada, busca la sección específica: "Python 3.11.9 - April 2, 2024".
Justo debajo de ese título, haz clic en el enlace: "Download Windows installer (64-bit)" para obtener el archivo python-3.11.9-amd64.exe.

## Paso 1: Instalar Python 3.11.9
Haz doble clic en el archivo ejecutable descargado.
⚠️ LO MÁS IMPORTANTE: En la primera ventana que se abre, abajo del todo, debes marcar obligatoriamente la casilla "Add python.exe to PATH".
Haz clic arriba en Install Now y espera a que se complete el proceso.

## Paso 2: Crear el Entorno Virtual
Abre la carpeta de este repositorio en Visual Studio Code, abre una terminal integrada y escribe:
python -m venv venv_tf

## Paso 3: Activar el Entorno Virtual
Si usas PowerShell:
.\venv_tf\Scripts\Activate.ps1
Si usas CMD (Símbolo del sistema):
venv_tf\Scripts\activate.bat

## Paso 4: Instalar las Librerías de Inteligencia Artificial
Con el entorno virtual activado correctamente, copia y ejecuta el siguiente comando para instalar el stack técnico requerido por el script:
pip install tensorflow numpy pandas scikit-learn matplotlib seaborn h5py

## Paso 5: Ejecución de Scripts
Asegúrate de que el archivo dataset_tramites_yauyos.csv se encuentre ubicado en esa misma carpeta raíz.
Para generar/preparar el dataset aleatorio:
python random_dataset.py
Para iniciar el entrenamiento del modelo CNN:
python modelo.py

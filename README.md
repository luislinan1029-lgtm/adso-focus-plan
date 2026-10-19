# 🚀 ADSO Focus & Plan - Planificador de Entregables & Cronómetro Pomodoro

Bienvenido al repositorio de **ADSO Focus & Plan**, un proyecto diseñado y estructurado bajo estándares profesionales de **Ingeniería de Software**, pensado especialmente para aprendices del programa **ADSO (Análisis y Desarrollo de Software - SENA)**.

---

## 📱 1. Compatibilidad Multiplataforma y Soporte Móvil

La aplicación ha sido diseñada con enfoque **Mobile-First** y convertida en una **PWA (Progressive Web App)**:

| Plataforma / Navegador | Estado de Compatibilidad | Cómo se comporta |
| :--- | :--- | :--- |
| **Android (Chrome, Brave, Firefox, Edge, Opera, Samsung Internet)** | ✅ 100% Compatible | Permite pulsar **"Instalar App"** para agregarse al cajón de aplicaciones como una app nativa, con icono propio, pantalla completa y soporte Offline. Además, vibra al terminar los bloques de estudio. |
| **iPhone / iPad (iOS Safari)** | ✅ 100% Compatible | Compatible con Safe Area (Notch / Dynamic Island), prevención de zoom indeseado en inputs y sonido desbloqueado con Web Audio API. Se puede instalar tocando *Compartir* -> *"Agregar a pantalla de inicio"*. |
| **Navegadores de Escritorio (Windows, Mac, Linux)** | ✅ 100% Compatible | Funciona en Chrome, Firefox, Microsoft Edge, Brave, Safari y Opera con diseño responsivo. |

---

## 🎯 2. Propósito del Proyecto

En el desarrollo de software y en el proceso formativo del SENA, dos de los mayores desafíos en equipo son:
1. **La Gestión del Tiempo y Concentración**: Evitar la procrastinación al investigar o programar.
2. **El Control de Entregables**: Saber quién es responsable de cada evidencia, cuándo se entrega y cuál es el artefacto final.

Esta aplicación resuelve ambos problemas en una única plataforma unificada:
- **Cronómetro Pomodoro Inteligente (25 min de estudio / 5 min de descanso)**: Bloques de hiperenfoque (Deep Work) con alertas sonoras en *Web Audio API* y vibración háptica en móviles.
- **Contador de Sesiones Diarias**: Registra cuántos bloques de 25 minutos has completado en la jornada.
- **Sistema de Racha de Días (Streak Tracker)**: Fomenta la disciplina diaria calculando días consecutivos de estudio (similar a GitHub o Duolingo).
- **Matriz de Entregables y Actividades**: Tabla interactiva con filtro de estado (Pendiente, En Progreso, Completada), asignación de responsables, fechas límites, scroll táctil suave y exportación de datos a **CSV / Excel**.

---

## 🏗️ 3. Arquitectura de Software y Estructura del Proyecto

Aplicamos principios de **Separación de Responsabilidades (SoC)** y el patrón **MVC (Modelo - Vista - Controlador)** junto con arquitectura **Offline-First**:

```text
mi proyecto para ADSO/
├── index.html          # VISTA: Estructura semántica HTML5, accesible y meta tags PWA
├── manifest.json       # PWA: Manifiesto web para instalación nativa en Android/iOS/PC
├── sw.js               # SERVICE WORKER: Caché y funcionamiento sin internet (Offline)
├── README.md           # DOCUMENTACIÓN: Manual técnico y justificación para el SENA
├── icons/              # ACTIVOS: Iconos vectoriales SVG y PNG de alta resolución
│   ├── icon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── css/
│   └── styles.css      # DISEÑO: Sistema responsive, touch targets (44px) y safe areas iOS
└── js/
    ├── storage.js      # SERVICIO: Persistencia con LocalStorage y fallback en memoria
    ├── streak.js       # MODELO / LÓGICA: Algoritmo de cálculo de racha de días consecutivos
    ├── timer.js        # MODELO: Máquina de estados 25/5, audio móvil y vibración háptica
    ├── tasks.js        # MODELO: Operaciones CRUD de actividades y exportación a CSV
    └── app.js          # CONTROLADOR: Coordinador general y manejador de instalación PWA
```

---

## 📋 4. Requerimientos del Sistema (Norma IEEE 830)

### Requerimientos Funcionales (RF)
- **RF-01**: El sistema debe permitir registrar una nueva actividad con título, responsable(s), fecha límite, entregable esperado y estado inicial.
- **RF-02**: El sistema debe listar las actividades en una tabla responsiva con opción de cambiar de estado (Pendiente, En Progreso, Completada) o eliminarla.
- **RF-03**: El sistema debe permitir filtrar actividades por estado y exportarlas a un archivo CSV compatible con Excel.
- **RF-04**: El sistema debe disponer de un cronómetro con cuenta regresiva de 25 minutos (Estudio) y alternar a 5 minutos (Descanso).
- **RF-05**: El sistema debe emitir una alerta sonora armónica y vibración en dispositivos móviles al culminar cada bloque.
- **RF-06**: Al completar una sesión de 25 minutos, el sistema debe incrementar el conteo de sesiones del día y evaluar la racha de días de estudio.
- **RF-07**: El sistema debe permitir ser instalado como aplicación PWA tanto en celulares como en computadores de escritorio.

### Requerimientos No Funcionales (RNF)
- **RNF-01 (Usabilidad Móvil)**: Touch targets mínimos de 44px de alto, respeto de Safe Area en iPhone y diseño fluido en cualquier resolución.
- **RNF-02 (Rendimiento y Disponibilidad)**: Carga instantánea y funcionamiento Offline mediante Service Worker.
- **RNF-03 (Compatibilidad)**: Funcionamiento sin fisuras en Chrome, Firefox, Safari (iOS/macOS), Microsoft Edge, Brave y Opera.

---

## ⚡ 5. Cómo Probar la Aplicación en tu PC y Celular

### En tu Computador:
1. Abre tu carpeta: `c:\Users\luisl\Documents\mi proyecto para ADSO\`
2. Haz **doble clic en `index.html`** para abrirla en Edge, Chrome, Firefox o Brave.
3. Si usas Chrome o Edge, verás un icono de instalación en la barra de direcciones o el botón **"Instalar App"** en la cabecera.

### En tu Celular (Android o iPhone):
- **Opción A (Recomendada en red local)**:
  Puedes iniciar un servidor local rápido en la terminal con Python:
  ```bash
  python -m http.server 8000
  ```
  Luego abres el navegador de tu celular conectado al mismo Wi-Fi y entras a: `http://TU_IP_LOCAL:8000` (por ejemplo: `http://192.168.1.15:8000`).
- **Opción B**:
  Subir el repositorio a **GitHub Pages** (gratuito) para tener un enlace HTTPS público que tus instructores y compañeros puedan abrir e instalar en sus celulares con un solo clic.

---

## 💡 6. Ideas para la Próxima Fase con tu Compañero de ADSO
1. **Publicar en GitHub Pages**: Desplegar la PWA online para que cualquier compañero la instale al instante.
2. **Backend en Node.js o Python**: Añadir sincronización en tiempo real entre los integrantes del grupo de estudio.
3. **Modo Oscuro**: Alternar tema claro y oscuro según las preferencias del sistema operativo.

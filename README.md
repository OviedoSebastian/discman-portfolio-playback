# Portafolio

Actúa como un Diseñador Senior de UI/UX especializado en interfaces interactivas y Experiencias Web 3D. Genera la estructura detallada de wireframes (Wireframing / Low-Mid Fidelity) en Figma para un portafolio web interactivo e innovador.

---

### 1. CONCEPTO CENTRAL Y METÁFORA VISUAL (WEB 3D)

- El elemento protagonista en la sección Principal (Hero Section) es un DISKMAN interactivo (3D / UI Neumórfica / Retro-futurista).

- Mecánica de Navegación: Los botones físicos del Diskman (Reproducir, Siguiente, Anterior, Expulsar/Abrir) cambian el Disco CD que se encuentra en su interior. 

- Cada CD representa un "track" o sección del portafolio (Sobre Mí, Proyectos, Habilidades, Experiencia, Contacto).

- Al cambiar de CD o pulsar un botón, la pantalla/interfaz del portafolio actualiza el menú y despliega la información correspondiente.

---

### 2. ESTRUCTURA Y COMPONENTES DE WIREFRAMES POR SECCIÓN

1. INICIO (HERO SECTION - DISKMAN VIEWPORT):

   - Header/Navbar: Logo personal, indicador de estado ("Playing: Track 01 - Hero"), control de audio (Mute/Unmute) y menú rápido alternativo.

   - Canvas 3D (Centro): Contenedor donde se renderizará el modelo 3D del Diskman.

   - Panel de Control del Diskman:

     * Botón "Play/Pause": Activa la presentación / scroll automático.

     * Botones "Next/Prev Track": Cambian el CD visible e intercalan las secciones.

     * Botón "Eject/Open": Muestra la bandeja abierta con los diferentes CDs disponibles para seleccionar.

     * Pantalla LCD digital del Diskman: Muestra el nombre de la sección actual, el "track number" y la duración ficticia.

   - Información Principal Overlay:

     * Nombre y apellido.

     * Cargo/Especialidad (Ej: Desarrollador Web Frontend / Web 3D).

     * Frase corta de valor.

     * CTAs primarios: [Ver Proyectos] y [Contactar].

2. SOBRE MÍ (TRACK 02 - ABOUT ME):

   - Distribución en 2 columnas:

     * Izquierda: Foto profesional / Avatar 3D / Ilustración interactiva.

     * Derecha: Perfil profesional, formación académica, enfoque en resolución de problemas y objetivos a futuro.

   - Tarjetas secundarias: Proyectos destacados personales y filosofía de aprendizaje.

3. PROYECTOS (TRACK 03 - PROJECTS GALLERY):

   - Grid/Carrusel interactivo de 3 a 6 tarjetas de proyectos.

   - Estructura de cada Tarjeta de Proyecto:

     * Placeholder para Captura/Demostración 3D/Video.

     * Nombre del proyecto y breve descripción.

     * Problema que resuelve y aporte personal.

     * Badges/Etiquetas de tecnologías utilizadas.

     * Botones interactivos: [Ver Sitio Desplegado] y [Ver Código en GitHub].

4. HABILIDADES TÉCNICAS (TRACK 04 - SKILLS & STACK):

   - Categorización clara en contenedores o paneles:

     * Frontend (HTML, CSS, JS, TS, React, Three.js).

     * Backend & Bases de Datos (Python, Node.js, PostgreSQL, etc.).

     * Herramientas y Otros (Git, GitHub, Docker, APIs REST, Blender).

   - Indicadores visuales de nivel o tarjetas interactivas de competencias.

5. EXPERIENCIA Y FORMACIÓN (TRACK 05 - TIMELINE):

   - Línea de tiempo vertical u horizontal interactiva.

   - Nodos con historial de: Experiencia laboral, prácticas, formación universitaria, cursos y certificaciones.

   - Detalle de fechas, roles y responsabilidades principales.

6. CONTACTO (TRACK 06 - CONTACT & FOOTER):

   - Formulario de contacto (Nombre, Email, Mensaje, Botón [Enviar]).

   - Enlaces directos a redes/perfiles profesionales: Correo electrónico, LinkedIn, GitHub.

   - Mensaje de cierre con llamado a la acción (Call to Action).

   - Disponibilidad laboral y ubicación.

---

### 3. ESPECIFICACIONES DE DISEÑO Y COMPONENTES EN FIGMA

- Layouts: Versión Desktop (1440px) y Responsive Mobile (390px).

- Sistema de Componentes y Variantes a crear:

  * Componente "Diskman": Estado Cerrado, Estado Abierto (Bandeja con CDs), Estado Girando/Reproduciendo.

  * Componente "Botones de Control": Default, Hover, Pressed, Active.

  * Componente "CD": Variantes con diferentes estilos/colores para cada sección (Track 1 al 6).

  * Componente "Tarjeta de Proyecto": Default y Hover state.

- Estilo de Wireframe: Escala de grises (Low/Mid Fidelity), enfoque en jerarquía tipográfica, spacing claro (Autolayout activo) y marcadores de posición (placeholders) para canvas 3D y multimedia.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://discman-portfolio-playback.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/805d375f-be5f-5d25-b308-fe8ea4daa43f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

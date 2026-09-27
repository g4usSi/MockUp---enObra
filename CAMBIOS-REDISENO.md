# EnObra · refinamiento visual y rendimiento

Esta versión conserva la estructura y las funciones del mockup original, pero actualiza la experiencia visual para que tenga más profundidad y movimiento sin depender de librerías externas.

## Cambios principales

- Header transparente sobre el hero y superficie clara al hacer scroll.
- Hero de mayor escala con parallax muy ligero.
- Sección “Más que una construcción, un hogar” convertida a composición editorial con fotografía y datos institucionales.
- Áreas de Constructora y Bienes Raíces convertidas en bloques fotográficos de gran formato.
- Portafolio del inicio rediseñado con una composición asimétrica: un proyecto principal y dos secundarios.
- Noticias simplificadas para una lectura más editorial y menos basada en tarjetas.
- Nueva franja visual de cierre antes del footer.
- Páginas internas con encabezados, servicios, principios, formularios y galerías refinados visualmente.
- Animaciones de entrada mediante `IntersectionObserver`.
- Parallax mediante `requestAnimationFrame` y `transform: translate3d()`.
- Parallax desactivado en pantallas de 768 px o menos.
- Soporte para `prefers-reduced-motion`.
- Sin nuevas dependencias, frameworks, videos de fondo ni librerías de animación.
- Versionado `?v=3` en CSS y JavaScript para evitar que el navegador muestre archivos antiguos al actualizar el sitio.

## Archivos modificados

- `index.html`
- `styles.css`
- `main.js`
- `LEEME.md`
- Todas las páginas HTML únicamente para actualizar el versionado de CSS/JS.

## Prueba rápida

Abre `index.html`. Para una prueba más parecida a producción puedes servir la carpeta con cualquier servidor HTTP local. El sitio sigue siendo HTML, CSS y JavaScript puro.

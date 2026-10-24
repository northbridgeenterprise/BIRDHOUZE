# Birdhouse Media MX — Sitio web

Sitio estático de Birdhouse Media MX, hecho con HTML, CSS y JavaScript. No requiere instalación de dependencias ni proceso de compilación.

## Vista local

Abre `index.html` en un navegador. Mantén las carpetas de fotografías junto a las páginas para que las galerías y portadas funcionen.

## Páginas

- `index.html`: inicio, servicios, equipo y contacto.
- `galeria.html`, `bodas.html` y `marcas.html`: portafolios fotográficos.
- `precios.html`: referencias de precio y preguntas frecuentes.
- `landing-bodas.html`: captación de bodas.
- `produccion-audiovisual.html`: producción audiovisual.
- `fotografia-marcas.html`: fotografía comercial.
- `contenido-campanas.html`: contenido y campañas.
- `eventos-experiencias.html`: eventos y experiencias.

## Publicación en GitHub Pages

1. En GitHub abre **Settings → Pages**.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
4. Cuando Pages termine de publicar, abre la URL que muestra esa sección.

Las rutas de imágenes son relativas al sitio; conserva las carpetas de fotografías y miniaturas al publicar.

## Consultas por WhatsApp

Los formularios de las páginas de servicio preparan un mensaje para WhatsApp al número configurado en `lead-form.js`. El visitante revisa y envía el mensaje desde WhatsApp; el sitio no almacena los datos del formulario.

## Mantenimiento

- Edita textos directamente en los archivos `.html`.
- Los estilos compartidos están en `styles.css`; las landings usan además `lead-landing.css`.
- Las galerías cargan sus colecciones desde archivos `*-data.js`.
- Prueba imágenes, enlaces y formularios después de cambiar archivos o rutas.

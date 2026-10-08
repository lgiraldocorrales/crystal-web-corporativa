# Vista previa temporal en GitHub Pages

El fallo anterior usaba Jekyll para interpretar el frontmatter TypeScript de Astro como YAML. Este workflow compila Astro y publica únicamente `dist/`.

En Settings → Pages → Build and deployment → Source, seleccionar **GitHub Actions**. El workflow se dispara con pushes a `main`, sin crear una rama `gh-pages`.

URL prevista: https://lgiraldocorrales.github.io/crystal-web-corporativa/

GitHub Pages sirve solamente archivos estáticos. No ejecuta Fastify ni permite probar SMTP. El formulario conserva el diseño y explica que esta vista previa no envía correos. La selección de idioma de las rutas compartidas se resuelve con una redirección de navegador a las variantes ya generadas.

Solo esta compilación agrega el prefijo del proyecto a enlaces, CSS y scripts. Agrega noindex/nofollow y robots Disallow para evitar que la vista previa compita con el sitio original. Los siete videos utilizan sus URLs HTTPS exactas del servidor Crystal original, para respetar el límite de tamaño de Pages; la vista previa depende de que ese servidor siga activo. Los demás assets se recuperan mediante LFS antes de compilar, y se rechazan punteros LFS pendientes en el artefacto. Los archivos locales y el build normal para Azure siguen intactos.

Prueba local: `npm run build:pages`. Esta salida estática necesita servirse bajo `/crystal-web-corporativa/`; el build normal es `npm run build` y luego `npm start`.

Esta vista previa no sustituye la validación de paridad ni el despliegue Azure. El banner corrupto original continúa pendiente. No se declara que la auditoría de producción pase: el workflow de la vista previa valida exclusivamente esta publicación estática.

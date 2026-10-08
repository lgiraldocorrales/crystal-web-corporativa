# Crystal: informe de migración y diferencias

**Estado: versión para revisión; no publicada ni aceptada como reemplazo de producción.** Fecha: 8 de octubre de 2026.

Se migró el contenido original a Astro 7.3.7, TypeScript estricto y Fastify 5 sobre Node.js 24. No se realizó un rediseño. El historial y las ramas remotas del repositorio privado `lgiraldocorrales/crystal-web-corporativa` permanecen intactos. No se trabajó en `crystal-web-page` ni se modificó `main`.

## Inventario y arquitectura

El ZIP contiene 38 páginas HTML provenientes de HAR, sin los assets referenciados. Se recuperaron del sitio vigente los archivos originales y 58 variantes/rutas enlazadas ausentes. Se construyen 96 rutas: 93 públicas y tres variantes internas para las URLs de productos compartidas entre idiomas. El inventario completo y la procedencia están en `Inventario.md`, `provenance.json`, `src/data/routes.json` y `asset-recovery.json`.

Se conservan textos, menú de escritorio y móvil distintos, jerarquía, footer, imágenes, videos, loader, favicon, vínculos a documentos y declaraciones tipográficas. Los archivos locales suman aproximadamente 1,24 GB únicos. Los siete videos y treinta PDF permanecen locales; los videos grandes requieren Git LFS, aprobado por el usuario.

El HTML repetido está separado en componentes Astro estáticos. Las páginas utilizan un layout de idioma/SEO y datos centrales de rutas y assets. No hay React, Vue ni hidratación de componentes. Los scripts clásicos mantienen el orden de ejecución original. La captura utiliza jQuery, Materialize y AOS; no contiene animaciones GSAP ni modo oscuro. GSAP está instalado y no se han añadido efectos. Las declaraciones de fuentes existentes se conservan; no se inventan archivos de fuentes de marca que no venían referenciados.

Fastify sirve `dist/`, `GET /health` y `POST /api/contact` en una sola aplicación. El arranque utiliza `process.env.PORT`. El backend anterior Flask fue revisado para recuperar la configuración SMTP por variables y la confirmación al remitente. No se encontró el backend Django original de la web pública.

## Validaciones realizadas

| Validación | Resultado |
|---|---|
| `npm run check` | 0 errores, 0 advertencias, 0 sugerencias |
| `npm run build` | Astro estático y backend TypeScript compilados; 96 páginas |
| `npm test` | 6 pruebas aprobadas; ninguna omitida |
| Formulario | Campos originales, HTML/texto, destinatarios configurados y confirmación por idioma comprobados con envío simulado |
| Seguridad | Orígenes, correo, longitudes, consentimiento, campos desconocidos, body, honeypot, errores genéricos y rate limit comprobados |
| Rutas HTTP | Las 96 responden 200 mediante Fastify; robots/sitemap y cookie de idioma comprobados |
| Auditoría de enlaces/assets/SEO | Sin referencias locales faltantes; un bloqueo por imagen original corrupta |
| Interacción en navegador | Menú móvil con teclado, jerarquía, cambio a inglés, salto al contenido y formulario español/inglés aprobados |
| Movimiento reducido | Sin autoplay de videos o carrusel en el caso comprobado |
| `npm audit` | 0 vulnerabilidades, incluyendo altas/críticas |
| Consola de aplicación | 0 excepciones de ejecución en las comparaciones |
| SMTP MasterBase real | Pendiente de configuración y prueba en desarrollo |
| Azure/App Service/DevOps | Configuración/pipeline entregados; ejecución real pendiente |

La auditoría de dependencias npm no incluye por sí sola los vendors históricos copiados. El visor PDF original se conserva con evaluación de expresiones JavaScript desactivada y worker local; esta modificación está documentada.

## Comparación visual

Se compararon las 38 páginas del ZIP a **1440, 768 y 390 px**: 114 parejas de capturas. Todas mantienen iguales dimensiones completas. 45 parejas coinciden exactamente píxel por píxel. Las restantes presentan diferencias pequeñas; la máxima media de diferencia por canal es **0.058153396 sobre 255**. No se declara «ninguna diferencia» ni se sustituye la aprobación visual del usuario por ese promedio.

El reloj se pausó antes de cargar cada documento y luego avanzó cuadro a cuadro; se esperó a fuentes e imágenes y se pausaron videos para comparar el mismo estado. Los mayores residuos aparecen en historia y unidades de negocio. La revisión manual y de comportamiento animado sigue pendiente. Las 58 rutas recuperadas tienen comprobación HTTP/links/assets; todavía no tienen la misma comparación exhaustiva de capturas.

Los servicios externos de mapas, GTM, analítica y widgets se bloquearon de forma idéntica durante esta comparación. Esto evita diferencias de red pero **no valida su funcionamiento conectado**. Las capturas de inicio y todos los resultados por ruta están en `screenshots/` y `visual-comparison.json`. El script `scripts/visual-parity.mjs` permite reproducir la comparación con Playwright.

## Diferencias técnicas y reparación de la captura

- Se retiraron scripts de seguridad inyectados por la captura HAR y tokens CSRF capturados. No eran contenido propio del sitio que debiera desplegarse.
- Se restauraron enlaces que la captura había anulado y rutas inglesas que requerían la cookie `django_language` antes de navegar.
- Se preservó el salto de línea que el navegador produce ante `</br>` inválido y se corrigieron atributos de idioma dañados.
- Se corrigió la inicialización obsoleta de modales y controles del slider que fallaba en la fuente; se mantuvieron DOM, apariencia y tiempos ordinarios.
- El formulario utiliza `/api/contact`; se agregan validación, sanitización, límite de body/rate, honeypot, origen y Turnstile opcional. No se muestran errores SMTP ni secretos.
- Se agregan foco visible, salto al contenido, soporte de teclado, labels y movimiento reducido. Un único h1 conserva la apariencia del encabezado fuente.
- Se centralizan SEO y metadatos técnicos; los títulos y URLs públicos se conservan. No se modifican textos editoriales para marketing.

## Bloqueos para aceptación y publicación

1. **Banner original dañado:** `public/static/store/images/cumplimiento/banner_programa_etico1.png`. El servidor original entrega el mismo archivo ilegible en descargas repetidas. Está conservado, no reemplazado por una imagen inventada. Se necesita el PNG válido original. Afecta `/asiSomos` y `/ThisIsWhoWeAre`. La auditoría falla deliberadamente mientras siga ese archivo.
2. **Publicación Git LFS:** la conexión de GitHub disponible permite operaciones del repositorio pero no proporciona un canal autenticado para subir objetos binarios LFS. No se publicaron punteros incompletos ni una migración parcial en `dev`. Se requiere un canal Git/LFS autenticado con capacidad para los assets.
3. **Entorno real:** faltan la validación SMTP MasterBase, integración de terceros y ejecución del pipeline en los recursos de desarrollo. No deben enviarse credenciales por el chat; se configuran en App Service Application Settings.
4. **Paridad:** queda aprobación visual explícita y ampliación de la comparación a las rutas recuperadas. `main` no debe actualizarse hasta esa aprobación y las pruebas completas.

El proyecto aún **no cumple todos los criterios de aceptación**. No se debe apagar el servidor anterior con este estado.

## Entrega y puesta en marcha

Descomprimir los cuatro ZIP en **la misma carpeta**. Todos crean/completan el directorio `crystal-web-corporativa/`:

- `Crystal_Astro_Fastify_Revision.zip`: código, configuración, lockfile, scripts, vendors, pruebas y documentación.
- `Crystal_Assets_01.zip`, `Crystal_Assets_02.zip` y `Crystal_Assets_03.zip`: particiones de los assets originales; se necesitan las tres.

No incluyen `node_modules`, outputs de build ni secretos. Después: `npm ci`, configurar `.env` local a partir de `.env.example`, `npm run check`, `npm run build`, `npm test`, `python3 scripts/audit_site.py`, `npm start`. La auditoría permanece bloqueada hasta corregir el banner con el archivo original válido.

Para llevarlo al repositorio existente, conservar `.git`, usar `dev`, copiar esta entrega después de revisar los archivos anteriores, instalar LFS y subir sus objetos antes del push. No crear ramas extra ni hacer force push. Los pasos detallados están en `docs/azure.md`. El pipeline distingue `dev` y `main`, despliega recursos independientes, verifica `/health` y no sobrescribe App Settings. La plataforma debe validar HTTPS Only, TLS mínimo 1.2, Always On, Application Insights y salida fija VNet/NAT si MasterBase la exige.

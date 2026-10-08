# Inventario de la migración Crystal

Fecha: 8 de octubre de 2026. Fuente principal: captura HAR entregada en `crystal_page_demo-main(1).zip`.

| Elemento | Hallazgo | Destino |
|---|---|---|
| HTML del ZIP | 38 páginas; el ZIP no incluía los archivos multimedia referenciados | Componentes `Page_*.astro` y rutas estáticas |
| Páginas enlazadas faltantes | Recuperadas del sitio vigente, con cookie de idioma | 58 rutas adicionales; procedencia en `routes.json` |
| Idiomas | Español e inglés; algunas rutas compartidas dependen de la cookie Django | Datos de idioma y selección equivalente en Fastify |
| Navegación | Menú de escritorio y móvil distintos, jerarquía anidada | Componentes separados conservando el DOM original |
| Multimedia y documentos | 7 MP4, 30 PDF, imágenes originales, aproximadamente 1,24 GB únicos | Archivos locales; Git LFS aprobado |
| Tipografía | Declaraciones originales de BrandonGrotesqueWeb/Neue Helvetica y las fuentes de sistema de Materialize; fuentes de iconos recuperadas | Declaraciones conservadas, sin sustituir por una fuente nueva; no se inventan archivos de fuentes ausentes |
| Estilos y animaciones | Materialize 1.0.0, jQuery 3.7.1, AOS 2.3.1; no GSAP en la captura | CSS y scripts originales locales; GSAP instalado sin añadir animaciones |
| Tema | No se encontró modo oscuro | No se agrega uno |
| Formulario | Departamento, nombre, apellido, correo, empresa, mensaje, idioma y autorización de datos | `POST /api/contact`, Nodemailer y SMTP MasterBase |
| Backend anterior | Flask; configuración SMTP por variables y confirmación al remitente; sin backend Django disponible | Fastify 5, plantillas HTML/texto y confirmación por idioma |
| Integraciones | GTM, mapas, PQRS externo, visor PDF | URLs conservadas; CSP compatible; requieren revisión conectada |
| Captura HAR | Scripts inyectados de seguridad, CSRF capturado y rutas anuladas | Inyecciones/tokens descartados; enlaces recuperados documentados |
| SEO | Títulos originales conservados; descripciones existentes/reutilizadas; rutas originales | Layout, canonical, hreflang, OG, Twitter, robots y sitemap |

La aplicación construye 96 rutas: 93 públicas y tres variantes internas en inglés de productos que conservan su URL pública compartida. Hay 49 variantes en español y 47 en inglés. La lista exacta es `src/data/routes.json`; `src/data/asset-manifest.json` centraliza las URLs de origen de assets.

Se revisó el repositorio privado `lgiraldocorrales/crystal-web-corporativa`, con `main` y `dev` inicialmente en `d0515d30168f70f91f95ffb6af43cd251465e4de`. No se utilizó ni modificó `crystal-web-page`. No se han actualizado las ramas remotas.

El banner `static/store/images/cumplimiento/banner_programa_etico1.png` devuelve un archivo PNG dañado desde el servidor original; permanece sin alterar hasta recibir el archivo válido. Este hallazgo bloquea la auditoría y el despliegue.

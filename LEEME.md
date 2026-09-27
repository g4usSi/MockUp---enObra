# EnObra · sitio multipágina, versión 2

Extrae el ZIP completo y abre `index.html`. HTML, CSS y JavaScript puro, sin instalación ni compilación. Imágenes y fuentes incluidas localmente.

## Organización

| Archivo | Contenido |
| --- | --- |
| index.html | Inicio: únicamente vistas previas y enlaces a los apartados. |
| nosotros.html | Presentación completa, historia, firma, misión, visión y principios derivados de los textos proporcionados. |
| servicios.html | Diseño, administración de proyectos, preconstrucción y construcción, con sus alcances. |
| proyectos.html | Portafolio independiente con filtro por año. |
| proyecto.html?id=… | Ficha del proyecto, fotografías, renders, descripción y video opcional. |
| bienes-raices.html | Catálogo inmobiliario independiente con filtros, orden y favoritos. |
| propiedad.html?id=… | Ficha comercial, galería, especificaciones, WhatsApp y visita. |
| noticias.html / noticia.html?id=… | Listado y publicación completa de noticias y eventos. |
| contacto.html | Contacto, WhatsApp y formulario de demostración. |
| admin.html | Panel local para administrar proyectos, propiedades, noticias, contacto y marca. |
| data.js | Contenido inicial editable. |
| store.js | Adaptador de almacenamiento local del prototipo. |
| main.js | Navegación, páginas, búsqueda, filtros, galerías y formularios. |
| admin.js | Edición, carga de medios, exportación e importación del panel. |
| styles.css | Identidad visual y adaptación responsive. |

La navegación abre páginas distintas en la misma pestaña. Las ventanas emergentes se reservan para búsqueda, visita y edición. La información institucional extensa NO está en Inicio. Se corrigieron ortografía y puntuación de los textos sin alterar su sentido. Los principios resumen los compromisos de los textos proporcionados.

La referencia de estructura consultada fue [Íntegro](https://integro.gt/): separación entre Nosotros, Portafolio, Noticias y Contacto. Se conserva la identidad azul y naranja de EnObra. No se ha copiado contenido institucional ni material gráfico de esa empresa. No se recibió un logo oficial ni una referencia gráfica adjunta; el logo actual sigue siendo una aproximación reemplazable.

## Qué funciona en el prototipo

- Páginas independientes y navegación móvil.
- Búsqueda de servicios, proyectos, propiedades y noticias, con enlaces a sus páginas.
- Filtro de proyectos por año y fichas con galerías.
- Filtros inmobiliarios combinables: operación, tipo, zona, precio, búsqueda, orden y favoritos. Los filtros se conservan en la URL.
- Favoritos en localStorage, con alternativa de memoria temporal si está bloqueado.
- WhatsApp abre una consulta prellenada; no envía mensajes automáticamente.
- Formularios de contacto y visita con validación y envío simulado.
- Panel local: crear, editar y eliminar proyectos, inmuebles y noticias; cargar fotos/renders; modificar contacto y rutas del logo; exportar/importar respaldos JSON y exportar data.js.
- Dos perfiles de demostración: Ing. Bernardo y Arquitecta, ambos con las mismas herramientas. No se inventó el nombre de la arquitecta.
- Videos MP4/WebM opcionales mediante ruta local o URL HTTPS, sin dependencias externas.

## Límites que deben resolverse antes de producción

Este entregable es un prototipo frontal, coherente con la solicitud de HTML, CSS y JS sin backend. El panel NO es un CMS seguro multiusuario: elegir un perfil no autentica a nadie, no hay contraseñas ni permisos de servidor, y los cambios no se sincronizan entre dispositivos. No debe utilizarse para guardar información privada.

Para producción hacen falta un backend/CMS, base de datos compartida, almacenamiento multimedia, dos cuentas reales con autorización en servidor, manejo seguro de formularios y publicación con HTTPS. No se ha registrado ni configurado un dominio, publicado el sitio, creado cuentas reales, enviado formularios ni concertado una reunión. Las credenciales y secretos nunca deben estar en JavaScript público.

Los formularios guardan solo la última simulación (`enobra-last-submission`) en el navegador. Usa datos ficticios al probar. El comentario “CONECTAR API REAL AQUÍ” en main.js indica el punto de integración.

## Insumos pendientes

- Logo oficial.
- Confirmación de teléfonos y dirección (se conservan los proporcionados anteriormente).
- Correo institucional: se muestra pendiente, no se inventó uno.
- URLs oficiales de Instagram y Facebook.
- Dominio definitivo y acceso a alojamiento.
- Nombre y correo de la arquitecta para la futura cuenta real.
- Renders, fotografías, trabajos ejecutados, años reales y datos comerciales de propiedades.
- Material y fecha confirmada del proyecto inmobiliario de septiembre.

Las propiedades, proyectos, años, noticias y fotos actuales están marcados como ejemplos. No se presenta un evento ni lanzamiento real sin información confirmada. Los campos de renders están disponibles, pero no se presentan fotografías de banco como renders auténticos.

## Inducción: administrar contenido

1. Abre `admin.html` o Administración en el pie del sitio.
2. Selecciona Ing. Bernardo o Arquitecta. Es una selección de perfil de demostración.
3. Abre Proyectos, Propiedades o Noticias y pulsa Añadir.
4. Completa los campos. En proyectos, el año organiza el portafolio. En propiedades, revisa operación, precio, superficie y especificaciones comerciales.
5. En Fotografías o Renders puedes escribir una ruta `assets/archivo.jpg`, una URL HTTPS o cargar archivos. Cada línea corresponde a una imagen; para retirarla, elimina su línea.
6. Las cargas locales aceptan JPEG, PNG, WebP o GIF hasta 2 MB por imagen. Este límite protege el pequeño almacenamiento del navegador. Para imágenes originales de alta resolución y videos, usa rutas/URLs alojadas adecuadamente.
7. Guarda, abre la página pública correspondiente y comprueba el resultado. Retira la marca de ejemplo solo si los datos son verificados.
8. Editar permite modificar un registro; Eliminar solicita confirmación.
9. Exporta un respaldo JSON. Puedes restaurarlo con Importar respaldo; esto reemplaza los datos locales tras confirmación.
10. Exporta data.js y reemplaza el archivo de la carpeta del sitio para trasladar los cambios a otra computadora. Las imágenes cargadas se incluyen como datos en el archivo exportado.

Los cambios locales usan `enobra-cms-v2`. Si el navegador mantiene una versión local anterior, esa versión tiene prioridad sobre data.js: importa el respaldo actualizado o elimina esa clave desde las herramientas del navegador para volver al contenido del archivo. Algunos navegadores aíslan el almacenamiento por archivo cuando se usa file://; exportar data.js permite trasladar el contenido de forma explícita. Para trabajo compartido real se necesita un servidor.

## Pruebas rápidas

1. Desde Inicio abre cada opción: verifica que la dirección cambia a un HTML diferente y que Inicio contiene solo resúmenes.
2. En Nosotros revisa presentación, firma, misión, visión y los cuatro principios. En Servicios revisa los cuatro grupos de alcances.
3. En Proyectos selecciona 2025 o 2026, abre una ficha y recorre sus fotografías.
4. En Bienes raíces combina Alquiler + Local; cambia precio o texto hasta obtener cero resultados; limpia filtros. Activa un favorito y recarga.
5. Abre una propiedad y solicita visita. Prueba campos vacíos, teléfono inválido y fecha pasada; después realiza una simulación válida.
6. En la búsqueda escribe Diseño y abre el resultado. En Servicios pulsa Solicitar información y comprueba el asunto preseleccionado en Contacto.
7. En el panel crea un proyecto de prueba, edítalo, carga un render y verifica su ficha; elimínalo tras confirmar. Haz una copia JSON antes de sustituir datos.
8. Revisa en móvil el menú, las tarjetas y los filtros plegables. Usa Tab, Shift+Tab y Escape en las ventanas.

## Revisión con el cliente

Guion sugerido para la reunión presencial, todavía no programada: validar colores y logo; revisar Inicio y navegación; confirmar textos; examinar portafolio e inmuebles; verificar datos de contacto; mostrar la administración y carga de renders; registrar correcciones y acordar entrega de insumos. La guía anterior y la pestaña Guía de uso sirven como material de inducción; no sustituyen una capacitación realizada con el cliente.

## Verificación realizada

Probado en Chromium mediante file://: 11 páginas, navegación, contenido separado, filtros, restauración por URL, favoritos, galería, validación de visita, búsqueda, selección de asunto, creación/edición/eliminación del panel, persistencia entre páginas y modificación de contacto. Sin errores JavaScript ni desbordamiento horizontal a 375, 768 y 1440 px. Se verificaron las rutas locales.

Fuentes e imágenes: `assets/FUENTES.txt` y licencias OFL incluidas. Al publicar, usar URLs públicas absolutas para las imágenes Open Graph y completar el dominio real.

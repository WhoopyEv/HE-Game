# Hired Experts — «Gracias, jefe» 🛡️

Minijuego web en pixel art creado por el equipo de desarrollo para el Día de Amor y Amistad de 2026. Es un homenaje a Hired Experts, con personajes de la empresa, mensajes de agradecimiento y bromas internas.

Juegas como **el Espartano**, un guiño a Sergio y a su expresión «mis espartanos». Exploras la oficina con vista desde arriba, reúnes cinco piezas y participas en una celebración en la terraza.

## Cómo jugar

Abre **[index.html](index.html)** en el navegador. No necesitas instalar dependencias ni compilar.

| Acción | Teclado | Táctil |
|---|---|---|
| Caminar | Flechas o WASD | Cruceta en pantalla |
| Hablar / avanzar un diálogo | E, ESPACIO o ENTER | Botón E |
| Abrir el ascensor | E frente a las puertas | Botón E |
| Elegir piso | ↑ / ↓ y E para confirmar | Toca el piso en la lista |
| Cerrar el selector del ascensor | ← / → | — |

Habla primero con **Sergio y Yesica en recepción** para recibir la misión y habilitar el ascensor. Después visita operaciones y conversa con los cinco integrantes del equipo de desarrollo. El HUD muestra tu progreso; la terraza se desbloquea cuando reúnes las cinco piezas.

## Recorrido actual

El edificio tiene **3 pisos**:

| Piso | Espacio | Qué sucede |
|---|---|---|
| 1 | Recepción y bienestar | Inicio de la misión y conversaciones opcionales |
| 2 | Operaciones | Exploración de la oficina y entrega de las cinco piezas |
| 3 | Terraza | Celebración, animación del logo y mensaje final del equipo |

Cada integrante entrega una pieza que representa un valor de Hired Experts:

| Personaje | Valor | Color |
|---|---|---|
| Diana | Oportunidad | Morado |
| Daniel | Confianza | Rojo |
| Nicolás | Aprendizaje | Blanco |
| Guillermo | Equipo | Amarillo |
| Felipe | Respaldo | Negro |

Otros personajes muestran mensajes opcionales en globos al acercarse. Al final, las piezas forman el logo de la empresa y aparece la dedicatoria del equipo de desarrollo.

## Versiones del proyecto

**La carpeta `versions/v2-edificio-completo/` contiene el código que usa actualmente `index.html`**, mediante `<base href="versions/v2-edificio-completo/">`. Su nombre es histórico: el mapa actual está reducido a tres pisos.

| Ruta | Contenido y uso actual |
|---|---|
| `index.html` | Entrada principal; carga los scripts y el audio de la versión del edificio |
| `versions/v2-edificio-completo/` | Versión del edificio, con su propia página, código, audio y configuración Docker |
| `versions/v1-un-piso/` | Primera versión conservada como referencia |
| `src/` | Implementación alternativa de plataformas lateral: saltos, obstáculos y piezas coleccionables |
| `artifact.html` | Fragmento HTML que actualmente carga la versión de plataformas de `src/`; no equivale a la entrada principal |
| `docs/PLAN.md` | Plan de la versión de plataformas (v3); no describe el juego que carga la página principal |

Los README y planes dentro de las carpetas de versiones pueden describir estados anteriores. Para el recorrido actual, las definiciones de `building.js`, `messages.js` y la lógica de `game.js` de la v2 son la referencia.

## Tecnología y estructura

El juego usa **HTML, CSS y JavaScript puro**, sin frameworks, dependencias de paquetes ni backend. Los escenarios y personajes se dibujan con Canvas a partir de tiles, matrices de píxeles y paletas. Los efectos de sonido se sintetizan con Web Audio; la versión del edificio también utiliza un archivo MP3 local.

```text
index.html                          Página principal y estilos
build-artifact.js                   Extrae estilos y cuerpo de index.html
artifact.html                       Fragmento de la versión de plataformas
versions/
  v2-edificio-completo/              Código de la versión actualmente enlazada
    index.html                      Entrada propia de esta versión
    assets/300-espartanos.mp3        Audio del Espartano
    src/
      sprites.js                    Pixel art y paletas
      map.js                        Tiles, mobiliario y decoración
      building.js                   Mapas, posiciones y personajes de los 3 pisos
      messages.js                   Valores, diálogos, dedicatoria y créditos
      engine.js                     Canvas, controles y bucle del juego
      characters.js                 Movimiento, colisiones y personajes
      dialogue.js                   Diálogos con efecto de escritura
      audio.js                      Efectos sintetizados y reproducción del MP3
      game.js                       Estados, misión, ascensor y celebración
    Dockerfile                      Servidor estático con Nginx
    docker-compose.yml              Publicación en el puerto 4001
  v1-un-piso/                        Primera versión
src/                                Código de la alternativa de plataformas
docs/PLAN.md                        Diseño de la alternativa de plataformas
```

## Personalizar la versión actual

Edita **[versions/v2-edificio-completo/src/messages.js](versions/v2-edificio-completo/src/messages.js)** para cambiar los textos:

- `VALUES`: nombres y colores de las cinco piezas.
- `MESSAGES.sergio`: misión y respuestas de Sergio y Yesica.
- `MESSAGES.devs`: agradecimientos de los cinco integrantes.
- `MESSAGES.extras`: conversaciones opcionales al acercarse.
- `MESSAGES.clouds`: globos de la celebración.
- `MESSAGES.finale`, `credits` y `dedication`: cierre del juego.

Las posiciones, decoraciones y personajes se configuran en **[building.js](versions/v2-edificio-completo/src/building.js)**. La secuencia de eventos y las condiciones de progreso viven en **[game.js](versions/v2-edificio-completo/src/game.js)**.

Editar los archivos del `src/` de la raíz cambia la alternativa de plataformas. Para modificar el juego que abre la página principal, utiliza el `src/` de la v2.

## Publicar

### Sitio estático

Puedes publicar la carpeta del proyecto en un servidor estático conservando la estructura de rutas. La entrada principal necesita `versions/v2-edificio-completo/src/` y `versions/v2-edificio-completo/assets/`.

También puedes publicar únicamente el contenido de `versions/v2-edificio-completo/`, usando su propio `index.html` como entrada junto con `src/` y `assets/`.

### Docker

Con Docker Compose disponible, ejecuta desde la raíz:

```bash
docker compose -f versions/v2-edificio-completo/docker-compose.yml up --build -d
```

Abre `http://localhost:4001`. Esta opción sirve la página propia de la v2 con Nginx.

### Estado del generador de fragmentos

```bash
node build-artifact.js
```

Este comando requiere Node.js y **sobrescribe `artifact.html`** extrayendo el bloque `<style>` y el contenido de `<body>` de la página principal. Los archivos JavaScript y el audio siguen siendo recursos separados.

Actualmente también omite el `<base>` del `<head>`. Por eso, el fragmento generado no conserva las rutas de la entrada principal: sus referencias `src/...` y `assets/...` necesitan resolverse respecto a `versions/v2-edificio-completo/` en el sitio que lo integre. Para publicar directamente el juego actual, utiliza una de las opciones anteriores.

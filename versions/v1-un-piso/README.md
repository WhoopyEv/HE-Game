# Hired Experts — "Gracias, jefe" 🛡️

Minijuego pixel-art para el Día de Amor y Amistad (viernes 18 de septiembre de 2026).

Juegas como **el Espartano** — el jefe. Recorres la oficina y, en cada escritorio, un miembro
del equipo de desarrollo te para para agradecerte. Al reunir los 5 mensajes se abre la sala de
juntas y ocurre la escena final: el equipo completo y la dedicatoria a Hired Experts.

Dura 3–4 minutos.

---

## Cómo jugarlo

**Doble clic en `index.html`.** No hay que instalar ni compilar nada.

| Acción | Teclado | Táctil |
|---|---|---|
| Caminar | Flechas o WASD | D-pad en pantalla |
| Hablar / avanzar | **E**, ESPACIO o ENTER | Botón **E** |

---

## Editar los mensajes

Todo el texto vive en **[`src/messages.js`](src/messages.js)** — el único archivo que hay que tocar
para personalizar los agradecimientos. No hace falta entender el resto del código.

```js
daniel: {
  name: 'DANIEL',
  lines: [
    'Primera caja de diálogo.',
    'Segunda caja.',
  ],
},
```

Cada cadena del array es una caja de diálogo. Recomendación: 2 o 3 por persona, ~80 caracteres
cada una — nadie lee párrafos largos en un minijuego.

También ahí están el texto de la intro, el mensaje final del equipo y los créditos.

---

## Estructura

```
index.html          la página; ábrela y ya
build-artifact.js   genera artifact.html (versión para publicar en web)
src/
  sprites.js        pixel art como matrices de caracteres + paleta
  map.js            tiles de la oficina, mobiliario y colisiones
  messages.js       ← los textos (lo que vas a querer editar)
  engine.js         canvas, escalado, teclado y táctil, game loop
  characters.js     el Espartano y los 5 devs; movimiento y colisiones
  dialogue.js       caja de diálogo con efecto máquina de escribir
  audio.js          sonidos chiptune generados con WebAudio
  game.js           máquina de estados y orquestación
docs/PLAN.md        el plan de diseño completo
```

**Sin dependencias, sin build, sin assets externos.** Todo el arte se dibuja por código y el audio
—música de fondo incluida— se sintetiza en el navegador con WebAudio. El juego entero pesa menos
de 60 KB.

La música es un loop chiptune sobre la progresión Do–Sol–Lam–Fa, definido como dos arrays de notas
en [`src/audio.js`](src/audio.js). El botón 🔊 de la esquina silencia todo. Por política de los
navegadores, el audio arranca al presionar ENTER, no antes.

---

## Personajes

| Quién | Dónde | Color |
|---|---|---|
| Daniel | arriba a la izquierda | camisa azul |
| Diana | arriba a la derecha | camisa morada |
| Nicolás | centro izquierda | camisa verde |
| Felipe | centro derecha | camisa naranja |
| Guillermo | abajo, el escritorio solo | camisa amarilla |

El Espartano (casco corintio con cresta roja y escudo) es el jugador.

---

## Publicar en web

```bash
node build-artifact.js
```

Genera `artifact.html`, que es `index.html` sin las etiquetas `<html>/<head>/<body>` — el formato
que piden los hosts que envuelven el contenido en su propia plantilla. `index.html` sigue siendo
la fuente de verdad: edita ese y vuelve a generar.

Al ser estático, también funciona tal cual en Netlify Drop o GitHub Pages subiendo la carpeta.

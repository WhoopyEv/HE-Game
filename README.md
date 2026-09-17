# Hired Experts — "Gracias, jefe" 🛡️

Minijuego pixel-art para el Día de Amor y Amistad (viernes 18 de septiembre de 2026), hecho por el
equipo de desarrollo.

Juegas como **el Espartano** y recorres el **edificio completo de Hired Experts**: 8 pisos, ascensor,
y en cada piso alguien que te deja un mensaje de agradecimiento. Marce te da la misión en recepción
y te espera arriba en la terraza. Al reunir los 6 mensajes, todo el edificio se reúne frente al arco
de globos y ocurre la escena final dedicada a Hired Experts.

(El Espartano es porque a Sergio le gustan los espartanos y nos llama "mis espartanos".)

---

## Cómo jugarlo

**Doble clic en `index.html`.** No hay que instalar ni compilar nada.

| Acción | Teclado | Táctil |
|---|---|---|
| Caminar | Flechas o WASD | D-pad en pantalla |
| Hablar / avanzar | **E**, ESPACIO o ENTER | Botón **E** |
| Usar el ascensor | **E** frente a las puertas | Botón **E** |
| Elegir piso | ↑ ↓ y **E** para ir, ← → para salir | Toca el piso en la lista |

El HUD muestra ❤ x/6. El ascensor marca con ❤ los pisos cuyo mensaje ya recogiste.

---

## El edificio

| Piso | Qué hay | ❤ |
|---|---|---|
| 1 | Recepción (Marce, Brandon, portería, servicios generales, logo de HE) y Bienestar (casilleros, ping-pong, almuerzo) | — |
| 2 | TI (manager y salones de training) y Recursos Humanos (3 managers y la oficina de Sergio) | Sergio |
| 3-7 | Dos oficinas de cubículos con agentes, un supervisor al final de cada hilera y suboficinas de manager | 1 manager por piso |
| 8 | Terraza: pasto, mesas con sillas de colores, la tienda de Marce y corazones decorando el borde | — (cierra el juego) |

Todos los pisos comparten la misma forma: oficina 01 · pasillo angosto con el ascensor y el baño ·
oficina 02.

---

## Editar los mensajes

Todo el texto vive en **[`src/messages.js`](src/messages.js)** — el único archivo que hay que tocar
para personalizar los agradecimientos. No hace falta entender el resto del código.

Los **mensajes obligatorios** (los que dan ❤) están en `floors`, uno por piso, y son de **una sola
frase** a propósito, para que recorrer 8 pisos no se sienta largo:

```js
floors: {
  3: {
    name: 'GERENTE PISO 3',
    lines: ['Gracias, Hired Experts, por dejarnos equivocarnos sin miedo.'],
  },
}
```

Los **mensajes opcionales** (no cuentan para el ❤ y se pueden repetir) están en `extras`, indexados
por el `id` del personaje: `aseo`, `brandon`, `porteria`, `mgrTi`, `mgrRh1`, `mgrRh2`, `mgrRh3`.

Ahí mismo están el texto de la intro, los diálogos de Marce, el mensaje final y los créditos.

Los mensajes opcionales **aparecen solos en un globo** cuando te acercas a la persona; los
obligatorios se leen con **E** en la caja de diálogo de abajo.

Los nombres de los gerentes de los pisos 3-7 están como placeholder (`GERENTE PISO 3`, etc.) hasta
que se definan las personas reales.

---

## Personalizar a alguien (easter eggs)

Todos los cubículos son iguales y tienen el mismo espacio de mesa; solo algunas personas tienen
objeto o mensaje. Se configura en la tabla `PERSONAL` de **[`src/building.js`](src/building.js)**:

```js
const PERSONAL = {
  3: [
    { col: 20, row: 1, item: 'pineapple', id: 'nicolas' },
  ],
};
```

- `col` / `row`: la posición de esa persona en el piso.
- `item`: el objeto que queda sobre su escritorio — `pineapple`, `headphones`, `duck`, `ball`,
  `mug` o `plant`.
- `id`: opcional. Si lo pones, esa persona habla: escribe su frase en `MESSAGES.extras.nicolas`
  y saldrá sola en un globo al pasar cerca.

Hoy el piso 3 tiene la piña, los audífonos, el pato y el balón repartidos en la primera hilera de
la oficina 02, sin mensaje todavía.

---

## Estructura

```
index.html          la página; ábrela y ya
build-artifact.js   genera artifact.html (versión para publicar en web)
src/
  sprites.js        pixel art como matrices de caracteres + paleta
  map.js            dibujo de tiles, terrenos, mobiliario y decoración
  building.js       los 8 pisos: mapas, zonas y personajes
  messages.js       ← los textos (lo que vas a querer editar)
  engine.js         canvas, escalado, teclado y táctil, game loop
  characters.js     el Espartano y los NPC; movimiento, colisiones y cámara
  dialogue.js       caja de diálogo con efecto máquina de escribir
  audio.js          sonidos chiptune generados con WebAudio
  game.js           máquina de estados, ascensor y orquestación
docs/PLAN.md        el plan de diseño completo
versions/v1-un-piso/  la versión anterior (un solo piso), congelada
```

**Sin dependencias, sin build, sin assets externos.** Todo el arte se dibuja por código —incluido el
logo de la empresa— y el audio se sintetiza en el navegador con WebAudio.

Los pisos 3-7 se generan con una sola plantilla parametrizada, así que agregar detalle a un piso no
obliga a rehacer los demás. La cámara sigue al Espartano porque cada piso es más grande que la
pantalla.

---

## Publicar en web

```bash
node build-artifact.js
```

Genera `artifact.html`, que es `index.html` sin las etiquetas `<html>/<head>/<body>` — el formato
que piden los hosts que envuelven el contenido en su propia plantilla. `index.html` sigue siendo
la fuente de verdad: edita ese y vuelve a generar.

Al ser estático, también funciona tal cual en Netlify Drop o GitHub Pages subiendo la carpeta.

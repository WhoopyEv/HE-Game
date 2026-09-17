# Hired Experts — "Gracias, jefe" 🛡️ — Plan v3: Modo Historia

> **Nota de contexto:** este documento reemplaza el plan v2 (edificio de 8 pisos, top-down). La v2
> se construyó completa y funcional, pero se abandonó: reproducía visualmente la jerarquía de la
> empresa (oficinas de vidrio para managers, escritorios distintos por rango, supervisores mirando
> filas) y era demasiado grande para el tiempo real disponible. Queda archivada en
> [`versions/v2-edificio-completo/`](../versions/v2-edificio-completo/) como referencia, no como
> punto de partida. La v1 (un piso, 5 devs) sigue en
> [`versions/v1-un-piso/`](../versions/v1-un-piso/).
>
> **Fecha del evento:** viernes 18 de septiembre de 2026. Este plan se escribe el jueves 17 → queda
> literalmente hoy. Por eso el alcance de este documento es deliberadamente chico: un solo nivel,
> un solo modo jugable.

---

## 1. Concepto

Plataformas 2D estilo Mario clásico, ambientado en la oficina de Hired Experts. El Espartano
corre y salta por un solo nivel corto ("Modo Historia"), recogiendo **5 piezas de valores**
repartidas en 6 escenarios. Al llegar a la meta, las piezas se arman y se voltean revelando el
logo de Hired Experts, y aparece el mensaje del equipo de desarrollo.

**Por qué este diseño y no el anterior:** ningún personaje representa un cargo. No hay oficinas de
manager, no hay "quien te da el mensaje según su rango" — los únicos que hablan en todo el juego
son los 5 devs, al principio (el porqué) y al final (el mensaje a Hired Experts). Los departamentos
existen como ambientación de los escenarios, no como fuente de autoridad narrativa.

**Segundo modo, Arcade** (estilo Dino de Google: un solo carril, obstáculos infinitos aleatorios,
high score real): queda **documentado pero sin construir**. Se planea desbloquear después de
terminar Historia una vez — pero esa lógica de desbloqueo tampoco se construye todavía. Por ahora
**no aparece en el menú**.

---

## 2. Flujo de pantallas

```
[Título]
  Botón "Historia" (habilitado) · "Arcade" (no existe todavía, ni se muestra)
        │
        v
[Pantalla "Cómo jugar"]
  Una frase de contexto (por qué el Espartano está corriendo) + diagrama de controles.
  Se salta con ESC en cualquier momento.
        │
        v
[Nivel — Modo Historia]
  6 escenarios en un solo recorrido continuo, cámara siguiendo al Espartano.
  ESC en cualquier momento abre pausa (reanudar / ver controles / volver al título).
  HUD: contador N/5 + ícono fijo de pieza de rompecabezas arcoíris.
        │
        v  (llega a la puerta de la terraza)
[Finale]
  Las piezas recogidas vuelan al centro, se acomodan sobre un fondo negro, y se voltean
  revelando el logo real de Hired Experts en pixel art.
  Si faltan piezas, el logo queda incompleto (no es un fracaso, es motivo de reintentar).
  Aparecen los 5 devs de pie junto al logo.
  Mensaje del equipo de desarrollo · créditos · "Volver a jugar"
```

---

## 3. Los 6 escenarios

Un solo nivel continuo, sin cortes de carga entre zonas — la cámara sigue al Espartano de punta a
punta. El **checkpoint de reaparición es el inicio de cada escenario**: si te caés o te choca un
obstáculo en cualquier punto de una zona, reaparecés al comienzo de esa misma zona, no del nivel
completo. No hay vidas ni pantalla de game over.

**Regla de oro del arte:** nada flota. Todo mueble que sea plataforma se dibuja y colisiona hasta
el piso; la decoración se ancla al suelo. Lo único que flota a propósito son las piezas de valores.

| # | Escenario | Ambiente | Pieza (color · valor) | Obstáculo(s) |
|---|---|---|---|---|
| 1 | **Recepción** (arranque) | mostrador, logo de HE en la pared, plantas | Morado · Oportunidad | Proyectil: cafetera eléctrica dispara un vaso de café en arco |
| 2 | **Parqueadero** | piso gris oscuro (asfalto), al aire libre, carros y estibas | — (respiro, sin pieza) | ninguno |
| 3 | **Bienestar** | casilleros (tres bloques), mesa de ping-pong, banca, dispensador | Amarillo · Equipo | Proyectil: pelota de ping-pong perdida que rebota |
| 4 | **Operaciones** | piso plano con escritorios, monitores, impresoras y sillas | Rojo · Confianza | **Esquivar las sillas que ruedan** (tres patrullas). Sin plataformas: el reto es horizontal |
| 5 | **TI** | cinco racks de servidor, todos con colisión, impresoras | Blanco · Aprendizaje | Patrulla + Proyectil (impresora) + Plataforma inestable — la zona más exigente |
| 6 | **Terraza** | escalera de cuatro escalones, pasto, arco de globos, mesas | Negro · Respaldo | Plataforma inestable a la misma altura que la terraza (si se falla, se cae sobre ella, no al vacío) |

La dificultad sube con el nivel: Recepción es la más simple, TI y la Terraza las más exigentes por
venir después y combinar más retos.

### Ubicación de las piezas

Cada pieza obliga a un salto pequeño ligado al obstáculo propio de su zona, no flota suelta:

| Escenario | Dónde está la pieza |
|---|---|
| Recepción | sobre el mostrador — hay que sincronizar el salto con la cafetera |
| Operaciones | flotando entre dos escritorios — se cruza saltando "isla a isla" mientras pasa el carrito |
| TI | arriba de los racks apilados — subiendo rack por rack, cruzando la baldosa inestable |
| Bienestar | encima de la mesa de ping-pong — esquivando la pelota que rebota |
| Terraza | casi en el último escalón, justo antes de la puerta — la prueba final |

### Objetos que nos representan

Piña, balón, termo, audífonos y pato — **desactivados por ahora** (comentados en `src/level.js`,
listos para volver con una línea). Se retomarán cuando el nivel esté cerrado.

---

## 4. Los 3 tipos de obstáculo

Un toolkit de 3 comportamientos genéricos, reutilizados con distinto disfraz por zona — así hay
variedad visual sin tener que programar un sistema nuevo por escenario.

### Patrulla
Se mueve en línea recta entre dos puntos fijos, a ras de piso, rebotando de un extremo al otro.
- **Choque:** reaparecés al inicio del escenario.
- **Se evita:** saltando por encima cuando pasa cerca.
- **Aviso justo:** se ve venir desde lejos, nunca aparece de la nada.
- **Parámetros:** velocidad, rango de ida y vuelta, fase inicial.
- **Disfraces:** silla de oficina rodando (Operaciones, TI), carrito de mercancía.

### Proyectil cronometrado
Se dispara en arco desde un punto fijo cada cierto intervalo.
- **Aviso justo:** parpadeo breve (~0.4s) en el origen antes de disparar.
- **Choque:** mismo respawn que Patrulla.
- **Se evita:** saltando en el momento justo o no estando en la zona de aterrizaje.
- **Parámetros:** intervalo entre disparos, altura/distancia del arco, duración del aviso.
- **Disfraces:** cafetera eléctrica (Recepción), impresora escupiendo papel (TI), pelota de
  ping-pong perdida (Bienestar).

### Plataforma inestable
Plataforma normal hasta que te parás en ella: empieza a parpadear y desaparece después de un
momento corto, reapareciendo un rato después.
- **Aviso justo:** el parpadeo da tiempo de saltar a la siguiente antes de que ceda.
- **Choque:** si estabas parado cuando desaparece, caés — mismo respawn sin castigo.
- **Se usa solo en TI y en la Terraza** (no en Recepción, Operaciones ni Bienestar — decisión
  explícita para no repetir el mismo truco en todas las zonas).
- **Disfraces:** baldosa de piso técnico removible (TI, muy propio del lugar), escalón/caja de
  madera que cede (Terraza).

---

## 5. Controles y sensación de juego

- **Movimiento:** izquierda/derecha a velocidad normal, constante — nada de auto-run. La sensación
  de velocidad/adrenalina queda para el futuro Modo Arcade, que ahí sí tiene sentido que sea
  frenético.
- **Salto:** un solo botón, arco fijo, sin doble salto ni power-ups por ahora.
- **No hay agachar/duck** — todo obstáculo se resuelve saltando o posicionándose, no hace falta un
  botón adicional.
- **ESC:** salta la pantalla de "cómo jugar", y durante el juego abre pausa.
- **Sin vidas ni game over** — la dificultad/dureza real queda para después del evento, hoy el
  objetivo es que cualquiera lo disfrute sin frustrarse.

---

## 6. Las 5 piezas de valores

Viven en un solo archivo editable (extensión de `messages.js`), igual que el resto del texto del
juego — cambiar un valor no toca el motor:

```js
// Los 5 valores que arma el Espartano. Cambiar nombre o color no requiere tocar el motor.
const VALUES = [
  { id: 'oportunidad', color: '#8f2fd4', label: 'OPORTUNIDAD' }, // morado — Recepción
  { id: 'confianza',   color: '#e0453e', label: 'CONFIANZA'   }, // rojo   — Operaciones
  { id: 'aprendizaje', color: '#f4f0e6', label: 'APRENDIZAJE' }, // blanco — TI
  { id: 'equipo',      color: '#f2c50a', label: 'EQUIPO'      }, // amarillo — Bienestar
  { id: 'respaldo',    color: '#0d0a12', label: 'RESPALDO'    }, // negro  — Terraza
];
```

Los colores son los del logo real de Hired Experts (rojo, morado, blanco, negro, amarillo) — no
son un arcoíris arbitrario. Antes de agarrarlas, las piezas son solo un bloque de ese color, sin
texto. Al agarrarlas, el nombre del valor aparece un instante junto al personaje (tipo power-up
clásico).

Sistema pensado para N piezas, no exactamente 5: si más adelante se agrega un 6º escenario con
valor propio, es una fila más en esta tabla — no hay que rediseñar nada.

---

## 7. HUD

- Contador numérico: `N/5`.
- Al lado, un ícono fijo de **pieza de rompecabezas multicolor** (arcoíris) — símbolo del conjunto
  completo, no cambia durante el juego. Es el mismo ícono que se agranda en la escena final.

---

## 8. El final

1. Al llegar a la puerta de la terraza: las piezas recogidas vuelan desde el HUD hacia un fondo
   negro que aparece en el centro de la pantalla.
2. Cada pieza viaja al punto exacto donde ese color vive dentro del logo real (el morado a la
   barra de arriba a la derecha, el rojo al cuadrito, el amarillo a la barra de abajo, el blanco a
   las letras, el negro al fondo).
3. Cuando están todas en su sitio, el conjunto arma una silueta y se **voltea** (mismo truco de
   espejo que ya se usa para el Espartano, `ctx.scale(-1,1)`, aplicado a la escena completa en vez
   de a un sprite). En el instante en que queda de canto, se reemplaza el dibujo: de piezas de
   colores sueltas a **el logo real, pixel-perfecto**, ya construido (`drawLogo` en `map.js`).
4. Si faltan piezas, el logo queda incompleto — no es un fracaso, es motivo para volver a
   intentarlo.
5. Los 5 devs aparecen de pie junto al logo armado (se reutilizan los sprites ya construidos en la
   v1/v2). Por ahora quedan con rasgos genéricos — **una única mujer del grupo debe ser Diana**
   (sprite de pelo largo), los otros 4 con sprites de hombre. Personalizarlos para que se vean como
   nosotros de verdad queda para después.
6. Mensaje del equipo de desarrollo (borrador, editable en el mismo archivo que `VALUES`):

```js
finale: {
  name: 'EL EQUIPO',
  lines: [
    'No es un logo.',
    'Es confianza, equipo, aprendizaje, respaldo y oportunidad — armados entre todos.',
    'Eso es Hired Experts.',
    'Gracias por dejarnos ser parte de esto.',
  ],
},
```

7. Créditos y "Volver a jugar".

---

## 9. Modo Arcade (documentado, no construido)

Estilo Dino de Google: el Espartano corre en un solo carril, obstáculos infinitos y aleatorios
(reciclando el mismo catálogo: Patrulla, Proyectil, Plataforma inestable, ahora generados al azar
y acelerando con el tiempo), sin piezas ni historia — el objetivo es un high score guardado en el
navegador. Se planea que se desbloquee al terminar Historia una vez. **Nada de esto se construye
en esta iteración** — ni el modo, ni el desbloqueo, ni el botón en el menú.

---

## 10. Punto de partida en el código

No se empieza de cero del todo: `engine.js`, `sprites.js`, `audio.js`, `dialogue.js` y el
`build-artifact.js` de la v2 son reutilizables casi tal cual. El resto necesita reescribirse porque
el género cambió (top-down → plataformas con gravedad):

| Archivo (v2) | Qué hace hoy | Qué necesita para v3 |
|---|---|---|
| `engine.js` | Canvas, loop, input, escalado | Reutilizable casi tal cual; se agrega tecla de pausa/ESC |
| `sprites.js` | Espartano de perfil (ya sirve), sprites de los 5 devs de pie | Se agrega pose de salto al Espartano; el resto de sprites de personal (agentes, managers, aseo) ya no se usan |
| `audio.js` | Chiptune + sfx | Se agregan sfx de salto, recoger pieza, y el volteo del logo |
| `dialogue.js` | Caja de diálogo para el mensaje final | Reutilizable tal cual |
| `map.js` | Dibujo de tiles top-down + `drawLogo` (reutilizable) | Todo lo de pisos/paredes top-down se descarta; se necesita un módulo nuevo de nivel: suelo, plataformas, gravedad, cámara horizontal |
| `building.js` | Los 8 pisos del edificio | Se descarta completo, se reemplaza por la definición del nivel de 6 escenarios |
| `characters.js` | Movimiento top-down, colisión de piso | Se reescribe: gravedad, salto, colisión de plataformas, checkpoints |
| `game.js` | Máquina de estados del edificio | Se reescribe: `TÍTULO → CÓMO_JUGAR → NIVEL ⇄ PAUSA → FINAL` |
| `messages.js` | Textos de los 5 devs, mensaje final | Se extiende con `VALUES` (§6) y el nuevo mensaje final (§8) |

`versions/v2-edificio-completo/` y `versions/v1-un-piso/` quedan como referencia congelada, no
como punto de edición.

---

## 11. Prioridades dado el tiempo

1. Física de plataformas + un escenario jugable de punta a punta (aunque sea gris, sin arte final).
2. Los 6 escenarios con su ambientación y las 5 piezas ubicadas.
3. Los 3 obstáculos con sus disfraces por zona.
4. El final: armado de piezas, volteo al logo, mensaje, devs de pie.
5. Pantalla "cómo jugar", pausa, pulido de HUD.
6. Objetos que nos representan (piña, balón, termo, audífonos, pato) repartidos por el nivel.

Si el tiempo aprieta, lo primero que se recorta es el punto 6, nunca el 1-4.

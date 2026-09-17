# Hired Experts — "Gracias, jefe" 🛡️ — Plan v2: El edificio completo

> **Nota de contexto:** este documento reemplaza el plan v1 (un solo piso, 5 devs). La
> implementación de v1 sigue funcionando y queda archivada en [`versions/v1-un-piso/`](../versions/v1-un-piso/)
> como referencia y como fallback si el tiempo no alcanza para v2.
>
> **Fecha del evento:** viernes 18 de septiembre de 2026. Este plan se escribe el miércoles 16 →
> quedan 2 días de margen. Por eso la arquitectura del edificio está diseñada para que solo 3 de
> los 8 pisos sean contenido "a medida" (1, 2 y 8); el resto (3-7) es una sola plantilla
> parametrizada. Ver [§8 Fases y prioridades](#8-fases-y-prioridades-dado-el-tiempo).

> **Estado:** v2 implementada. Los 8 pisos, el ascensor con selección de piso, la cámara que sigue
> al Espartano, el contador ❤ x/6, los mensajes opcionales y la escena final en la terraza están
> funcionando. Lo que queda pendiente es la personalización de contenido (nombres y frases reales de
> los gerentes, easter eggs de agentes), que se hace en [`src/messages.js`](../src/messages.js) sin
> tocar el motor.

---

## 1. Concepto

El juego pasa de ser un gesto personal ("el equipo le agradece al jefe") a ser **la pieza del
equipo de desarrollo para el concurso "Amor y Amistad" de Hired Experts** (equipos de 3-4,
evaluados en creatividad, originalidad y trabajo en equipo).

El jugador sigue siendo **el Espartano**. Ya no recorre una sola oficina: recorre el **edificio
completo de Hired Experts, piso por piso**, cumpliendo una misión que le da Marce (una persona muy
querida de la empresa) en la recepción: reunir un agradecimiento de cada piso y llevarlo hasta la
terraza. Al completar la misión, todo el edificio se reúne para la escena final dedicada a Hired
Experts.

La inversión de roles del concepto original se mantiene (el jefe/Espartano recibe gratitud en vez
de darla), pero el destinatario final ya no es una persona sino la empresa completa — coherente con
que esto se presenta como entrega de equipo, no como regalo individual.

**Por qué el Espartano:** no es una elección estética arbitraria. A Sergio (el CEO) le gustan los
espartanos y llama al equipo "mis espartanos" — el personaje jugable es una referencia directa a
eso, no un guerrero genérico.

**Duración objetivo:** más larga que v1 (son 8 pisos en vez de 1), pero cada piso se mantiene corto
a propósito — diálogos de una sola frase por personaje obligatorio para que recorrer el edificio no
se sienta pesado.

---

## 2. Flujo de la experiencia

```
[Pantalla título]
        │
        v
[Piso 1 — Recepción]
  · Marce le da la misión al Espartano: reunir un agradecimiento de cada piso
    y presentarse en la terraza (piso 8) cuando los tenga todos
  · HUD: ❤ 0/6
        │
        v  (el jugador entra al ascensor)
[Ascensor — hub de navegación]
  · Menú de selección de piso (1-8)
  · Marca visualmente qué pisos ya tienen su ❤ recogido
        │
        v  (orden libre, ×6 pisos con corazón obligatorio: piso 2 y pisos 3-7)
[Piso N — diálogo con el personaje obligatorio]
  · Una frase de agradecimiento → ❤ sube
  · Personajes opcionales del piso (managers extra, agentes personalizables)
    dan mensajes que NO cuentan para el progreso
        │
        v  (al llegar al piso 8 en cualquier momento)
[Piso 8 — Terraza]
  · Si faltan ❤: Marce recuerda la misión ("todavía faltan X pisos")
  · Si están los 6/6: se dispara el finale
        │
        v
[Escena final]
  · Todo el edificio se reúne en la terraza, frente al arco de globos en forma de
    corazón (el mismo del evento real) · confeti · dedicatoria a Hired Experts
  · Créditos: esto lo hizo el equipo de desarrollo, como entrega para el concurso
  · "Volver a jugar"
```

---

## 3. El edificio

### 3.1 Forma general (pisos 1-7)

Todos los pisos comparten la misma silueta estructural: dos oficinas separadas por un pasillo
angosto central, con el ascensor en la parte de arriba del pasillo y el baño pegado directamente al
borde inferior del pasillo (mismo bloque, sin gap — no es un anexo flotante).

```
┌───────────┬─────┬───────────┐
│ oficina01 │pasi-│ oficina02 │
│           │llo  │           │
│           │(asc)│           │
└───────────┴──┬──┴───────────┘
               │ baño │
               └──────┘
```

El pasillo es notablemente más angosto que las oficinas — es el corredor de circulación y acceso al
ascensor/baño, no un espacio habitable.

El piso 8 (terraza) no sigue esta plantilla: es piso de pasto (verde) con mesas de almuerzo, sin
oficinas ni pasillo.

**El piso 1 sí sigue esta misma forma**, reinterpretada: oficina01 = recepción (Marce, Brandon,
portería, las 4 personas de aseo), oficina02 = bienestar (casilleros, ping-pong, mesas de almuerzo),
pasillo central = ascensor + baño, igual que en el resto del edificio. No es una forma distinta, es
la misma plantilla con otro contenido — igual que el piso 2.

Cada piso es más grande que el mapa de v1 (dos oficinas + pasillo + baño no caben enteras en una
sola pantalla sin cámara). Por eso **la cámara sigue al Espartano** en vez de mostrar el piso
completo de una — esto es un cambio de comportamiento respecto a v1, donde el mapa entero se veía
fijo sin scroll.

### 3.2 Piso por piso

| Piso | Tipo | Contenido | ❤ obligatorio |
|---|---|---|---|
| **1** | A medida | **Oficina01 = Recepción**: Marce (da la misión), Brandon (manager de logística y servicios generales), portería, las 4 personas de aseo (mensaje único de agradecimiento, no importa a cuál te acerques primero). **Oficina02 = Bienestar**: casilleros, mesa de ping-pong, mesas de almuerzo | — |
| **2** | A medida | **Oficina01 = TI**: suboficina del manager de TI + salones de training. **Oficina02 = RRHH**: 3 suboficinas de manager (mensajes opcionales) + oficina del CEO, Sergio | Sergio (CEO) |
| **3-7** | Plantilla | **Oficina01**: 4 filas de cubículos, un supervisor al final de cada fila (ambiente, decorativo). **Oficina02**: 3 filas de cubículos + suboficinas de manager | 1 manager por piso |
| **8** | A medida | **Terraza**: pasto, mesas blancas verticales con sillas amarillas/blancas/azules, la tienda de Marce sobre baldosa, zona de baldosa en la salida del ascensor, corazones y plantas en el borde | — (dispara el finale si 6/6) |

Total de corazones obligatorios: **6** (Sergio en el piso 2 + un manager por cada piso 3-7).

---

## 4. Personajes

### 4.1 Obligatorios (dan ❤)

| Personaje | Piso | Nota |
|---|---|---|
| Sergio (CEO) | 2 | Suboficina propia en la oficina de RRHH |
| Manager piso 3 | 3 | Placeholder — nombre/mensaje real a definir después |
| Manager piso 4 | 4 | Placeholder |
| Manager piso 5 | 5 | Placeholder |
| Manager piso 6 | 6 | Placeholder |
| Manager piso 7 | 7 | Placeholder |

### 4.2 Mission-giver

| Personaje | Dónde | Rol |
|---|---|---|
| Marce | Piso 1 (recepción) y piso 8 (terraza) | Da la misión al inicio; en la terraza recuerda la misión si faltan ❤, o dispara el finale si están los 6/6 |

### 4.3 Opcionales / personalizables (no dan ❤, se completan después)

| Personaje | Piso | Nota |
|---|---|---|
| Brandon | 1 | Manager de logística y servicios generales |
| Portería | 1 | Ambiente |
| 4 personas de aseo | 1 | Un solo mensaje general del equipo, reflexivo, agradeciendo por cuidar del edificio y los espacios de todos |
| Manager de TI | 2 | Mensaje opcional |
| 3 managers de RRHH | 2 | Mensajes opcionales, aún sin decidir si los tres hablan o solo algunos |
| Supervisores de fila | 3-7 | Decorativos por ahora |
| Agentes de cubículo | 3-7 | Diversos, algunos personalizables con mensajes propios (easter eggs de amigos) más adelante |

La identidad real de los managers (pisos 2-7) y de los agentes a personalizar se define después de
tener la estructura funcionando — no bloquea la construcción del edificio.

---

## 5. Mecánicas

| Mecánica | Detalle |
|---|---|
| Movimiento | Igual que v1: flechas/WASD, 4 direcciones |
| Cámara | Sigue al Espartano (a diferencia de v1, donde el mapa completo se veía fijo sin scroll) — necesario porque cada piso es más grande que una sola pantalla |
| Navegación entre pisos | Ascensor en el pasillo de cada piso. Interactuar abre un menú de selección de piso (1-8), que marca cuáles ya tienen su ❤ recogido. Sin animación de cabina por ahora |
| Progreso | HUD ❤ x/6. Los pisos se pueden visitar en cualquier orden |
| Diálogo obligatorio | **Una sola frase** por personaje que da ❤ — con 6 personajes en vez de 5 y muchos más pisos que recorrer, hay que mantener el ritmo corto |
| Diálogo opcional | **Automático**: aparece en un globo de cómic sobre la persona al pasar cerca, sin presionar nada. No usa la caja de diálogo. El mensaje de aseo es único y compartido por los 4 |
| Ayuda | Botón **?** junto al de sonido: abre un modal con los controles y pausa la entrada del juego |
| Trigger final | En el piso 8, si ❤ = 6/6 se dispara el finale. Si no, Marce recuerda la misión |
| Personalización diferida | Managers y algunos agentes de cubículo quedan como placeholders genéricos, reemplazables sin tocar el motor (mismo principio que `messages.js` en v1) |

---

## 6. Detalles de pulido acordados

Bajo costo de implementación, alto valor de creatividad/conexión con el evento real:

1. **Corazones decorando el borde de la terraza** (guiño a la decoración del evento). El arco de
   globos en forma de corazón está implementado y disponible —basta con volver a poner la propiedad
   `arch` en el piso 8 de `src/building.js`— pero por ahora se dejó fuera.
2. **Letrero de piso al llegar en el ascensor** (ej. "Piso 3 — Ventas"), 1-2 segundos, sin diálogo.
   Le da personalidad a los pisos de la plantilla (3-7) sin escribir contenido nuevo.
3. **Sonido de "ding"** del ascensor al cambiar de piso, usando el sistema de audio WebAudio ya
   existente.
4. **Créditos finales** dejan explícito que esto lo construyó **el equipo de desarrollo** como su
   entrega para el concurso, no como un mensaje genérico de la empresa.

Explícitamente diferido (no compite por tiempo con terminar los 8 pisos base): personalización de
managers y agentes, easter eggs de amigos, animación de cabina de ascensor.

---

## 7. Arte y estructura técnica

Se mantienen los principios de v1: todo el arte por código (sprites como matrices de caracteres +
paleta), sin assets externos, JS vanilla con scripts clásicos, audio sintetizado con WebAudio.

Cambio de fondo respecto a v1: el motor pasa de tener **un mapa fijo** a soportar **N pisos**, cada
uno con su propio mapa, personajes y estado de progreso. Los pisos 3-7 deberían compartir una sola
plantilla parametrizada (cantidad de filas, paleta, identidad del manager) en vez de seis mapas
hechos a mano — esa es la decisión de arquitectura que hace viable construir el edificio completo en
el tiempo disponible.

Así quedó implementado: las definiciones de piso viven en `src/building.js` (mapas como rejilla de
caracteres, zonas de terreno y lista de NPC por piso), `src/map.js` quedó como biblioteca de dibujo
de tiles/terrenos/mobiliario, y `src/game.js` maneja el piso actual, el menú del ascensor y el
progreso. Los pisos 1, 2 y 8 son a medida; los 3-7 salen de `officeFloor(n)`.

### 7.1 Mapa del código (v2 implementada)

| Archivo | Qué hace |
|---|---|
| `src/engine.js` | Canvas, loop, input (teclado + táctil), escalado pixel-perfect |
| `src/sprites.js` | Paleta y sprites por código: Espartano, agentes con diadema, supervisores, managers, Marce, aseo, portería |
| `src/map.js` | Dibujo de tiles: terrenos, paredes, vidrio, ascensor, mobiliario, baño, pasto, arco de globos |
| `src/building.js` | Los 8 pisos: rejillas de caracteres, zonas de terreno, NPC y decoración. `officeFloor(n)` genera los pisos 3-7 |
| `src/characters.js` | Espartano y NPC: movimiento, colisiones, rango de interacción, cámara, indicadores (❤ / prompt / diálogo opcional) |
| `src/dialogue.js` | Caja de diálogo, typewriter, cola de mensajes |
| `src/messages.js` | **Todos los textos**, aislados del motor: `floors` (obligatorios), `extras` (opcionales), Marce, intro, finale, créditos |
| `src/audio.js` | Chiptune por WebAudio + "ding" del ascensor |
| `src/game.js` | Máquina de estados `TÍTULO → INTRO → JUGANDO ⇄ DIÁLOGO / ASCENSOR → FINAL`, piso actual, progreso ❤ x/6 |

Notas de implementación que no son obvias leyendo el código:

- **Roles de NPC:** `required` (da ❤, uno por piso 2-7, se habla con **E**), `optional` (globo
  automático al acercarse), `mission` (Marce, marcador **!**) y `none` (ambiente).
- **Personalización:** la tabla `PERSONAL` en `src/building.js` sobrescribe agentes generados por
  posición: `item` les pone un objeto en el escritorio y `id` los vuelve `optional` con su texto en
  `MESSAGES.extras`. Todos los cubículos tienen el mismo tamaño de mesa; el objeto va en la franja
  libre frente al monitor, así nadie queda con escritorio más grande que el resto.
- **Ascensor:** el menú es un overlay de DOM (`#elevator`), no canvas, para que el texto se lea bien
  en cualquier pantalla. Marca ❤ los pisos ya completados.
- **Puerta de la misión:** el ascensor no funciona hasta hablar con Marce, para que nadie se pierda
  al empezar.
- **Rendimiento:** el fondo de cada piso se pinta una vez a un canvas y se cachea; por frame solo se
  redibujan los NPC visibles (con culling de cámara) y los monitores, que son sprites pre-renderizados.

`versions/v1-un-piso/` tiene una copia congelada de esta misma implementación como fallback si el
edificio completo no llega a tiempo — no es el punto de partida para editar, es la red de seguridad.

---

## 8. Fases y prioridades dado el tiempo

Con el evento el viernes 18 y este plan escrito el miércoles 16, la prioridad de construcción debería
ser:

1. ✅ Arquitectura multi-piso (ascensor, selección de piso, progreso ❤ x/6).
2. ✅ Plantilla de pisos 3-7 con managers placeholder.
3. ✅ Pisos a medida: 1 (recepción/bienestar/aseo), 2 (TI/RRHH/Sergio), 8 (terraza/finale).
4. ✅ Los 4 detalles de pulido (§6).
5. ⬜ Personalización real de managers/agentes — se puede seguir ajustando sin tocar la estructura.

Si el tiempo aprieta, lo primero que se recorta es la personalización (punto 5) y el pulido (punto
4), nunca la arquitectura base (puntos 1-3).

---

## 9. Supuestos y riesgos

- **Fecha:** evento viernes 18 de septiembre de 2026. Este plan se escribe el miércoles 16 → 2 días
  de margen. Alcance completo de 8 pisos es ambicioso para ese margen; la mitigación es la plantilla
  reutilizable de los pisos 3-7 y dejar toda personalización para después.
- **Identidad de los managers:** los 5 managers de pisos 3-7 quedan como placeholders hasta que se
  definan personas reales. No bloquea la construcción.
- **RRHH (piso 2):** aún sin decidir si los 3 managers opcionales de RRHH tendrán mensaje cada uno o
  solo algunos — no es bloqueante, se puede dejar sin mensaje y agregar después.
- **Riesgo real:** que 8 pisos con ascensor y plantilla paramétrica no alcancen a terminarse a tiempo
  completos. Mitigación: v1 (un piso, 5 devs) queda funcional en
  [`versions/v1-un-piso/`](../versions/v1-un-piso/) como fallback si hace falta entregar algo antes
  de tener el edificio completo.

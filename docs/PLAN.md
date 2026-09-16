# Hired Experts — "Gracias, jefe" 🛡️

Minijuego pixel-art para el Día de Amor y Amistad.
Un recorrido por la oficina donde el equipo de desarrollo le agradece a su jefe y, a través de él, a Hired Experts.

---

## 1. Concepto

El jugador **es el Espartano** (el jefe). Aparece en la entrada de la oficina y camina entre los
escritorios. Cada vez que se acerca a un miembro del equipo, ese dev lo detiene y le dice su
mensaje de agradecimiento. Al reunir los 5 mensajes se abre la sala de juntas, donde ocurre la
escena final: el equipo completo reunido y el mensaje dedicado a Hired Experts.

La gracia está en la inversión de roles: el jefe no da órdenes, recibe gratitud. Y la recibe
caminando, uno por uno, como quien pasa por los puestos un viernes por la tarde.

**Duración objetivo:** 3 a 4 minutos de principio a fin. Corto a propósito.

---

## 2. Flujo de la experiencia

```
[Pantalla título]
  "HIRED EXPERTS — Día de Amor y Amistad"
  sprite del Espartano parpadeando · "Presiona ENTER"
        │
        v
[Oficina — exploración libre]           HUD: ❤ 0/5
  · El Espartano entra por el pasillo central
  · Sobre cada dev disponible flota un "❤" que rebota
  · Al entrar en rango aparece el prompt [ E ]
        │
        v  (×5, en cualquier orden)
[Diálogo]
  ┌──────────────────────────────────────┐
  │  DIANA                               │
  │  Texto con efecto máquina de         │
  │  escribir, 2–3 cajas por persona  ▾  │
  └──────────────────────────────────────┘
  · El corazón de ese dev se apaga y el HUD sube a ❤ 1/5
        │
        v  (al llegar a 5/5)
[Se abre la sala de juntas]
  · Un brillo marca la puerta · los 5 devs caminan solos hacia allá
        │
        v
[Escena final]
  · Los 5 + el Espartano alrededor de la mesa
  · Confeti · mensaje dedicado a Hired Experts
  · Créditos: Daniel · Diana · Nicolás · Guillermo · Felipe
  · "Volver a jugar"
```

---

## 3. El mapa

Basado en la referencia: vista cenital, piso de madera, pasillo central vertical.

```
        ┌───────── pared superior ─────────┐
   estanterías        estanterías   │  COCINA (piso claro)
   plantas/cajas                    │  nevera · dispensador · reloj
        ┌──────┐        ┌──────┐    │
        │ PC   │        │ PC   │    ├──────────────────────────┐
        │Daniel│        │Diana │    │  SALA DE JUNTAS          │
        └──────┘        └──────┘    │  (alfombra azul)         │
                                    │  mesa · cuadro · plantas │
        ┌──────┐        ┌──────┐    │  ← se abre al 5/5        │
        │Nicolás│       │Guiller│   │                          │
        └──────┘        └──────┘    └──────────────────────────┘
             ┌──────┐
             │Felipe│      plantas decorativas en las esquinas
             └──────┘
```

- **Zona de trabajo (izquierda):** piso de madera, 5 escritorios con monitores, sillas, estanterías.
- **Cocina (arriba derecha):** piso claro, nevera, dispensador de agua, reloj de pared. Decorativa.
- **Sala de juntas (abajo derecha):** alfombra azul, mesa central, cuadro. Bloqueada hasta el 5/5.
- **Pasillo central:** por donde entra el Espartano.

Tamaño: rejilla de 16×16 px, mapa de ~24×14 tiles. Cabe entero en pantalla, **sin cámara que siga
al jugador** — se ve toda la oficina de una, como en la referencia.

---

## 4. Personajes

| Personaje  | Rol | Detalle visual |
|---|---|---|
| **Espartano** | Jugador | Casco con cresta roja, capa roja, escudo circular. Debe leerse como espartano incluso en 16×16 px: la cresta es la silueta clave. |
| **Daniel** | NPC | Escritorio con monitor de tubo |
| **Diana** | NPC | Escritorio con monitor plano |
| **Nicolás** | NPC | Laptop |
| **Guillermo** | NPC | Doble pantalla |
| **Felipe** | NPC | Escritorio con planta al lado |

Cada dev tiene paleta de ropa distinta para diferenciarlos a simple vista. Sin ambición de retrato:
son sprites de 16×16, la identidad la da el color + el nombre en la caja de diálogo.

**Animación:** 2 frames de caminata × 4 direcciones para el Espartano. Los devs están sentados
(estáticos) con un frame sutil de "tecleando".

---

## 5. Mecánicas

| Mecánica | Detalle |
|---|---|
| Movimiento | Flechas / WASD, 4 direcciones, velocidad constante |
| Colisiones | AABB contra rejilla de sólidos (paredes, escritorios, muebles, plantas) |
| Interacción | Tecla **E** o **Espacio** en rango (~24 px). Prompt flotante sobre el NPC |
| Diálogo | Caja inferior estilo Pokémon, efecto máquina de escribir (~35 ms/carácter), E para avanzar, E de nuevo para saltar el tipeo |
| Progreso | HUD con ❤ 0/5. No se puede repetir un dev ya visitado (su corazón se apaga) |
| Trigger final | Al llegar a 5/5 se desbloquea la sala de juntas |
| Móvil | D-pad táctil en pantalla + botón de acción. **No opcional:** el link se va a abrir mucho desde el celular |
| Audio | Chiptune generado con WebAudio, sin archivos externos: blip al tipear, jingle corto al final. Botón de mute visible, arranca en silencio hasta la primera tecla (política de autoplay de los navegadores) |

---

## 6. Arte: todo por código

**No se descarga ni un solo asset.** Los sprites se definen como matrices de caracteres + paleta, y
se pintan una vez a canvas offscreen al arrancar:

```
const ESPARTANO_ABAJO = [
  '....rrrr....',
  '...rCCCCr...',
  '...CssssC...',
  ...
]
```

Razones: cero dependencias, cero problemas de licencias, cero rutas rotas al desplegar, y el juego
entero pesa menos de 100 KB.

- Canvas lógico **384×224**, escalado ×3/×4 según pantalla, `imageSmoothingEnabled = false`.
- Paleta fija de ~16 colores, cálida, tomada de la referencia (maderas, azul de la alfombra, beige de cocina).

---

## 7. Estructura técnica

JS vanilla, **scripts clásicos** (no módulos ES) para que el `index.html` funcione tanto con doble
clic en local como servido desde el link.

```
hired-experts-thanks/
├─ index.html          ← todo el markup + CSS inline
├─ src/
│  ├─ engine.js        loop de render, input (teclado + táctil), canvas
│  ├─ sprites.js       matrices de pixel art + paleta + pintado offscreen
│  ├─ map.js           tiles, mobiliario, rejilla de colisiones
│  ├─ characters.js    Espartano + los 5 devs, movimiento y animación
│  ├─ dialogue.js      caja de diálogo, typewriter, cola de mensajes
│  ├─ messages.js      ← LOS 5 TEXTOS + el mensaje final (archivo a editar)
│  ├─ audio.js         WebAudio, sfx y jingle
│  └─ game.js          máquina de estados: TÍTULO → OFICINA → DIÁLOGO → FINAL
└─ docs/PLAN.md
```

**Máquina de estados**, una sola fuente de verdad para qué se actualiza y qué se dibuja:
`TITULO → JUGANDO ⇄ DIALOGO → TRANSICION_FINAL → FINAL`.

`messages.js` queda aislado a propósito: cambiar un agradecimiento no debe implicar tocar el motor.

---

## 8. Los mensajes

Yo redacto los 5 borradores. Criterios:

- Cortos: 2 o 3 cajas de diálogo, ~200 caracteres por persona. Nadie lee párrafos en un minijuego.
- Cada uno con un ángulo distinto (aprendizaje, confianza, equipo, oportunidad, respaldo) para que
  no suenen a plantilla repetida cinco veces.
- Dirigidos al jefe pero hablando de **Hired Experts**: el jefe es el mensajero.
- El mensaje final es del equipo completo, la dedicatoria explícita a la empresa.

Quedan en `messages.js` como texto plano, fáciles de ajustar si alguien quiere reescribir el suyo.

---

## 9. Fases de trabajo

| # | Fase | Qué entrega | Se puede ver |
|---|---|---|---|
| 1 | Motor base | Canvas, loop, input, escalado pixel-perfect | Cuadrado que se mueve |
| 2 | Mapa | Tiles, mobiliario, colisiones | La oficina dibujada |
| 3 | Personajes | Espartano animado + 5 devs en sus puestos | Caminar por la oficina |
| 4 | Diálogos | Caja, typewriter, prompts, HUD ❤ | El juego jugable de punta a punta |
| 5 | Escena final | Desbloqueo, caminata de los NPCs, confeti, créditos | El juego completo |
| 6 | Pulido | Táctil, audio, pantalla de título, responsive | Listo para compartir |
| 7 | Despliegue | Link para compartir | 🎉 |

Las fases 1–4 son el 80% del valor: con eso ya hay algo que se puede mostrar. Si el tiempo aprieta,
5 y 6 se recortan sin romper nada.

---

## 10. Despliegue

Se publica como página web con link propio para compartir al equipo y al jefe. Es privado por
defecto: nadie lo ve hasta que se comparta. Alternativas si se prefiere algo autogestionado:
Netlify Drop o GitHub Pages (el proyecto es estático, sirve tal cual en cualquiera de los dos).

---

## 11. Supuestos y riesgos

- **Fecha:** el evento es el **viernes 18 de septiembre de 2026**. Hoy es lunes 14 → 4 días de
  margen. Alcanza para las 7 fases completas; la entrega queda lista con holgura el miércoles 16
  para dejar el jueves libre a correcciones de texto.
- **Nombres:** Daniel, Diana, Nicolás, Guillermo y Felipe aparecen solo de pila. Si quieren apellido
  o apodo, se ajusta en `messages.js`.
- **El Espartano:** representación simbólica del jefe, sin nombre propio ni intento de parecido
  físico. Si prefieren que lleve su nombre, es un cambio de una línea.
- **Riesgo real:** que el sprite del Espartano no se lea como espartano a 16×16. Mitigación:
  se prototipa ese sprite primero, en la fase 3, y si no funciona se sube a 24×24 solo para él.
- **Riesgo menor:** rendimiento en celulares viejos. Mitigación: el mapa se pinta una sola vez a un
  canvas de fondo y por frame solo se redibujan los personajes.

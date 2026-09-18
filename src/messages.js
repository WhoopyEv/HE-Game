// ============================================================
//  TODO EL TEXTO Y LOS VALORES DEL JUEGO VIVEN ACÁ.
//  Cambiar cualquier cosa de este archivo no requiere tocar el motor.
// ============================================================

// Las piezas que arma el Espartano. El orden es el orden en que aparecen en el nivel.
// Los colores son los del logo real de Hired Experts.
// Agregar o quitar una fila acá ajusta el contador del HUD y el texto de la intro solos.
const VALUES = [
  { id: 'oportunidad', color: '#8f2fd4', label: 'OPORTUNIDAD' }, // morado   — Recepción
  { id: 'confianza', color: '#e0453e', label: 'CONFIANZA' },     // rojo     — Operaciones
  { id: 'aprendizaje', color: '#f4f0e6', label: 'APRENDIZAJE' }, // blanco   — TI
  { id: 'equipo', color: '#f2c50a', label: 'EQUIPO' },           // amarillo — Bienestar
  { id: 'respaldo', color: '#0d0a12', label: 'RESPALDO' },       // negro    — Terraza
];

const VALUE_BY_ID = {};
VALUES.forEach(function (v) {
  VALUE_BY_ID[v.id] = v;
});

const MESSAGES = {
  title: {
    heading: 'HIRED EXPERTS',
    subheading: 'Día de Amor y Amistad',
    play: 'HISTORIA',
    prompt: 'Presiona ENTER para empezar',
  },

  howto: {
    title: 'CÓMO JUGAR',
    // {n} se reemplaza solo por la cantidad de valores de arriba.
    intro: 'Hay {n} piezas repartidas por la oficina. Recógelas todas y descubre qué arman.',
    controls: [
      ['← →  /  A D', 'moverte'],
      ['ESPACIO  /  ↑  /  W', 'saltar'],
      ['ESC', 'pausa'],
    ],
    start: 'Empezar',
    skip: 'ESC para saltar',
  },

  pause: {
    title: 'PAUSA',
    resume: 'Seguir',
    restart: 'Reiniciar',
  },

  finale: {
    name: 'EL EQUIPO DE DESARROLLO',
    lines: [
      'HE nos da oportunidades, confianza, aprendizaje, equipo y respaldo.',
      'Eso es lo que significa para nosotros ser parte de esta familia.',
    ],
  },

  // Si llegás a la meta sin todas las piezas.
  incomplete: {
    name: '',
    lines: ['Quedaron piezas por ahí. Volvé a intentarlo para armarlo completo.'],
  },

  credits: ['Daniel', 'Diana', 'Nicolás', 'Guillermo', 'Felipe'],

  dedication: 'Hecho por el equipo de desarrollo · Día de Amor y Amistad 2026',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MESSAGES, VALUES, VALUE_BY_ID };
}

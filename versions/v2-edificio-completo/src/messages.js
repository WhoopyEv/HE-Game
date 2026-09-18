// Todo el texto del juego vive acá. Cambiar un mensaje no requiere tocar el motor.
// Los mensajes de los cinco del equipo son de UNA sola frase a propósito.

// Las cinco piezas que reparte el equipo de desarrollo.
// Los colores son los del logo real de Hired Experts.
const VALUES = [
  { id: 'oportunidad', color: '#8f2fd4', label: 'OPORTUNIDAD' },
  { id: 'confianza', color: '#e0453e', label: 'CONFIANZA' },
  { id: 'aprendizaje', color: '#f4f0e6', label: 'APRENDIZAJE' },
  { id: 'equipo', color: '#f2c50a', label: 'EQUIPO' },
  { id: 'respaldo', color: '#0d0a12', label: 'RESPALDO' },
];

const VALUE_BY_ID = {};
VALUES.forEach(function (v) {
  VALUE_BY_ID[v.id] = v;
});

const MESSAGES = {
  title: {
    heading: 'HIRED EXPERTS',
    subheading: 'Día de Amor y Amistad',
    prompt: 'Presiona ENTER para entrar al edificio',
  },

  intro: {
    name: '',
    lines: [
      'Viernes en la mañana y el edificio tiene algo preparado.',
      'Tú eres el Espartano. Sergio te está esperando en recepción.',
    ],
  },

  sergio: {
    name: 'SERGIO (CUPIDO BOSS)',
    mission: [
      'Espartano, qué bueno verte por acá. Quiero pedirte una misión.',
      'Hoy es Día de Amor y Amistad y los cinco del equipo de desarrollo tienen algo preparado para la empresa: una pieza cada uno.',
      'Súbete a operaciones y recógelas. Con las cinco abrimos la terraza y celebramos allá arriba.',
    ],
    again: [
      'Suba a operaciones y hable con los cinco del equipo. El ascensor está en el pasillo.',
    ],
    ready: [
      'Misión cumplida, Espartano.',
      'Ahora te confieso una cosa: esto nunca fue una misión, era una excusa para decirte algo.',
    ],
  },

  elevatorLocked: {
    name: '',
    lines: ['Mejor primero hablo con Sergio, allá en recepción.'],
  },

  // Sale cuando se intenta subir a la terraza sin las cinco piezas.
  terraceLocked: {
    name: '',
    lines: ['La terraza está cerrada hasta que estén las cinco piezas. Todavía falta gente por escuchar en operaciones.'],
  },

  // Los cinco del equipo de desarrollo. Cada uno entrega una pieza al hablarle.
  devs: {
    diana: {
      name: 'DIANA',
      lines: ['Acá me dieron la oportunidad cuando yo misma todavía no sabía si podía: esa pieza es suya.'],
    },
    daniel: {
      name: 'DANIEL',
      lines: ['A mí me soltaron el proyecto sin preguntarme cuántos años llevaba, y eso tiene un nombre: confianza.'],
    },
    nicolas: {
      name: 'NICOLÁS',
      lines: ['Todo lo que sé hacer hoy lo aprendí acá, rompiendo cosas y arreglándolas sin que nadie me hiciera sentir mal.'],
    },
    guillermo: {
      name: 'GUILLERMO',
      lines: ['Cuando algo se cae en este equipo, no se cae uno solo: por eso la mía es la del equipo.'],
    },
    felipe: {
      name: 'FELIPE',
      lines: ['Nunca me ha tocado resolver nada solo, siempre hay alguien detrás, y eso se llama respaldo.'],
    },
  },

  // Mensajes opcionales: salen en globo al acercarse, no dan pieza.
  extras: {
    aseo: {
      name: 'SERVICIOS GENERALES',
      lines: ['Gracias por el aseo general y por dejar siempre todo ordenado.'],
    },
    brandon: {
      name: 'BRANDON',
      lines: [
        'Logística es esto: que cuando usted llegue, todo esté donde tiene que estar y nadie tenga que pensar en eso.',
      ],
    },
    porteria: {
      name: 'PORTERÍA',
      lines: ['Buenos días, Espartano. Siga, que arriba lo están esperando.'],
    },
    josue: {
      name: 'JOSUÉ',
      lines: ['Yo cuido un piso entero, jefe. Y en el descanso, cuido esta mesa.'],
    },
    danielPardo: {
      name: 'DANIEL PARDO',
      lines: ['¿Están trabajando? Pueden trabajar más fuerte.'],
    },
    sebastian: {
      name: 'SEBASTIÁN',
      lines: ['Zorro, no te lo lleves.'],
    },
    zorro: {
      name: 'ZORRO',
      lines: ['Si se hace algo, se hace bien.'],
    },
    marce: {
      name: 'MARCE',
      lines: ['Hoy no fío, mañana sí.'],
    },
    robot: {
      name: 'ASPIRADORA',
      lines: ['Bep, bop. Bep.'],
    },
    logisticaOps: {
      name: 'LOGÍSTICA',
      lines: ['¡Buen día, joven!'],
    },
    ops1: {
      name: 'OPERACIONES',
      lines: ['Uno entra a contestar llamadas y termina aprendiendo a hablarle a cualquiera sin miedo.'],
    },
    ops2: {
      name: 'OPERACIONES',
      lines: ['Lo mejor de este piso es que si uno se traba, voltea y siempre hay alguien que le ayuda.'],
    },
    ops3: {
      name: 'OPERACIONES',
      lines: ['Acá el café se acaba rápido, pero la gente no se acaba nunca.'],
    },
    ops5: {
      name: 'OPERACIONES',
      lines: ['Cuando cierro turno y miro para atrás, siempre hay alguien más que también se quedó.'],
    },
    ops4: {
      name: 'OPERACIONES',
      lines: ['Llevo tres años acá y todavía me río con los mismos de la primera semana.'],
    },
  },

  // Globos cortos de la celebración en la terraza (sin tildes: se dibujan con
  // la fuente de píxeles del juego, que es solo de mayúsculas).
  clouds: {
    diana: 'Gracias, HE',
    daniel: '¡Gracias por tanto!',
    nicolas: 'Gracias, equipo',
    guillermo: 'Gracias por todo',
    felipe: '¡Feliz día, HE!',
    sergio: 'Gracias, mis espartanos',
    brandon: 'Gracias por estar',
    aseoT: 'Gracias a ustedes',
    porteroT: '¡Gracias, HE!',
    logisticaT: 'Gracias, de verdad',
    josueT: '¡Que viva HE!',
    zorroT: 'Gracias por tanto',
    sebastianT: 'Gracias, HE',
    recepT: '¡Gracias a todos!',
    agenteT: 'Gracias, HE',
  },

  // El mensaje del equipo de desarrollo para Hired Experts.
  finale: {
    name: 'EL EQUIPO DE DESARROLLO',
    lines: [
      'HE nos da oportunidades, confianza, aprendizaje, equipo y respaldo.',
      'Eso es lo que significa para nosotros ser parte de esta familia.',
      '¡Feliz Día de Amor y Amistad!',
    ],
  },

  credits: ['Daniel', 'Diana', 'Nicolás', 'Guillermo', 'Felipe'],

  dedication: 'Hecho por el equipo de desarrollo · Día de Amor y Amistad 2026',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MESSAGES, VALUES, VALUE_BY_ID };
}

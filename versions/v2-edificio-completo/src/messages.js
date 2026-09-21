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
    prompt: 'Presiona ENTER para entrar al site',
  },

  intro: {
    name: '',
    lines: [
      'Viernes en la mañana y el edificio tiene algo preparado para tí, Espartano.',
      'Sergio y Yesica te están esperando en recepción.',
    ],
  },

  sergio: {
    name: 'SERGIO Y YESICA (CUPIDOS)',
    mission: [
      'Espartano, qué bueno verte por acá. Queremos pedirte una misión.',
      'Hoy es Día de Amor y Amistad y los cinco del equipo de desarrollo tienen algo preparado para la empresa.',
      'Súbete a operaciones para ver qué tienen por decir. Luego de que las tengas, te esperamos en la terraza.',
    ],
    again: [
      'Cuando tengas las cinco piezas, sube a la terraza, te esperamos allá.',
    ],
    ready: [
      'Misión cumplida, Espartano.',
      'Ahora te confieso una cosa: esto nunca fue una misión, era una excusa para decirte algo.',
    ],
  },

  elevatorLocked: {
    name: '',
    lines: ['Mejor primero hablo con Sergio y Yesica.'],
  },

  // Sale cuando se intenta subir a la terraza sin las cinco piezas.
  terraceLocked: {
    name: '',
    lines: ['La terraza está cerrada hasta que estén las cinco piezas. Todavía falta gente por escuchar en operaciones.'],
  },

  // Los cinco del equipo de desarrollo. Cada uno entrega una pieza al hablarle.
  devs: {
    diana: {
      name: 'DIANA A.',
      lines: ['A mí me dieron la oportunidad antes de que yo misma estuviera segura de poder. Mira, esta pieza es para ti.'],
    },
    daniel: {
      name: 'DANIEL R.',
      lines: ['Desde el primer día confiaron en mí y me dieron espacio para demostrar lo que podía hacer.'],
    },
    nicolas: {
      name: 'NICOLÁS D.',
      lines: ['Llegué con bastante conocimiento, pero acá he aprendido mucho más haciendo, equivocándome y trabajando con el equipo.'],
    },
    guillermo: {
      name: 'GUILLERMO M.',
      lines: ['Cuando hay un problema, nadie se queda solo tratando de resolverlo. Nos metemos todos y lo sacamos como equipo.'],
    },
    felipe: {
      name: 'FELIPE P.',
      lines: ['Más de una vez me he quedado mirando algo sin saber qué hacer, y siempre termina llegando alguien a dar una mano.'],
    },
  },

  // Mensajes opcionales: salen en globo al acercarse, no dan pieza.
  extras: {
    aseo: {
      name: 'SERVICIOS GENERALES',
      lines: ['Que el edificio se vea así de limpio no es casualidad — es trabajo de todos los días.'],
    },
    // TODO: Nico, ajusta la frase si hay una forma más exacta en que la empresa lo pide.
    aseoBanos: {
      name: 'SERVICIOS GENERALES',
      lines: ['Gracias por tu participación en el cuidado de los baños, es un tema que nos importa a todos.'],
    },
    brandon: {
      name: 'BRANDON',
      lines: [
        'Buenos días, ingenier@.',
      ],
    },
    porteria: {
      name: 'PORTERÍA',
      lines: ['Buenos días, Espartano. Siga, que el Boss lo está esperando.'],
    },
    josue: {
      name: 'JOSUÉ',
      lines: ['Yo cuido un piso entero, jefe. Y en el break, cuido esta mesa.'],
    },
    danielPardo: {
      name: 'DANIEL PARDO',
      lines: ['Mmm... ¿Están trabajando? ¿Pueden trabajar más fuerte? No, mentira, sigan así chicos.'],
    },
    sebastian: {
      name: 'SEBASTIÁN RODRIGUEZ',
      lines: ['Zorro, no te lo lleves.'],
    },
    zorro: {
      name: 'D. ZORRO',
      lines: ['Si se hace algo, se hace bien.'],
    },
    marce: {
      name: 'MARCE',
      lines: ['Hola, muy buenos días, ¿qué se te antoja?.'],
    },
    robot: {
      name: 'ESPERANCITA',
      lines: ['Bep, bop. Bep.'],
    },
    logisticaOps: {
      name: 'LOGÍSTICA',
      lines: ['¡Buen día, joven!'],
    },
    frehynner: {
      name: 'FREHYNNER',
      lines: ['¡Ya casi pagan!!'],
    },
    printerRH3: {
      name: 'IMPRESORA',
      lines: ['Estoy cansada, jefe.'],
    },
    // Frases sueltas de operaciones, sin nombre -- cualquiera del piso.
    ops6: {
      lines: ['Hey, qué buenas métricas, muchachos.'],
    },
    ops7: {
      lines: ['¿Cuántas llamadas voy hoy?'],
    },
    ops8: {
      lines: ['Ja, papi, cero lates este mes.'],
    },
    ops9: {
      lines: ['Que no baje más el dólar, por favor, jajaja.'],
    },
    ops10: {
      lines: ['A tres de cumplir la meta del mes.'],
    },
    ops11: {
      lines: ['Si me sale bono este mes, invito empanada donde Marce.'],
    },
    ops12: {
      lines: ['¿Quién me trae un electrolit?'],
    },
    ops13: {
      lines: ['Noooo, ¡actualización de Windows!!'],
    },
    ops14: {
      lines: ['Muchachosss, se cayó Forth... mentira, bromita.'],
    },
    ops15: {
      lines: ['¿Quién pa\' tomarnos algo, después del work?'],
    },
    ops16: {
      lines: ['¿Pola, después del work, o mareos?'],
    },
    ops17: {
      lines: ['¿Después del work, Pola o miedo?'],
    },
    ops18: {
      lines: ['¡Mis pielnas, mis pielnas!'],
    },
    jonathan: {
      name: 'JHONNATAN',
      lines: ['Esto está muy family friendly.'],
    },
    marco: {
      name: 'MARCO',
      lines: ['Reiniciar arregla el 90% de los problemas. El otro 10% soy yo.'],
    },
    rhRecluta: {
      lines: ['Se cayó otro candidato :c'],
    },
    rhLine1: {
      lines: ['Este candidato tiene buen perfil. No lo espanten.'],
    },
    rhLine2: {
      lines: ['Un momento, estoy stalkeando LinkedIn… profesionalmente.'],
    },
    rhLine3: {
      lines: ['¿Quién me quitó al candidato bueno?'],
    },
    rhLine4: {
      lines: ['Si no está en el sistema, no pasó.'],
    },
    rhLine5: {
      lines: ['¿Y el comprobante de la incapacidad?'],
    },
    rhLine6: {
      lines: ['Todo estaba tranquilo hasta que llegó cierre de nómina.'],
    },
    rhLine7: {
      lines: ['Más celulares cargando en bienestar.'],
    },
    tiLine1: {
      lines: ['Necesito más información que "no funciona".'],
    },
    tiLine2: {
      lines: ['No es que no quiera ayudarte. Es que necesito el ticket.'],
    },
    breakGuy: {
      name: '',
      lines: ['¡Pista, pista que se me acaba el break!'],
    },
    jorge: {
      name: 'JORGE ALVARADO',
      lines: ['¿Qué curioso... no?'],
    },
    danilo: {
      name: 'DANILO',
      lines: ['¡VENTAAAA!'],
    },
    dorilocos: {
      name: 'BIENESTAR',
      lines: ['Uff, qué buenos dorilocos.'],
    },
    diegoG: {
      name: 'DIEGO G. (EL HERMANO DE JULIÁN)',
      lines: ['Quiubo, chinit@.'],
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

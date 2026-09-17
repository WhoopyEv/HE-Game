// Todo el texto del juego vive acá. Cambiar un mensaje no requiere tocar el motor.
// Los mensajes obligatorios (los que dan ❤) son de UNA sola frase a propósito.
const MESSAGES = {
  title: {
    heading: 'HIRED EXPERTS',
    subheading: 'Día de Amor y Amistad',
    prompt: 'Presiona ENTER para entrar al edificio',
  },

  intro: {
    name: '',
    lines: [
      'Viernes, ocho pisos, y todo el edificio con algo preparado.',
      'Tú eres el Espartano. Marce te está esperando en recepción.',
    ],
  },

  marce: {
    name: 'MARCE',
    mission: [
      'Espartano, justo a usted lo estaba esperando.',
      'Hoy es el Día de Amor y Amistad y le tengo una misión: súbase por todo el edificio y recójame un mensaje de agradecimiento en cada piso.',
      'Yo lo espero arriba en la terraza, con todo listo. No me llegue sin los seis.',
    ],
    again: [
      'Suba, suba. El ascensor está en el pasillo y yo lo espero en la terraza.',
    ],
    waiting: [
      'Todavía no, Espartano. Le falta gente por escuchar.',
    ],
    ready: [
      'Los seis mensajes completos. Entonces sí: venga, que el edificio entero lo está esperando.',
    ],
  },

  elevatorLocked: {
    name: '',
    lines: ['Mejor primero hablo con Marce, allá en recepción.'],
  },

  // Un mensaje obligatorio por piso. Reemplazar nombre y frase cuando estén definidos.
  floors: {
    2: {
      name: 'SERGIO',
      lines: [
        'Yo les digo "mis espartanos" porque es lo que veo cuando camino por este edificio: gente que da la cara.',
      ],
    },
    3: {
      name: 'GERENTE PISO 3',
      lines: [
        'Gracias, Hired Experts, por dejarnos equivocarnos sin miedo: así se aprende de verdad.',
      ],
    },
    4: {
      name: 'GERENTE PISO 4',
      lines: [
        'Lo mejor de esta empresa es que uno llega sabiendo poco y nadie lo hace sentir mal por preguntar.',
      ],
    },
    5: {
      name: 'GERENTE PISO 5',
      lines: [
        'Aquí aprendí que un equipo no se sostiene con procesos, sino con gente que responde cuando uno la necesita.',
      ],
    },
    6: {
      name: 'GERENTE PISO 6',
      lines: [
        'En Hired Experts nadie se queda solo con un problema, y eso no se paga con sueldo.',
      ],
    },
    7: {
      name: 'GERENTE PISO 7',
      lines: [
        'Gracias por una empresa donde crecer no es un premio, es parte del trabajo.',
      ],
    },
  },

  // Mensajes opcionales: no cuentan para el ❤ y se pueden repetir.
  extras: {
    aseo: {
      name: 'SERVICIOS GENERALES',
      lines: [
        'Nosotros vemos este edificio cuando ya no hay nadie: vacío, en silencio y listo para mañana.',
        'Gracias a todos los que dejan su puesto y el baño como les gustaría encontrarlos. Cuidar lo de todos también es querer a la empresa.',
      ],
    },
    brandon: {
      name: 'BRANDON',
      lines: [
        'Logística es esto: que cuando usted llegue, todo esté donde tiene que estar y nadie tenga que pensar en eso.',
      ],
    },
    porteria: {
      name: 'PORTERÍA',
      lines: [
        'Buenos días, Espartano. Siga, que arriba lo están esperando.',
      ],
    },
    mgrTi: {
      name: 'MANAGER DE TI',
      lines: [
        'Si nada se cae, parece que no hicimos nada. Gracias por confiar igual.',
      ],
    },
    mgrRh1: {
      name: 'RECURSOS HUMANOS',
      lines: [
        'Acá contratamos personas, no hojas de vida. Por eso esto se siente distinto.',
      ],
    },
    mgrRh2: {
      name: 'RECURSOS HUMANOS',
      lines: [
        'Lo más bonito de este trabajo es ver entrar a alguien nervioso y verlo después enseñándole a otro.',
      ],
    },
    mgrRh3: {
      name: 'RECURSOS HUMANOS',
      lines: [
        'Gracias por dejarnos cuidar a la gente y no solo administrarla.',
      ],
    },
  },

  finale: {
    name: 'TODO EL EDIFICIO',
    lines: [
      'Espartano, los seis mensajes eran apenas una excusa.',
      'Lo que queríamos decir es más simple: gracias, Hired Experts, por ser el lugar donde aprendimos, donde nos equivocamos sin miedo y donde nos quedamos.',
      'Ocho pisos, un montón de gente, y al final la misma idea: esto se construye entre todos.',
      '¡Feliz Día de Amor y Amistad!',
    ],
  },

  credits: ['Daniel', 'Diana', 'Nicolás', 'Guillermo', 'Felipe'],

  dedication: 'Hecho por el equipo de desarrollo · Día de Amor y Amistad 2026',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MESSAGES };
}

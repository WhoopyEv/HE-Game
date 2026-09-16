const MESSAGES = {
  title: {
    heading: 'HIRED EXPERTS',
    subheading: 'Día de Amor y Amistad',
    prompt: 'Presiona ENTER para entrar a la oficina',
  },

  intro: {
    name: '',
    lines: [
      'Otro viernes en la oficina... pero hoy el equipo de desarrollo tiene algo preparado.',
      'Quieren mandarle un mensaje a Hired Experts, y tú eres quien lo va a llevar.',
      'Pasa por cada escritorio y escúchalos.',
    ],
  },

  devs: {
    daniel: {
      name: 'DANIEL',
      lines: [
        'Hired Experts me recibió sabiendo la mitad de lo que sé hoy.',
        'Aquí aprendí que revisar el código de alguien también es enseñarle.',
        'Gracias por ser una empresa donde uno crece mientras trabaja.',
      ],
    },
    diana: {
      name: 'DIANA',
      lines: [
        'En Hired Experts me dieron responsabilidades antes de que yo misma me creyera lista.',
        'Resultó que tenían razón, y eso me cambió la forma de trabajar.',
        'Gracias por apostarle a la gente y no solo a la hoja de vida.',
      ],
    },
    nicolas: {
      name: 'NICOLÁS',
      lines: [
        'En esta empresa nadie se queda solo con un bug a las once de la noche.',
        'Eso no sale en ningún manual: es la cultura de Hired Experts.',
        'Gracias por construir un lugar donde el equipo se cuida.',
      ],
    },
    guillermo: {
      name: 'GUILLERMO',
      lines: [
        'Hired Experts me dio la oportunidad que en otros lados no quisieron darme.',
        'Hoy hago lo que me gusta, con gente que respeto y de la que aprendo.',
        'Gracias por abrir esa puerta. Y sobre todo, por dejarla abierta.',
      ],
    },
    felipe: {
      name: 'FELIPE',
      lines: [
        'Aquí, cuando algo sale mal, la empresa da la cara por el equipo primero.',
        'Trabajar sin miedo a equivocarse es un lujo que no todos tienen.',
        'Gracias, Hired Experts, por ese respaldo.',
      ],
    },
  },

  unlock: {
    name: '',
    lines: ['El equipo te está esperando en la sala de juntas.'],
  },

  finale: {
    name: 'EL EQUIPO',
    lines: [
      'Jefe, esto no es solo para usted. Es para toda Hired Experts.',
      'Gracias por ser la empresa donde aprendimos, donde nos equivocamos sin miedo y donde nos quedamos.',
      'Lo que construimos aquí no es solo software: es un equipo que da gusto.',
      '¡Feliz Día de Amor y Amistad!',
    ],
  },

  credits: ['Daniel', 'Diana', 'Nicolás', 'Guillermo', 'Felipe'],

  dedication: 'Con cariño, el equipo de desarrollo',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MESSAGES };
}

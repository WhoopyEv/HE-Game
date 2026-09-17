# v2 — El edificio completo (archivado)

Esta versión implementaba un edificio de 8 pisos (recepción, TI/RRHH, cinco pisos de oficinas
genéricas, terraza) recorrido en vista top-down, con un ascensor para navegar entre pisos y
corazones recogidos hablando con un gerente por piso.

**Se abandonó por dos razones:**

1. Reproducía visualmente la jerarquía de la empresa: oficinas de vidrio separadas para managers,
   escritorios de madera distintos a los de agentes, supervisores posicionados al final de cada
   fila. Ese lenguaje visual comunicaba justo lo que no se quería mostrar.
2. Con el tiempo real disponible (el evento era al día siguiente), 6 de los 8 pisos eran la misma
   plantilla repetida — demasiado grande para pulir bien, y poco significativo para alguien que no
   fuera de esas dos oficinas puntuales.

Se reemplazó por la v3: un plataformas 2D de un solo nivel ("Modo Historia"), donde no hay oficinas
separadas por rango y el mensaje final es del equipo de desarrollo, no de un gerente por piso.

Queda acá completo y funcional como referencia — no es el punto de partida para seguir editando.

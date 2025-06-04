# Treball en Equip (Bubble Game)

## Instalació i desenvolupament

Descarreguem primer el fitxers necessaris de npm fent servir `bun install` o `npm install`.

Per engegar el servidor de desenvolupament fem servir `bun run dev` o `npm run dev`.

Un cop fet això podem entrar amb al navegador a la url `http://localhost:5173`.

Tot això esta creat amb el framework [vite](https://vite.dev/).

## Introducció

Es el joc de les bombolles.

L'objectiu es simple, petar totes les bombolles aconseguint la puntuació més altra possible.

## Descripció del disseny del joc

Al ser un joc senzill el disseny també ho es.

Es tracta d'un tauler de 15x10 bombolles on tenim entre 3 i 5 colors diferents. Cada vegada que tirem una bola al tauler aquesta s'enganxa, si ho fa i esta connectada a 3 o més boles del mateix color aquestes s'eliminen i sumem 200 punts per cada bombolla eliminada. A part d'això tenim també boles especials que destrueixen la fila i columne entera.

Si s'aconegueixen eliminar totes les bombolles es guanyar el joc.

Si tirant alguna bola es surt del nombre màxim permès de files s'acaba el joc.

## Descripció de les parts més rellevants de la implementació

El més rellevant seria la part de aconseguir les bombolles conectades per despres eliminar-les i aconseguir puntuació. Per fer això hem fet servir l'algoritme DFS (Depth First Search), les cerques a google ens han ajudat.

## Conclusions i problemes trobats

Ens ha semblat interesant però prefeririem fer servir un motor de jocs "normal".

El principal problema que ens hem trobat ha sigut intentar fer que el snapping de les bombolles quedes bé però, no ho hem aconseguit tal qual ho voliem.

També hem tingut problemes amb els marges del tauler, les boles no quedaven ben enganxades i es produient bugs.

## Manual d’usuari

Primer ens trobariem amb un menú principal, en el qual trobem 4 botons.

- **Jugar**: ens permet jugar al joc. Consisteix en petar totes les bombolles del tauler. Sembla fàcil pero no ho es.
- **Opcions**: ens permet triar el nivell de dificultat del joc. Els nivells de dificultat són **fàcil**, **mitjana** i **dificil**. Com més alt el nivell, més colors de bombolles hi ha i menys boles especials tenim.
- **Instruccions**: ens porta a una pàgina que ens explicar com funciona el joc.
- **Sortir**: ens permet "sortir" del joc.

> Fet per Carlos Pendino i Mikolaj Jaworski
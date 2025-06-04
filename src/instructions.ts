const $decoracio = document.querySelector('.decoració')!;

const colors = ['vermella', 'blava', 'groga', 'verda'];
const quantitats: any = {
    facil: 20,
    mitjana: 40,
    dificil: 80
};

// Obtenir dificultat de localStorage o per defecte
const dificultatSeleccionada = localStorage.getItem('dificultatSeleccionada') || 'dificil';

function generaBoles(dificultat: string) {
    $decoracio.innerHTML = '';
    const numBoles = quantitats[dificultat] || 40;

    for (let i = 0; i < numBoles; i++) {
        const bola = document.createElement('div');
        bola.classList.add('bola');

        const indexColor = Math.floor(Math.random() * colors.length);
        const color = colors[indexColor] || 'vermella';
        bola.classList.add(color);

        bola.style.top = Math.floor(Math.random() * 90) + '%';
        bola.style.left = Math.floor(Math.random() * 90) + '%';

        const duracio = (Math.random() * 6 + 6).toFixed(2);
        bola.style.animationDuration = duracio + 's';

        $decoracio.appendChild(bola);
    }
}

// Generar boles decoratives segons dificultat seleccionada
generaBoles(dificultatSeleccionada);

document.querySelector('button#menu')?.addEventListener('click', () => location.assign('index.html'));
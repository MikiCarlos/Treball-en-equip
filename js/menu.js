const $decoracio = document.querySelector('.decoració');
const $play = document.getElementById('play');
const $options = document.getElementById('options');
const $instructions = document.getElementById('instructions');
const $quit = document.getElementById('quit');

    const colors = ['vermella', 'blava', 'groga', 'verda'];
    const quantitats = {
        facil: 20,
        mitjana: 40,
        dificil: 80
    };

// Obtenir dificultat de localStorage o per defecte
const dificultatSeleccionada = localStorage.getItem('dificultatSeleccionada') || 'dificil';

function generaBoles(dificultat) {
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

$play.addEventListener('click', () => location.assign('joc.html'));
$options.addEventListener('click', () => location.assign('opcions.html'));
$instructions.addEventListener('click', () => location.assign('instructions.html'));
$quit.addEventListener('click', () => location.assign('adeu.html'));
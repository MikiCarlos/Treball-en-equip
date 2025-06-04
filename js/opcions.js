window.onload = () => {
    const opcions = document.querySelectorAll('.diff-option');
    
    opcions.forEach(btn => {
        btn.addEventListener('click', () => {
            const dificultat = btn.dataset.diff;
            // Guardar dificultat seleccionada a localStorage
            localStorage.setItem('dificultatSeleccionada', dificultat);
            // Tornar al menú principal
            window.location.href = 'index.html';
        });
    });

    const decoracio = document.querySelector('.decoració');
    const btnJugar = document.getElementById('play');

    const colors = ['vermella', 'blava', 'groga', 'verda'];
    const quantitats = {
        facil: 20,
        mitjana: 40,
        dificil: 80
    };

    // Obtenir dificultat de localStorage o per defecte
    const dificultatSeleccionada = localStorage.getItem('dificultatSeleccionada') || 'dificil';

    function generaBoles(dificultat) {
        decoracio.innerHTML = '';
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

            decoracio.appendChild(bola);
        }
    }

    // Generar boles decoratives segons dificultat seleccionada
    generaBoles(dificultatSeleccionada);

    btnJugar.addEventListener('click', () => {
        console.log('Dificultat escollida:', dificultatSeleccionada);
        // Aquí pots iniciar el joc i fer servir la dificultat
    });

};

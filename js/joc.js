function create() {
    this.add.text(300, 250, 'Joc carregat!', { fontSize: '32px', fill: '#fff' });

    // Exemple de pausa amb ESC (opcional, si es vol fer des d'aquí també)
    this.input.keyboard.on('keydown-ESC', () => {
        const menu = document.getElementById('menuPausa');
        menu.style.display = 'flex';
        this.scene.pause(); // Pausa el joc
    });
}

function pintarTitolPausaColorit() {
    const titol = document.getElementById('titolPausa');
    const text = "Joc en pausa";
    const colors = ['vermella', 'blava', 'groga', 'verda'];

    titol.innerHTML = ""; // Esborrem contingut anterior

    for (let lletra of text) {
        const span = document.createElement('span');
        span.textContent = lletra;
        const color = colors[Math.floor(Math.random() * colors.length)];
        span.classList.add(color);
        titol.appendChild(span);
    }
}


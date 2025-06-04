window.onload = () => {
    const decoracio = document.querySelector('.decoracio');
    const colors = ['vermella', 'blava', 'groga', 'verda'];
    const numBoles = 40;

    for (let i = 0; i < numBoles; i++) {
        const bola = document.createElement('div');
        bola.classList.add('bola');

        const color = colors[Math.floor(Math.random() * colors.length)];
        bola.classList.add(color); // segueix fent servir les classes de background

        bola.style.top = Math.floor(Math.random() * 90) + '%';
        bola.style.left = Math.floor(Math.random() * 90) + '%';

        const duracio = (Math.random() * 6 + 6).toFixed(2);
        bola.style.animationDuration = duracio + 's';

        decoracio.appendChild(bola);
    }

    pintarTitol();

    function pintarTitol() {
        const titol = document.getElementById('titol');
        const text = "Gràcies per jugar!";
        const colors = ['vermella', 'blava', 'groga', 'verda'];

        titol.innerHTML = ""; // Esborrem contingut anterior

        for (let lletra of text) {
            const span = document.createElement('span');
            span.textContent = lletra;
            const color = colors[Math.floor(Math.random() * colors.length)];
            span.classList.add(`${color}-text`); // nou: color de text
            titol.appendChild(span);
        }
    }
};

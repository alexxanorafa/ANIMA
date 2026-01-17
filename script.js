const App = {
    state: { currentQ: 0, scores: {}, limit: 5 },

    // Banco de Dados com Validação Arquetípica
    db: [
        { q: "VETOR_DE_INTENÇÃO: O que o seu ego busca?", a: [{t: "DOMÍNIO (LEÃO)", s: "leao"}, {t: "ASCENSÃO (ÁGUIA)", s: "aguia"}] },
        { q: "SISTEMA_DE_DEFESA: Reação ao stress?", a: [{t: "CONFRONTO", s: "lobo"}, {t: "CAMUFLAGEM", s: "cobra"}] },
        { q: "RESSONÂNCIA: Qual o seu elemento?", a: [{t: "FOGO_QUÂNTICO", s: "leao"}, {t: "TERRA_BIOMÉTRICA", s: "urso"}] }
    ],

    animals: {
        leao: { n: "LEÃO (PANTHERA LEO)", c: "PLEXO SOLAR", d: "Arquétipo da Soberania. Representa o 'Self' em pleno domínio da vontade consciente.", g: "Lidere a partir do coração." },
        aguia: { n: "ÁGUIA (AQUILA CHRYSAETOS)", c: "TERCEIRO OLHO", d: "Arquétipo da Transcendência. Capacidade de observar padrões macroscópicos sem perda de foco.", g: "Eleve a sua perspectiva." },
        lobo: { n: "LOBO (CANIS LUPUS)", c: "GARGANTA", d: "Arquétipo da Lealdade. Equilíbrio entre a autonomia individual e a inteligência social.", g: "Confie nos seus instintos." }
    },

    startRitual() {
        this.switchScreen('sc-intro', 'sc-wheel');
    },

    spin() {
        const wheel = document.getElementById('mainWheel');
        const deg = Math.floor(5000 + Math.random() * 5000);
        wheel.style.transform = `rotate(${deg}deg)`;
        
        document.getElementById('spinBtn').disabled = true;
        
        setTimeout(() => {
            this.switchScreen('sc-wheel', 'sc-quiz');
            this.render();
        }, 4100);
    },

    render() {
        const q = this.db[this.state.currentQ];
        document.getElementById('q-portal').innerText = `PORTAL_0${this.state.currentQ + 1}`;
        document.getElementById('q-text').innerText = q.q;
        
        const container = document.getElementById('q-options');
        container.innerHTML = '';
        
        q.a.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'spin-trigger'; // Reuso do estilo futurista
            btn.innerText = opt.t;
            btn.onclick = () => this.handle(opt.s);
            container.appendChild(btn);
        });

        document.getElementById('progress-bar').style.width = `${(this.state.currentQ / this.db.length) * 100}%`;
    },

    handle(slug) {
        this.state.scores[slug] = (this.state.scores[slug] || 0) + 1;
        this.state.currentQ++;

        if(this.state.currentQ < this.db.length) this.render();
        else this.showResult();
    },

    showResult() {
        const winner = Object.entries(this.state.scores).sort((a,b) => b[1]-a[1])[0][0];
        const res = this.animals[winner];
        
        this.switchScreen('sc-quiz', 'sc-result');
        document.getElementById('res-name').innerText = res.n;
        document.getElementById('res-desc').innerText = res.d;
        document.getElementById('res-chakra').innerText = `SINCRONIA: ${res.c}`;
    },

    switchScreen(out, inS) {
        document.getElementById(out).classList.remove('active');
        setTimeout(() => document.getElementById(inS).classList.add('active'), 400);
    }
};

// UI Toggle
document.getElementById('menuBtn').onclick = () => document.getElementById('sideMenu').classList.toggle('active');
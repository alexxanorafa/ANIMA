// script.js - ANIMA | Shamanic OS v2.0
const STATE = {
    currentLevel: 1,
    totalLevels: 3,
    questionsPerLevel: 4,
    currentQuestion: 0,
    scores: {},
    availableAnimals: [],
    questions: [],
    animals: {},
    currentSession: []
};

// ========== FUNÇÕES BÁSICAS ==========
function loadData() {
    try {
        if (typeof QUESTIONS_DATA !== 'undefined' && QUESTIONS_DATA.questions) {
            STATE.questions = QUESTIONS_DATA.questions;
        } else {
            throw new Error('QUESTIONS_DATA não definido');
        }
        
        if (typeof ANIMALS_DATA !== 'undefined') {
            STATE.animals = ANIMALS_DATA;
            STATE.availableAnimals = Object.keys(ANIMALS_DATA);
        } else {
            throw new Error('ANIMALS_DATA não definido');
        }
        
        return true;
    } catch (err) {
        console.error('[ANIMA ERRO] Falha ao carregar dados:', err.message);
        return false;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// ========== MENU ==========
function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (!menuBtn || !sideMenu) return;
    
    function toggleMenu() {
        const isOpening = !sideMenu.classList.contains('active');
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        menuBtn.setAttribute('aria-expanded', isOpening);
    }
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    overlay.addEventListener('click', toggleMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// ========== RODA ==========
function initWheel() {
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('mainWheel');
    
    if (!spinBtn || !wheel) return;
    
    let isSpinning = false;
    
    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        
        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.textContent = 'SINCRONIZANDO...';
        spinBtn.style.opacity = '0.5';
        
        createPortalTransition();
        
        const degrees = 3600 + Math.floor(Math.random() * 3600);
        wheel.style.transition = 'transform 3s cubic-bezier(0.1, 0, 0.1, 1)';
        wheel.style.transform = `rotate(${degrees}deg)`;
        
        setTimeout(() => {
            showScreen('sc-quiz');
            STATE.currentLevel = 1;
            STATE.currentQuestion = 0;
            STATE.scores = {};
            STATE.currentSession = [];
            addProgressMilestones();
            renderQuestion();
            
            setTimeout(() => {
                isSpinning = false;
                spinBtn.disabled = false;
                spinBtn.textContent = 'SINCRONIZAR DESTINO';
                spinBtn.style.opacity = '1';
            }, 1000);
        }, 2500);
    });
}

function createPortalTransition() {
    const portal = document.createElement('div');
    portal.className = 'portal-transition';
    document.body.appendChild(portal);
    setTimeout(() => portal.remove(), 1000);
}

// ========== QUIZ ==========
function addProgressMilestones() {
    const progressBar = document.querySelector('.dna-progress');
    if (!progressBar) return;
    
    progressBar.querySelectorAll('.milestone').forEach(m => m.remove());
    
    for (let i = 1; i <= 3; i++) {
        const milestone = document.createElement('div');
        milestone.className = 'milestone';
        milestone.style.left = `${(i * 25)}%`;
        progressBar.appendChild(milestone);
    }
}

function renderQuestion() {
    if (STATE.currentLevel > STATE.totalLevels) {
        showResult();
        return;
    }
    
    const startIdx = (STATE.currentLevel - 1) * STATE.questionsPerLevel;
    const levelQuestions = STATE.questions.slice(startIdx, startIdx + STATE.questionsPerLevel);
    
    if (!levelQuestions.length || STATE.currentQuestion >= levelQuestions.length) {
        STATE.currentLevel++;
        STATE.currentQuestion = 0;
        renderQuestion();
        return;
    }
    
    const question = levelQuestions[STATE.currentQuestion];
    
    document.getElementById('q-portal').textContent = 
        `NÍVEL ${STATE.currentLevel}/${STATE.totalLevels} - ETAPA ${STATE.currentQuestion + 1}/${STATE.questionsPerLevel}`;
    document.getElementById('q-text').textContent = question.q;
    
    const container = document.getElementById('q-options');
    container.innerHTML = '';
    
    question.a.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'spin-trigger option-btn';
        button.textContent = option.t;
        button.setAttribute('role', 'option');
        
        button.addEventListener('click', () => {
            handleAnswer(option.s, question.q, option.t);
        });
        
        container.appendChild(button);
    });
    
    const totalQuestions = STATE.totalLevels * STATE.questionsPerLevel;
    const answeredQuestions = ((STATE.currentLevel - 1) * STATE.questionsPerLevel) + STATE.currentQuestion;
    const progress = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function handleAnswer(animalSlug, questionText, answerText) {
    // Sistema de pesos
    const weightMatrix = {
        'aguia': { 'visao': 1.0, 'liberdade': 0.8, 'racional': 0.7 },
        'coruja': { 'visao': 0.5, 'sabedoria': 1.0, 'silêncio': 0.8 },
        'leao': { 'coragem': 1.0, 'confronto': 0.9, 'poder': 0.8 },
        'lobo': { 'instinto': 0.7, 'social': 1.0, 'equilibrio': 0.8 },
        'urso': { 'introspeccao': 1.0, 'solidao': 0.9, 'cura': 0.8 },
        'tartaruga': { 'resiliencia': 1.0, 'paciencia': 0.8, 'tempo': 0.9 },
        'serpente': { 'transformacao': 1.0, 'adaptacao': 0.9, 'renovacao': 0.8 },
        'baleia': { 'memoria': 1.0, 'profundidade': 0.9, 'emocao': 0.8 },
        'elefante': { 'ancestralidade': 1.0, 'paciencia': 0.9, 'proteccao': 0.8 },
        'tigre': { 'foco': 1.0, 'poder': 0.9, 'acao': 0.8 },
        'pantera': { 'agilidade': 1.0, 'misterio': 0.9, 'acao': 0.8 },
        'colibri': { 'alegria': 1.0, 'momento': 0.9, 'beleza': 0.8 },
        'golfinho': { 'comunicacao': 1.0, 'social': 0.8, 'liberdade': 0.7 },
        'castor': { 'construcao': 1.0, 'trabalho': 0.9, 'paciente': 0.8 },
        'raposa': { 'astucia': 1.0, 'intuicao': 0.9, 'oportunidade': 0.8 },
        'tubarao': { 'instinto': 0.9, 'determinacao': 1.0, 'superacao': 0.8 }
    };
    
    // Adiciona pontos
    Object.keys(weightMatrix).forEach(animal => {
        const keywords = Object.keys(weightMatrix[animal]);
        keywords.forEach(keyword => {
            if (answerText.toLowerCase().includes(keyword) || questionText.toLowerCase().includes(keyword)) {
                STATE.scores[animal] = (STATE.scores[animal] || 0) + weightMatrix[animal][keyword];
            }
        });
    });
    
    // Pontuação direta
    STATE.scores[animalSlug] = (STATE.scores[animalSlug] || 0) + 1.0;
    
    STATE.currentSession.push({
        level: STATE.currentLevel,
        question: questionText,
        answer: answerText,
        animal: animalSlug,
        timestamp: new Date().toISOString()
    });
    
    STATE.currentQuestion++;
    
    setTimeout(() => {
        renderQuestion();
    }, 300);
}

// ========== RESULTADO ==========
async function showResult() {
    const sortedScores = Object.entries(STATE.scores).sort(([,a], [,b]) => b - a);
    const topScore = sortedScores[0]?.[1] || 0;
    const topAnimals = sortedScores.filter(([,score]) => score === topScore).map(([animal]) => animal);
    
    let winner;
    
    if (topAnimals.length > 1) {
        winner = await resolveTie(topAnimals);
    } else {
        winner = topAnimals[0];
    }
    
    if (!winner) {
        const allAnimals = Object.keys(STATE.animals);
        winner = allAnimals[Math.floor(Math.random() * allAnimals.length)];
    }
    
    const result = STATE.animals[winner];
    
    if (!result) {
        alert('Erro ao calcular resultado. Tente novamente.');
        return;
    }
    
    // Atualiza interface
    document.getElementById('res-name').textContent = result.n;
    document.getElementById('res-desc').textContent = result.d;
    
    // Chakra visual
    const chakraEl = document.getElementById('res-chakra');
    const chakraColors = {
        'RAIZ': 'var(--chakra-root)',
        'SACRO': 'var(--chakra-sacral)',
        'PLEXO SOLAR': 'var(--chakra-solar)',
        'CORAÇÃO': 'var(--chakra-heart)',
        'GARGANTA': 'var(--chakra-throat)',
        'TERCEIRO OLHO': 'var(--chakra-third-eye)',
        'COROA': 'var(--chakra-crown)'
    };
    
    chakraEl.innerHTML = `
        <div class="chakra-visual">
            <div class="chakra-symbol active" style="background: ${chakraColors[result.c] || 'var(--neon)'}">
                ${result.c.split(' ')[0].charAt(0)}
            </div>
            <span>CHAKRA: ${result.c}</span>
        </div>
    `;
    
    // Shadow Work
    const shadows = {
        'leao': 'A sombra do Leão é a tirania. Quando desequilibrado, pode transformar coragem em agressão.',
        'aguia': 'A sombra da Águia é o distanciamento emocional. Pode ver tudo de cima, mas perder a conexão.',
        'lobo': 'A sombra do Lobo é a dependência grupal. Pode perder a individualidade.',
        'coruja': 'A sombra da Coruja é o isolamento. Pode se perder nas sombras do inconsciente.',
        'urso': 'A sombra do Urso é a inércia. O recolhimento pode tornar-se apatia.',
        'baleia': 'A sombra da Baleia é o peso emocional. Pode carregar memórias que não são suas.',
        'serpente': 'A sombra da Serpente é a manipulação. A transformação pode tornar-se venenosa.',
        'tartaruga': 'A sombra da Tartaruga é o imobilismo. A paciência pode degenerar em procrastinação.',
        'elefante': 'A sombra do Elefante é a rigidez. A tradição pode tornar-se conservadorismo.',
        'tubarao': 'A sombra do Tubarão é a obsessão. O instinto pode transformar-se em agressão.',
        'pantera': 'A sombra da Pantera é o sigilo excessivo. O mistério pode esconder desconfiança.',
        'colibri': 'A sombra do Colibri é a superficialidade. A busca pelo momento pode evitar profundidade.',
        'golfinho': 'A sombra do Golfinho é a dispersão. A comunicação lúdica pode evitar conversas sérias.',
        'castor': 'A sombra do Castor é o trabalho excessivo. A construção pode tornar-se materialismo.',
        'raposa': 'A sombra da Raposa é a desonestidade. A astúcia pode degenerar em manipulação.',
        'tigre': 'A sombra do Tigre é a impaciência. O foco pode tornar-se obsessão.'
    };
    
    if (!document.querySelector('.shadow-work')) {
        const shadowDiv = document.createElement('div');
        shadowDiv.className = 'shadow-work';
        shadowDiv.innerHTML = `
            <h4>🌑 TRABALHO DA SOMBRA</h4>
            <p>${shadows[winner] || 'Cada arquétipo traz seu desafio. Observe onde este animal pode estar em desequilíbrio na sua vida.'}</p>
        `;
        chakraEl.after(shadowDiv);
    }
    
    // Totem Triádico
    const sortedAnimals = Object.entries(STATE.scores).sort(([,a], [,b]) => b - a).map(([animal]) => animal);
    const central = sortedAnimals[0] || winner;
    const auxiliary = sortedAnimals[1] || '';
    const apprentice = sortedAnimals[sortedAnimals.length - 1] || '';
    
    if (!document.querySelector('.totem-triadic')) {
        const totemDiv = document.createElement('div');
        totemDiv.className = 'totem-triadic';
        totemDiv.innerHTML = `
            <div class="totem-animal central">
                <h4>🏆 CENTRAL</h4>
                <div class="animal-name">${STATE.animals[central]?.n || result.n}</div>
                <div class="animal-desc">Seu arquétipo principal</div>
            </div>
            ${auxiliary ? `
            <div class="totem-animal auxiliary">
                <h4>⚡ AUXILIAR</h4>
                <div class="animal-name">${STATE.animals[auxiliary]?.n}</div>
                <div class="animal-desc">Recurso complementar</div>
            </div>
            ` : ''}
            ${apprentice && apprentice !== central ? `
            <div class="totem-animal apprentice">
                <h4>📚 APRENDIZAGEM</h4>
                <div class="animal-name">${STATE.animals[apprentice]?.n}</div>
                <div class="animal-desc">Arquétipo a integrar</div>
            </div>
            ` : ''}
        `;
        
        const shadowWorkEl = document.querySelector('.shadow-work');
        if (shadowWorkEl) {
            shadowWorkEl.after(totemDiv);
        } else {
            chakraEl.after(totemDiv);
        }
    }
    
    // Botões de exportação
    if (!document.querySelector('.export-buttons')) {
        const exportDiv = document.createElement('div');
        exportDiv.className = 'export-buttons';
        exportDiv.innerHTML = `
            <button class="export-btn copy" id="copyResult">📋 COPIAR</button>
            <button class="export-btn share" id="shareResult">🔗 PARTILHAR</button>
        `;
        
        document.querySelector('.reboot').before(exportDiv);
        
        document.getElementById('copyResult').addEventListener('click', () => {
            exportResult(result, { central, auxiliary, apprentice });
        });
        
        document.getElementById('shareResult').addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Meu Animal: ${result.n}`,
                        text: `Descobri meu animal no ANIMA: ${result.n}`,
                        url: window.location.href
                    });
                } catch (err) {}
            } else {
                exportResult(result, { central, auxiliary, apprentice });
            }
        });
    }
    
    saveToHistory(result, { central, auxiliary, apprentice });
    showScreen('sc-result');
}

function resolveTie(topAnimals) {
    return new Promise((resolve) => {
        const questions = [
            {
                q: "Para desempatar: Qual é a sua relação com o silêncio?",
                options: [
                    { text: "É FERTILIDADE", animals: ['coruja', 'urso', 'tartaruga'] },
                    { text: "É VÁCUO", animals: ['golfinho', 'colibri', 'aguia'] }
                ]
            },
            {
                q: "Para desempatar: Como vê o futuro?",
                options: [
                    { text: "COMO CONSTRUÇÃO", animals: ['castor', 'elefante', 'tartaruga'] },
                    { text: "COMO DESCOBERTA", animals: ['aguia', 'tubarao', 'pantera'] }
                ]
            }
        ];
        
        const question = questions[Math.floor(Math.random() * questions.length)];
        
        const modal = document.createElement('div');
        modal.className = 'tie-breaker-modal active';
        modal.innerHTML = `
            <div class="tie-breaker-content">
                <h3>EMPATE DETETADO</h3>
                <p>${question.q}</p>
                <div class="tie-breaker-options">
                    ${question.options.map((opt, idx) => `
                        <button class="spin-trigger" data-index="${idx}">${opt.text}</button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const selectedAnimals = question.options[index].animals;
                const winner = topAnimals.find(animal => selectedAnimals.includes(animal)) || topAnimals[0];
                modal.remove();
                resolve(winner);
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(topAnimals[0]);
            }
        });
    });
}

// ========== EXPORTAÇÃO ==========
async function exportResult(result, totem) {
    const textToCopy = `
🦁 ANIMA | RESULTADO

🏆 ANIMAL DE PODER: ${result.n}
🌀 CHAKRA: ${result.c}

📖 PERFIL: ${result.d}

🎯 TOTEM TRIÁDICO:
• CENTRAL: ${STATE.animals[totem.central]?.n || result.n}
• AUXILIAR: ${STATE.animals[totem.auxiliary]?.n || ''}
• APRENDIZAGEM: ${STATE.animals[totem.apprentice]?.n || ''}

📅 ${new Date().toLocaleString('pt-BR')}
ANIMA | Shamanic OS
    `.trim();
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showNotification('Resultado copiado!', 'success');
    } catch (err) {
        showNotification('Erro ao copiar', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(56, 142, 60, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 4000;
        animation: fadeInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOutDown 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== HISTÓRICO ==========
function saveToHistory(result, totem) {
    try {
        const historyItem = {
            animal: result.n,
            chakra: result.c,
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            responses: STATE.currentSession.length,
            level: STATE.currentLevel - 1,
            totem: {
                central: STATE.animals[totem.central]?.n || result.n,
                auxiliary: STATE.animals[totem.auxiliary]?.n || '',
                apprentice: STATE.animals[totem.apprentice]?.n || ''
            }
        };
        
        let history = [];
        const stored = localStorage.getItem('anima_history');
        if (stored) {
            try {
                history = JSON.parse(stored);
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                history = [];
            }
        }
        
        history.unshift(historyItem);
        if (history.length > 10) history = history.slice(0, 10);
        
        localStorage.setItem('anima_history', JSON.stringify(history));
    } catch (err) {
        console.error('Erro ao salvar histórico:', err);
    }
}

function showHistoryModal() {
    let history = [];
    
    try {
        const stored = localStorage.getItem('anima_history');
        if (stored) history = JSON.parse(stored);
        if (!Array.isArray(history)) history = [];
    } catch (err) {
        history = [];
    }
    
    const modal = document.createElement('div');
    modal.className = 'history-modal active';
    modal.innerHTML = `
        <div class="history-content">
            <h2>📜 HISTÓRICO</h2>
            <div class="history-list">
                ${history.length ? 
                    history.map(item => `
                        <div class="history-item">
                            <div class="history-animal">${item.animal}</div>
                            <div class="history-chakra">${item.chakra}</div>
                            <div class="history-info">
                                <span>Nível: ${item.level || '-'}</span>
                                <span>Respostas: ${item.responses || '-'}</span>
                            </div>
                            <div class="history-date">${item.date} ${item.time || ''}</div>
                        </div>
                    `).join('') 
                    : '<p class="no-history">Nenhum histórico</p>'
                }
            </div>
            <button class="spin-trigger close-history">FECHAR</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-history').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    document.addEventListener('keydown', function handleEsc(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    });
}

// ========== BOTÕES ==========
function initButtons() {
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => location.reload());
    }
    
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', showHistoryModal);
    }
    
    const initBtn = document.getElementById('initBtn');
    if (initBtn) {
        initBtn.addEventListener('click', () => showScreen('sc-wheel'));
    }
}

// ========== PARTÍCULAS ==========
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    const particles = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3
    }));
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 255, 0.3)';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    window.addEventListener('resize', resizeCanvas);
}

// ========== INICIALIZAÇÃO ==========
function initApp() {
    console.log('[ANIMA] Inicializando v2.0...');
    
    const initBtn = document.getElementById('initBtn');
    const loadingEl = document.getElementById('loading-state');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (initBtn) initBtn.disabled = true;
    
    try {
        initMenu();
        initParticles();
        initButtons();
        initWheel();
        
        const loaded = loadData();
        
        if (!loaded) {
            throw new Error('Dados não carregados');
        }
        
        if (initBtn) {
            initBtn.textContent = 'INICIAR JORNADA';
            initBtn.disabled = false;
        }
        
    } catch (err) {
        console.error('Erro:', err);
        
        if (initBtn) {
            initBtn.textContent = 'ERRO - RECARREGAR';
            initBtn.disabled = false;
            initBtn.onclick = () => location.reload();
        }
        
        alert('Erro ao carregar. Recarregue a página.');
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initApp);
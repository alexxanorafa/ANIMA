// ============================================
// SISTEMA ANIMA - Shamanic OS
// Versão final - Usa ficheiros JavaScript para dados
// ============================================

// ESTADO DA APLICAÇÃO
const STATE = {
    currentQuestion: 0,
    scores: {},
    questions: [],
    animals: {},
    initialized: false
};

// ============================================
// INICIALIZAÇÃO DOS DADOS
// ============================================

function loadData() {
    try {
        console.log('[ANIMA] Carregando dados...');
        
        // Carrega dados dos ficheiros JavaScript
        // Estes estão disponíveis porque foram carregados no HTML
        if (typeof QUESTIONS_DATA !== 'undefined' && QUESTIONS_DATA.questions) {
            STATE.questions = QUESTIONS_DATA.questions;
            console.log(`[ANIMA] ${STATE.questions.length} questões carregadas`);
        } else {
            throw new Error('QUESTIONS_DATA não definido');
        }
        
        if (typeof ANIMALS_DATA !== 'undefined') {
            STATE.animals = ANIMALS_DATA;
            console.log(`[ANIMA] ${Object.keys(STATE.animals).length} animais carregados`);
        } else {
            throw new Error('ANIMALS_DATA não definido');
        }
        
        return true;
        
    } catch (err) {
        console.error('[ANIMA ERRO] Falha ao carregar dados:', err.message);
        return false;
    }
}

// ============================================
// SISTEMA DE TELAS
// ============================================

function showScreen(screenId) {
    // Esconde todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostra a tela desejada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log(`[ANIMA] Tela: ${screenId}`);
    } else {
        console.error(`[ANIMA ERRO] Tela não encontrada: ${screenId}`);
    }
}

// ============================================
// SISTEMA DE MENU
// ============================================

function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (!menuBtn || !sideMenu) {
        console.error('[ANIMA ERRO] Elementos do menu não encontrados');
        return;
    }
    
    function toggleMenu() {
        const isOpening = !sideMenu.classList.contains('active');
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        menuBtn.setAttribute('aria-expanded', isOpening);
    }
    
    // Event listeners
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    overlay.addEventListener('click', toggleMenu);
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    console.log('[ANIMA] Menu inicializado');
}

// ============================================
// SISTEMA DA RODA
// ============================================

function initWheel() {
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('mainWheel');
    
    if (!spinBtn || !wheel) {
        console.error('[ANIMA ERRO] Elementos da roda não encontrados');
        return;
    }
    
    spinBtn.addEventListener('click', () => {
        spinBtn.disabled = true;
        spinBtn.textContent = 'SINCRONIZANDO...';
        
        // Animação da roda
        const degrees = 3600 + Math.floor(Math.random() * 3600);
        wheel.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)';
        wheel.style.transform = `rotate(${degrees}deg)`;
        
        // Transição para quiz
        setTimeout(() => {
            showScreen('sc-quiz');
            renderQuestion();
            spinBtn.disabled = false;
            spinBtn.textContent = 'SINCRONIZAR DESTINO';
        }, 4100);
    });
    
    console.log('[ANIMA] Roda inicializada');
}

// ============================================
// SISTEMA DE QUIZ
// ============================================

function renderQuestion() {
    if (!STATE.questions.length || STATE.currentQuestion >= STATE.questions.length) {
        console.error('[ANIMA ERRO] Nenhuma questão disponível');
        return;
    }
    
    const question = STATE.questions[STATE.currentQuestion];
    
    // Atualiza interface
    document.getElementById('q-portal').textContent = 
        `ETAPA ${STATE.currentQuestion + 1}/${STATE.questions.length}`;
    document.getElementById('q-text').textContent = question.q;
    
    // Cria opções
    const container = document.getElementById('q-options');
    container.innerHTML = '';
    
    question.a.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'spin-trigger option-btn';
        button.textContent = option.t;
        button.setAttribute('role', 'option');
        
        button.addEventListener('click', () => {
            handleAnswer(option.s);
        });
        
        container.appendChild(button);
    });
    
    // Atualiza progresso
    const progress = ((STATE.currentQuestion + 1) / STATE.questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    console.log(`[ANIMA] Questão ${STATE.currentQuestion + 1} renderizada`);
}

function handleAnswer(animalSlug) {
    // Contabiliza resposta
    STATE.scores[animalSlug] = (STATE.scores[animalSlug] || 0) + 1;
    STATE.currentQuestion++;
    
    // Próxima questão ou resultado
    if (STATE.currentQuestion < STATE.questions.length) {
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    // Encontra animal com mais pontos
    let winner = '';
    let maxScore = 0;
    
    for (const [animal, score] of Object.entries(STATE.scores)) {
        if (score > maxScore) {
            maxScore = score;
            winner = animal;
        }
    }
    
    // Se empate, escolhe aleatoriamente
    const tiedAnimals = Object.entries(STATE.scores)
        .filter(([animal, score]) => score === maxScore)
        .map(([animal]) => animal);
    
    if (tiedAnimals.length > 1) {
        winner = tiedAnimals[Math.floor(Math.random() * tiedAnimals.length)];
    }
    
    // Obtém dados do animal
    const result = STATE.animals[winner];
    
    if (!result) {
        console.error(`[ANIMA ERRO] Animal não encontrado: ${winner}`);
        alert('Erro ao calcular resultado. Tente novamente.');
        return;
    }
    
    // Atualiza tela de resultado
    document.getElementById('res-name').textContent = result.n;
    document.getElementById('res-desc').textContent = result.d;
    document.getElementById('res-chakra').textContent = `CHAKRA: ${result.c}`;
    
    // Salva no histórico
    saveToHistory(result);
    
    // Mostra tela de resultado
    showScreen('sc-result');
    
    console.log(`[ANIMA] Resultado: ${result.n} (${winner})`);
}

function saveToHistory(result) {
    try {
        const historyItem = {
            animal: result.n,
            chakra: result.c,
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
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
        
        // Mantém apenas os últimos 10
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('anima_history', JSON.stringify(history));
        
    } catch (err) {
        console.error(`[ANIMA ERRO] Erro ao salvar histórico: ${err.message}`);
    }
}

// ============================================
// SISTEMA DE BOTÕES
// ============================================

function initButtons() {
    // Botão de reinício
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload();
        });
    }
    
    // Botão de histórico
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', showHistoryModal);
    }
    
    // Botão de iniciar
    const initBtn = document.getElementById('initBtn');
    if (initBtn) {
        initBtn.addEventListener('click', () => {
            showScreen('sc-wheel');
        });
    }
    
    console.log('[ANIMA] Botões inicializados');
}

function showHistoryModal() {
    let history = [];
    
    try {
        const stored = localStorage.getItem('anima_history');
        if (stored) {
            history = JSON.parse(stored);
            if (!Array.isArray(history)) history = [];
        }
    } catch (err) {
        console.error(`[ANIMA ERRO] Erro ao ler histórico: ${err.message}`);
    }
    
    const modal = document.createElement('div');
    modal.className = 'history-modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Histórico de resultados');
    
    modal.innerHTML = `
        <div class="history-content">
            <h2>📜 HISTÓRICO DE SINCRONIZAÇÕES</h2>
            <div class="history-list">
                ${history.length ? 
                    history.map(item => `
                        <div class="history-item" role="listitem">
                            <div class="history-animal">${item.animal}</div>
                            <div class="history-chakra">${item.chakra}</div>
                            <div class="history-date">${item.date} ${item.time || ''}</div>
                        </div>
                    `).join('') 
                    : '<p class="no-history">Nenhuma sincronização anterior encontrada</p>'
                }
            </div>
            <button class="spin-trigger close-history" aria-label="Fechar histórico">FECHAR</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    const closeBtn = modal.querySelector('.close-history');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Fechar com ESC
    const closeModal = () => modal.remove();
    const handleEsc = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    document.addEventListener('keydown', handleEsc);
    modal.addEventListener('click', function handler(e) {
        if (e.target === modal) {
            document.removeEventListener('keydown', handleEsc);
        }
    });
}

// ============================================
// SISTEMA DE PARTÍCULAS
// ============================================

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
    
    console.log('[ANIMA] Partículas inicializadas');
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initApp() {
    console.log('[ANIMA] Inicializando sistema...');
    
    const initBtn = document.getElementById('initBtn');
    const loadingEl = document.getElementById('loading-state');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (initBtn) initBtn.disabled = true;
    
    try {
        // Inicializa sistemas básicos
        initMenu();
        initParticles();
        initButtons();
        initWheel();
        
        // Carrega dados
        const loaded = loadData();
        
        if (!loaded || STATE.questions.length === 0 || Object.keys(STATE.animals).length === 0) {
            throw new Error('Dados não carregados corretamente');
        }
        
        // Ativa botão de iniciar
        if (initBtn) {
            initBtn.textContent = 'INICIAR JORNADA';
            initBtn.disabled = false;
        }
        
        STATE.initialized = true;
        console.log('[ANIMA] Sistema inicializado com sucesso!');
        
    } catch (err) {
        console.error(`[ANIMA ERRO] Falha na inicialização: ${err.message}`);
        
        if (initBtn) {
            initBtn.textContent = 'ERRO - RECARREGAR';
            initBtn.disabled = false;
            initBtn.onclick = () => location.reload();
        }
        
        alert('Erro ao carregar o sistema. Recarregue a página.');
        
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

// ============================================
// INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
// ============================================

document.addEventListener('DOMContentLoaded', initApp);
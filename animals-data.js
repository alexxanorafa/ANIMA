// animals-data.js - Dados dos animais
const ANIMALS_DATA = {
    "leao": {
        "n": "LEÃO",
        "c": "PLEXO SOLAR",
        "d": "Soberania e Coragem. O domínio do Eu consciente sobre os instintos primordiais. Arquétipo do Rei/Guardião presente em todas as culturas."
    },
    "aguia": {
        "n": "ÁGUIA",
        "c": "TERCEIRO OLHO",
        "d": "Visão Transpessoal. A capacidade de observar a vida de uma perspetiva elevada. Mensageira divina na mitologia grega e nativa americana."
    },
    "lobo": {
        "n": "LOBO",
        "c": "GARGANTA",
        "d": "Inteligência Social. O mestre do equilíbrio entre a matilha e a autonomia individual. Professor e guia nas tradições xamânicas."
    },
    "coruja": {
        "n": "CORUJA",
        "c": "COROA",
        "d": "Sabedoria Oculta. A faculdade de navegar no inconsciente e ver a verdade nas sombras. Símbolo de Atena na Grécia Antiga."
    },
    "urso": {
        "n": "URSO",
        "c": "RAIZ",
        "d": "Introspeção e Cura. A força que provém do silêncio interior e da renovação cíclica. Animal de poder para xamãs siberianos."
    },
    "baleia": {
        "n": "BALEIA",
        "c": "CORAÇÃO",
        "d": "Memória Ancestral. Guardiã das frequências emocionais profundas do planeta. Criadora de mundos na mitologia polinésia."
    },
    "serpente": {
        "n": "SERPENTE",
        "c": "SACRO",
        "d": "Transmutação Vital. Energia Kundalini em constante renovação e transformação. Símbolo de cura e renascimento universal."
    },
    "tartaruga": {
        "n": "TARTARUGA",
        "c": "RAIZ",
        "d": "Resiliência Histórica. A sabedoria de quem caminha no tempo certo da Terra. Suporta o mundo em várias mitologias."
    },
    "elefante": {
        "n": "ELEFANTE",
        "c": "RAIZ",
        "d": "Paciência e Realeza. Força imensa baseada na ancestralidade e na proteção. Representação de Ganesha no hinduísmo."
    },
    "tubarao": {
        "n": "TUBARÃO",
        "c": "SACRO",
        "d": "Instinto Implacável. Determinação focada e superação de medos abissais. Guia nos oceanos do inconsciente."
    },
    "pantera": {
        "n": "PANTERA",
        "c": "SACRO",
        "d": "Mistério e Agilidade. Movimento silencioso entre os mundos visível e invisível. Guardiã dos segredos noturnos."
    },
    "colibri": {
        "n": "COLIBRI",
        "c": "CORAÇÃO",
        "d": "Alegria Efêmera. Capacidade de extrair beleza de cada momento passageiro. Mensageiro de amor nas culturas andinas."
    },
    "golfinho": {
        "n": "GOLFINHO",
        "c": "GARGANTA",
        "d": "Comunicação Lúdica. Inteligência social aliada à liberdade criativa. Guia de almas na mitologia grega."
    },
    "castor": {
        "n": "CASTOR",
        "c": "RAIZ",
        "d": "Construção Prática. Transformação do ambiente através do trabalho paciente e determinado. Arquétipo do Construtor."
    },
    "raposa": {
        "n": "RAPOSA",
        "c": "TERCEIRO OLHO",
        "d": "Astúcia Intuitiva. Percepção aguçada para oportunidades ocultas. Trickster e professor em várias culturas."
    },
    "tigre": {
        "n": "TIGRE",
        "c": "PLEXO SOLAR",
        "d": "Foco e Poder. Energia concentrada para ações decisivas e protegidas. Símbolo real na Ásia, protetor contra espíritos."
    },
    // NOVOS ANIMAIS ADICIONADOS ABAIXO
    "corvo": {
        "n": "CORVO",
        "c": "COROA",
        "d": "Magia e Transformação. Mensageiro entre mundos, detentor de memórias ancestrais. Olho de Odin na mitologia nórdica."
    },
    "cavalo": {
        "n": "CAVALO",
        "c": "SACRO",
        "d": "Liberdade e Paixão. Força vital que corre em direção ao horizonte. Pégaso na Grécia, transporte de deuses e heróis."
    },
    "gato": {
        "n": "GATO",
        "c": "TERCEIRO OLHO",
        "d": "Independência Mística. Equilíbrio entre carinho e autonomia, visão noturna. Bastet no Egito, guardiã do lar."
    },
    "borboleta": {
        "n": "BORBOLETA",
        "c": "SACRO",
        "d": "Metamorfose e Alma. Transformação radical, beleza efêmera. Psiquê na Grécia, símbolo da alma em muitas culturas."
    },
    "veado": {
        "n": "VEADO",
        "c": "CORAÇÃO",
        "d": "Sensibilidade e Gentileza. Conexão profunda com a natureza e ciclos. Símbolo de Cristo e renascimento espiritual."
    },
    "falcão": {
        "n": "FALCÃO",
        "c": "TERCEIRO OLHO",
        "d": "Foco e Precisão. Visão aguçada para detalhes importantes. Horus no Egito, representação do sol e realeza."
    },
    "cisne": {
        "n": "CISNE",
        "c": "GARGANTA",
        "d": "Graça e Transformação Interior. Beleza que emerge do caos. Zeus como cisne, símbolo de pureza e fidelidade."
    },
    "touro": {
        "n": "TOURO",
        "c": "RAIZ",
        "d": "Força Terrena e Determinação. Poder de manifestação material. Ápis no Egito, símbolo de fertilidade e poder."
    },
    "cão": {
        "n": "CÃO",
        "c": "CORAÇÃO",
        "d": "Lealdade e Proteção. Fidelidade incondicional, guardião entre mundos. Anúbis no Egito, Cérbero na Grécia."
    },
    "aranha": {
        "n": "ARANHA",
        "c": "TERCEIRO OLHO",
        "d": "Criatividade Tecelã. Arte de tecer conexões e padrões complexos. Criadora do mundo em culturas nativas americanas."
    },
    "morcego": {
        "n": "MORCEGO",
        "c": "TERCEIRO OLHO",
        "d": "Percepção Sônica. Navegação pelo invisível através de ecos. Símbolo de renascimento em culturas mesoamericanas."
    },
    "abelha": {
        "n": "ABELHA",
        "c": "PLEXO SOLAR",
        "d": "Comunidade e Prosperidade. Trabalho coletivo, doçura compartilhada. Mensageira dos deuses na Grécia Antiga."
    },
    "formiga": {
        "n": "FORMIGA",
        "c": "RAIZ",
        "d": "Persistência Coletiva. Disciplina, trabalho em equipe e visão de longo prazo. Esopo, lição de previsão e trabalho."
    },
    "jacare": {
        "n": "JACARÉ",
        "c": "RAIZ",
        "d": "Paciência Ancestral. Força primal que aguarda o momento exato. Símbolo de criação e paciência em culturas africanas."
    },
    "lontra": {
        "n": "LONTRA",
        "c": "CORAÇÃO",
        "d": "Jogo e Alegria. Arte de encontrar felicidade nas pequenas coisas. Trickster brincalhão em várias tradições."
    },
    "salamandra": {
        "n": "SALAMANDRA",
        "c": "SACRO",
        "d": "Regeneração e Adaptação. Capacidade de renascer das cinzas. Espírito do fogo na alquimia medieval."
    },
    "caranguejo": {
        "n": "CARANGUEJO",
        "c": "SACRO",
        "d": "Proteção e Ciclos Lunares. Movimento lateral inteligente, conexão com marés emocionais. Símbolo do zodíaco."
    },
    "fênix": {
        "n": "FÊNIX",
        "c": "CORAÇÃO",
        "d": "Ressurreição e Renovação. Capacidade de renascer das cinzas, transformação total. Símbolo de imortalidade universal."
    },
    "dragão": {
        "n": "DRAGÃO",
        "c": "COROA",
        "d": "Poder Cósmico e Sabedoria. Força elemental, guardião de tesouros. Símbolo de poder na China, força na Europa."
    }
};

// Torna disponível globalmente
if (typeof window !== 'undefined') {
    window.ANIMALS_DATA = ANIMALS_DATA;
}
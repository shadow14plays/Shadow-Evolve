// ==============================================
// Shadow-Evolve — Dados dos treinos e exercícios
// ==============================================

// Cada exercício tem tempo de trabalho e descanso em segundos.
// `rounds` define quantas vezes a sequência completa se repete (padrão).
const WORKOUTS = [
  {
    id: 'aquecimento',
    nome: 'Aquecimento Rápido',
    emoji: '☀️',
    nivel: 'Iniciante',
    foco: 'Preparação',
    rounds: 1,
    descricao: 'Prepare o corpo antes de qualquer treino. Leve, rápido e essencial.',
    exercicios: [
      { nome: 'Polichinelos leves', tempo: 30, descanso: 10 },
      { nome: 'Rotação de braços', tempo: 20, descanso: 10 },
      { nome: 'Rotação de quadril', tempo: 20, descanso: 10 },
      { nome: 'Agachamento lento', tempo: 20, descanso: 10 },
      { nome: 'Giro de tronco', tempo: 20, descanso: 10 },
      { nome: 'Corrida estacionária leve', tempo: 30, descanso: 10 },
    ],
  },
  {
    id: 'despertar',
    nome: 'Despertar',
    emoji: '🌅',
    nivel: 'Iniciante',
    foco: 'Corpo todo',
    rounds: 2,
    descricao: 'Treino leve pra acordar o corpo inteiro. Perfeito pra começar.',
    exercicios: [
      { nome: 'Polichinelos', tempo: 30, descanso: 15 },
      { nome: 'Agachamento', tempo: 30, descanso: 15 },
      { nome: 'Flexão com joelhos', tempo: 30, descanso: 15 },
      { nome: 'Prancha', tempo: 20, descanso: 15 },
      { nome: 'Afundo alternado', tempo: 30, descanso: 15 },
      { nome: 'Corrida estacionária', tempo: 30, descanso: 15 },
    ],
  },
  {
    id: 'evolucao',
    nome: 'Evolução Diária',
    emoji: '🔥',
    nivel: 'Intermediário',
    foco: 'Corpo todo',
    rounds: 3,
    descricao: 'Circuito completo pra queimar e ganhar resistência.',
    exercicios: [
      { nome: 'Polichinelos', tempo: 40, descanso: 20 },
      { nome: 'Agachamento com salto', tempo: 30, descanso: 20 },
      { nome: 'Flexão', tempo: 30, descanso: 20 },
      { nome: 'Mountain climber', tempo: 30, descanso: 20 },
      { nome: 'Prancha', tempo: 30, descanso: 20 },
      { nome: 'Burpee', tempo: 20, descanso: 20 },
    ],
  },
  {
    id: 'cardio-express',
    nome: 'Cardio Express',
    emoji: '⚡',
    nivel: 'Intermediário',
    foco: 'Cardio rápido',
    rounds: 2,
    descricao: 'Pouco tempo? Suor garantido em poucos minutos, sem sair do lugar.',
    exercicios: [
      { nome: 'Corrida estacionária', tempo: 30, descanso: 15 },
      { nome: 'Polichinelos', tempo: 30, descanso: 15 },
      { nome: 'Skipping alto', tempo: 25, descanso: 15 },
      { nome: 'Saltos laterais', tempo: 25, descanso: 15 },
      { nome: 'Mountain climber rápido', tempo: 25, descanso: 15 },
      { nome: 'Shadow boxing', tempo: 30, descanso: 15 },
    ],
  },
  {
    id: 'sombra',
    nome: 'Modo Sombra',
    emoji: '🌑',
    nivel: 'Avançado',
    foco: 'HIIT intenso',
    rounds: 4,
    descricao: 'O desafio máximo do Shadow-Evolve. Intervalos curtos, intensidade total.',
    exercicios: [
      { nome: 'Burpee', tempo: 30, descanso: 15 },
      { nome: 'Agachamento com salto', tempo: 30, descanso: 15 },
      { nome: 'Flexão', tempo: 30, descanso: 15 },
      { nome: 'Mountain climber', tempo: 30, descanso: 15 },
      { nome: 'Saltos laterais', tempo: 30, descanso: 15 },
      { nome: 'Prancha tocando ombros', tempo: 30, descanso: 15 },
    ],
  },
  {
    id: 'core',
    nome: 'Core de Aço',
    emoji: '🧱',
    nivel: 'Intermediário',
    foco: 'Abdômen e lombar',
    rounds: 3,
    descricao: 'Fortaleça o centro do corpo: postura, equilíbrio e definição.',
    exercicios: [
      { nome: 'Prancha', tempo: 30, descanso: 15 },
      { nome: 'Prancha lateral (direita)', tempo: 20, descanso: 10 },
      { nome: 'Prancha lateral (esquerda)', tempo: 20, descanso: 10 },
      { nome: 'Abdominal bicicleta', tempo: 30, descanso: 15 },
      { nome: 'Elevação de pernas', tempo: 25, descanso: 15 },
      { nome: 'Giro russo', tempo: 30, descanso: 15 },
    ],
  },
  {
    id: 'pernas',
    nome: 'Pernas Fortes',
    emoji: '🦵',
    nivel: 'Intermediário',
    foco: 'Pernas e glúteos',
    rounds: 3,
    descricao: 'Base sólida: agachamentos, afundos e potência pra membros inferiores.',
    exercicios: [
      { nome: 'Agachamento', tempo: 40, descanso: 20 },
      { nome: 'Afundo alternado', tempo: 30, descanso: 20 },
      { nome: 'Agachamento isométrico', tempo: 30, descanso: 20 },
      { nome: 'Elevação de panturrilha', tempo: 30, descanso: 15 },
      { nome: 'Elevação de quadril', tempo: 30, descanso: 20 },
      { nome: 'Agachamento com salto', tempo: 25, descanso: 20 },
    ],
  },
  {
    id: 'bracos',
    nome: 'Braços & Ombros',
    emoji: '💪',
    nivel: 'Iniciante',
    foco: 'Membros superiores',
    rounds: 3,
    descricao: 'Flexões e variações pra fortalecer peito, braços e ombros em casa.',
    exercicios: [
      { nome: 'Flexão', tempo: 30, descanso: 20 },
      { nome: 'Flexão diamante', tempo: 20, descanso: 20 },
      { nome: 'Tríceps no banco', tempo: 30, descanso: 20 },
      { nome: 'Flexão pike', tempo: 25, descanso: 20 },
      { nome: 'Prancha sobe-desce', tempo: 30, descanso: 20 },
      { nome: 'Shadow boxing', tempo: 40, descanso: 20 },
    ],
  },
  {
    id: 'alongamento',
    nome: 'Alongamento Zen',
    emoji: '🧘',
    nivel: 'Iniciante',
    foco: 'Flexibilidade',
    rounds: 1,
    descricao: 'Solte o corpo e acalme a mente. Segure cada posição com calma.',
    exercicios: [
      { nome: 'Alongamento de pescoço', tempo: 30, descanso: 10 },
      { nome: 'Ombros e braços', tempo: 30, descanso: 10 },
      { nome: 'Gato-vaca', tempo: 30, descanso: 10 },
      { nome: 'Postura da criança', tempo: 40, descanso: 10 },
      { nome: 'Alongamento de posteriores', tempo: 30, descanso: 10 },
      { nome: 'Flexor de quadril (direita)', tempo: 30, descanso: 10 },
      { nome: 'Flexor de quadril (esquerda)', tempo: 30, descanso: 10 },
      { nome: 'Quadríceps em pé', tempo: 30, descanso: 10 },
    ],
  },
];

// Plano semanal — índice 0 = domingo (como Date.getDay()).
const PLANO_SEMANAL = [
  { dia: 'Domingo', descanso: true, dica: 'Descanso ativo: caminhada leve ou Alongamento Zen 🧘' },
  { dia: 'Segunda', treinoId: 'despertar' },
  { dia: 'Terça', treinoId: 'core' },
  { dia: 'Quarta', treinoId: 'alongamento' },
  { dia: 'Quinta', treinoId: 'pernas' },
  { dia: 'Sexta', treinoId: 'evolucao' },
  { dia: 'Sábado', treinoId: 'sombra' },
];

// Biblioteca de exercícios com dicas de execução.
const EXERCICIOS = [
  { nome: 'Polichinelo', emoji: '🤸', musculo: 'Cardio', nivel: 'Iniciante', dica: 'Abdômen ativo, coordene braços e pernas no mesmo ritmo.' },
  { nome: 'Agachamento', emoji: '🦵', musculo: 'Pernas', nivel: 'Iniciante', dica: 'Costas retas, joelhos alinhados com as pontas dos pés.' },
  { nome: 'Flexão', emoji: '💪', musculo: 'Peito e braços', nivel: 'Intermediário', dica: 'Corpo em linha reta, cotovelos a ~45° do tronco.' },
  { nome: 'Prancha', emoji: '🧱', musculo: 'Core', nivel: 'Iniciante', dica: 'Quadril alinhado, olhar pro chão e respiração calma.' },
  { nome: 'Afundo', emoji: '🚶', musculo: 'Pernas', nivel: 'Iniciante', dica: 'Passo largo, joelho de trás quase tocando o chão.' },
  { nome: 'Burpee', emoji: '🔥', musculo: 'Corpo todo', nivel: 'Avançado', dica: 'Sequência: agacha, prancha, flexão e salto. Ritmo constante.' },
  { nome: 'Mountain climber', emoji: '⛰️', musculo: 'Core e cardio', nivel: 'Intermediário', dica: 'Joelhos em direção ao peito, quadril estável.' },
  { nome: 'Elevação de quadril', emoji: '🍑', musculo: 'Glúteos', nivel: 'Iniciante', dica: 'Empurre o quadril pra cima e contraia o glúteo no topo.' },
  { nome: 'Abdominal bicicleta', emoji: '🚴', musculo: 'Core', nivel: 'Intermediário', dica: 'Gire o tronco de forma controlada, sem puxar o pescoço.' },
  { nome: 'Agachamento com salto', emoji: '🚀', musculo: 'Pernas', nivel: 'Avançado', dica: 'Aterrisse suave, absorvendo o impacto com os joelhos.' },
  { nome: 'Tríceps no banco', emoji: '🪑', musculo: 'Braços', nivel: 'Intermediário', dica: 'Apoie as mãos na beirada de uma cadeira firme.' },
  { nome: 'Prancha lateral', emoji: '↔️', musculo: 'Core', nivel: 'Intermediário', dica: 'Corpo em linha reta, quadril longe do chão.' },
  { nome: 'Gato-vaca', emoji: '🐈', musculo: 'Mobilidade', nivel: 'Iniciante', dica: 'Alterne arqueando e arredondando a coluna, devagar.' },
  { nome: 'Postura da criança', emoji: '🧎', musculo: 'Alongamento', nivel: 'Iniciante', dica: 'Sentado nos calcanhares, estique os braços à frente e respire.' },
];

function workoutById(id) {
  return WORKOUTS.find((w) => w.id === id);
}

// Segundos totais de um round completo do treino.
function duracaoPorRound(t) {
  return t.exercicios.reduce((s, e) => s + e.tempo + e.descanso, 0);
}

// Duração estimada do treino em minutos (com os rounds padrão).
function duracaoEstimada(t) {
  return duracaoComRounds(t, t.rounds);
}

// Duração estimada em minutos para uma quantidade específica de rounds.
function duracaoComRounds(t, rounds) {
  return Math.max(1, Math.round((duracaoPorRound(t) * rounds) / 60));
}

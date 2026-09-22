// ==============================================
// Shadow-Evolve — Lógica do app
// ==============================================

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const STORAGE_KEY = 'shadow-evolve-logs';
const METAS_KEY = 'shadow-evolve-metas';

// ---------------- Utilidades ----------------

function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtMinSeg(totalSeg) {
  const s = Math.max(0, Math.ceil(totalSeg));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------------- Progresso (localStorage) ----------------

function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
function salvarLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function addLog(nome, minutos) {
  const logs = getLogs();
  logs.push({ data: isoDate(), treino: nome, minutos: Math.max(1, Math.round(minutos)) });
  salvarLogs(logs);
  renderHome();
  renderProgresso();
  toast(`✓ ${nome} registrado!`);
}

// Logs dos últimos 7 dias (incluindo hoje).
function logsUltimos7Dias() {
  const dias = new Set();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.add(isoDate(d));
  }
  return getLogs().filter((l) => dias.has(l.data));
}

function minutosUltimos7Dias() {
  return logsUltimos7Dias().reduce((s, l) => s + l.minutos, 0);
}

function streak() {
  const dias = new Set(getLogs().map((l) => l.data));
  let count = 0;
  const d = new Date();
  if (!dias.has(isoDate(d))) d.setDate(d.getDate() - 1); // streak pode começar ontem
  while (dias.has(isoDate(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

// ---------------- Metas ----------------

function getMetas() {
  try {
    const m = JSON.parse(localStorage.getItem(METAS_KEY) || 'null');
    if (m && m.treinos > 0 && m.minutos > 0) return m;
  } catch {}
  return { treinos: 4, minutos: 60 };
}
function salvarMetas(m) {
  localStorage.setItem(METAS_KEY, JSON.stringify(m));
}

function abrirMetas() {
  const m = getMetas();
  $('#modal').innerHTML = `
    <div class="cabecalho">
      <span class="emoji">🎯</span>
      <div><h3>Metas da semana</h3></div>
    </div>
    <p class="desc">Defina seus objetivos pros últimos 7 dias. Constância vale mais que intensidade.</p>
    <div class="custom-grid" style="grid-template-columns:1fr 1fr">
      <label>Treinos por semana<input id="meta-treinos" type="number" min="1" max="14" value="${m.treinos}"></label>
      <label>Minutos por semana<input id="meta-minutos" type="number" min="10" max="900" value="${m.minutos}"></label>
    </div>
    <div class="acoes-modal">
      <button class="btn ghost" onclick="fecharModal()">Cancelar</button>
      <button class="btn" onclick="salvarMetasDoModal()">Salvar</button>
    </div>`;
  $('#modal-overlay').hidden = false;
}

function salvarMetasDoModal() {
  const t = parseInt($('#meta-treinos').value, 10);
  const m = parseInt($('#meta-minutos').value, 10);
  if (t > 0 && m > 0) {
    salvarMetas({ treinos: t, minutos: m });
    toast('Metas atualizadas 🎯');
  }
  fecharModal();
  renderProgresso();
  renderHome();
}

// ---------------- Navegação ----------------

function switchView(nome) {
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${nome}`));
  $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.view === nome));
  window.scrollTo({ top: 0 });
  if (nome === 'home') renderHome();
  if (nome === 'progresso') renderProgresso();
}

// ---------------- Início ----------------

function saudacao() {
  const h = new Date().getHours();
  if (h < 6) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function renderHome() {
  const instalavel = deferredPrompt
    ? '<button class="btn install" onclick="instalarApp()">📲 Instalar Shadow-Evolve no dispositivo</button>'
    : '';

  $('#home-saudacao').innerHTML = `
    ${instalavel}
    <div class="saudacao">
      <h1>${saudacao()}, atleta 🌑</h1>
      <p>Cada treino te faz evoluir. Vamos treinar?</p>
    </div>`;

  const total = getLogs().length;
  const mins = minutosUltimos7Dias();
  $('#home-stats').innerHTML = `
    <div class="stat-card"><div class="valor fogo">🔥 ${streak()}</div><div class="rotulo">dias seguidos</div></div>
    <div class="stat-card"><div class="valor">${total}</div><div class="rotulo">treinos feitos</div></div>
    <div class="stat-card"><div class="valor verde">${mins}</div><div class="rotulo">min · últimos 7 dias</div></div>`;

  // Treino de hoje
  const hoje = PLANO_SEMANAL[new Date().getDay()];
  if (hoje.treinoId) {
    const t = workoutById(hoje.treinoId);
    $('#home-hoje').innerHTML = `
      <div class="hoje-card">
        <div class="emoji">${t.emoji}</div>
        <div class="conteudo">
          <h3>${t.nome}</h3>
          <div class="meta">${t.foco} · ~${duracaoEstimada(t)} min · ${t.nivel}</div>
          <div class="acoes">
            <button class="btn" onclick="prepararGuiado('${t.id}')">▶ Fazer agora</button>
            <button class="btn ghost" onclick="abrirDetalhe('${t.id}')">Detalhes</button>
          </div>
        </div>
      </div>`;
  } else {
    $('#home-hoje').innerHTML = `
      <div class="descanso-card">
        <div class="emoji">🧘</div>
        <p><strong>Dia de descanso.</strong></p>
        <p>${hoje.dica}</p>
      </div>`;
  }

  // Plano da semana
  const diaHoje = new Date().getDay();
  $('#home-plano').innerHTML = PLANO_SEMANAL.map((item, i) => {
    const t = item.treinoId ? workoutById(item.treinoId) : null;
    const classe = i === diaHoje ? 'plano-linha hoje' : 'plano-linha';
    const info = t ? `${t.emoji} ${t.nome}` : `<span class="descanso">🧘 ${item.dica}</span>`;
    const acoes = t
      ? `<button class="btn ghost" style="padding:6px 10px;font-size:0.75rem" onclick="prepararGuiado('${t.id}')">▶</button>`
      : '';
    return `
      <div class="${classe}">
        <span class="dia">${item.dia}</span>
        <span class="info">${info}</span>
        ${i === diaHoje ? '<span class="tag-hoje">hoje</span>' : ''}
        ${acoes}
      </div>`;
  }).join('');
}

// ---------------- Treinos ----------------

function renderTreinos() {
  $('#lista-treinos').innerHTML = WORKOUTS.map((t) => `
    <article class="treino-card">
      <div class="treino-top">
        <span class="treino-emoji">${t.emoji}</span>
        <span class="badge nivel-${t.nivel}">${t.nivel}</span>
      </div>
      <h3>${t.nome}</h3>
      <p class="desc">${t.descricao}</p>
      <p class="treino-meta">${t.foco} · ~${duracaoEstimada(t)} min · ${t.exercicios.length} exercícios · ${t.rounds} rounds</p>
      <div class="treino-acoes">
        <button class="btn ghost" onclick="abrirDetalhe('${t.id}')">Detalhes</button>
        <button class="btn" onclick="prepararGuiado('${t.id}')">▶ Iniciar</button>
        <button class="btn ghost ok" title="Concluir e registrar" onclick="concluirManual('${t.id}')">✓</button>
      </div>
    </article>`).join('');

  $('#lista-exercicios').innerHTML = EXERCICIOS.map((e) => `
    <div class="exercicio-card">
      <div class="topo">
        <span class="emoji">${e.emoji}</span>
        <div>
          <h4>${e.nome}</h4>
          <div class="musculo">${e.musculo} · ${e.nivel}</div>
        </div>
      </div>
      <p class="dica">${e.dica}</p>
    </div>`).join('');
}

function abrirDetalhe(id) {
  const t = workoutById(id);
  const dicaAquecimento =
    t.id !== 'aquecimento' && t.id !== 'alongamento'
      ? '<p class="desc" style="margin-top:10px">💡 Dica: faça o ☀️ Aquecimento Rápido antes e o 🧘 Alongamento Zen depois.</p>'
      : '';
  $('#modal').innerHTML = `
    <div class="cabecalho">
      <span class="emoji">${t.emoji}</span>
      <div>
        <h3>${t.nome}</h3>
        <span class="badge nivel-${t.nivel}">${t.nivel}</span>
      </div>
    </div>
    <p class="desc">${t.descricao}<br>${t.foco} · ~${duracaoEstimada(t)} min · ${t.rounds} rounds</p>
    <ul>
      ${t.exercicios
        .map((e) => `<li><span>${e.nome}</span><span>${e.tempo}s + ${e.descanso}s descanso</span></li>`)
        .join('')}
    </ul>
    ${dicaAquecimento}
    <div class="acoes-modal" style="margin-top:14px">
      <button class="btn ghost" onclick="fecharModal()">Fechar</button>
      <button class="btn" onclick="fecharModal(); prepararGuiado('${t.id}')">▶ Iniciar treino</button>
    </div>`;
  $('#modal-overlay').hidden = false;
}

function fecharModal() {
  $('#modal-overlay').hidden = true;
}

function concluirManual(id) {
  const t = workoutById(id);
  addLog(t.nome, duracaoEstimada(t));
}

// ---------------- Timer ----------------

const RING_C = 2 * Math.PI * 54; // circunferência do anel (r=54)

const T = {
  mode: 'guiado',           // 'guiado' | 'custom'
  workoutId: WORKOUTS.find((w) => w.id !== 'aquecimento').id,
  rounds: null,             // null = usar os rounds padrão do treino
  custom: { work: 30, rest: 15, rounds: 8 },
  steps: [],
  i: 0,
  phase: 'idle',            // 'idle' | 'prep' | 'work' | 'rest' | 'done'
  endTime: 0,
  remaining: 0,
  total: 1,
  elapsed: 0,               // segundos totais decorridos (work + rest)
  timerId: null,
};

let ultimoBeep = null;

// --- áudio ---
let audioCtx = null;
function ensureAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {}
}
function beep(freq = 880, dur = 0.12, type = 'square', vol = 0.07) {
  try {
    ensureAudio();
    if (!audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(audioCtx.destination);
    const t0 = audioCtx.currentTime;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0);
    o.stop(t0 + dur);
  } catch {}
}

function passosDoTreino(t, rounds) {
  const steps = [];
  for (let r = 0; r < rounds; r++) {
    t.exercicios.forEach((e) =>
      steps.push({ label: e.nome, sub: `Round ${r + 1}/${rounds}`, work: e.tempo, rest: e.descanso })
    );
  }
  return steps;
}

function roundsAtuais() {
  const t = workoutById(T.workoutId);
  return T.rounds ?? t.rounds;
}

function setModo(modo) {
  if (T.phase !== 'idle') return;
  T.mode = modo;
  renderTimer();
}

function selecionarTreinoTimer(id) {
  if (T.phase !== 'idle') return;
  T.workoutId = id;
  T.rounds = null; // volta aos rounds padrão do novo treino
  renderTimer();
}

// Ajusta a quantidade de rounds do treino guiado selecionado.
function ajustarRounds(delta) {
  if (T.phase !== 'idle') return;
  const novo = Math.min(12, Math.max(1, roundsAtuais() + delta));
  T.rounds = novo;
  renderTimer();
}

function lerCustom() {
  const w = parseInt($('#custom-work')?.value, 10);
  const r = parseInt($('#custom-rest')?.value, 10);
  const n = parseInt($('#custom-rounds')?.value, 10);
  if (w > 0) T.custom.work = w;
  if (r >= 0) T.custom.rest = r;
  if (n > 0) T.custom.rounds = n;
}

// Pré-seleciona um treino e leva até a aba do timer.
function prepararGuiado(id) {
  if (T.phase !== 'idle') {
    toast('⏱️ Já existe um timer em andamento');
    switchView('timer');
    return;
  }
  T.mode = 'guiado';
  T.workoutId = id;
  T.rounds = null;
  switchView('timer');
  renderTimer();
}

function iniciarTimer() {
  ensureAudio();
  if (T.mode === 'guiado') {
    const t = workoutById(T.workoutId);
    T.steps = passosDoTreino(t, roundsAtuais());
  } else {
    lerCustom();
    const { work, rest, rounds } = T.custom;
    T.steps = [];
    for (let r = 0; r < rounds; r++) T.steps.push({ label: `Round ${r + 1}`, sub: 'Personalizado', work, rest });
  }
  T.i = 0;
  T.elapsed = 0;
  iniciarFase('prep', 5);
  renderTimer();
}

function iniciarFase(fase, segundos) {
  T.phase = fase;
  T.total = segundos;
  T.remaining = segundos;
  T.endTime = Date.now() + segundos * 1000;
  ultimoBeep = null;
  if (!T.timerId) T.timerId = setInterval(tick, 200);
}

function tick() {
  const rest = Math.max(0, (T.endTime - Date.now()) / 1000);
  T.remaining = rest;

  if (T.phase === 'work' || T.phase === 'rest') {
    const s = Math.ceil(rest);
    if (s <= 3 && s >= 1 && s !== ultimoBeep) {
      ultimoBeep = s;
      beep(1000, 0.07, 'sine', 0.05);
    }
  }

  if (rest <= 0) proximaFase();
  else atualizarDisplay();
}

function proximaFase() {
  if (T.phase === 'prep') {
    beep(880, 0.15);
    iniciarFase('work', T.steps[0].work);
    atualizarDisplay();
    return;
  }
  if (T.phase === 'work') {
    T.elapsed += T.steps[T.i].work;
    beep(660, 0.2);
    const ultimo = T.i === T.steps.length - 1;
    if (ultimo) {
      finalizar();
      return;
    }
    iniciarFase('rest', T.steps[T.i].rest);
    atualizarDisplay();
    return;
  }
  if (T.phase === 'rest') {
    T.elapsed += T.steps[T.i].rest;
    T.i++;
    beep(880, 0.15);
    iniciarFase('work', T.steps[T.i].work);
    atualizarDisplay();
  }
}

function pularFase() {
  if (T.phase === 'prep' || T.phase === 'work' || T.phase === 'rest') proximaFase();
}

function alternarPausa() {
  if (T.phase === 'idle' || T.phase === 'done') return;
  if (T.timerId) {
    clearInterval(T.timerId);
    T.timerId = null;
    T.remaining = Math.max(0, (T.endTime - Date.now()) / 1000);
    atualizarDisplay();
    $('#btn-pausa').textContent = '▶ Continuar';
  } else {
    T.endTime = Date.now() + T.remaining * 1000;
    T.timerId = setInterval(tick, 200);
    $('#btn-pausa').textContent = '⏸ Pausar';
  }
}

function zerarTimer() {
  clearInterval(T.timerId);
  T.timerId = null;
  T.phase = 'idle';
  T.steps = [];
  renderTimer();
}

function finalizar() {
  clearInterval(T.timerId);
  T.timerId = null;
  T.phase = 'done';
  beep(988, 0.18);
  setTimeout(() => beep(1319, 0.3), 220);
  renderTimer();
}

function registrarConcluido() {
  const nome = T.mode === 'guiado' ? workoutById(T.workoutId).nome : 'Treino livre';
  addLog(nome, Math.max(1, Math.round(T.elapsed / 60)));
  zerarTimer();
}

// --- renderização ---

function renderTimer() {
  const ui = $('#timer-ui');

  if (T.phase === 'idle') {
    let config;
    if (T.mode === 'guiado') {
      const tSel = workoutById(T.workoutId);
      const rounds = roundsAtuais();
      config = `
        <div class="escolha-treino">
          ${WORKOUTS.map(
            (t) => `
            <button class="escolha-item ${t.id === T.workoutId ? 'selected' : ''}" onclick="selecionarTreinoTimer('${t.id}')">
              <span>${t.emoji}</span>
              <span>${t.nome}</span>
              <span class="meta">~${duracaoEstimada(t)} min · ${t.nivel}</span>
            </button>`
          ).join('')}
        </div>
        <div class="rounds-row">
          <span class="rotulo">Rounds</span>
          <span class="total">~${duracaoComRounds(tSel, rounds)} min no total</span>
          <div class="stepper">
            <button onclick="ajustarRounds(-1)" aria-label="Menos um round">−</button>
            <span>${rounds}</span>
            <button onclick="ajustarRounds(1)" aria-label="Mais um round">+</button>
          </div>
        </div>`;
    } else {
      config = `
        <div class="custom-grid">
          <label>Trabalho (s)<input id="custom-work" type="number" min="5" max="600" value="${T.custom.work}"></label>
          <label>Descanso (s)<input id="custom-rest" type="number" min="0" max="300" value="${T.custom.rest}"></label>
          <label>Rounds<input id="custom-rounds" type="number" min="1" max="30" value="${T.custom.rounds}"></label>
        </div>`;
    }

    ui.innerHTML = `
      <div class="timer-modes">
        <button class="chip ${T.mode === 'guiado' ? 'active' : ''}" onclick="setModo('guiado')">Treino guiado</button>
        <button class="chip ${T.mode === 'custom' ? 'active' : ''}" onclick="setModo('custom')">Personalizado</button>
      </div>
      ${config}
      <button class="btn big" onclick="iniciarTimer()">▶ Começar</button>`;
    return;
  }

  if (T.phase === 'done') {
    const nome = T.mode === 'guiado' ? workoutById(T.workoutId).nome : 'Treino livre';
    ui.innerHTML = `
      <div class="concluido">
        <div class="emoji">🎉</div>
        <h3>${nome} concluído!</h3>
        <p>~${Math.max(1, Math.round(T.elapsed / 60))} minutos de evolução.</p>
        <div class="acoes">
          <button class="btn accent big" onclick="registrarConcluido()">✓ Registrar no progresso</button>
          <button class="btn ghost" onclick="zerarTimer()">Voltar ao timer</button>
        </div>
      </div>`;
    return;
  }

  ui.innerHTML = `
    <div class="timer-arena">
      <div class="fase-label" id="timer-label"></div>
      <div class="fase-sub" id="timer-sub"></div>
      <div class="ring-wrap">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
            <linearGradient id="gradRingRest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34d399"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="60" cy="60" r="54"></circle>
          <circle class="ring-fg" id="ring" cx="60" cy="60" r="54"
            stroke-dasharray="${RING_C}" stroke-dashoffset="0"></circle>
        </svg>
        <div class="ring-center">
          <div class="tempo" id="timer-tempo">0:00</div>
          <div class="fase" id="timer-fase"></div>
        </div>
      </div>
      <div class="prox" id="timer-prox"></div>
      <div class="timer-controles">
        <button class="btn-circle" title="Reiniciar" onclick="zerarTimer()">⟲</button>
        <button class="btn big" id="btn-pausa" onclick="alternarPausa()">⏸ Pausar</button>
        <button class="btn-circle" title="Pular fase" onclick="pularFase()">⏭</button>
      </div>
    </div>`;
  atualizarDisplay();
}

function atualizarDisplay() {
  const tempo = $('#timer-tempo');
  if (!tempo) return; // arena não está montada

  tempo.textContent = fmtMinSeg(T.remaining);
  const faseEl = $('#timer-fase');
  const label = $('#timer-label');
  const sub = $('#timer-sub');
  const prox = $('#timer-prox');
  const ring = $('#ring');

  ring.style.strokeDashoffset = RING_C * (1 - T.remaining / T.total);
  ring.classList.toggle('rest', T.phase === 'rest' || T.phase === 'prep');

  const step = T.steps[T.i];
  if (T.phase === 'prep') {
    label.textContent = 'Prepare-se…';
    sub.textContent = T.mode === 'guiado' ? workoutById(T.workoutId).nome : 'Treino personalizado';
    faseEl.textContent = 'começando';
    prox.textContent = `Primeiro: ${T.steps[0].label}`;
  } else if (T.phase === 'work') {
    label.textContent = step.label;
    sub.textContent = step.sub;
    faseEl.textContent = `exercício ${T.i + 1}/${T.steps.length}`;
    const next = T.steps[T.i + 1];
    prox.textContent = next ? `A seguir: ${next.label}` : 'Último exercício!';
  } else if (T.phase === 'rest') {
    label.textContent = 'Descanso 💨';
    sub.textContent = 'Respire fundo e recupere';
    faseEl.textContent = 'descanso';
    const next = T.steps[T.i + 1];
    prox.textContent = next ? `A seguir: ${next.label}` : '';
  }
}

// ---------------- Progresso ----------------

function renderProgresso() {
  const logs = getLogs();
  const total = logs.length;
  const semana = logsUltimos7Dias();
  const mins = semana.reduce((s, l) => s + l.minutos, 0);
  const qtd = semana.length;

  // gráfico: últimos 7 dias
  const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const colunas = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = isoDate(d);
    const m = logs.filter((l) => l.data === iso).reduce((s, l) => s + l.minutos, 0);
    colunas.push({ dia: DIAS[d.getDay()], m, hoje: i === 0 });
  }
  const max = Math.max(...colunas.map((c) => c.m), 1);

  const grafico = colunas
    .map(
      (c) => `
      <div class="col">
        <span class="mins">${c.m ? c.m + '′' : ''}</span>
        <div class="barra ${c.m ? 'com-min' : ''}" style="height:${c.m ? Math.max(12, (c.m / max) * 100) : 4}%"></div>
        <span class="dia" style="${c.hoje ? 'color:var(--text);font-weight:700' : ''}">${c.dia}</span>
      </div>`
    )
    .join('');

  // metas
  const metas = getMetas();
  const pctTreinos = Math.min(100, Math.round((qtd / metas.treinos) * 100));
  const pctMinutos = Math.min(100, Math.round((mins / metas.minutos) * 100));
  const metasBatidas = qtd >= metas.treinos && mins >= metas.minutos;

  const historico = logs.length
    ? logs
        .slice(-12)
        .reverse()
        .map((l) => {
          const [a, m, d] = l.data.split('-');
          return `<div class="hist-item"><span>✅ ${l.treino}</span><span>${l.minutos} min</span><span class="data">${d}/${m}/${a}</span></div>`;
        })
        .join('')
    : `<div class="vazio">Nenhum treino registrado ainda.<br>Complete um treino e ele aparece aqui. 💜</div>`;

  $('#progresso-ui').innerHTML = `
    <div class="stats-row">
      <div class="stat-card"><div class="valor fogo">🔥 ${streak()}</div><div class="rotulo">dias seguidos</div></div>
      <div class="stat-card"><div class="valor">${total}</div><div class="rotulo">treinos feitos</div></div>
      <div class="stat-card"><div class="valor verde">${mins}</div><div class="rotulo">min · últimos 7 dias</div></div>
    </div>

    <div class="chart-card" style="margin-top:14px">
      <div class="metas-head">
        <h3>🎯 Metas da semana</h3>
        <button class="btn ghost mini" onclick="abrirMetas()">Editar</button>
      </div>
      <div class="meta-linha">
        <div class="meta-info">
          <span>🏋️ ${qtd}/${metas.treinos} treinos</span>
          <span class="pct">${pctTreinos}%</span>
        </div>
        <div class="meta-bar"><div class="meta-fill ${pctTreinos >= 100 ? 'ok' : ''}" style="width:${pctTreinos}%"></div></div>
      </div>
      <div class="meta-linha" style="margin-bottom:0">
        <div class="meta-info">
          <span>⏱️ ${mins}/${metas.minutos} minutos</span>
          <span class="pct">${pctMinutos}%</span>
        </div>
        <div class="meta-bar"><div class="meta-fill ${pctMinutos >= 100 ? 'ok' : ''}" style="width:${pctMinutos}%"></div></div>
      </div>
      ${metasBatidas ? '<div class="meta-ok">🏆 Metas batidas! Você tá evoluindo de verdade.</div>' : ''}
    </div>

    <div class="chart-card">
      <h3>Minutos treinados · últimos 7 dias</h3>
      <div class="chart">${grafico}</div>
    </div>

    <h2 class="section-title" style="margin-top:8px">Histórico</h2>
    <div class="historico">${historico}</div>
    ${logs.length ? '<button class="link-limpar" onclick="limparHistorico()">Limpar histórico</button>' : ''}`;
}

function limparHistorico() {
  if (confirm('Apagar todo o histórico de treinos?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderProgresso();
    renderHome();
    toast('Histórico apagado');
  }
}

// ---------------- PWA: instalação ----------------

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  renderHome(); // mostra o botão de instalar se estivermos na home
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  toast('📲 Shadow-Evolve instalado!');
});

function instalarApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    renderHome();
  });
}

// ---------------- Inicialização ----------------

function init() {
  $('#data-hoje').textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  $$('.nav-btn').forEach((b) => b.addEventListener('click', () => switchView(b.dataset.view)));
  $('#modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('#modal-overlay')) fecharModal();
  });

  renderHome();
  renderTreinos();
  renderTimer();
  renderProgresso();

  // registra o service worker (PWA / offline)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
}

init();

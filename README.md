# 🌑 Shadow-Evolve

Aplicativo de treino em casa — sem equipamento, só você e sua evolução.

## ✨ Funcionalidades

- **Início** — saudação, streak de dias seguidos 🔥, treino do dia (plano semanal), estatísticas rápidas e botão de instalação do app.
- **Treinos** — 9 treinos sem equipamento, do Iniciante ao Avançado:
  - ☀️ Aquecimento Rápido · 🌅 Despertar · 🔥 Evolução Diária · ⚡ Cardio Express · 🌑 Modo Sombra · 🧱 Core de Aço · 🦵 Pernas Fortes · 💪 Braços & Ombros · 🧘 Alongamento Zen
  - Detalhes de cada treino com tempos de trabalho/descanso, mais biblioteca de 14 exercícios com dicas de execução.
- **Timer** — modo *treino guiado* (segue a sequência do treino, com **rounds ajustáveis de 1 a 12**, anel de progresso, contagem regressiva sonora e "a seguir") e modo *personalizado* (trabalho / descanso / rounds).
- **Progresso** — registro de treinos, **metas semanais configuráveis** (treinos + minutos) com barras de progresso, gráfico dos últimos 7 dias, streak e histórico. Dados no navegador (localStorage).
- **PWA** — instalável no celular/desktop (manifest + ícones) e funciona offline via service worker.

## 🛠️ Tecnologias

Web app estático, sem build: **HTML + CSS + JavaScript puro** (PWA nativo).

```
index.html          → estrutura das 4 telas (SPA com navegação inferior)
styles.css          → tema escuro com acentos neon
data.js             → treinos, plano semanal e biblioteca de exercícios
app.js              → navegação, timer HIIT, metas, progresso, PWA
manifest.webmanifest→ instalação como app
sw.js               → service worker (offline)
icons/              → ícones 192/512
```

## ▶️ Como rodar

Abra `index.html` no navegador, ou sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 3000
```

E acesse http://localhost:3000 — no celular, use o botão "Instalar" ou o menu do navegador ("Adicionar à tela inicial").

## 🗺️ Próximos passos

- [ ] Timer com contagem por voz (text-to-speech)
- [ ] Sons personalizáveis / vibração
- [ ] Sincronização de progresso entre dispositivos
- [ ] Modo claro/escuro

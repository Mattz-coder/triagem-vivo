(function(){
  // ==== CONFIGURAÇÃO DE REDIRECIONAMENTO ====
  // Troque estas URLs pelas páginas reais da Vivo para cada nível.
  // Deixe vazio ("") para não redirecionar automaticamente por nível
  // (nesse caso, cai na REDIRECT_URL_DEFAULT).
  const REDIRECT_URLS = {
    baixo: "https://www.vivo.com.br/atendimento-simplificado",
    medio: "https://www.vivo.com.br/atendimento",
    alto:  "https://www.vivo.com.br/atendimento-rapido",
  };
  const REDIRECT_URL_DEFAULT = "https://www.vivo.com.br/";
  // Se true, adiciona o nível como parâmetro na URL (?nivel=baixo)
  const APPEND_LEVEL_PARAM = true;

  const questions = [
    {
      text: "1. Você já usa aplicativos de banco ou de compras pelo celular?",
      options: [
        { label: "Sim, com frequência", pts: 3 },
        { label: "Às vezes", pts: 2 },
        { label: "Nunca", pts: 0 },
        { label: "Não sei dizer", pts: 0 },
      ]
    },
    {
      text: "2. Como você prefere aprender a usar algo novo em um aplicativo?",
      options: [
        { label: "Sozinho, explorando o app", pts: 3 },
        { label: "Com um tutorial em texto", pts: 2 },
        { label: "Com um vídeo explicando", pts: 1 },
        { label: "Prefiro que alguém me explique", pts: 0 },
      ]
    },
    {
      text: "3. Quando encontra um erro no celular ou app, o que você faz?",
      options: [
        { label: "Tento resolver sozinho", pts: 3 },
        { label: "Pesquiso a solução na internet", pts: 2 },
        { label: "Peço ajuda a alguém", pts: 1 },
        { label: "Desisto da tarefa", pts: 0 },
      ]
    },
    {
      text: "4. Com que frequência você usa a internet no dia a dia?",
      options: [
        { label: "Várias vezes ao dia", pts: 3 },
        { label: "Todo dia", pts: 2 },
        { label: "Algumas vezes por semana", pts: 1 },
        { label: "Raramente", pts: 0 },
      ]
    },
    {
      text: "5. Você se sente confortável digitando em um teclado de celular ou computador?",
      options: [
        { label: "Sim, totalmente", pts: 2 },
        { label: "Mais ou menos", pts: 1 },
        { label: "Prefiro falar ou tocar em vez de digitar", pts: 0 },
      ]
    },
  ];

  const levels = {
    baixo: {
      label: "Nível Baixo",
      pillClass: "level-baixo",
      range: [0, 4],
      title: "Atendimento simplificado",
      text: "Você vai ver telas com linguagem simples, uma ação por vez, confirmação a cada passo e a opção de assistir um vídeo curto ou falar direto com um atendente quando quiser."
    },
    medio: {
      label: "Nível Médio",
      pillClass: "level-medio",
      range: [5, 9],
      title: "Atendimento com apoio sob demanda",
      text: "Você vai ver um fluxo mais direto, com tutoriais disponíveis quando precisar, sem etapas extras de confirmação em cada tela."
    },
    alto: {
      label: "Nível Alto",
      pillClass: "level-alto",
      range: [10, 14],
      title: "Atendimento rápido",
      text: "Você vai ver um modo rápido, com atalhos e menos telas de confirmação, direto ao ponto."
    }
  };

  const MAX_SCORE = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.pts)), 0);

  let current = 0;
  const answers = new Array(questions.length).fill(null);

  const form = document.getElementById('quizForm');
  const introBlock = document.getElementById('introBlock');
  const progressText = document.getElementById('progressText');
  const progressPct = document.getElementById('progressPct');
  const progressFill = document.getElementById('progressFill');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const hintText = document.getElementById('hintText');
  const resultSection = document.getElementById('result');
  const quizCard = document.getElementById('quizCard');

  function buildQuestions(){
    questions.forEach((q, qi) => {
      const wrap = document.createElement('div');
      wrap.className = 'question';
      wrap.id = 'q' + qi;
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-labelledby', 'qtext' + qi);

      const p = document.createElement('p');
      p.className = 'qtext';
      p.id = 'qtext' + qi;
      p.textContent = q.text;
      wrap.appendChild(p);

      const ul = document.createElement('ul');
      ul.className = 'options';

      q.options.forEach((opt, oi) => {
        const li = document.createElement('li');
        li.className = 'option';
        const inputId = 'q' + qi + '_o' + oi;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.id = inputId;
        input.value = oi;

        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = opt.label;

        input.addEventListener('change', () => {
          answers[qi] = opt.pts;
          [...ul.children].forEach(c => c.classList.remove('selected'));
          li.classList.add('selected');
          hintText.textContent = '';
        });

        li.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') input.click();
        });

        li.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);
      });

      wrap.appendChild(ul);
      form.appendChild(wrap);
    });
  }

  function showQuestion(i){
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    document.getElementById('q' + i).classList.add('active');
    introBlock.style.display = i === 0 ? 'block' : 'none';
    progressText.textContent = 'Pergunta ' + (i + 1) + ' de ' + questions.length;
    const pct = Math.round(((i + 1) / questions.length) * 100);
    progressPct.textContent = pct + '%';
    progressFill.style.width = pct + '%';
    btnBack.style.visibility = i === 0 ? 'hidden' : 'visible';
    btnNext.textContent = i === questions.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
    hintText.textContent = '';
  }

  function calcLevel(score){
    if (score <= levels.baixo.range[1]) return 'baixo';
    if (score <= levels.medio.range[1]) return 'medio';
    return 'alto';
  }

  function showResult(){
    const score = answers.reduce((a, b) => a + b, 0);
    const levelKey = calcLevel(score);
    const level = levels[levelKey];

    quizCard.querySelector('.progress-wrap').style.display = 'none';
    form.style.display = 'none';
    document.querySelector('.nav').style.display = 'none';
    introBlock.style.display = 'none';
    hintText.style.display = 'none';

    document.getElementById('scoreNum').textContent = score;
    const pill = document.getElementById('levelPill');
    pill.textContent = level.label;
    pill.className = 'level-pill ' + level.pillClass;

    const pct = (score / MAX_SCORE) * 100;
    document.getElementById('gaugeFill').style.width = pct + '%';
    document.getElementById('gaugeMarker').style.left = pct + '%';

    document.getElementById('expTitle').textContent = level.title;
    document.getElementById('expText').textContent = level.text;

    const tbody = document.getElementById('breakdownBody');
    tbody.innerHTML = '';
    questions.forEach((q, i) => {
      const tr = document.createElement('tr');
      const tdLabel = document.createElement('td');
      tdLabel.textContent = 'Pergunta ' + (i + 1);
      const tdPts = document.createElement('td');
      tdPts.className = 'pts';
      tdPts.textContent = answers[i] + ' pts';
      tr.appendChild(tdLabel);
      tr.appendChild(tdPts);
      tbody.appendChild(tr);
    });

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // guarda o nível calculado para o botão de redirecionamento usar
    resultSection.dataset.levelKey = levelKey;
  }

  function buildRedirectUrl(levelKey){
    let url = REDIRECT_URLS[levelKey] || REDIRECT_URL_DEFAULT;
    if (APPEND_LEVEL_PARAM) {
      const sep = url.includes('?') ? '&' : '?';
      url += sep + 'nivel=' + encodeURIComponent(levelKey);
    }
    return url;
  }

  btnNext.addEventListener('click', () => {
    if (answers[current] === null) {
      hintText.textContent = 'Escolha uma opção para continuar.';
      return;
    }
    if (current < questions.length - 1) {
      current++;
      showQuestion(current);
    } else {
      showResult();
    }
  });

  btnBack.addEventListener('click', () => {
    if (current > 0) {
      current--;
      showQuestion(current);
    }
  });

  document.getElementById('btnContinue').addEventListener('click', () => {
    const levelKey = resultSection.dataset.levelKey;
    window.location.href = buildRedirectUrl(levelKey);
  });

  document.getElementById('btnRestart').addEventListener('click', () => {
    current = 0;
    answers.fill(null);
    document.querySelectorAll('.option.selected').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
    quizCard.querySelector('.progress-wrap').style.display = 'block';
    form.style.display = 'block';
    document.querySelector('.nav').style.display = 'flex';
    hintText.style.display = 'block';
    resultSection.style.display = 'none';
    showQuestion(0);
    quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.fontctrl button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fontctrl button').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const size = btn.dataset.size;
      document.documentElement.setAttribute('data-fontsize', size === 'normal' ? '' : size);
    });
  });

  buildQuestions();
  showQuestion(0);
})();

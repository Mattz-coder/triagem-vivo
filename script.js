(function(){
  // ==================================================================
  // CONFIGURAÇÃO — troque pelos links/dados reais
  // ==================================================================
  const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5511900000000";

  // ==================================================================
  // ÍCONES (SVG simples, sem uso de logos/imagens de terceiros)
  // ==================================================================
  const ICONS = {
    recarga: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 3-4 7h3v6l4-7h-3z"/></svg>',
    conta:   '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8zm0 4h8v2H8zm0-8h4v2H8z"/></svg>',
    plano:   '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM7 15V5h10v10H7z"/></svg>',
    ajuda:   '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.9 15.5h-1.9v-1.9h1.9v1.9zm1.97-7.2c-.5.72-1 .95-1.34 1.55-.16.29-.22.48-.22 1.4h-1.8v-.45c0-.68.16-1.15.6-1.72.32-.42.9-.72 1.24-1.13.34-.4.49-.98.14-1.5-.3-.44-.86-.62-1.4-.5-.5.1-.87.5-.97 1h-1.9c.14-1.6 1.42-2.75 2.98-2.75 1.32 0 2.42.72 2.84 1.85.34.9.14 1.68-.17 2.25z"/></svg>',
    back:    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 4l-8 8 8 8 1.4-1.4L9.8 12l6.6-6.6z"/></svg>',
    speaker: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 9v6h4l5 5V4L8 9H4zm11.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    check:   '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
  };

  // ==================================================================
  // LEITURA EM VOZ ALTA (Web Speech API)
  // ==================================================================
  function speak(text){
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  function listenButton(text){
    return '<button type="button" class="btn-listen" data-speak="' + text.replace(/"/g,'&quot;') + '">' +
      ICONS.speaker + '<span>Ouvir</span></button>';
  }

  // ==================================================================
  // CONTROLE DE FONTE
  // ==================================================================
  function applyFontSize(size){
    document.documentElement.setAttribute('data-fontsize', size === 'normal' ? '' : size);
    document.querySelectorAll('.fontctrl button').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.size === size ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.fontctrl button').forEach(btn => {
    btn.addEventListener('click', () => applyFontSize(btn.dataset.size));
  });

  // ==================================================================
  // NAVEGAÇÃO POR TELAS
  // ==================================================================
  const app = document.getElementById('app');
  let history = ['home'];

  function backRow(){
    return history.length > 1
      ? '<div class="backrow"><button type="button" class="btn-back" id="btnGoBack">' + ICONS.back + '<span>Voltar</span></button></div>'
      : '';
  }

  function go(viewId){
    history.push(viewId);
    render(viewId);
  }
  function goBack(){
    if (history.length <= 1) return;
    history.pop();
    render(history[history.length - 1]);
  }
  function goHome(){
    history = ['home'];
    render('home');
  }

  // ==================================================================
  // TELAS
  // ==================================================================
  const VIEWS = {

    home(){
      return `
        ${backRow()}
        <h1 class="screen-title">Olá! Como podemos ajudar?</h1>
        <p class="screen-sub">Toque em um dos botões abaixo</p>
        <div class="card-grid">
          <button type="button" class="bigcard" data-go="recarga">
            <span class="bigcard-icon">${ICONS.recarga}</span>
            <span class="bigcard-label">Fazer uma recarga</span>
          </button>
          <button type="button" class="bigcard" data-go="conta">
            <span class="bigcard-icon">${ICONS.conta}</span>
            <span class="bigcard-label">Ver minha conta</span>
          </button>
          <button type="button" class="bigcard" data-go="plano">
            <span class="bigcard-icon">${ICONS.plano}</span>
            <span class="bigcard-label">Meu plano</span>
          </button>
          <button type="button" class="bigcard" data-go="ajuda">
            <span class="bigcard-icon">${ICONS.ajuda}</span>
            <span class="bigcard-label">Central de ajuda</span>
          </button>
        </div>
      `;
    },

    recarga(){
      return `
        ${backRow()}
        <h1 class="screen-title">Fazer uma recarga</h1>
        ${listenButton('Toque no valor que você quer colocar de crédito no seu celular.')}
        <p class="screen-sub">Escolha o valor</p>
        <div class="choice-list">
          <button type="button" class="choice-btn" data-go="recarga-confirma" data-valor="15"><span class="dot"></span> R$ 15</button>
          <button type="button" class="choice-btn" data-go="recarga-confirma" data-valor="20"><span class="dot"></span> R$ 20</button>
          <button type="button" class="choice-btn" data-go="recarga-confirma" data-valor="30"><span class="dot"></span> R$ 30</button>
          <button type="button" class="choice-btn" data-go="recarga-confirma" data-valor="50"><span class="dot"></span> R$ 50</button>
        </div>
      `;
    },

    'recarga-confirma'(valor){
      const v = valor || '20';
      return `
        ${backRow()}
        <h1 class="screen-title">Confirmar recarga</h1>
        <div class="value-box">
          <span class="value">R$ ${v},00</span>
          <span class="value-caption">Valor da recarga</span>
        </div>
        ${listenButton('Confirmar recarga de ' + v + ' reais?')}
        <button type="button" class="btn-primary-lg" data-go="recarga-sucesso">Confirmar</button>
        <button type="button" class="btn-secondary-lg" data-go="recarga">Escolher outro valor</button>
      `;
    },

    'recarga-sucesso'(){
      return `
        <div class="success-box">
          <div class="success-icon">${ICONS.check}</div>
          <h1 class="screen-title">Recarga feita!</h1>
          <p class="screen-sub">Seu celular já está com o novo crédito.</p>
          ${listenButton('Sua recarga foi feita com sucesso.')}
          <button type="button" class="btn-primary-lg" data-gohome="1">Voltar ao início</button>
        </div>
      `;
    },

    conta(){
      return `
        ${backRow()}
        <h1 class="screen-title">Minha conta</h1>
        <div class="value-box">
          <span class="value">R$ 89,90</span>
          <span class="value-caption">Vence dia 20 deste mês</span>
        </div>
        ${listenButton('Sua conta é de 89 reais e 90 centavos. Vence no dia 20 deste mês.')}
        <button type="button" class="btn-primary-lg" data-go="conta-sucesso">Pagar agora</button>
        <button type="button" class="btn-secondary-lg" data-go="conta-sucesso">Já paguei essa conta</button>
      `;
    },

    'conta-sucesso'(){
      return `
        <div class="success-box">
          <div class="success-icon">${ICONS.check}</div>
          <h1 class="screen-title">Tudo certo!</h1>
          <p class="screen-sub">Sua conta está em dia.</p>
          ${listenButton('Sua conta está em dia.')}
          <button type="button" class="btn-primary-lg" data-gohome="1">Voltar ao início</button>
        </div>
      `;
    },

    plano(){
      return `
        ${backRow()}
        <h1 class="screen-title">Meu plano</h1>
        <div class="value-box">
          <span class="value">20 GB</span>
          <span class="value-caption">Plano Vivo Turbo — internet para usar no celular</span>
        </div>
        <p class="screen-sub">Você já usou 12 GB dos 20 GB deste mês</p>
        <div class="meter"><div class="meter-fill" style="width:60%"></div></div>
        ${listenButton('Seu plano é o Vivo Turbo, de 20 gigabytes. Você já usou 12 gigabytes.')}
        <button type="button" class="btn-primary-lg" data-whatsapp="1">Quero aumentar meu plano</button>
      `;
    },

    ajuda(){
      const faqs = [
        { q: 'Como faço uma recarga?', a: 'Toque em "Fazer uma recarga" na tela inicial e escolha o valor.' },
        { q: 'Como sei se minha conta está paga?', a: 'Toque em "Ver minha conta" para ver o valor e a data.' },
        { q: 'Esqueci minha senha, e agora?', a: 'Toque em "Falar com uma pessoa" no botão roxo no rodapé da tela.' },
      ];
      return `
        ${backRow()}
        <h1 class="screen-title">Central de ajuda</h1>
        ${listenButton('Aqui estão as perguntas mais comuns.')}
        ${faqs.map(f => `
          <div class="faq-item">
            <p class="faq-q">${ICONS.ajuda.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" width="24" height="24"')} ${f.q}</p>
            <p class="faq-a">${f.a}</p>
          </div>
        `).join('')}
        <button type="button" class="btn-primary-lg" data-whatsapp="1">Falar com uma pessoa</button>
      `;
    },
  };

  function render(viewId, arg){
    app.innerHTML = VIEWS[viewId](arg);
  }

  // ==================================================================
  // EVENTOS (delegação — cobre elementos recriados a cada tela)
  // ==================================================================
  app.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('[data-speak]');
    if (speakBtn) { speak(speakBtn.dataset.speak); return; }

    const backBtn = e.target.closest('#btnGoBack');
    if (backBtn) { goBack(); return; }

    const homeBtn = e.target.closest('[data-gohome]');
    if (homeBtn) { goHome(); return; }

    const waBtn = e.target.closest('[data-whatsapp]');
    if (waBtn) { window.location.href = WHATSAPP_URL; return; }

    const goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      const target = goBtn.dataset.go;
      const valor = goBtn.dataset.valor;
      history.push(target);
      render(target, valor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('btnHelp').addEventListener('click', () => {
    window.location.href = WHATSAPP_URL;
  });

  // ==================================================================
  // INÍCIO
  // ==================================================================
  applyFontSize('lg'); // este site já entra com fonte ampliada por padrão
  render('home');
})();

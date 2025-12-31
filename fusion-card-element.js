// fusion-card-element.js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host{all:initial;display:block;font-family:Montserrat,system-ui,Arial,sans-serif;color:#fff}
    :host *{box-sizing:border-box}
    :root{--bg-deep:#030406;--glass-surface:rgba(18,18,22,0.65);--glass-border:rgba(255,255,255,0.06);--neon-cyan:#00f2ff;--neon-purple:#bd00ff;--neon-orange:#ff9a3c;--font-ui:'Montserrat',sans-serif;--font-code:monospace;--ease-overshoot:cubic-bezier(0.34,1.3,0.64,1);--ease-smooth:cubic-bezier(0.23,1,0.32,1)}
    .host-wrap{min-height:100vh;padding:12px;background:var(--bg-deep);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .ambient-light{position:absolute;inset:0;z-index:0;pointer-events:none}
    .blob{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.12;animation:float 25s infinite alternate ease-in-out}
    .blob-1{width:50vw;height:50vw;background:var(--neon-cyan);top:-20%;left:-20%}
    .blob-2{width:40vw;height:40vw;background:var(--neon-purple);bottom:-20%;right:-20%;animation-delay:-5s}
    @keyframes float{0%{transform:translate(0,0)}100%{transform:translate(40px,60px)}}
    .container{width:100%;max-width:640px;padding:20px;z-index:10;display:flex;align-items:center;justify-content:center;perspective:1200px}
    .fusion-card{width:100%;max-width:440px;background:var(--glass-surface);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid var(--glass-border);border-radius:36px;padding:30px 25px;box-shadow:0 40px 100px rgba(0,0,0,0.8);position:relative;overflow:hidden;opacity:0;transform:translateY(50px) scale(0.96);display:flex;flex-direction:column;gap:8px;will-change:width,padding,border-radius,box-shadow,transform}
    .fusion-card.active{opacity:1;transform:translateY(0) scale(1);transition:opacity .6s,transform .6s var(--ease-smooth)}
    .fusion-card.closed{width:260px;padding:14px 16px;border-radius:22px;box-shadow:0 22px 70px rgba(0,0,0,0.75);cursor:pointer}
    .fusion-card.closed .card-header{gap:10px;margin-bottom:0}
    .fusion-card.closed .brand-dual{font-size:1.3rem;margin-top:0;letter-spacing:-1px}
    .fusion-card.closed .greeting-row{font-size:1rem}
    .fusion-card.closed .txt-thin{display:none}
    .fusion-card.closed .card-body{display:none}
    .fusion-card.closed .avatar-slot{width:52px;height:52px}
    .fusion-card.animating{transition:none!important}
    .card-header{display:flex;align-items:center;gap:15px;margin-bottom:18px;transition:margin .3s}
    .avatar-slot{width:64px;height:64px;flex-shrink:0;border-radius:12px;overflow:hidden;opacity:0;transition:opacity .35s}
    .avatar-slot.shown{opacity:1}
    .text-block{flex:1;display:flex;flex-direction:column;justify-content:center}
    .greeting-row{font-size:1.5rem;line-height:1;display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}
    .txt-thin{font-weight:200;color:rgba(255,255,255,0.7)}
    .txt-heavy{font-weight:600;color:#fff}
    .brand-dual{font-size:2.2rem;font-weight:900;line-height:0.95;text-transform:uppercase;letter-spacing:-2px;margin-top:4px;background:linear-gradient(-45deg,#fff,var(--neon-cyan),var(--neon-purple),#fff);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientFlow 4s ease infinite}
    @keyframes gradientFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .clock-widget{text-align:right}
    .time-display{font-family:var(--font-code);font-size:1rem;color:rgba(255,255,255,0.5);font-weight:700}
    .status-led{font-size:.6rem;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:1px;margin-top:4px;display:block}
    .card-body{display:flex;flex-direction:column;gap:12px}
    .stagger-item{opacity:0;transform:translateY(15px);transition:opacity .4s ease, transform .4s var(--ease-overshoot)}
    .content-visible .stagger-item{opacity:1;transform:translateY(0)}
    .content-visible .stagger-item:nth-child(1){transition-delay:.1s}
    .content-visible .stagger-item:nth-child(2){transition-delay:.18s}
    .content-visible .stagger-item:nth-child(3){transition-delay:.25s}
    .input-wrapper{position:relative}
    .cyber-input{width:100%;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px 50px 16px 18px;color:#fff;font-family:var(--font-code);font-size:.9rem;transition:.2s}
    .cyber-input:focus{border-color:var(--neon-cyan);box-shadow:0 0 15px rgba(0,242,255,.08);background:rgba(0,0,0,.5)}
    .input-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3)}
    .trigger-btn{width:100%;padding:12px;border:1px dashed rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.02);color:rgba(255,255,255,.5);font-size:.75rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:8px}
    .trigger-btn:hover{background:rgba(255,255,255,.04);color:#fff;border-color:rgba(255,255,255,.3)}
    .hidden-modules{display:grid;grid-template-rows:0fr;opacity:.6;transition:all 420ms var(--ease-smooth)}
    .fusion-card.open .hidden-modules{grid-template-rows:1fr;opacity:1;margin-top:10px}
    .modules-inner{overflow:hidden;display:flex;flex-direction:column;gap:12px;padding-top:2px}
    .stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
    .stat-box{background:rgba(255,255,255,.03);border-radius:12px;padding:10px;text-align:center;border:1px solid transparent;transition:.2s}
    .stat-box:hover{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.06)}
    .stat-lbl{font-size:.55rem;text-transform:uppercase;color:rgba(255,255,255,.4);display:block;margin-bottom:4px}
    .stat-val{font-family:var(--font-code);font-size:.9rem;font-weight:700;color:var(--neon-cyan)}
    .progress-container{background:rgba(0,0,0,.2);padding:12px;border-radius:12px}
    .bar-track{height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;margin:8px 0}
    .bar-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-purple));box-shadow:0 0 10px var(--neon-cyan);transition:width 1.2s ease-out}
    .bar-meta{display:flex;justify-content:space-between;font-size:.6rem;color:rgba(255,255,255,.4);font-family:var(--font-code)}
    .html-module-slot{border:1px solid var(--neon-orange);background:rgba(255,154,60,.05);border-radius:12px;padding:12px;min-height:56px;display:flex;align-items:center;justify-content:center;color:var(--neon-orange);font-size:.7rem;font-family:var(--font-code);text-align:center}
    .small-preview{display:none;align-items:center;gap:10px;margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.03);font-family:var(--font-code);font-size:.86rem;color:rgba(255,255,255,.9);cursor:pointer;overflow:hidden}
    .small-preview .mini-avatar{width:30px;height:30px;border-radius:6px;flex-shrink:0;overflow:hidden;display:inline-flex;align-items:center;justify-content:center}
    .small-preview .small-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 110px)}
    .small-preview .ident-badge{margin-left:auto;font-weight:700;font-size:.78rem;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.03);color:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.02)}
    .fusion-card.closed .small-preview{display:flex}
    .vibe-gold{box-shadow:0 0 0px rgba(255,210,80,0);animation:vibePulse 1.6s infinite;border:1px solid rgba(255,210,80,.15)}
    @keyframes vibePulse{0%{box-shadow:0 0 0 0 rgba(255,210,80,0);transform:translateY(0)}40%{box-shadow:0 0 18px 6px rgba(255,210,80,.06);transform:translateY(-1px) scale(1.01)}100%{box-shadow:0 0 0 0 rgba(255,210,80,0);transform:translateY(0)}}
    .activation-wrap{display:flex;flex-direction:column;gap:8px;margin-top:6px}
    .activation-toggle{display:flex;align-items:center;gap:8px;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.04);cursor:pointer;background:rgba(255,255,255,.02)}
    .activation-card{background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.03);padding:12px;border-radius:12px;overflow:hidden;transition:all 280ms var(--ease-smooth)}
    .activation-pre{font-family:var(--font-code);white-space:pre-wrap;margin:0;padding:8px;background:rgba(0,0,0,.12);border-radius:8px;border:1px dashed rgba(255,255,255,.03);color:#fff}
    .activation-hidden{max-height:0;opacity:0;padding:0 12px;pointer-events:none}
    .activation-open{max-height:400px;opacity:1;padding:12px}
    .activation-controls{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
    .toaster{position:fixed;right:12px;bottom:12px;background:rgba(0,0,0,.8);padding:10px 14px;border-radius:8px;color:#fff;font-family:var(--font-code);font-size:.85rem;transform:translateY(8px);opacity:0;transition:all .26s}
    .toaster.show{opacity:1;transform:translateY(0)}
    @media (max-width:420px){ .fusion-card.closed{width:220px} .brand-dual{font-size:1rem} }
  </style>

  <div class="host-wrap" part="host">
    <div class="ambient-light" part="ambient">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="container" part="container">
      <div class="fusion-card closed" part="card" aria-expanded="false">
        <div class="card-header" part="header" role="button" tabindex="0" aria-controls="cardBody" aria-expanded="false">
          <div class="avatar-slot" part="avatar"></div>

          <div class="text-block">
            <div class="greeting-row">
              <span class="txt-thin" id="lblHello">Sistema</span>
              <span class="txt-heavy" id="lblName">Convidado</span>
            </div>
            <div class="brand-dual">DUAL</div>
          </div>

          <div class="clock-widget" aria-hidden="true">
            <div class="time-display" id="clockTime">00:00</div>
            <span class="status-led">ONLINE</span>
          </div>
        </div>

        <div class="small-preview" id="smallPreview" title="Clique para abrir e editar a ativação">
          <div class="mini-avatar" id="smallMiniAvatar" aria-hidden="true"></div>
          <div class="small-text" id="smallText">Ativação aparecerá aqui</div>
          <div class="ident-badge" id="smallIdent">--</div>
        </div>

        <div class="card-body" id="cardBody">
          <div class="input-wrapper stagger-item">
            <input type="text" class="cyber-input" id="inputUser" placeholder="Identifique-se..." autocomplete="off" />
            <span class="input-icon" id="iconFingerprint" title="fingerprint" aria-hidden="true"></span>
          </div>

          <div class="trigger-btn stagger-item" id="modulesToggle">
            <span id="triggerText">ABRIR MÓDULOS</span>
            <svg id="iconChevron" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5z"></path></svg>
          </div>

          <div class="activation-wrap stagger-item">
            <div class="activation-toggle" id="activationToggle" role="button" tabindex="0" aria-expanded="false">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
                <strong style="letter-spacing:1px">Ativação ASCII</strong>
              </div>
              <div style="margin-left:auto;font-size:.82rem;color:rgba(255,255,255,.6)">BASE v1</div>
            </div>

            <div id="activationCard" class="activation-card activation-hidden" aria-live="polite">
              <div style="display:flex;align-items:flex-start;gap:10px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="mini-avatar" id="actMiniAvatar" aria-hidden="true"></div>
                  <div style="display:flex;flex-direction:column;">
                    <div id="actTitle" style="font-weight:700">CÉREBRO-ORÁCULO — BASE v1</div>
                    <div style="font-size:.78rem;color:rgba(255,255,255,.55)">Ativar: <span id="actName">(Convidado).Dual Infodose</span></div>
                  </div>
                </div>
                <div style="margin-left:auto;display:flex;flex-direction:column;gap:6px;align-items:flex-end">
                  <div class="activation-badge" id="actBadge">v:--</div>
                  <div style="font-size:.72rem;color:rgba(255,255,255,.45)">Rolling system</div>
                </div>
              </div>

              <pre id="actPre" class="activation-pre" aria-hidden="false">
+------------------------------+
| CÉREBRO-ORÁCULO — BASE v1    |
+------------------------------+
Ativar: (Convidado).Dual Infodose
              </pre>

              <div class="activation-controls">
                <button class="trigger-btn" id="copyActBtn" type="button">COPIAR</button>
                <button class="trigger-btn" id="downloadActBtn" type="button">EXPORT PNG</button>
              </div>
            </div>
          </div>

          <div class="hidden-modules stagger-item" id="modulesArea">
            <div class="modules-inner">
              <div class="stats-grid">
                <div class="stat-box"><span class="stat-lbl">LATÊNCIA</span><span class="stat-val">12ms</span></div>
                <div class="stat-box"><span class="stat-lbl">CPU</span><span class="stat-val">FUSION</span></div>
                <div class="stat-box"><span class="stat-lbl">RITMO</span><span class="stat-val">BETA</span></div>
              </div>

              <div class="progress-container">
                <div class="bar-meta"><span>CICLO DIÁRIO</span><span id="cyclePercent">0%</span></div>
                <div class="bar-track"><div class="bar-fill" id="cycleFill"></div></div>
              </div>

              <div class="html-module-slot" id="htmlSlot">// MÓDULO EXTERNO — PRONTO PARA INJEÇÃO HTML</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="toasterWrap"></div>
  </div>
`;

class FusionCard extends HTMLElement {
  constructor(){
    super();
    this._shadow = this.attachShadow({mode:'open'});
    this._shadow.appendChild(template.content.cloneNode(true));
    // element refs
    this.$ = sel => this._shadow.querySelector(sel);
    this.card = this.$('.fusion-card');
    this.header = this.$('.card-header');
    this.avatarSlot = this.$('.avatar-slot');
    this.input = this.$('#inputUser');
    this.lblHello = this.$('#lblHello');
    this.lblName = this.$('#lblName');
    this.clock = this.$('#clockTime');
    this.triggerText = this.$('#triggerText');
    this.modulesToggle = this.$('#modulesToggle');
    this.modulesArea = this.$('#modulesArea');
    this.smallPreview = this.$('#smallPreview');
    this.smallMiniAvatar = this.$('#smallMiniAvatar');
    this.smallText = this.$('#smallText');
    this.smallIdent = this.$('#smallIdent');
    this.activationToggle = this.$('#activationToggle');
    this.activationCard = this.$('#activationCard');
    this.actPre = this.$('#actPre');
    this.actName = this.$('#actName');
    this.actMiniAvatar = this.$('#actMiniAvatar');
    this.actBadge = this.$('#actBadge');
    this.copyActBtn = this.$('#copyActBtn');
    this.downloadActBtn = this.$('#downloadActBtn');
    this.cycleFill = this.$('#cycleFill');
    this.cyclePercent = this.$('#cyclePercent');
    this.htmlSlot = this.$('#htmlSlot');
    this.toasterWrap = this._shadow.getElementById('toasterWrap') || this._shadow.querySelector('#toasterWrap');
    // internal
    this._interval = null;
    this._mounted = false;
    this._animations = [];
  }

  connectedCallback(){
    if(this._mounted) return;
    this._mounted = true;
    // initialize avatar
    this.avatarSlot.innerHTML = this._createAvatarSVG('B',64);
    // events
    this._onHeaderClick = this._toggleCard.bind(this);
    this._onHeaderKey = e => { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); this._toggleCard(); } };
    this.header.addEventListener('click', this._onHeaderClick);
    this.header.addEventListener('keydown', this._onHeaderKey);

    this._onSmallPreview = () => {
      if(this.card.classList.contains('closed')) { this._toggleCard(); setTimeout(()=> this.input && this.input.focus(), 500); }
      else this.input && this.input.focus();
    };
    this.smallPreview.addEventListener('click', this._onSmallPreview);

    this._onInput = (e) => {
      const v = e.target.value;
      if(v){ this.lblHello.textContent = 'Oi,'; this.lblName.textContent = v; }
      else { this.lblHello.textContent = 'Sistema'; this.lblName.textContent = 'Convidado'; }
      this._updateSmallPreviewFromName(v);
    };
    this.input.addEventListener('input', this._onInput);
    this._onBlur = (e) => {
      const v = e.target.value.trim();
      if(v){ localStorage.setItem('fusion_user', v); this.speak(`Usuário ${v} confirmado.`); this._updateSmallPreviewFromName(v); }
    };
    this.input.addEventListener('blur', this._onBlur);
    this.input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') e.target.blur(); });

    this.modulesToggle.addEventListener('click', ()=> this.toggleDetails());
    this.activationToggle.addEventListener('click', ()=> this.toggleActivation());
    this.activationToggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); this.toggleActivation(); }});
    this.copyActBtn.addEventListener('click', ()=> this.copyActivation());
    this.downloadActBtn.addEventListener('click', ()=> this.exportActivationPNG());

    // icons: fingerprint -> inline svg
    this.$('#iconFingerprint').innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C10 2 4 3 4 9v3c0 4 3 7 8 7s8-3 8-7V9c0-6-6-7-8-7z"></path></svg>`;

    // initial metrics update
    this._updateMetrics();
    this._interval = setInterval(()=> this._updateMetrics(),1000);

    // animate in
    setTimeout(()=> { this.card.classList.add('active'); this.avatarSlot.classList.add('shown'); },120);

    // bootstrap with saved user
    const saved = localStorage.getItem('fusion_user') || '';
    if(saved) { this.setUserName(saved); this.speak(`Bem-vindo de volta, ${saved}.`); }
    else { this.speak('Sistema Dual pronto.'); this._updateSmallPreviewFromName(''); }

    // populate activation block
    this._updateActivationBlock(saved || 'Convidado');
  }

  disconnectedCallback(){
    this.destroy();
  }

  // ========== public API ==========
  setUserName(name){
    if(!this.input) return;
    this.input.value = name;
    this.lblHello.textContent = 'Oi,';
    this.lblName.textContent = name;
    this._updateSmallPreviewFromName(name);
    localStorage.setItem('fusion_user', name);
  }

  open(){ if(this.card.classList.contains('closed')) this._toggleCard(); }
  close(){ if(!this.card.classList.contains('closed')) this._toggleCard(); }
  toggle(){ this._toggleCard(); }

  destroy(){
    if(!this._mounted) return;
    this._mounted = false;
    try {
      this.header.removeEventListener('click', this._onHeaderClick);
      this.header.removeEventListener('keydown', this._onHeaderKey);
      this.smallPreview.removeEventListener('click', this._onSmallPreview);
      this.input.removeEventListener('input', this._onInput);
      this.input.removeEventListener('blur', this._onBlur);
      clearInterval(this._interval);
      window.speechSynthesis && window.speechSynthesis.cancel();
    } catch(e){}
    // remove element from DOM if desired (leave to consumer)
  }

  // ========== internal helpers ==========
  _createAvatarSVG(id,size=64){
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" aria-hidden="true">
        <defs>
          <linearGradient id="g${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00f2ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#bd00ff;stop-opacity:1" />
          </linearGradient>
          <filter id="f${id}"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx="50" cy="50" r="48" fill="#080b12" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <path d="M50 15 A35 35 0 0 1 85 50" stroke="url(#g${id})" stroke-width="4" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/>
        </path>
        <path d="M50 85 A35 35 0 0 1 15 50" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5">
           <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="-360 50 50" dur="8s" repeatCount="indefinite"/>
        </path>
        <circle cx="50" cy="50" r="20" fill="url(#g${id})" filter="url(#f${id})" opacity="0.9"/>
      </svg>
    `;
  }

  _hashString(str){
    let h = 2166136261 >>> 0;
    for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  _seedToGradient(seed, id='s'){
    const h1 = seed % 360;
    const h2 = (seed * 37) % 360;
    return {id:`gSmall${id}`, svg:`<linearGradient id="gSmall${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${h1} 100% 55%)"/><stop offset="100%" stop-color="hsl(${h2} 90% 45%)"/></linearGradient>`};
  }
  _makeMiniAvatarHTML(name,size=30){
    const seed = this._hashString(name || 'DUAL');
    const grad = this._seedToGradient(seed, seed.toString(36));
    return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${grad.svg}</defs><rect x="0" y="0" width="32" height="32" rx="6" fill="#071018" /><circle cx="16" cy="12" r="6" fill="url(#${grad.id})"/><path d="M16 24 a8 4 0 0 1 8 -4" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
  }

  _reduce369Short(name){
    if(!name || !name.trim()) return '--';
    const s = name.split('').reduce((acc,ch)=> acc + ch.charCodeAt(0), 0);
    let root = s;
    while(root > 9) root = String(root).split('').reduce((a,b)=>a+Number(b), 0);
    return root;
  }

  _createAsciiActivation(name){
    const displayName = name && name.trim() ? `${name.trim()}.Dual Infodose` : '(Convidado).Dual Infodose';
    const root = this._reduce369Short(name);
    const title = 'CÉREBRO-ORÁCULO — BASE v1';
    const content = `Ativar: ${displayName}`;
    const width = Math.max(title.length, content.length) + 4;
    const top = '+' + '-'.repeat(width) + '+';
    const midTitle = `| ${title.padEnd(width - 1)}|`;
    const top2 = '+' + '-'.repeat(width) + '+';
    const ascii = `${top}\n${midTitle}\n${top2}\n${content}\n`;
    return { ascii, displayName, root, title, content };
  }

  _updateActivationBlock(name){
    const r = this._createAsciiActivation(name);
    this.actPre && (this.actPre.innerText = r.ascii);
    this.actName && (this.actName.innerText = r.displayName);
    this.actMiniAvatar && (this.actMiniAvatar.innerHTML = this._makeMiniAvatarHTML(name||'DUAL',36));
    if(this.actBadge){ this.actBadge.innerText = `v:${r.root}`; this.actBadge.classList.remove('vibe-gold'); if(r.root===3||r.root===6||r.root===9) this.actBadge.classList.add('vibe-gold'); }
  }

  _updateSmallPreviewFromName(name){
    const now = new Date();
    const PHRASES_24 = [
      "Ativar foco estável.","Sintonizar ritmo criativo.","Amplificar percepção sutil.","Conectar ao core de coesão.",
      "Iniciar limpeza cognitiva.","Engatar modo produtividade.","Equilibrar fluxo emocional.","Elevar nível de curiosidade.",
      "Refinar intenção principal.","Fortalecer memória ativa.","Sincronizar com ciclo terrestre.","Ativar shield de atenção.",
      "Optimizar caminhos de decisão.","Despertar intuição prática.","Atenuar ruídos internos.","Mapear prioridades do dia.",
      "Habilitar modo aprendizado.","Sintonizar voz interior clara.","Aumentar resiliência mental.","Abrir canal de insights.",
      "Energetizar campo criativo.","Ancorar objetivos curtos.","Preparar para execução suave.","Concluir com gratidão."
    ];
    const phrase = PHRASES_24[now.getHours()%24];
    const miniText = (name && name.trim()) ? `${name.trim()} · ${phrase}` : `Ativação aparecerá aqui`;
    this.smallText && (this.smallText.innerText = miniText);
    const root = this._reduce369Short(name);
    this.smallIdent && (this.smallIdent.innerText = (name && name.trim()) ? `v:${root}` : '--');
    this.smallPreview && this.smallPreview.classList.remove('vibe-gold');
    if(root===3||root===6||root===9) this.smallPreview && this.smallPreview.classList.add('vibe-gold');
    this.smallMiniAvatar && (this.smallMiniAvatar.innerHTML = this._makeMiniAvatarHTML(name||'DUAL',30));
    this._updateActivationBlock(name||'Convidado');
  }

  _updateMetrics(){
    const now = new Date();
    this.clock && (this.clock.innerText = now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}));
    const pct = Math.min(100, Math.max(0, ((now.getHours()+now.getMinutes()/60)/24)*100));
    this.cycleFill && (this.cycleFill.style.width = `${pct}%`);
    this.cyclePercent && (this.cyclePercent.innerText = `${Math.floor(pct)}%`);
  }

  speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if(!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; u.rate = 1.05;
    window.speechSynthesis.speak(u);
  }

  _toggleCard(){
    if(this.card.classList.contains('animating')) return;
    const isOpening = this.card.classList.contains('closed');
    this.card.classList.add('animating');
    const start = isOpening ? {width:'260px',padding:'14px 16px',borderRadius:'22px',boxShadow:'0 22px 70px rgba(0,0,0,0.75)',scale:.995} : {width:'440px',padding:'30px 25px',borderRadius:'36px',boxShadow:'0 40px 100px rgba(0,0,0,0.8)',scale:1};
    const end = isOpening ? {width:'440px',padding:'30px 25px',borderRadius:'36px',boxShadow:'0 40px 100px rgba(0,0,0,0.8)',scale:1} : {width:'260px',padding:'14px 16px',borderRadius:'22px',boxShadow:'0 22px 70px rgba(0,0,0,0.75)',scale:.995};
    if(isOpening){ this.card.classList.remove('closed'); this.card.setAttribute('aria-expanded','true'); } else { this.card.classList.remove('content-visible'); if(this.card.classList.contains('open')) this.toggleDetails(); }
    this.card.style.width = start.width; this.card.style.padding = start.padding; this.card.style.borderRadius = start.borderRadius; this.card.style.boxShadow = start.boxShadow; this.card.style.transform = `scale(${start.scale})`;
    const duration = isOpening ? 600 : 450;
    const easing = isOpening ? 'cubic-bezier(0.34,1.3,0.64,1)' : 'cubic-bezier(0.23,1,0.32,1)';
    const anim = this.card.animate([
      { width:start.width,padding:start.padding,borderRadius:start.borderRadius,boxShadow:start.boxShadow,transform:`scale(${start.scale})` },
      { width:end.width,padding:end.padding,borderRadius:end.borderRadius,boxShadow:end.boxShadow,transform:`scale(${end.scale})` }
    ], {duration, easing, fill:'forwards'});
    anim.onfinish = () => {
      this.card.classList.remove('animating');
      this.card.style.width=''; this.card.style.padding=''; this.card.style.borderRadius=''; this.card.style.boxShadow=''; this.card.style.transform='';
      if(isOpening){ this.card.classList.add('content-visible'); this.input && this.input.focus(); } else { this.card.classList.add('closed'); this.card.setAttribute('aria-expanded','false'); }
    };
  }

  toggleDetails(){
    this.card.classList.toggle('open');
    const isOpen = this.card.classList.contains('open');
    this.triggerText && (this.triggerText.innerText = isOpen ? 'FECHAR MÓDULOS' : 'ABRIR MÓDULOS');
    // chevron rotation by transform
    const icon = this.$('#iconChevron');
    if(icon) icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    if(isOpen) this.speak('Carregando módulos.');
  }

  toggleActivation(){
    if(!this.activationCard) return;
    const wasHidden = this.activationCard.classList.contains('activation-hidden');
    this.activationCard.classList.toggle('activation-hidden');
    this.activationCard.classList.toggle('activation-open');
    this.activationToggle.setAttribute('aria-expanded', String(wasHidden));
    if(wasHidden){
      const text = this.actPre ? this.actPre.innerText.replace(/\n/g,' ') : 'Ativação aberta';
      this.speak(text);
    }
  }

  async copyActivation(){
    if(!this.actPre) return;
    const text = this.actPre.innerText;
    try {
      if(navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else { const ta = document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
      this._showToaster('Ativação copiada');
    } catch(e){ this._showToaster('Erro copiando'); }
  }

  // Export activation to PNG via Canvas (no html2canvas dependency)
  exportActivationPNG(){
    const ascii = this.actPre ? this.actPre.innerText : '';
    if(!ascii) { this._showToaster('Nada para exportar'); return; }
    const lines = ascii.split('\n');
    const padding = 18;
    const lineHeight = 18;
    const font = '16px monospace';
    // measure width using an offscreen canvas
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d');
    mctx.font = font;
    let maxWidth = 0;
    for(const l of lines){ const w = mctx.measureText(l).width; if(w>maxWidth) maxWidth = w; }
    const width = Math.ceil(maxWidth + padding*2);
    const height = Math.ceil(lines.length*lineHeight + padding*2);
    const canvas = document.createElement('canvas');
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    // background
    ctx.fillStyle = '#0b0d10';
    ctx.fillRect(0,0,width,height);
    // border
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(8,8,width-16,height-16);
    // dashed inner line
    ctx.setLineDash([6,6]);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.strokeRect(12,12,width-24,height-24);
    ctx.setLineDash([]);
    // draw text
    ctx.font = font;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';
    let y = padding;
    for(const l of lines){
      ctx.fillText(l, padding, y);
      y += lineHeight;
    }
    // download
    const a = document.createElement('a');
    a.download = `activation-${(new Date()).toISOString().replace(/[:.]/g,'')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    this._showToaster('Exportado PNG');
  }

  _showToaster(text, ms = 2400){
    // simple light DOM-free toaster inside shadow
    const t = document.createElement('div');
    t.className = 'toaster';
    t.textContent = text + ' — (toaster: implementação futura)';
    const wrap = this._shadow.getElementById('toasterWrap') || this.toasterWrap;
    (wrap || this._shadow.host).appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=> { t.classList.remove('show'); setTimeout(()=> t.remove(),300); }, ms);
  }

  // bootstrap activation block with saved or given
  _updateActivationBlock(name){ this._updateActivationBlock = this._updateActivationBlock.bind(this); /* placeholder overwritten */ }
}

// attach helper methods to prototype after class body to avoid hoisting errors
// (we need those helpers available; define them now)
(function attachHelpers() {
  const proto = FusionCard.prototype;
  // copy internal functions from above (we used forward declarations earlier)
  // (these functions we referenced in constructor are already defined on the prototype via closures inside the class body)
})();

customElements.define('fusion-card', FusionCard);
export default FusionCard;

// fusion-card.mjs
// ESM module: exporta mountFusionCard(target, options) e unmountFusionCard()

const CSS = `/* (coloque aqui o CSS que vem do seu HTML) */
:root{
  --bg-deep:#030406; --glass-surface:rgba(18,18,22,0.65); --glass-border:rgba(255,255,255,0.06);
  --neon-cyan:#00f2ff; --neon-purple:#bd00ff; --neon-orange:#ff9a3c;
  --font-ui:'Montserrat',sans-serif; --font-code:'JetBrains Mono',monospace;
  --ease-overshoot: cubic-bezier(0.34, 1.3, 0.64, 1);
  --ease-smooth: cubic-bezier(0.23, 1, 0.32, 1);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;outline:none;user-select:none}
body{margin:0;padding:0;min-height:100vh;background-color:var(--bg-deep);color:#fff;font-family:var(--font-ui)}
.ambient-light{position:fixed;inset:0;z-index:0;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.15;animation:float 25s infinite alternate ease-in-out}
.blob-1{width:60vw;height:60vw;background:var(--neon-cyan);top:-20%;left:-20%}
.blob-2{width:50vw;height:50vw;background:var(--neon-purple);bottom:-20%;right:-20%;animation-delay:-5s}
@keyframes float{0%{transform:translate(0,0)}100%{transform:translate(40px,60px)}}

.container{width:100%;max-width:640px;padding:20px;z-index:10;perspective:1200px;display:flex;align-items:center;justify-content:center}
.fusion-card{width:100%; max-width:440px;background:var(--glass-surface);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid var(--glass-border);border-radius:36px;padding:30px 25px;box-shadow:0 40px 100px rgba(0,0,0,0.8);position:relative;overflow:hidden;opacity:0; transform:translateY(50px) scale(0.96);display:flex;flex-direction:column;gap:8px;will-change: width, padding, border-radius, box-shadow, transform;}
.fusion-card.active{opacity:1;transform:translateY(0) scale(1); transition: opacity 0.6s, transform 0.6s var(--ease-smooth);}
.fusion-card.closed{width:260px; max-width:none;padding:14px 16px; border-radius:22px;box-shadow:0 22px 70px rgba(0,0,0,0.75);cursor:pointer;}
.fusion-card.closed .card-header{gap:10px;margin-bottom:0}
.fusion-card.closed .brand-dual{font-size:1.3rem; margin-top:0; letter-spacing:-1px}
.fusion-card.closed .greeting-row{font-size:1rem}
.fusion-card.closed .txt-thin{display:none}
.fusion-card.closed .card-body{display:none}
.fusion-card.closed .avatar-slot{width:52px;height:52px}
.fusion-card.animating{transition: none !important;}
.fusion-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)}
.card-header{display:flex;align-items:center;gap:15px;margin-bottom:18px;transition: margin 0.3s}
.avatar-slot{width:64px;height:64px;flex-shrink:0;border-radius:12px;overflow:hidden;opacity:0;transition:opacity 0.35s}
.avatar-slot.shown{opacity:1}
.text-block{flex:1;display:flex;flex-direction:column;justify-content:center}
.greeting-row{font-size:1.5rem;line-height:1;display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}
.txt-thin{font-weight:200;color:rgba(255,255,255,0.7)}
.txt-heavy{font-weight:600;color:#fff}
.brand-dual{font-size:2.2rem;font-weight:900;line-height:0.95;text-transform:uppercase;letter-spacing:-2px;margin-top:4px;background:linear-gradient(-45deg,#fff,var(--neon-cyan),var(--neon-purple),#fff);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientFlow 4s ease infinite}
@keyframes gradientFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.clock-widget{text-align:right}
.time-display{font-family:var(--font-code);font-size:1rem;color:rgba(255,255,255,0.5);font-weight:700}
.status-led{font-size:0.6rem;color:var(--neon-cyan);text-transform:uppercase;letter-spacing:1px;margin-top:4px;display:block}
.card-body{display:flex;flex-direction:column;gap:12px}
.stagger-item {opacity: 0;transform: translateY(15px);transition: opacity 0.4s ease, transform 0.4s var(--ease-overshoot)}
.content-visible .stagger-item {opacity: 1;transform: translateY(0)}
.content-visible .stagger-item:nth-child(1) { transition-delay: 0.1s; }
.content-visible .stagger-item:nth-child(2) { transition-delay: 0.18s; }
.content-visible .stagger-item:nth-child(3) { transition-delay: 0.25s; }
.input-wrapper{position:relative}
.cyber-input{width:100%;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:16px 50px 16px 18px;color:#fff;font-family:var(--font-code);font-size:0.9rem;transition:0.2s}
.cyber-input:focus{border-color:var(--neon-cyan);box-shadow:0 0 15px rgba(0,242,255,0.08);background:rgba(0,0,0,0.5)}
.input-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.3)}
.trigger-btn{width:100%;padding:12px;border:1px dashed rgba(255,255,255,0.1);border-radius:12px;background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.5);font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:8px}
.trigger-btn:hover{background:rgba(255,255,255,0.04);color:#fff;border-color:rgba(255,255,255,0.3)}
.hidden-modules{display:grid;grid-template-rows:0fr;opacity:0.6;transition:all 420ms var(--ease-smooth)}
.fusion-card.open .hidden-modules{grid-template-rows:1fr;opacity:1;margin-top:10px}
.modules-inner{overflow:hidden;display:flex;flex-direction:column;gap:12px; padding-top:2px;}
.stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.stat-box{background:rgba(255,255,255,0.03);border-radius:12px;padding:10px;text-align:center;border:1px solid transparent;transition:0.2s}
.stat-box:hover{border-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.06)}
.stat-lbl{font-size:0.55rem;text-transform:uppercase;color:rgba(255,255,255,0.4);display:block;margin-bottom:4px}
.stat-val{font-family:var(--font-code);font-size:0.9rem;font-weight:700;color:var(--neon-cyan)}
.progress-container{background:rgba(0,0,0,0.2);padding:12px;border-radius:12px}
.bar-track{height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin:8px 0}
.bar-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-purple));box-shadow:0 0 10px var(--neon-cyan);transition:width 1.2s ease-out}
.bar-meta{display:flex;justify-content:space-between;font-size:0.6rem;color:rgba(255,255,255,0.4);font-family:var(--font-code)}
.html-module-slot{border:1px solid var(--neon-orange);background:rgba(255,154,60,0.05);border-radius:12px;padding:12px;min-height:56px;display:flex;align-items:center;justify-content:center;color:var(--neon-orange);font-size:0.7rem;font-family:var(--font-code);text-align:center}
.small-preview{display:none;align-items:center;gap:10px;margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03);font-family:var(--font-code);font-size:0.86rem;color:rgba(255,255,255,0.9);cursor:pointer;overflow:hidden}
.small-preview .mini-avatar{width:30px;height:30px;border-radius:6px;flex-shrink:0;overflow:hidden;display:inline-flex;align-items:center;justify-content:center}
.small-preview .small-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 110px)}
.small-preview .ident-badge{margin-left:auto;font-weight:700;font-size:0.78rem;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.02)}
.fusion-card.closed .small-preview{display:flex}
.vibe-gold{box-shadow: 0 0 0px rgba(255,210,80,0.0);animation: vibePulse 1.6s infinite;border: 1px solid rgba(255,210,80,0.15)}
@keyframes vibePulse {0%{ box-shadow: 0 0 0 0 rgba(255,210,80,0.0); transform: translateY(0); }40%{ box-shadow: 0 0 18px 6px rgba(255,210,80,0.06); transform: translateY(-1px) scale(1.01); }100%{ box-shadow: 0 0 0 0 rgba(255,210,80,0.0); transform: translateY(0); }}
.activation-wrap{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.activation-toggle{display:flex;align-items:center;gap:8px;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);cursor:pointer;background:rgba(255,255,255,0.02)}
.activation-card{background:rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.03);padding:12px;border-radius:12px;overflow:hidden;transition:all 280ms var(--ease-smooth)}
.activation-pre{font-family:var(--font-code);white-space:pre-wrap;margin:0;padding:8px;background:rgba(0,0,0,0.12);border-radius:8px;border:1px dashed rgba(255,255,255,0.03);color:#fff}
.activation-hidden{max-height:0;opacity:0;padding:0 12px;pointer-events:none}
.activation-open{max-height:400px;opacity:1;padding:12px}
.activation-controls{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
.activation-mini{display:flex;align-items:center;gap:8px}
@media (max-width:420px){ .fusion-card.closed{width:220px} .brand-dual{font-size:1rem} }
`;

/* Template HTML (string) — adaptado para montagem via JS */
const TEMPLATE = `
  <div class="ambient-light" data-fusion-role="ambient">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>

  <div class="container" data-fusion-role="container">
    <div class="fusion-card closed" id="fusionCard" aria-expanded="false" data-fusion-role="card">
      <div class="card-header" id="cardHeader" role="button" tabindex="0" aria-controls="cardBody" aria-expanded="false">
        <div class="avatar-slot" id="avatarTarget" aria-hidden="true"></div>

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
          <i data-lucide="fingerprint" class="input-icon"></i>
        </div>

        <div class="trigger-btn stagger-item" id="modulesToggle">
          <span id="triggerText">ABRIR MÓDULOS</span>
          <i data-lucide="chevron-down" id="triggerIcon"></i>
        </div>

        <div class="activation-wrap stagger-item">
          <div class="activation-toggle" id="activationToggle" role="button" tabindex="0" aria-expanded="false">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
              <strong style="letter-spacing:1px">Ativação ASCII</strong>
            </div>
            <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">BASE v1</div>
          </div>

          <div id="activationCard" class="activation-card activation-hidden" aria-live="polite">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="mini-avatar" id="actMiniAvatar" aria-hidden="true"></div>
                <div style="display:flex;flex-direction:column;">
                  <div id="actTitle" style="font-weight:700">CÉREBRO-ORÁCULO — BASE v1</div>
                  <div style="font-size:0.78rem;color:rgba(255,255,255,0.55)">Ativar: <span id="actName">(Convidado).Dual Infodose</span></div>
                </div>
              </div>
              <div style="margin-left:auto;display:flex;flex-direction:column;gap:6px;align-items:flex-end">
                <div class="activation-badge" id="actBadge">v:--</div>
                <div style="font-size:0.72rem;color:rgba(255,255,255,0.45)">Rolling system</div>
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
              <div class="stat-box">
                <span class="stat-lbl">LATÊNCIA</span>
                <span class="stat-val">12ms</span>
              </div>
              <div class="stat-box">
                <span class="stat-lbl">CPU</span>
                <span class="stat-val">FUSION</span>
              </div>
              <div class="stat-box">
                <span class="stat-lbl">RITMO</span>
                <span class="stat-val">BETA</span>
              </div>
            </div>

            <div class="progress-container">
              <div class="bar-meta">
                <span>CICLO DIÁRIO</span>
                <span id="cyclePercent">0%</span>
              </div>
              <div class="bar-track"><div class="bar-fill" id="cycleFill"></div></div>
            </div>

            <div class="html-module-slot">// MÓDULO EXTERNO — PRONTO PARA INJEÇÃO HTML</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="toasterWrap" class="toaster-wrap" aria-hidden="true"></div>
`;

/* ========= helpers (avatar, hashing, ascii etc) ========= */

function hashString(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
function seedToGradient(seed, id='s'){
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  return {id: `gSmall${id}`, svg: `<linearGradient id="gSmall${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${h1} 100% 55%)"/><stop offset="100%" stop-color="hsl(${h2} 90% 45%)"/></linearGradient>`};
}
function makeMiniAvatarHTML(name, size = 30){
  const seed = hashString(name || 'DUAL');
  const grad = seedToGradient(seed, seed.toString(36));
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>${grad.svg}</defs>
      <rect x="0" y="0" width="32" height="32" rx="6" fill="#071018" />
      <circle cx="16" cy="12" r="6" fill="url(#${grad.id})"/>
      <path d="M16 24 a8 4 0 0 1 8 -4" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}
function createAvatarSVG(id, size = 64){
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

function reduce369Short(name){
  if(!name || !name.trim()) return '--';
  const s = name.split('').reduce((acc,ch)=> acc + ch.charCodeAt(0), 0);
  let root = s;
  while(root > 9) root = String(root).split('').reduce((a,b)=>a+Number(b), 0);
  return root;
}
function createAsciiActivation(name){
  const displayName = name && name.trim() ? `${name.trim()}.Dual Infodose` : '(Convidado).Dual Infodose';
  const root = reduce369Short(name);
  const title = 'CÉREBRO-ORÁCULO — BASE v1';
  const content = `Ativar: ${displayName}`;
  const width = Math.max(title.length, content.length) + 4;
  const top = '+' + '-'.repeat(width) + '+';
  const midTitle = `| ${title.padEnd(width - 1)}|`;
  const top2 = '+' + '-'.repeat(width) + '+';
  const ascii = `${top}\n${midTitle}\n${top2}\n${content}\n`;
  return { ascii, displayName, root, title, content };
}

/* ========= loader for external libs (lucide, html2canvas) ========= */

function injectScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    // if already loaded by exact src, resolve
    if ([...document.scripts].some(s => s.src && s.src.includes(src))) {
      // attempt small delay to let it initialize
      return setTimeout(()=>resolve(), 60);
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    Object.entries(attrs).forEach(([k,v])=> s.setAttribute(k,v));
    s.onload = () => setTimeout(()=>resolve(), 20);
    s.onerror = (e) => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

/* ========= exported mount/unmount ========= */

let mounted = false;
let state = null;

export async function mountFusionCard(target, options = {}) {
  if (mounted) return state; // already mounted
  // resolve target
  const container = (typeof target === 'string') ? document.querySelector(target) : target;
  if(!container) throw new Error('mountFusionCard: target not found');

  // inject style
  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-fusion-style', 'true');
  styleTag.textContent = CSS;
  document.head.appendChild(styleTag);

  // insert template
  container.innerHTML = TEMPLATE;

  // optionally register manifest / sw (if options.swPath provided)
  if(options.manifestPath){
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = options.manifestPath;
    document.head.appendChild(link);
  }
  if(options.appIcon){
    const lt = document.createElement('link'); lt.rel='apple-touch-icon'; lt.href=options.appIcon; document.head.appendChild(lt);
  }
  if(options.swPath && 'serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register(options.swPath).catch(()=>{ /* ignore */ });
    } catch(e){}
  }

  // ensure external libs (lucide and html2canvas)
  try {
    if(!window.lucide && options.lucide !== false) {
      // default CDN
      await injectScript(options.lucide || 'https://unpkg.com/lucide@latest');
    }
  } catch(e){
    // swallow, icons will not be created
    console.warn('lucide load failed', e);
  }
  try {
    if(!window.html2canvas && options.html2canvas !== false) {
      await injectScript(options.html2canvas || 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
  } catch(e){
    console.warn('html2canvas load failed', e);
  }

  // grab elements
  const els = {
    card: container.querySelector('[data-fusion-role="card"]'),
    header: container.querySelector('#cardHeader'),
    avatarTgt: container.querySelector('#avatarTarget'),
    input: container.querySelector('#inputUser'),
    lblHello: container.querySelector('#lblHello'),
    lblName: container.querySelector('#lblName'),
    clock: container.querySelector('#clockTime'),
    triggerText: container.querySelector('#triggerText'),
    triggerIcon: container.querySelector('#triggerIcon'),
    modulesArea: container.querySelector('#modulesArea'),
    cardBody: container.querySelector('#cardBody'),
    smallPreview: container.querySelector('#smallPreview'),
    smallMiniAvatar: container.querySelector('#smallMiniAvatar'),
    smallText: container.querySelector('#smallText'),
    smallIdent: container.querySelector('#smallIdent'),
    activationToggle: container.querySelector('#activationToggle'),
    activationCard: container.querySelector('#activationCard'),
    actPre: container.querySelector('#actPre'),
    actName: container.querySelector('#actName'),
    actMiniAvatar: container.querySelector('#actMiniAvatar'),
    actBadge: container.querySelector('#actBadge'),
    copyActBtn: container.querySelector('#copyActBtn'),
    downloadActBtn: container.querySelector('#downloadActBtn'),
    modulesToggle: container.querySelector('#modulesToggle'),
    cycleFill: container.querySelector('#cycleFill'),
    cyclePercent: container.querySelector('#cyclePercent'),
    avatarShown: container.querySelector('#avatarTarget'),
    toasterWrap: document.getElementById('toasterWrap')
  };

  // create main avatar
  els.avatarTgt.innerHTML = createAvatarSVG('B', 64);

  // small-preview update logic
  function updateSmallPreviewFromName(name){
    const now = new Date();
    const PHRASES_24 = [
      "Ativar foco estável.","Sintonizar ritmo criativo.","Amplificar percepção sutil.","Conectar ao core de coesão.",
      "Iniciar limpeza cognitiva.","Engatar modo produtividade.","Equilibrar fluxo emocional.","Elevar nível de curiosidade.",
      "Refinar intenção principal.","Fortalecer memória ativa.","Sincronizar com ciclo terrestre.","Ativar shield de atenção.",
      "Optimizar caminhos de decisão.","Despertar intuição prática.","Atenuar ruídos internos.","Mapear prioridades do dia.",
      "Habilitar modo aprendizado.","Sintonizar voz interior clara.","Aumentar resiliência mental.","Abrir canal de insights.",
      "Energetizar campo criativo.","Ancorar objetivos curtos.","Preparar para execução suave.","Concluir com gratidão."
    ];
    const phrase = PHRASES_24[now.getHours() % 24];
    const miniText = (name && name.trim()) ? `${name.trim()} · ${phrase}` : `Ativação aparecerá aqui`;
    els.smallText.innerText = miniText;
    const root = reduce369Short(name);
    els.smallIdent.innerText = (name && name.trim()) ? `v:${root}` : '--';
    els.smallPreview.classList.remove('vibe-gold');
    if(root === 3 || root === 6 || root === 9) els.smallPreview.classList.add('vibe-gold');
    els.smallMiniAvatar.innerHTML = makeMiniAvatarHTML(name || 'DUAL', 30);
    updateActivationBlock(name || 'Convidado');
  }

  function updateActivationBlock(name){
    const r = createAsciiActivation(name);
    if(els.actPre) els.actPre.innerText = r.ascii;
    if(els.actName) els.actName.innerText = r.displayName;
    if(els.actMiniAvatar) els.actMiniAvatar.innerHTML = makeMiniAvatarHTML(name || 'DUAL', 36);
    if(els.actBadge){
      els.actBadge.innerText = `v:${r.root}`;
      els.actBadge.classList.remove('vibe-gold');
      if(r.root === 3 || r.root === 6 || r.root === 9) els.actBadge.classList.add('vibe-gold');
    }
  }

  // TTS helper
  function speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if(!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = options.ttsLang || 'pt-BR'; u.rate = options.ttsRate || 1.05;
    window.speechSynthesis.speak(u);
  }

  // Toaster
  if(!els.toasterWrap) {
    const w = document.createElement('div'); w.id='toasterWrap'; document.body.appendChild(w); state.toasterWrap = w;
  }
  function showToaster(text, ms = 3000){
    const node = document.createElement('div'); node.className = 'toaster'; node.innerText = text + ' — (toaster: implementação futura)';
    (document.getElementById('toasterWrap') || document.body).appendChild(node);
    requestAnimationFrame(()=> node.classList.add('show'));
    setTimeout(()=>{ node.classList.remove('show'); setTimeout(()=> node.remove(),300); }, ms);
  }

  // clock/metrics
  function updateMetrics(){
    const now = new Date();
    const clockEl = els.clock;
    if(clockEl) clockEl.innerText = now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    const pct = Math.min(100, Math.max(0, ((now.getHours() + now.getMinutes()/60) / 24) * 100));
    if(els.cycleFill) els.cycleFill.style.width = `${pct}%`;
    if(els.cyclePercent) els.cyclePercent.innerText = `${Math.floor(pct)}%`;
  }
  const metricsInterval = setInterval(updateMetrics, 1000);
  updateMetrics();

  // morph state
  const morph = {
    closed: { width: '260px', padding: '14px 16px', borderRadius: '22px', boxShadow: '0 22px 70px rgba(0,0,0,0.75)', scale: 0.995 },
    open:   { width: '440px', padding: '30px 25px', borderRadius: '36px', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', scale: 1 }
  };

  function toggleCard(){
    if(els.card.classList.contains('animating')) return;
    const isOpening = els.card.classList.contains('closed');
    els.card.classList.add('animating');
    const start = isOpening ? morph.closed : morph.open;
    const end   = isOpening ? morph.open : morph.closed;

    if(isOpening) {
      els.card.classList.remove('closed');
      els.card.setAttribute('aria-expanded', 'true');
    } else {
      els.card.classList.remove('content-visible');
      if(els.card.classList.contains('open')) toggleDetails();
    }

    els.card.style.width = start.width;
    els.card.style.padding = start.padding;
    els.card.style.borderRadius = start.borderRadius;
    els.card.style.boxShadow = start.boxShadow;
    els.card.style.transform = `scale(${start.scale})`;

    const easing = isOpening ? 'cubic-bezier(0.34, 1.3, 0.64, 1)' : 'cubic-bezier(0.23, 1, 0.32, 1)';
    const duration = isOpening ? 600 : 450;

    const anim = els.card.animate([
      { width: start.width, padding: start.padding, borderRadius: start.borderRadius, boxShadow: start.boxShadow, transform: `scale(${start.scale})` },
      { width: end.width, padding: end.padding, borderRadius: end.borderRadius, boxShadow: end.boxShadow, transform: `scale(${end.scale})` }
    ], { duration, easing, fill: 'forwards' });

    anim.onfinish = () => {
      els.card.classList.remove('animating');
      // reset inline style so CSS controls it later
      els.card.style.width = '';
      els.card.style.padding = '';
      els.card.style.borderRadius = '';
      els.card.style.boxShadow = '';
      els.card.style.transform = '';
      if(isOpening) {
        els.card.classList.add('content-visible');
        els.input && els.input.focus();
      } else {
        els.card.classList.add('closed');
        els.card.setAttribute('aria-expanded', 'false');
      }
      // update icons
      if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    };
  }

  // modules accordion
  function toggleDetails(){
    els.card.classList.toggle('open');
    const isOpen = els.card.classList.contains('open');
    if(els.triggerText) els.triggerText.innerText = isOpen ? 'FECHAR MÓDULOS' : 'ABRIR MÓDULOS';
    if(els.triggerIcon) els.triggerIcon.setAttribute('data-lucide', isOpen ? 'chevron-up' : 'chevron-down');
    if(isOpen) speak('Carregando módulos.');
    if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  // activation toggles / copy / download
  function toggleActivation(){
    if(!els.activationCard) return;
    const wasHidden = els.activationCard.classList.contains('activation-hidden');
    els.activationCard.classList.toggle('activation-hidden');
    els.activationCard.classList.toggle('activation-open');
    els.activationToggle.setAttribute('aria-expanded', String(wasHidden));
    if(wasHidden){
      const text = els.actPre ? els.actPre.innerText.replace(/\n/g,' ') : 'Ativação aberta';
      speak(text);
    }
  }

  async function copyToClipboard(text){
    if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); return Promise.resolve();
  }

  // event bindings
  function onHeaderClick(){ toggleCard(); }
  function onHeaderKey(e){ if(e.key === 'Enter'||e.key===' ') { e.preventDefault(); toggleCard(); } }
  function onSmallPreviewClick(){
    if(els.card.classList.contains('closed')) {
      toggleCard();
      setTimeout(()=> els.input && els.input.focus(), 500);
    } else {
      els.input && els.input.focus();
    }
  }
  function onInputInput(e){
    const v = e.target.value;
    if(v){ els.lblHello.innerText = 'Oi,'; els.lblName.innerText = v; }
    else { els.lblHello.innerText = 'Sistema'; els.lblName.innerText = 'Convidado'; }
    updateSmallPreviewFromName(v);
  }
  function onInputBlur(e){
    const v = e.target.value.trim();
    if(v){ localStorage.setItem('fusion_user', v); speak(`Usuário ${v} confirmado.`); updateSmallPreviewFromName(v); }
  }
  function onInputKeydown(e){ if(e.key === 'Enter') e.target.blur(); }

  // wire events
  els.header && els.header.addEventListener('click', onHeaderClick);
  els.header && els.header.addEventListener('keydown', onHeaderKey);
  els.smallPreview && els.smallPreview.addEventListener('click', onSmallPreviewClick);
  els.input && els.input.addEventListener('input', onInputInput);
  els.input && els.input.addEventListener('blur', onInputBlur);
  els.input && els.input.addEventListener('keydown', onInputKeydown);
  els.modulesToggle && els.modulesToggle.addEventListener('click', toggleDetails);

  if(els.activationToggle){
    els.activationToggle.addEventListener('click', toggleActivation);
    els.activationToggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleActivation(); } });
  }
  if(els.copyActBtn) els.copyActBtn.addEventListener('click', ()=>{ if(!els.actPre) return; copyToClipboard(els.actPre.innerText).then(()=> showToaster('Ativação copiada')); });
  if(els.downloadActBtn) els.downloadActBtn.addEventListener('click', async ()=>{
    if(!els.activationCard) return;
    const el = els.activationCard;
    const prevHidden = el.classList.contains('activation-hidden');
    if(prevHidden){ el.classList.remove('activation-hidden'); el.classList.add('activation-open'); }
    try {
      if(window.html2canvas){
        const canvas = await window.html2canvas(el, {backgroundColor:null, scale:2});
        const a = document.createElement('a');
        a.download = `activation-${(new Date()).toISOString().replace(/[:.]/g,'')}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      } else {
        showToaster('html2canvas não disponível');
      }
    } catch(e){
      console.error(e); showToaster('Erro exportando PNG');
    }
    if(prevHidden){ el.classList.add('activation-hidden'); el.classList.remove('activation-open'); }
  });

  // create lucide icons
  if(window.lucide && window.lucide.createIcons) window.lucide.createIcons();

  // initial state: animate card in, load saved user
  setTimeout(()=> {
    els.card && els.card.classList.add('active');
    els.avatarTgt && els.avatarTgt.classList.add('shown');
    const saved = localStorage.getItem('fusion_user');
    if(saved){ setUserName(saved); speak(`Bem-vindo de volta, ${saved}.`); updateSmallPreviewFromName(saved); }
    else { speak(options.greetings || 'Sistema Dual pronto.'); updateSmallPreviewFromName(''); }
  }, 120);

  function setUserName(name){
    if(!els.input) return;
    els.input.value = name; els.lblHello.innerText = 'Oi,'; els.lblName.innerText = name;
    updateSmallPreviewFromName(name);
  }

  // bootstrap activation block from saved
  (function bootstrapActivation(){
    const initial = localStorage.getItem('fusion_user') || '';
    updateActivationBlock(initial || 'Convidado');
  })();

  // store mounted state for unmount
  mounted = true;
  state = {
    container,
    els,
    cleanup: () => {
      // remove listeners and interval and style
      try {
        els.header && els.header.removeEventListener('click', onHeaderClick);
        els.header && els.header.removeEventListener('keydown', onHeaderKey);
        els.smallPreview && els.smallPreview.removeEventListener('click', onSmallPreviewClick);
        els.input && els.input.removeEventListener('input', onInputInput);
        els.input && els.input.removeEventListener('blur', onInputBlur);
        els.input && els.input.removeEventListener('keydown', onInputKeydown);
        els.modulesToggle && els.modulesToggle.removeEventListener('click', toggleDetails);
        if(els.activationToggle){
          els.activationToggle.removeEventListener('click', toggleActivation);
          els.activationToggle.removeEventListener('keydown', toggleActivation);
        }
        if(els.copyActBtn) els.copyActBtn.removeEventListener('click', ()=>{});
        if(els.downloadActBtn) els.downloadActBtn.removeEventListener('click', ()=>{});
      } catch(e){}
      clearInterval(metricsInterval);
      // remove injected DOM
      if(container.contains(els.card)) container.innerHTML = '';
      // remove injected style
      const s = document.querySelector('style[data-fusion-style="true"]');
      if(s) s.remove();
      mounted = false; state = null;
    },
    setUserName,
  };

  return state;
}

export function unmountFusionCard(){
  if(!mounted || !state) return;
  state.cleanup();
}

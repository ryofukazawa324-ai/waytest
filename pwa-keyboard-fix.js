(()=>{
  const isStandalone=()=>window.matchMedia?.('(display-mode: standalone)')?.matches===true||window.navigator.standalone===true;
  const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function safariUrl(){const u=new URL(location.href);u.searchParams.set('browser','1');u.searchParams.delete('home');return u.href;}
  function addSafariFallback(){
    if(!isStandalone()||!isIOS()||document.getElementById('nway-safari-fallback'))return;
    const bar=document.createElement('div');
    bar.id='nway-safari-fallback';
    bar.innerHTML=`<span>iPadのホーム画面版でキーボードが出ない場合</span><a href="${safariUrl()}" target="_blank" rel="noopener external">Safariで開く（入力用）</a>`;
    document.body.appendChild(bar);
  }
  function applyLoginKeypad(){
    if(!isStandalone())return;
    const gate=document.getElementById('nway-login');
    const id=document.getElementById('nway-id');
    const pass=document.getElementById('nway-pass');
    const form=document.getElementById('nway-login-form');
    if(!gate||!id||!pass||!form||document.getElementById('nway-pwa-keypad'))return;
    id.value='nway';id.readOnly=true;id.inputMode='none';pass.inputMode='none';pass.setAttribute('enterkeyhint','done');
    const note=document.createElement('div');note.className='pwa-keyboard-note';note.textContent='ログインは下の数字キーでも入力できます。日本語入力は「Safariで開く（入力用）」を使ってください。';pass.insertAdjacentElement('afterend',note);
    const keypad=document.createElement('div');keypad.id='nway-pwa-keypad';keypad.className='pwa-keypad';keypad.innerHTML=`<button type="button" data-key="1">1</button><button type="button" data-key="2">2</button><button type="button" data-key="3">3</button><button type="button" data-key="4">4</button><button type="button" data-key="5">5</button><button type="button" data-key="6">6</button><button type="button" data-key="7">7</button><button type="button" data-key="8">8</button><button type="button" data-key="9">9</button><button type="button" data-action="clear">クリア</button><button type="button" data-key="0">0</button><button type="button" data-action="back">⌫</button>`;note.insertAdjacentElement('afterend',keypad);
    keypad.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.key!==undefined){if(pass.value.length<32)pass.value+=b.dataset.key}else if(b.dataset.action==='back')pass.value=pass.value.slice(0,-1);else if(b.dataset.action==='clear')pass.value='';pass.dispatchEvent(new Event('input',{bubbles:true}))});
  }
  const style=document.createElement('style');style.textContent=`#nway-login .pwa-keyboard-note{margin-top:7px;font-size:11px;line-height:1.45;color:#667085;font-weight:600}#nway-login .pwa-keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}#nway-login .pwa-keypad button{margin:0;width:100%;padding:11px 6px;border:1px solid #d7ddea;border-radius:10px;background:#f7f9fc;color:#172033;font-size:16px;font-weight:800;touch-action:manipulation;-webkit-tap-highlight-color:transparent}#nway-login .pwa-keypad button:active{background:#e9eef8}#nway-safari-fallback{position:fixed;left:12px;right:12px;bottom:12px;z-index:99998;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid #d7ddea;border-radius:14px;background:rgba(255,255,255,.96);box-shadow:0 8px 28px rgba(15,23,42,.16);font:600 11px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI","Yu Gothic",sans-serif;color:#667085}#nway-safari-fallback a{flex:0 0 auto;text-decoration:none;background:#285dff;color:#fff;border-radius:9px;padding:8px 10px;font-weight:800}@media(min-width:700px){#nway-login .login-card{width:min(100%,430px)}#nway-safari-fallback{left:50%;right:auto;transform:translateX(-50%);width:min(680px,calc(100% - 24px))}}`;document.head.appendChild(style);
  function apply(){addSafariFallback();applyLoginKeypad()}
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
(()=>{
  const ICON='data:image/png;base64,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';
  const icon=document.createElement('link');icon.rel='icon';icon.type='image/png';icon.sizes='32x32';icon.href=ICON;document.head.appendChild(icon);
  const apple=document.createElement('link');apple.rel='apple-touch-icon';apple.href=ICON;document.head.appendChild(apple);
  const theme=document.createElement('meta');theme.name='theme-color';theme.content='#0b4acb';document.head.appendChild(theme);

  const SESSION_KEY='nway-auth-session-v1';
  const REMEMBER_KEY='nway-auth-remember-v1';
  const ID_HASH='d2d9d4c4cfaded84d4451b7d16f23632de07eb0f97d5024914895fe0bd600c2c';
  const PASS_HASH='8752f24ec0a8ac50ef732fbaa26f2df1cea32e477b8d4ad4160748155ed23054';

  const already=sessionStorage.getItem(SESSION_KEY)==='1'||localStorage.getItem(REMEMBER_KEY)==='1';
  if(!already)document.documentElement.classList.add('nway-locked');

  const style=document.createElement('style');
  style.textContent=`
    .nway-locked body>*:not(#nway-login){display:none!important}
    #nway-login{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:linear-gradient(135deg,#0f172a,#304c91);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Yu Gothic",sans-serif;color:#172033}
    #nway-login .login-card{width:min(100%,380px);background:#fff;border-radius:20px;padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.25)}
    #nway-login h1{margin:0 0 6px;font-size:22px}
    #nway-login p{margin:0 0 18px;color:#667085;font-size:13px;line-height:1.6}
    #nway-login label{display:block;margin-top:12px;font-size:12px;font-weight:800}
    #nway-login input[type="text"],#nway-login input[type="password"]{width:100%;margin-top:6px;padding:12px;border:1px solid #dce1eb;border-radius:11px;font:inherit;font-size:16px;background:#fff}
    #nway-login .remember{display:flex;align-items:center;gap:8px;margin-top:14px;font-size:13px;font-weight:650;color:#344054;cursor:pointer}
    #nway-login .remember input{width:18px;height:18px;margin:0;accent-color:#285dff}
    #nway-login button{width:100%;margin-top:18px;padding:12px;border:0;border-radius:11px;background:#285dff;color:#fff;font:inherit;font-weight:800;cursor:pointer}
    #nway-login .login-error{min-height:20px;margin-top:10px;color:#b42318;font-size:12px;font-weight:700}
  `;
  document.head.appendChild(style);

  async function sha256(s){
    const bytes=new TextEncoder().encode(s);
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  if(already)return;

  window.addEventListener('DOMContentLoaded',()=>{
    const gate=document.createElement('div');
    gate.id='nway-login';
    gate.innerHTML=`<div class="login-card">
      <h1>ノジマウェイ学習</h1>
      <p>IDとパスワードを入力してください。</p>
      <form id="nway-login-form" autocomplete="off">
        <label>ID<input id="nway-id" type="text" inputmode="text" autocapitalize="none" autocomplete="username" required></label>
        <label>パスワード<input id="nway-pass" type="password" inputmode="numeric" autocomplete="current-password" required></label>
        <label class="remember"><input id="nway-remember" type="checkbox">次回以降はログインを省略する</label>
        <button type="submit">ログイン</button>
        <div class="login-error" id="nway-error"></div>
      </form>
    </div>`;
    document.body.appendChild(gate);

    const form=document.getElementById('nway-login-form');
    const id=document.getElementById('nway-id');
    const pass=document.getElementById('nway-pass');
    const remember=document.getElementById('nway-remember');
    const error=document.getElementById('nway-error');
    setTimeout(()=>id.focus(),50);

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      error.textContent='確認中…';
      try{
        const [ih,ph]=await Promise.all([sha256(id.value.trim()),sha256(pass.value)]);
        if(ih===ID_HASH&&ph===PASS_HASH){
          sessionStorage.setItem(SESSION_KEY,'1');
          if(remember.checked)localStorage.setItem(REMEMBER_KEY,'1');
          else localStorage.removeItem(REMEMBER_KEY);
          document.documentElement.classList.remove('nway-locked');
          gate.remove();
        }else{
          error.textContent='IDまたはパスワードが違います。';
          pass.value='';
          pass.focus();
        }
      }catch{
        error.textContent='ログイン確認に失敗しました。もう一度試してください。';
      }
    });
  });
})();
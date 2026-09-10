(()=>{
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
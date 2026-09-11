(()=>{
  const URL='https://gwmwynjkhxaywknhakcw.supabase.co';
  const KEY='sb_publishable_lGmCtn4giQA0585yjQb5yw_a9ptkN6Q';
  const TRACKED=['waytest-v1','waytest-history-v1','waytest-volumes-v1','waytest-question-seen-v3','waytest-question-seen-v2'];
  const OWNER='waytest-cloud-owner-v1';
  const LAST='waytest-cloud-updated-at-v1';
  const TABLE='waytest_user_state';
  let client=null,user=null,applying=false,timer=null,busy=false;

  function snapshot(){
    const values={};
    TRACKED.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)values[k]=v});
    return {version:1,values};
  }
  function hasMeaningfulLocal(){
    try{const h=JSON.parse(localStorage.getItem('waytest-history-v1')||'[]');if(Array.isArray(h)&&h.length)return true}catch{}
    try{const s=JSON.parse(localStorage.getItem('waytest-v1')||'{}');if(s&&typeof s==='object'&&Object.keys(s).length)return true}catch{}
    return false;
  }
  function applyState(state){
    applying=true;
    try{
      TRACKED.forEach(k=>localStorage.removeItem(k));
      const v=state&&state.values&&typeof state.values==='object'?state.values:{};
      TRACKED.forEach(k=>{if(typeof v[k]==='string')localStorage.setItem(k,v[k])});
    }finally{applying=false}
  }
  function setStatus(text,kind=''){
    const el=document.getElementById('cloudStatus');if(!el)return;
    el.textContent=text;el.style.color=kind==='err'?'#b42318':kind==='ok'?'#087f5b':'#697386';
  }
  async function pushNow(){
    if(!client||!user||busy)return false;
    if(localStorage.getItem(OWNER)!==user.id)return false;
    busy=true;setStatus('クラウドへ保存中…');
    try{
      const now=new Date().toISOString();
      const {data,error}=await client.from(TABLE).upsert({user_id:user.id,state:snapshot(),updated_at:now},{onConflict:'user_id'}).select('updated_at').single();
      if(error)throw error;
      localStorage.setItem(LAST,data?.updated_at||now);
      setStatus('同期済み','ok');
      return true;
    }catch(e){
      console.error('waytest cloud save failed',e);setStatus('同期に失敗しました。通信を確認してください。','err');return false;
    }finally{busy=false}
  }
  function schedulePush(){
    clearTimeout(timer);timer=setTimeout(()=>pushNow(),700);
  }

  const nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem;
  Storage.prototype.setItem=function(k,v){
    const r=nativeSet.call(this,k,v);
    if(this===localStorage&&!applying&&TRACKED.includes(String(k)))schedulePush();
    return r;
  };
  Storage.prototype.removeItem=function(k){
    const r=nativeRemove.call(this,k);
    if(this===localStorage&&!applying&&TRACKED.includes(String(k)))schedulePush();
    return r;
  };

  async function activate(u){
    if(!u||!client)return;
    user=u;renderUI();setStatus('アカウントの記録を確認中…');
    try{
      const owner=localStorage.getItem(OWNER);
      const localHas=hasMeaningfulLocal();
      const {data,error}=await client.from(TABLE).select('state,updated_at').eq('user_id',u.id).maybeSingle();
      if(error)throw error;

      if(!owner){
        if(localHas){
          localStorage.setItem(OWNER,u.id);
          await pushNow();
          setStatus('この端末の既存記録をアカウントへ引き継ぎました。','ok');
          return;
        }
        if(data){
          applyState(data.state);localStorage.setItem(OWNER,u.id);localStorage.setItem(LAST,data.updated_at||'');
          location.reload();return;
        }
        localStorage.setItem(OWNER,u.id);await pushNow();return;
      }

      if(owner!==u.id){
        if(data){
          applyState(data.state);localStorage.setItem(OWNER,u.id);localStorage.setItem(LAST,data.updated_at||'');
          location.reload();return;
        }
        applyState({version:1,values:{}});localStorage.setItem(OWNER,u.id);localStorage.removeItem(LAST);
        await pushNow();location.reload();return;
      }

      if(data){
        const localLast=localStorage.getItem(LAST)||'';
        if(!localLast||String(data.updated_at||'')>localLast){
          applyState(data.state);localStorage.setItem(LAST,data.updated_at||'');
          location.reload();return;
        }
        setStatus('同期済み','ok');
      }else{
        await pushNow();
      }
    }catch(e){
      console.error('waytest cloud load failed',e);setStatus('クラウド記録の読み込みに失敗しました。','err');
    }
  }

  function renderUI(){
    const box=document.getElementById('cloudBox');if(!box)return;
    if(user){
      box.innerHTML=`<div class="ttl">Supabaseアカウント同期</div><div class="sub"><b>${escapeHtml(user.email||'ログイン中')}</b> の記録として保存します。別端末でも同じアカウントで続きから使えます。</div><div class="acts"><button class="b" id="cloudSyncNow">今すぐ同期</button><button class="b danger" id="cloudLogout">ログアウト</button></div><div class="sub" id="cloudStatus" style="margin-top:7px">同期状態を確認中…</div>`;
      document.getElementById('cloudSyncNow').onclick=()=>pushNow();
      document.getElementById('cloudLogout').onclick=async()=>{await pushNow();await client.auth.signOut();user=null;renderUI();setStatus('ログアウトしました。端末の記録は残っています。')};
    }else{
      box.innerHTML=`<div class="ttl">Supabaseアカウント同期</div><div class="sub">既存のSupabaseアカウントでログインすると、最初はこの端末の記録をそのまま引き継ぎ、その後はアカウントごとにクラウド保存します。</div><input id="cloudEmail" type="email" placeholder="メールアドレス" autocomplete="username"><input id="cloudPass" type="password" placeholder="パスワード" autocomplete="current-password"><div class="acts"><button class="pri" id="cloudLogin">ログインして同期</button></div><div class="sub" id="cloudStatus" style="margin-top:7px"></div>`;
      document.getElementById('cloudLogin').onclick=async()=>{
        const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPass').value;
        if(!email||!password)return setStatus('メールアドレスとパスワードを入力してください。','err');
        setStatus('ログイン中…');
        const {data,error}=await client.auth.signInWithPassword({email,password});
        if(error)return setStatus('ログインできませんでした。入力内容を確認してください。','err');
        user=data.user;renderUI();await activate(user);
      };
    }
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  window.addEventListener('DOMContentLoaded',async()=>{
    const note=document.querySelector('.note');if(!note)return;
    const box=document.createElement('div');box.className='box';box.id='cloudBox';note.insertAdjacentElement('afterend',box);renderUI();
    if(!window.supabase?.createClient){setStatus('同期機能を読み込めませんでした。','err');return}
    client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data:{session}}=await client.auth.getSession();
    if(session?.user){user=session.user;renderUI();await activate(user)}
    client.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'){user=null;renderUI();return}
      if(session?.user&&session.user.id!==user?.id)setTimeout(()=>activate(session.user),0);
    });
  });
})();
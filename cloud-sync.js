(()=>{
  const URL='https://gwmwynjkhxaywknhakcw.supabase.co';
  const KEY='sb_publishable_lGmCtn4giQA0585yjQb5yw_a9ptkN6Q';
  const TABLE='waytest_user_state';
  const TRACKED=['waytest-v1','waytest-history-v1','waytest-volumes-v1','waytest-question-seen-v3','waytest-question-seen-v2'];
  const META='waytest-cloud-meta-v2';
  const DIRTY='waytest-cloud-dirty-v2';
  const BACKUP='waytest-data-backups-v1';
  let client=null,user=null,applying=false,timer=null,busy=false,statusText='未ログイン';

  const nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem;
  const safeJSON=(s,f)=>{try{return JSON.parse(s)}catch{return f}};
  const snapshot=()=>{const values={};TRACKED.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)values[k]=v});return values};
  function meaningful(values=snapshot()){
    const h=safeJSON(values['waytest-history-v1']||'[]',[]),s=safeJSON(values['waytest-v1']||'{}',{}),seen=safeJSON(values['waytest-question-seen-v3']||values['waytest-question-seen-v2']||'[]',[]);
    return (Array.isArray(h)&&h.length>0)||(s&&typeof s==='object'&&Object.keys(s).length>0)||(Array.isArray(seen)&&seen.length>0);
  }
  function backup(reason){
    try{const cur=snapshot();if(!Object.keys(cur).length)return;let list=safeJSON(localStorage.getItem(BACKUP)||'[]',[]);if(!Array.isArray(list))list=[];list.unshift({date:new Date().toISOString(),signature:JSON.stringify(cur),data:cur,reason});nativeSet.call(localStorage,BACKUP,JSON.stringify(list.slice(0,10)))}catch{}
  }
  function meta(){return safeJSON(localStorage.getItem(META)||'null',null)}
  function setMeta(updatedAt){nativeSet.call(localStorage,META,JSON.stringify({userId:user?.id||null,lastCloudUpdatedAt:updatedAt||null,syncedAt:new Date().toISOString()}));nativeRemove.call(localStorage,DIRTY)}
  function cloudValues(state){return state&&state.format==='waytest-cloud-v2'&&state.values&&typeof state.values==='object'?state.values:(state&&state.values&&typeof state.values==='object'?state.values:{});}
  function parseStats(s){const x=safeJSON(s||'{}',{});return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
  function mergeStats(a,b){const o={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const x=a[k]||{},y=b[k]||{};o[k]={ok:Math.max(+x.ok||0,+y.ok||0),ng:Math.max(+x.ng||0,+y.ng||0),mid:Math.max(+x.mid||0,+y.mid||0)}}return o}
  function mergeHistory(a,b){const aa=safeJSON(a||'[]',[]),bb=safeJSON(b||'[]',[]),m=new Map();[...(Array.isArray(aa)?aa:[]),...(Array.isArray(bb)?bb:[])].forEach(h=>{const sig=JSON.stringify([h?.date,h?.score,h?.volumes,h?.answers]);if(!m.has(sig))m.set(sig,h)});return [...m.values()].sort((x,y)=>new Date(y?.date||0)-new Date(x?.date||0)).slice(0,100)}
  function mergeList(a,b){const aa=safeJSON(a||'[]',[]),bb=safeJSON(b||'[]',[]);return [...new Set([...(Array.isArray(aa)?aa:[]),...(Array.isArray(bb)?bb:[])])]}
  function mergeValues(local,cloud){
    const out={...cloud,...local};
    out['waytest-v1']=JSON.stringify(mergeStats(parseStats(local['waytest-v1']),parseStats(cloud['waytest-v1'])));
    out['waytest-history-v1']=JSON.stringify(mergeHistory(local['waytest-history-v1'],cloud['waytest-history-v1']));
    const lv=safeJSON(local['waytest-volumes-v1']||'null',null),cv=safeJSON(cloud['waytest-volumes-v1']||'null',null);
    out['waytest-volumes-v1']=JSON.stringify(Array.isArray(lv)&&lv.length?lv:(Array.isArray(cv)&&cv.length?cv:[1,2,6]));
    out['waytest-question-seen-v3']=JSON.stringify(mergeList(local['waytest-question-seen-v3'],cloud['waytest-question-seen-v3']));
    out['waytest-question-seen-v2']=JSON.stringify(mergeList(local['waytest-question-seen-v2'],cloud['waytest-question-seen-v2']));
    return out;
  }
  function applyValues(values,reason){backup(reason);applying=true;try{TRACKED.forEach(k=>nativeRemove.call(localStorage,k));TRACKED.forEach(k=>{if(typeof values[k]==='string')nativeSet.call(localStorage,k,values[k])})}finally{applying=false}}
  function setStatus(text,kind=''){statusText=text;const el=document.getElementById('cloudStatus');if(el){el.textContent=text;el.style.color=kind==='err'?'#b42318':kind==='ok'?'#087f5b':'#697386'}}

  async function fetchCloud(){const {data,error}=await client.from(TABLE).select('state,updated_at').eq('user_id',user.id).maybeSingle();if(error)throw error;return data}
  async function pushValues(values=snapshot()){
    if(!client||!user||busy)return false;busy=true;setStatus('クラウドへ保存中…');
    try{const now=new Date().toISOString(),state={format:'waytest-cloud-v2',savedAt:now,values};const {data,error}=await client.from(TABLE).upsert({user_id:user.id,state,updated_at:now},{onConflict:'user_id'}).select('updated_at').single();if(error)throw error;setMeta(data?.updated_at||now);setStatus('同期済み','ok');return true}
    catch(e){console.error('waytest cloud save failed',e);setStatus('同期に失敗しました。通信を確認してください。','err');return false}
    finally{busy=false}
  }
  function schedulePush(){if(!user||applying)return;nativeSet.call(localStorage,DIRTY,'1');clearTimeout(timer);timer=setTimeout(()=>pushValues(),900)}

  Storage.prototype.setItem=function(k,v){const r=nativeSet.call(this,k,v);if(this===localStorage&&!applying&&TRACKED.includes(String(k)))schedulePush();return r};
  Storage.prototype.removeItem=function(k){const r=nativeRemove.call(this,k);if(this===localStorage&&!applying&&TRACKED.includes(String(k)))schedulePush();return r};

  async function activate(u){
    if(!u||!client)return;user=u;renderUI();setStatus('アカウントの記録を確認中…');
    try{
      const local=snapshot(),localMeta=meta(),dirty=localStorage.getItem(DIRTY)==='1',row=await fetchCloud();
      if(!row){await pushValues(local);setStatus('この端末の記録をアカウントへ保存しました。','ok');return}
      const cloud=cloudValues(row.state);
      if(!localMeta||localMeta.userId!==u.id){
        if(meaningful(local)){
          const merged=mergeValues(local,cloud);applyValues(merged,'before-first-cloud-merge');await pushValues(merged);setStatus('端末の既存記録を残してアカウント記録と統合しました。','ok');
        }else{applyValues(cloud,'before-cloud-restore');setMeta(row.updated_at);setStatus('アカウントの記録を読み込みました。','ok')}
        return;
      }
      if(dirty){const merged=mergeValues(local,cloud);applyValues(merged,'before-dirty-cloud-merge');await pushValues(merged);return}
      const ct=new Date(row.updated_at||0).getTime(),lt=new Date(localMeta.lastCloudUpdatedAt||0).getTime();
      if(ct>lt+1000){applyValues(cloud,'before-newer-cloud-restore');setMeta(row.updated_at);setStatus('別端末の新しい記録を読み込みました。','ok')}else setStatus('同期済み','ok');
    }catch(e){console.error('waytest cloud load failed',e);setStatus('クラウド記録の読み込みに失敗しました。','err')}
  }

  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function renderUI(){
    const note=document.querySelector('.note');if(!note)return;let box=document.getElementById('cloudBox');if(!box){box=document.createElement('div');box.className='box';box.id='cloudBox';note.insertAdjacentElement('afterend',box)}
    if(!client){box.innerHTML='<div class="ttl">Supabaseアカウント同期</div><div class="sub">同期機能を読み込めませんでした。端末の記録はそのまま使えます。</div>';return}
    if(user){
      box.innerHTML=`<div class="ttl">Supabaseアカウント同期</div><div class="sub"><b>${escapeHtml(user.email||'ログイン中')}</b> の記録として自動保存中です。別端末でも同じアカウントで続きから使えます。</div><div class="acts"><button class="pri" id="cloudSyncNow">今すぐ同期</button><button class="b danger" id="cloudLogout">ログアウト</button></div><div class="sub" id="cloudStatus" style="margin-top:7px">${escapeHtml(statusText)}</div>`;
      document.getElementById('cloudSyncNow').onclick=()=>pushValues();
      document.getElementById('cloudLogout').onclick=async()=>{const ok=await pushValues();if(!ok)return alert('最新記録を保存できなかったためログアウトを中止しました。');if(!confirm('ログアウトします。学習記録はこのアカウントのクラウドに残ります。'))return;backup('before-cloud-logout');const {error}=await client.auth.signOut({scope:'local'});if(error)return alert(error.message);applying=true;try{TRACKED.forEach(k=>nativeRemove.call(localStorage,k));nativeRemove.call(localStorage,META);nativeRemove.call(localStorage,DIRTY)}finally{applying=false}location.reload()};
    }else{
      box.innerHTML=`<div class="ttl">Supabaseアカウント同期</div><div class="sub">ログインすると、<b>最初はこの端末にある記録を消さずに</b>アカウント保存へ移行します。その後はアカウントごとに自動同期します。</div><input id="cloudEmail" type="email" placeholder="メールアドレス" autocomplete="email"><input id="cloudPass" type="password" placeholder="パスワード" autocomplete="current-password"><div class="acts"><button class="pri" id="cloudLogin">ログインして同期</button><button class="b" id="cloudSignup">新規登録</button></div><div class="sub" id="cloudStatus" style="margin-top:7px">${escapeHtml(statusText)}</div>`;
      const email=document.getElementById('cloudEmail'),pass=document.getElementById('cloudPass');
      const login=async()=>{if(!email.value.trim()||!pass.value)return setStatus('メールアドレスとパスワードを入力してください。','err');setStatus('ログイン中…');const {data,error}=await client.auth.signInWithPassword({email:email.value.trim(),password:pass.value});if(error)return setStatus('ログインできませんでした。入力内容を確認してください。','err');if(data?.user)await activate(data.user)};
      document.getElementById('cloudLogin').onclick=login;pass.addEventListener('keydown',e=>{if(e.key==='Enter')login()});
      document.getElementById('cloudSignup').onclick=async()=>{if(!email.value.trim()||!pass.value)return setStatus('メールアドレスとパスワードを入力してください。','err');setStatus('登録中…');const {data,error}=await client.auth.signUp({email:email.value.trim(),password:pass.value});if(error)return setStatus(error.message,'err');if(data?.session&&data?.user)await activate(data.user);else setStatus('登録しました。確認メールが届いた場合は、メール内のリンクを開いてからログインしてください。','ok')};
    }
  }

  async function init(){
    if(!window.supabase?.createClient){statusText='同期ライブラリ読込エラー';return}
    client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'nway-supabase-auth-v1'}});
    window.waytestSupabase=client;
    const {data,error}=await client.auth.getUser();
    if(!error&&data?.user)await activate(data.user);else{user=null;statusText='未ログイン'}
    client.auth.onAuthStateChange((event,session)=>{setTimeout(async()=>{if(event==='SIGNED_IN'&&session?.user){if(!user||user.id!==session.user.id)await activate(session.user)}else if(event==='SIGNED_OUT'){user=null;statusText='未ログイン';renderUI()}},0)});
  }

  window.__WAYTEST_SYNC_READY=(async()=>{try{await init()}catch(e){console.error(e);statusText='同期初期化エラー'}})();
  window.addEventListener('DOMContentLoaded',()=>{renderUI();window.__WAYTEST_SYNC_READY.finally(renderUI)});
  window.addEventListener('pagehide',()=>{if(user&&localStorage.getItem(DIRTY)==='1')pushValues()});
})();
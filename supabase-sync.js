(()=>{
  const SUPABASE_URL='https://gwmwynjkhxaywknhakcw.supabase.co';
  const SUPABASE_KEY='sb_publishable_lGmCtn4giQA0585yjQb5yw_a9ptkN6Q';
  const TABLE='waytest_user_state';
  const DATA_KEYS=['waytest-v1','waytest-history-v1','waytest-volumes-v1','waytest-question-seen-v3','waytest-question-seen-v2'];
  const META_KEY='waytest-cloud-meta-v1';
  const DIRTY_KEY='waytest-cloud-dirty-v1';
  const BACKUP_KEY='waytest-data-backups-v1';
  let client=null,currentUser=null,applying=false,syncTimer=null,lastStatus='未ログイン';

  const rawSet=Storage.prototype.setItem;
  const rawRemove=Storage.prototype.removeItem;

  function safeJSON(s,fallback){try{return JSON.parse(s)}catch{return fallback}}
  function collect(){const o={};DATA_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)o[k]=v});return o}
  function meaningful(d){
    const stats=safeJSON(d['waytest-v1']||'{}',{}),hist=safeJSON(d['waytest-history-v1']||'[]',[]),seen=safeJSON(d['waytest-question-seen-v3']||d['waytest-question-seen-v2']||'[]',[]);
    return Object.keys(stats||{}).length>0||(Array.isArray(hist)&&hist.length>0)||(Array.isArray(seen)&&seen.length>0);
  }
  function backupCurrent(reason){
    try{
      const current=collect();if(!Object.keys(current).length)return;
      const signature=JSON.stringify(current);
      let backups=safeJSON(localStorage.getItem(BACKUP_KEY)||'[]',[]);if(!Array.isArray(backups))backups=[];
      backups.unshift({date:new Date().toISOString(),signature,data:current,reason});
      rawSet.call(localStorage,BACKUP_KEY,JSON.stringify(backups.slice(0,10)));
    }catch{}
  }
  function setMeta(userId,updatedAt){rawSet.call(localStorage,META_KEY,JSON.stringify({userId,lastCloudUpdatedAt:updatedAt||null,syncedAt:new Date().toISOString()}));rawRemove.call(localStorage,DIRTY_KEY)}
  function getMeta(){return safeJSON(localStorage.getItem(META_KEY)||'null',null)}
  function markDirty(){if(!currentUser||applying)return;rawSet.call(localStorage,DIRTY_KEY,'1');scheduleSync()}
  function parseStats(s){const x=safeJSON(s||'{}',{});return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
  function mergeStats(a,b){const out={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const x=a[k]||{},y=b[k]||{};out[k]={ok:Math.max(+x.ok||0,+y.ok||0),ng:Math.max(+x.ng||0,+y.ng||0),mid:Math.max(+x.mid||0,+y.mid||0)}}return out}
  function mergeHistory(a,b){
    const aa=safeJSON(a||'[]',[]),bb=safeJSON(b||'[]',[]),map=new Map();
    [...(Array.isArray(aa)?aa:[]),...(Array.isArray(bb)?bb:[])].forEach(h=>{const sig=JSON.stringify([h?.date,h?.score,h?.volumes,h?.answers]);if(!map.has(sig))map.set(sig,h)});
    return [...map.values()].sort((x,y)=>new Date(y?.date||0)-new Date(x?.date||0)).slice(0,100)
  }
  function mergeArrayJSON(a,b){const aa=safeJSON(a||'[]',[]),bb=safeJSON(b||'[]',[]);return [...new Set([...(Array.isArray(aa)?aa:[]),...(Array.isArray(bb)?bb:[])])]}
  function mergeData(local,cloud){
    const out={...cloud,...local};
    out['waytest-v1']=JSON.stringify(mergeStats(parseStats(local['waytest-v1']),parseStats(cloud['waytest-v1'])));
    out['waytest-history-v1']=JSON.stringify(mergeHistory(local['waytest-history-v1'],cloud['waytest-history-v1']));
    const lv=safeJSON(local['waytest-volumes-v1']||'null',null),cv=safeJSON(cloud['waytest-volumes-v1']||'null',null);
    out['waytest-volumes-v1']=JSON.stringify(Array.isArray(lv)&&lv.length?lv:(Array.isArray(cv)&&cv.length?cv:[1,2,6]));
    out['waytest-question-seen-v3']=JSON.stringify(mergeArrayJSON(local['waytest-question-seen-v3'],cloud['waytest-question-seen-v3']));
    out['waytest-question-seen-v2']=JSON.stringify(mergeArrayJSON(local['waytest-question-seen-v2'],cloud['waytest-question-seen-v2']));
    return out;
  }
  function unpackState(state){return state&&state.format==='waytest-cloud-v1'&&state.data&&typeof state.data==='object'?state.data:(state&&typeof state==='object'?state:{});}
  function applyData(data,reason){
    backupCurrent(reason);applying=true;
    try{DATA_KEYS.forEach(k=>rawRemove.call(localStorage,k));DATA_KEYS.forEach(k=>{if(typeof data[k]==='string')rawSet.call(localStorage,k,data[k])});}
    finally{applying=false}
  }
  function setStatus(s){lastStatus=s;renderAccountBox()}

  async function fetchCloud(userId){
    const {data,error}=await client.from(TABLE).select('state,updated_at').eq('user_id',userId).maybeSingle();
    if(error)throw error;return data;
  }
  async function saveCloud(data){
    if(!currentUser)throw new Error('ログインしていません');
    setStatus('保存中…');
    const now=new Date().toISOString();
    const state={format:'waytest-cloud-v1',savedAt:now,data};
    const {data:row,error}=await client.from(TABLE).upsert({user_id:currentUser.id,state,updated_at:now},{onConflict:'user_id'}).select('updated_at').single();
    if(error)throw error;
    setMeta(currentUser.id,row?.updated_at||now);setStatus('同期済み');return row?.updated_at||now;
  }
  async function syncNow(){
    if(!currentUser)return false;
    try{await saveCloud(collect());return true}catch(e){console.error(e);setStatus('同期エラー');return false}
  }
  function scheduleSync(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(),900)}

  async function reconcile(user){
    currentUser=user;setStatus('確認中…');
    const local=collect(),meta=getMeta(),dirty=localStorage.getItem(DIRTY_KEY)==='1';
    let row;
    try{row=await fetchCloud(user.id)}catch(e){console.error(e);setStatus('接続エラー');return}
    if(!row){await saveCloud(local);return}
    const cloud=unpackState(row.state);
    if(!meta||meta.userId!==user.id){
      if(meaningful(local)){
        const merged=mergeData(local,cloud);applyData(merged,'before-first-account-merge');await saveCloud(merged);
      }else{applyData(cloud,'before-cloud-restore');setMeta(user.id,row.updated_at);setStatus('同期済み')}
      return;
    }
    if(dirty){const merged=mergeData(local,cloud);applyData(merged,'before-dirty-merge');await saveCloud(merged);return}
    const cloudTime=new Date(row.updated_at||0).getTime(),known=new Date(meta.lastCloudUpdatedAt||0).getTime();
    if(cloudTime>known+1000){applyData(cloud,'before-newer-cloud-restore');setMeta(user.id,row.updated_at)}
    setStatus('同期済み');
  }

  Storage.prototype.setItem=function(k,v){const r=rawSet.call(this,k,v);if(this===localStorage&&DATA_KEYS.includes(k))markDirty();return r};
  Storage.prototype.removeItem=function(k){const r=rawRemove.call(this,k);if(this===localStorage&&DATA_KEYS.includes(k))markDirty();return r};

  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function renderAccountBox(){
    const host=document.querySelector('.w');if(!host||!document.body)return;
    let box=document.getElementById('cloudAccountBox');
    if(!box){box=document.createElement('div');box.id='cloudAccountBox';box.className='box';const note=host.querySelector('.note');if(note?.nextSibling)host.insertBefore(box,note.nextSibling);else host.appendChild(box)}
    if(!client){box.innerHTML='<div class="ttl">クラウド保存</div><div class="sub">Supabaseの読み込みに失敗しました。端末保存はそのまま使えます。</div>';return}
    if(currentUser){
      box.innerHTML=`<div class="ttl">クラウド保存</div><div class="sub"><b>${esc(currentUser.email||'ログイン中')}</b><br>このアカウントごとに点数・履歴・苦手データを保存します。</div><div class="acts"><button class="pri" id="cloudSyncNow">今すぐ同期</button><button class="b" id="cloudLogout">ログアウト</button></div><div class="sub" style="margin-top:7px">状態：<span id="cloudStatus">${esc(lastStatus)}</span></div>`;
      document.getElementById('cloudSyncNow').onclick=()=>syncNow();
      document.getElementById('cloudLogout').onclick=async()=>{
        const ok=await syncNow();if(!ok)return alert('最新記録をクラウドに保存できなかったため、ログアウトを中止しました。');
        if(!confirm('この端末からログアウトします。学習記録はクラウドに残ります。'))return;
        backupCurrent('before-account-logout');
        const {error}=await client.auth.signOut({scope:'local'});if(error)return alert(error.message);
        applying=true;try{DATA_KEYS.forEach(k=>rawRemove.call(localStorage,k));rawRemove.call(localStorage,META_KEY);rawRemove.call(localStorage,DIRTY_KEY)}finally{applying=false}
        location.reload();
      };
    }else{
      box.innerHTML=`<div class="ttl">クラウド保存</div><div class="sub">Supabaseアカウントでログインすると、今この端末にある記録を残したままアカウント保存へ移行できます。</div><input id="cloudEmail" type="email" autocomplete="email" placeholder="メールアドレス"><input id="cloudPass" type="password" autocomplete="current-password" placeholder="パスワード"><div class="acts"><button class="pri" id="cloudLogin">ログイン</button><button class="b" id="cloudSignup">新規登録</button></div><div class="sub" id="cloudMessage" style="margin-top:7px">状態：${esc(lastStatus)}</div>`;
      const email=document.getElementById('cloudEmail'),pass=document.getElementById('cloudPass'),msg=document.getElementById('cloudMessage');
      async function login(){msg.textContent='ログイン中…';const {data,error}=await client.auth.signInWithPassword({email:email.value.trim(),password:pass.value});if(error){msg.textContent=error.message;return}if(data?.user){await reconcile(data.user);renderAccountBox()}}
      document.getElementById('cloudLogin').onclick=login;
      document.getElementById('cloudSignup').onclick=async()=>{msg.textContent='登録中…';const {data,error}=await client.auth.signUp({email:email.value.trim(),password:pass.value});if(error){msg.textContent=error.message;return}if(data?.session&&data?.user){await reconcile(data.user);renderAccountBox()}else msg.textContent='登録しました。確認メールが届いた場合は、メール内のリンクを開いてからログインしてください。'};
      pass.addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    }
  }

  async function init(){
    if(!window.supabase?.createClient){lastStatus='ライブラリ読込エラー';return}
    client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'nway-supabase-auth-v1'}});
    window.waytestSupabase=client;
    const {data,error}=await client.auth.getUser();
    if(!error&&data?.user){await reconcile(data.user)}else{currentUser=null;lastStatus='未ログイン'}
    client.auth.onAuthStateChange((event,session)=>{
      setTimeout(async()=>{
        if(event==='SIGNED_IN'&&session?.user){if(!currentUser||currentUser.id!==session.user.id)await reconcile(session.user);else{currentUser=session.user;renderAccountBox()}}
        if(event==='SIGNED_OUT'){currentUser=null;lastStatus='未ログイン';renderAccountBox()}
      },0)
    });
  }

  window.__WAYTEST_SYNC_READY=(async()=>{try{await init()}catch(e){console.error(e);lastStatus='同期初期化エラー'}})();
  window.addEventListener('DOMContentLoaded',()=>{renderAccountBox();window.__WAYTEST_SYNC_READY.finally(renderAccountBox)});
  window.addEventListener('pagehide',()=>{if(currentUser&&localStorage.getItem(DIRTY_KEY)==='1')syncNow()});
})();
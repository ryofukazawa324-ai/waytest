(()=>{
  const DATA_KEYS=[
    'waytest-v1',
    'waytest-history-v1',
    'waytest-volumes-v1',
    'waytest-question-seen-v3',
    'waytest-question-seen-v2',
    'waytest-memorandum-v1'
  ];
  const BACKUP_KEY='waytest-data-backups-v1';
  const PREFIX='NWAY1-';

  function encodeText(s){
    const bytes=new TextEncoder().encode(s);
    let bin='';
    for(let i=0;i<bytes.length;i+=0x8000){
      bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
    }
    return btoa(bin);
  }
  function decodeText(s){
    const bin=atob(s);
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function exportPayload(){
    const data={};
    DATA_KEYS.forEach(k=>{
      const v=localStorage.getItem(k);
      if(v!==null)data[k]=v;
    });
    return {
      format:'nway-transfer-v1',
      createdAt:new Date().toISOString(),
      data
    };
  }
  function makeCode(){
    return PREFIX+encodeText(JSON.stringify(exportPayload()));
  }
  function parseCode(code){
    const raw=String(code||'').trim().replace(/\s+/g,'');
    if(!raw.startsWith(PREFIX))throw new Error('このサイト用の引き継ぎコードではありません。');
    const obj=JSON.parse(decodeText(raw.slice(PREFIX.length)));
    if(!obj||obj.format!=='nway-transfer-v1'||!obj.data||typeof obj.data!=='object'){
      throw new Error('引き継ぎコードの形式が正しくありません。');
    }
    return obj;
  }
  function backupCurrent(){
    try{
      const current={};
      let has=false;
      DATA_KEYS.forEach(k=>{
        const v=localStorage.getItem(k);
        if(v!==null){current[k]=v;has=true;}
      });
      if(!has)return;
      const signature=JSON.stringify(current);
      let backups=[];
      try{backups=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]')}catch{backups=[]}
      if(!Array.isArray(backups))backups=[];
      backups.unshift({date:new Date().toISOString(),signature,data:current,reason:'before-transfer-import'});
      localStorage.setItem(BACKUP_KEY,JSON.stringify(backups.slice(0,10)));
    }catch(e){console.warn('transfer backup skipped',e)}
  }
  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch{return false;}
  }
  function ensureUI(){
    const app=document.getElementById('app');
    if(!app||document.getElementById('transferBox'))return;
    const isHistory=[...app.querySelectorAll('.ttl')].some(el=>el.textContent.includes('点数の推移'));
    if(!isHistory)return;

    const box=document.createElement('div');
    box.className='box';
    box.id='transferBox';
    box.innerHTML=`
      <div class="ttl">記録の引き継ぎ</div>
      <div class="sub">機種変更・別ブラウザへ、点数・回答履歴・苦手データ・覚書の習得記録などをまとめて移せます。ログイン情報は含みません。</div>
      <div class="acts">
        <button class="pri" id="makeTransfer">引き継ぎコードを作る</button>
        <button class="b" id="openImport">コードから復元</button>
      </div>
      <div id="exportArea" style="display:none;margin-top:10px">
        <textarea id="transferOut" readonly style="min-height:120px;font-size:11px"></textarea>
        <div class="acts"><button class="b" id="copyTransfer">コードをコピー</button></div>
        <div class="sub" id="copyStatus" style="margin-top:6px"></div>
      </div>
      <div id="importArea" style="display:none;margin-top:10px">
        <textarea id="transferIn" placeholder="古い端末で作った引き継ぎコードを貼り付け" style="min-height:120px;font-size:11px"></textarea>
        <div class="acts"><button class="pri" id="restoreTransfer">この記録を復元</button></div>
        <div class="sub" id="restoreStatus" style="margin-top:6px"></div>
      </div>`;
    app.appendChild(box);

    const exportArea=document.getElementById('exportArea');
    const importArea=document.getElementById('importArea');
    const out=document.getElementById('transferOut');
    const input=document.getElementById('transferIn');
    const copyStatus=document.getElementById('copyStatus');
    const restoreStatus=document.getElementById('restoreStatus');

    document.getElementById('makeTransfer').onclick=async()=>{
      const code=makeCode();
      out.value=code;
      exportArea.style.display='block';
      importArea.style.display='none';
      const ok=await copyText(code);
      copyStatus.textContent=ok?'引き継ぎコードをコピーしました。新しい端末で貼り付けてください。':'コードを表示しました。「コードをコピー」を押してください。';
    };
    document.getElementById('copyTransfer').onclick=async()=>{
      const ok=await copyText(out.value);
      if(!ok){out.focus();out.select();copyStatus.textContent='自動コピーできませんでした。選択されたコードを手動でコピーしてください。';}
      else copyStatus.textContent='コピーしました。';
    };
    document.getElementById('openImport').onclick=()=>{
      importArea.style.display=importArea.style.display==='none'?'block':'none';
      exportArea.style.display='none';
      if(importArea.style.display==='block')setTimeout(()=>input.focus(),50);
    };
    document.getElementById('restoreTransfer').onclick=()=>{
      restoreStatus.textContent='';
      try{
        const obj=parseCode(input.value);
        const hist=obj.data['waytest-history-v1'];
        let count='';
        try{const h=JSON.parse(hist||'[]');if(Array.isArray(h))count=`（本番記録 ${h.length}回）`;}catch{}
        if(!confirm(`この引き継ぎ記録${count}で現在の学習記録を置き換えます。よろしいですか？`))return;
        backupCurrent();
        DATA_KEYS.forEach(k=>localStorage.removeItem(k));
        DATA_KEYS.forEach(k=>{
          if(Object.prototype.hasOwnProperty.call(obj.data,k)&&typeof obj.data[k]==='string')localStorage.setItem(k,obj.data[k]);
        });
        restoreStatus.textContent='復元しました。画面を更新します。';
        setTimeout(()=>location.reload(),350);
      }catch(e){
        restoreStatus.textContent=e?.message||'引き継ぎコードを読み込めませんでした。';
      }
    };
  }

  window.addEventListener('DOMContentLoaded',()=>{
    const app=document.getElementById('app');
    if(!app)return;
    const mo=new MutationObserver(()=>ensureUI());
    mo.observe(app,{childList:true,subtree:true});
    ensureUI();
  });
})();
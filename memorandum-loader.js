(()=>{
  const OLD3='大きな夢を持てを目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const NEW3='大きな夢を持て。目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const OLD10='先を視て、OODAの実践と部下の育成が、リーダーの貢献を拡大し、自己の成長を促す。';
  const NEW10='先を視て、OODAの実践と部下の育成が、マネジャーの貢献を拡大し、自己の成長を促す。';
  const INIT_OLD="window.addEventListener('DOMContentLoaded',ensureLauncher);";
  const INIT_NEW="if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',ensureLauncher);else ensureLauncher();";
  const ACTIVE_MARKER="  let active=false,track='business',level='choice',idx=0,selected=[];";
  const FINISH_MARKER="  function renderFinish(){state.sessionStarted=false;save();";
  const RENDER_OLD="  function renderQuestion(){const main=app(),set=TRACKS[track],item=set.items[idx],st=getStat(track,idx,level),n=set.items.length;selected=[];if(!item)return renderFinish();";
  const RENDER_NEW="  function renderQuestion(){const main=app(),set=TRACKS[track],item=set.items[idx];if(item&&track==='manager'&&(level==='choice'||level==='input'))randomizeManagerBlanks(item);const st=getStat(track,idx,level),n=set.items.length;selected=[];if(!item)return renderFinish();";
  const TOKEN_OLD="return esc(text).replace(/@@(\\d+)@@/g";
  const TOKEN_NEW="return esc(`${idx+1}. ${text}`).replace(/@@(\\d+)@@/g";
  const PARTICLE_PATCH=`  const particleAdds={
    business:{0:['と'],1:['と'],3:['は'],6:['と'],8:['で']},
    manager:{0:['で'],1:['と'],4:['で'],6:['と'],7:['に'],9:['と']},
    actions:{1:['を'],3:['で'],4:['を']}
  };
  Object.entries(particleAdds).forEach(([trackName,rows])=>{
    Object.entries(rows).forEach(([i,parts])=>{
      const item=TRACKS[trackName].items[Number(i)];
      parts.forEach(p=>{if(item.text.includes(p)&&!item.words.includes(p))item.words.push(p)});
      item.words.sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
    });
  });
  TRACKS.manager.items.forEach(item=>{item._blankPool=[...item.words]});
  function randomizeManagerBlanks(item){
    TRACKS.manager.items.forEach(x=>{if(x._blankPool)x.words=[...x._blankPool]});
    const pool=[...(item._blankPool||item.words)].filter(w=>item.text.includes(w));
    if(pool.length<=2){item.words=pool;return}
    const min=Math.max(2,Math.ceil(pool.length*.4));
    const max=Math.max(min,Math.min(pool.length,Math.ceil(pool.length*.65)));
    const count=min+Math.floor(Math.random()*(max-min+1));
    item.words=shuffle(pool).slice(0,count).sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
  }
  function renderDoneList(count,includeEnd=false){
    if(!count&&!includeEnd)return '';
    const set=TRACKS[track],limit=Math.min(count,set.items.length);
    const rows=set.items.slice(0,limit).map((item,i)=>\`<div style="padding:8px 0;border-bottom:1px solid #e6e9f0;line-height:1.65"><b>\${i+1}.</b> \${esc(item.text)}</div>\`).join('');
    const end=includeEnd?\`<div style="padding:10px 0 2px;font-weight:900">以上</div>\`:'';
    return \`<div class="box"><div class="ttl">\${includeEnd?'完成形':'ここまでの完成文'}</div><div style="font-size:14px">\${rows}\${end}</div></div>\`;
  }
`;
  const FINISH_PATCH=`  function renderFinish(){return renderClosing()}
  function renderClosing(){
    const main=app(),set=TRACKS[track];
    main.innerHTML=\`<div data-memo-root>\${renderDoneList(set.items.length)}<div class="box"><div class="ttl">\${esc(set.title)}｜最後の締め</div><div class="q">最後に「以上」と入力してください。</div><input id="memoEndInput" autocomplete="off" autocapitalize="none" placeholder="ここに入力"><div class="acts"><button class="pri" id="memoEndCheck">締める</button></div><div class="sub" id="memoEndMsg" style="margin-top:8px"></div></div></div>\`;
    const input=document.getElementById('memoEndInput'),msg=document.getElementById('memoEndMsg');
    const check=()=>{
      if(norm(input.value)==='以上'){renderFinalFinish();return}
      msg.textContent='「以上」と入力してください。';
      msg.style.color='#b42318';
      input.classList.add('memoWrong');
      input.focus();
    };
    document.getElementById('memoEndCheck').onclick=check;
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check()}});
    setTimeout(()=>input.focus(),30);
  }
  function renderFinalFinish(){state.sessionStarted=false;save();`;
  fetch('memorandum-v2.js?v=2',{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('覚書データを読み込めませんでした');return r.text()})
    .then(src=>{
      if(!src.includes(OLD3))throw new Error('第3訓の訂正対象が見つかりませんでした');
      if(!src.includes(OLD10))throw new Error('第10訓の訂正対象が見つかりませんでした');
      src=src.replace(OLD3,NEW3).replace(OLD10,NEW10);
      if(src.includes(ACTIVE_MARKER))src=src.replace(ACTIVE_MARKER,PARTICLE_PATCH+ACTIVE_MARKER);
      if(src.includes(RENDER_OLD))src=src.replace(RENDER_OLD,RENDER_NEW);
      else throw new Error('ランダム穴埋めの適用箇所が見つかりませんでした');
      if(src.includes(TOKEN_OLD))src=src.replace(TOKEN_OLD,TOKEN_NEW);
      else throw new Error('番号表示の適用箇所が見つかりませんでした');
      src=src.split('esc(item.text)').join('esc(`${idx+1}. ${item.text}`)');
      const qStart=src.indexOf('  function renderQuestion(){');
      const qEnd=src.indexOf('  function renderChoice',qStart);
      if(qStart>=0&&qEnd>qStart){
        let block=src.slice(qStart,qEnd);
        block=block.replace('main.innerHTML=`<div data-memo-root>','main.innerHTML=`<div data-memo-root>${renderDoneList(idx)}');
        src=src.slice(0,qStart)+block+src.slice(qEnd);
      }else throw new Error('積み上げ表示の適用箇所が見つかりませんでした');
      if(src.includes(FINISH_MARKER))src=src.replace(FINISH_MARKER,FINISH_PATCH);
      const fStart=src.indexOf('  function renderFinalFinish(){');
      const fEnd=src.indexOf("  window.addEventListener('DOMContentLoaded'",fStart);
      if(fStart>=0&&fEnd>fStart){
        let block=src.slice(fStart,fEnd);
        block=block.replace('main.innerHTML=`<div data-memo-root>','main.innerHTML=`<div data-memo-root>${renderDoneList(total(),true)}');
        src=src.slice(0,fStart)+block+src.slice(fEnd);
      }else throw new Error('完成形表示の適用箇所が見つかりませんでした');
      if(src.includes(INIT_OLD))src=src.replace(INIT_OLD,INIT_NEW);
      (0,eval)(src+'\n//# sourceURL=memorandum-v2-corrected.js');
    })
    .catch(e=>{console.error('覚書の読み込みに失敗しました',e);});
})();
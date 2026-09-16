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
  const RENDER_NEW="  function renderQuestion(){const main=app(),set=TRACKS[track],item=set.items[idx];if(item&&(level==='choice'||level==='input'))prepareDenseBlanks(item);const st=getStat(track,idx,level),n=set.items.length;selected=[];if(!item)return renderFinish();";
  const TOKEN_OLD="return esc(text).replace(/@@(\\d+)@@/g";
  const TOKEN_NEW="return esc(`${idx+1}. ${text}`).replace(/@@(\\d+)@@/g";
  const DENSE_PATCH=`  const denseBlankMap={
    business:[
      {required:['目標と','熱意をもって','人生','時間は','平等','結果は','公正']},
      {required:['準備して','時間と','期限を守れ','己に勝って','信用増大']},
      {required:['優先順位をつけ','実行','一分の速さは','力なり']},
      {required:['整理','整頓','清掃','清潔','躾','習慣は','人格を作る']},
      {required:['相談','連絡','報告を','多く行え','自分の成長の','糧']},
      {required:['考え方は','幹から','先に','森の成果を','目指せ']},
      {required:['反復','改善しろ','時間の短縮と','結果の向上を'],optional:['ではなく']},
      {required:['良い事は','まねて','上まわれ','新しい','企画創造'],optional:['次は']},
      {required:['無理に','挑戦','知恵','心','勇気で','全力行動']},
      {required:['競争無くして','成長なし','ゲーム感覚で','自らの幸せを']}
    ],
    manager:[
      {required:['自己マネジメントしろ','世間の目は','厳しい','仕事で','みんなの手本に','なれ'],optional:['まず']},
      {required:['エバンジェリストたれ','勇気をもっての','伝導と','許しは','部下と','自分を磨く']},
      {required:['大きな夢を持て','目標と','時と','施策と','役割優先を','記せ','計画となる','必ず達成すると','人に誓え'],optional:['それが']},
      {required:['人の目利きをせよ','指導は','視ること','聞くことから','質問へ','企画','参画(2.56)で','決定へ','議して','決して','書して','納得して','必ず実行を'],optional:['会議では']},
      {required:['相談されたら','即決断','できない時は','期日指定で','回答を','信頼を作る'],optional:['それが']},
      {required:['提案は','すべて許可','前提','現状','マイナス','原因','どうすれば','どうなる','をチェックし','コミットを','忘れるな']},
      {required:['数字だけを','見るな','プロセスを','注視せよ','個人別中間チェックによる','問題発見と','治療が','部下の成長と','部門の業績向上に','繋がる']},
      {required:['困難でも','あきらめるな','継続して','目標に近づく','努力をしろ']},
      {required:['成果と','プロセスに対して','オープンな','信賞必罰を','厳しく','暖かく','行動で','示そう']},
      {required:['先を視て','OODAの実践と','部下の育成が','マネジャーの貢献を','拡大し','自己の成長を','促す']}
    ],
    actions:[
      {required:['自ら学び','自ら販買する']},
      {required:['自ら5Sし','自ら買い場を','作る']},
      {required:['従業員を','観察から','質問し','育成を','行う']},
      {required:['個人名で','気配りと','信賞必罰を','行う']},
      {required:['自らアイデアを','出し','自ら他部門に','応援する']}
    ]
  };
  Object.entries(denseBlankMap).forEach(([trackName,rows])=>{
    rows.forEach((cfg,i)=>{
      const item=TRACKS[trackName].items[i];
      if(!item)return;
      item._denseRequired=(cfg.required||[]).filter(w=>item.text.includes(w));
      item._denseOptional=(cfg.optional||[]).filter(w=>item.text.includes(w));
    });
  });
  function prepareDenseBlanks(item){
    const required=[...(item._denseRequired||item.words||[])];
    const optional=(item._denseOptional||[]).filter(w=>Math.random()<.35);
    item.words=[...new Set([...required,...optional])]
      .filter(w=>item.text.includes(w))
      .sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
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
      if(src.includes(ACTIVE_MARKER))src=src.replace(ACTIVE_MARKER,DENSE_PATCH+ACTIVE_MARKER);
      if(src.includes(RENDER_OLD))src=src.replace(RENDER_OLD,RENDER_NEW);
      else throw new Error('高密度穴埋めの適用箇所が見つかりませんでした');
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
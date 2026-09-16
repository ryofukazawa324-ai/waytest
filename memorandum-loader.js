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
  const RENDER_NEW="  function renderQuestion(){const main=app(),set=TRACKS[track],item=set.items[idx];if(item){if(level==='choice')item.words=[...(item._baseWords||item.words)];else if(level==='input')prepareDenseBlanks(item,false);else if(level==='dense')prepareDenseBlanks(item,true)}const st=getStat(track,idx,level),n=set.items.length;selected=[];if(!item)return renderFinish();";
  const DISPATCH_OLD="if(level==='choice')renderChoice(item);else if(level==='input')renderInput(item);else renderFull(item)";
  const DISPATCH_NEW="if(level==='choice')renderChoice(item);else if(level==='input'||level==='dense')renderInput(item);else renderFull(item)";
  const TOKEN_OLD="return esc(text).replace(/@@(\\d+)@@/g";
  const TOKEN_NEW="return esc(`${idx+1}. ${text}`).replace(/@@(\\d+)@@/g";
  const LABEL_OLD="function levelLabel(l){return l==='choice'?'初級・単語選択':l==='input'?'中級・入力穴埋め':'上級・全文入力'}";
  const LABEL_NEW="function levelLabel(l){return l==='choice'?'初級・単語選択':l==='input'?'中級・細かい入力':l==='dense'?'上級・まとめ入力':'最上級・全文入力'}";
  const HOME_OLD="function renderHome(){state.sessionStarted=false;save();const main=app();if(!main)return;document.getElementById('openMemo')?.classList.add('on');const cards=Object.entries(TRACKS).map(([id,t])=>{const a=progressSummary(id,'choice'),b=progressSummary(id,'input'),c=progressSummary(id,'full');return `<button class=\"memoChoice\" data-track=\"${id}\"><b>${esc(t.title)}</b><span class=\"sub\">単語選択 ${a.ok}/${a.total}｜入力穴埋め ${b.ok}/${b.total}｜全文入力 ${c.ok}/${c.total}</span></button>`}).join('');main.innerHTML=`<div data-memo-root><div class=\"box\"><div class=\"memoHead\"><div><div class=\"ttl\">覚書</div><div class=\"sub\">各項目は必ず番号順。途中をランダム出題しません。</div></div><span class=\"memoBadge\">順番固定</span></div><div class=\"memoGrid\">${cards}</div></div></div>`;main.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{track=b.dataset.track;renderLevel()})}";
  const HOME_NEW="function renderHome(){state.sessionStarted=false;save();const main=app();if(!main)return;document.getElementById('openMemo')?.classList.add('on');const cards=Object.entries(TRACKS).map(([id,t])=>{const a=progressSummary(id,'choice'),b=progressSummary(id,'input'),c=progressSummary(id,'dense'),d=progressSummary(id,'full');return `<button class=\"memoChoice\" data-track=\"${id}\"><b>${esc(t.title)}</b><span class=\"sub\">単語選択 ${a.ok}/${a.total}｜細かい入力 ${b.ok}/${b.total}｜まとめ入力 ${c.ok}/${c.total}｜全文入力 ${d.ok}/${d.total}</span></button>`}).join('');main.innerHTML=`<div data-memo-root><div class=\"box\"><div class=\"memoHead\"><div><div class=\"ttl\">覚書</div><div class=\"sub\">各項目は必ず番号順。途中をランダム出題しません。</div></div><span class=\"memoBadge\">順番固定</span></div><div class=\"memoGrid\">${cards}</div></div></div>`;main.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{track=b.dataset.track;renderLevel()})}";
  const LEVEL_OLD="function renderLevel(){const main=app(),title=TRACKS[track].title,n=total();main.innerHTML=`<div data-memo-root><div class=\"box\"><div class=\"ttl\">${esc(title)}｜難易度</div><div class=\"sub\">3モードとも第1項目から第${n}項目まで順番固定です。</div><div class=\"memoLevel\"><button class=\"memoChoice\" data-level=\"choice\"><b>初級：単語選択で穴埋め</b><span class=\"sub\">重要語を候補から選んで文章を完成。</span></button><button class=\"memoChoice\" data-level=\"input\"><b>中級：入力で穴埋め</b><span class=\"sub\">候補なし。空欄に重要語を自分で入力。</span></button><button class=\"memoChoice\" data-level=\"full\"><b>上級：一から全文入力</b><span class=\"sub\">ヒントなしで文章を最初から入力。</span></button></div><div class=\"acts\"><button class=\"b\" id=\"memoBack\">← 覚書トップ</button></div></div></div>`;main.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;idx=0;state.sessionStarted=true;save();renderQuestion()});document.getElementById('memoBack').onclick=renderHome}";
  const LEVEL_NEW="function renderLevel(){const main=app(),title=TRACKS[track].title,n=total();main.innerHTML=`<div data-memo-root><div class=\"box\"><div class=\"ttl\">${esc(title)}｜難易度</div><div class=\"sub\">4モードとも第1項目から第${n}項目まで順番固定です。</div><div class=\"memoLevel\"><button class=\"memoChoice\" data-level=\"choice\"><b>初級：単語選択</b><span class=\"sub\">重要語を候補から選んで穴埋め。</span></button><button class=\"memoChoice\" data-level=\"input\"><b>中級：細かい入力穴埋め</b><span class=\"sub\">単語・文節ごとに分かれた空欄を入力。</span></button><button class=\"memoChoice\" data-level=\"dense\"><b>上級：句読点ごとにまとめて入力</b><span class=\"sub\">句読点まで続く部分を1つの空欄として入力。</span></button><button class=\"memoChoice\" data-level=\"full\"><b>最上級：一から全文入力</b><span class=\"sub\">ヒントなしで文章を最初から入力。</span></button></div><div class=\"acts\"><button class=\"b\" id=\"memoBack\">← 覚書トップ</button></div></div></div>`;main.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;idx=0;state.sessionStarted=true;save();renderQuestion()});document.getElementById('memoBack').onclick=renderHome}";
  const DENSE_PATCH=`  const particleAdds={
    business:{0:['と'],1:['と'],3:['は'],6:['と'],8:['で']},
    manager:{0:['で'],1:['と'],4:['で'],6:['と'],7:['に'],9:['と']},
    actions:{1:['を'],3:['で'],4:['を']}
  };
  Object.entries(particleAdds).forEach(([trackName,rows])=>Object.entries(rows).forEach(([i,parts])=>{
    const item=TRACKS[trackName].items[Number(i)];
    parts.forEach(p=>{if(item.text.includes(p)&&!item.words.includes(p))item.words.push(p)});
    item.words.sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
  }));
  const denseBlankMap={
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
  Object.entries(denseBlankMap).forEach(([trackName,rows])=>rows.forEach((cfg,i)=>{
    const item=TRACKS[trackName].items[i];if(!item)return;
    item._baseWords=[...item.words];
    item._denseRequired=(cfg.required||[]).filter(w=>item.text.includes(w));
    item._denseOptional=(cfg.optional||[]).filter(w=>item.text.includes(w));
  }));
  function prepareDenseBlanks(item,merge){
    const required=[...(item._denseRequired||item._baseWords||item.words||[])];
    const optional=(item._denseOptional||[]).filter(w=>Math.random()<.35);
    const ordered=[...new Set([...required,...optional])]
      .filter(w=>item.text.includes(w))
      .map(w=>({w,start:item.text.indexOf(w)}))
      .sort((a,b)=>a.start-b.start);
    if(!merge){item.words=ordered.map(x=>x.w);return}
    const merged=[];
    ordered.forEach(part=>{
      const end=part.start+part.w.length;
      if(!merged.length){merged.push({w:part.w,start:part.start,end});return}
      const last=merged[merged.length-1],gap=item.text.slice(last.end,part.start);
      if(part.start>=last.end&&gap.trim()===''){last.w=item.text.slice(last.start,end);last.end=end}
      else merged.push({w:part.w,start:part.start,end});
    });
    item.words=merged.map(x=>x.w);
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
    const check=()=>{if(norm(input.value)==='以上'){renderFinalFinish();return}msg.textContent='「以上」と入力してください。';msg.style.color='#b42318';input.classList.add('memoWrong');input.focus()};
    document.getElementById('memoEndCheck').onclick=check;
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check()}});
    setTimeout(()=>input.focus(),30);
  }
  function renderFinalFinish(){state.sessionStarted=false;save();`;
  fetch('memorandum-v2.js?v=3',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('覚書データを読み込めませんでした');return r.text()})
    .then(src=>{
      src=src.replace(OLD3,NEW3).replace(OLD10,NEW10);
      if(src.includes(ACTIVE_MARKER))src=src.replace(ACTIVE_MARKER,DENSE_PATCH+ACTIVE_MARKER);
      if(src.includes(LABEL_OLD))src=src.replace(LABEL_OLD,LABEL_NEW);
      src=src.replace('.memoLevel{display:grid;grid-template-columns:repeat(3,1fr);','.memoLevel{display:grid;grid-template-columns:repeat(2,1fr);');
      if(src.includes(HOME_OLD))src=src.replace(HOME_OLD,HOME_NEW);
      else throw new Error('覚書トップの更新箇所が見つかりませんでした');
      if(src.includes(LEVEL_OLD))src=src.replace(LEVEL_OLD,LEVEL_NEW);
      else throw new Error('難易度選択の更新箇所が見つかりませんでした');
      if(src.includes(RENDER_OLD))src=src.replace(RENDER_OLD,RENDER_NEW);
      else throw new Error('穴埋め難易度の適用箇所が見つかりませんでした');
      if(src.includes(DISPATCH_OLD))src=src.replace(DISPATCH_OLD,DISPATCH_NEW);
      else throw new Error('入力モード分岐の適用箇所が見つかりませんでした');
      src=src.replace('<div class="meta">候補なしで、空欄の言葉を入力</div>','<div class="meta">${level===\'dense\'?\'句読点までをひとまとまりで入力\':\'単語・文節ごとに細かく入力\'}</div>');
      if(src.includes(TOKEN_OLD))src=src.replace(TOKEN_OLD,TOKEN_NEW);
      src=src.split('esc(item.text)').join('esc(`${idx+1}. ${item.text}`)');
      const qStart=src.indexOf('  function renderQuestion(){'),qEnd=src.indexOf('  function renderChoice',qStart);
      if(qStart>=0&&qEnd>qStart){let block=src.slice(qStart,qEnd);block=block.replace('main.innerHTML=`<div data-memo-root>','main.innerHTML=`<div data-memo-root>${renderDoneList(idx)}');src=src.slice(0,qStart)+block+src.slice(qEnd)}
      if(src.includes(FINISH_MARKER))src=src.replace(FINISH_MARKER,FINISH_PATCH);
      const fStart=src.indexOf('  function renderFinalFinish(){'),fEnd=src.indexOf("  window.addEventListener('DOMContentLoaded'",fStart);
      if(fStart>=0&&fEnd>fStart){let block=src.slice(fStart,fEnd);block=block.replace('main.innerHTML=`<div data-memo-root>','main.innerHTML=`<div data-memo-root>${renderDoneList(total(),true)}');src=src.slice(0,fStart)+block+src.slice(fEnd)}
      if(src.includes(INIT_OLD))src=src.replace(INIT_OLD,INIT_NEW);
      (0,eval)(src+'\n//# sourceURL=memorandum-v2-four-levels.js');
    })
    .catch(e=>console.error('覚書の読み込みに失敗しました',e));
})();
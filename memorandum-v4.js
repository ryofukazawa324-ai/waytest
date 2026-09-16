(()=>{
  const KEY='waytest-memorandum-v1';
  const TRACKS={
    business:{title:'ビジネス基本10訓',items:[
      {text:'目標と熱意をもって人生、時間は平等、結果は公正。',words:['目標','熱意','平等','公正']},
      {text:'準備して、時間と期限を守れ。己に勝って信用増大。',words:['準備','時間','期限','己','信用増大']},
      {text:'優先順位をつけ実行。一分の速さは力なり。',words:['優先順位','実行','一分','力']},
      {text:'整理・整頓・清掃・清潔・躾。習慣は人格を作る。',words:['整理','整頓','清掃','清潔','躾','習慣','人格']},
      {text:'相談、連絡、報告を多く行え。自分の成長の糧。',words:['相談','連絡','報告','成長','糧']},
      {text:'考え方は幹から先に。森の成果を目指せ。',words:['幹','森','成果']},
      {text:'反復ではなく改善しろ。時間の短縮と結果の向上を。',words:['反復','改善','時間','結果']},
      {text:'良い事はまねて上まわれ。次は新しい企画創造。',words:['まねて','上まわれ','企画創造']},
      {text:'無理に挑戦。知恵、心、勇気で全力行動。',words:['無理','知恵','心','勇気','全力行動']},
      {text:'競争無くして成長なし。ゲーム感覚で自らの幸せを。',words:['競争','成長','ゲーム感覚','幸せ']}
    ]},
    manager:{title:'マネジャー10訓',items:[
      {text:'まず自己マネジメントしろ。世間の目は厳しい。仕事でみんなの手本になれ。',words:['自己マネジメント','世間','仕事','手本']},
      {text:'エバンジェリストたれ。勇気をもっての伝導と許しは部下と自分を磨く。',words:['エバンジェリスト','勇気','伝導','許し','部下','自分']},
      {text:'大きな夢を持て。目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。',words:['大きな夢','目標','時','施策','役割優先','計画','達成','誓え']},
      {text:'人の目利きをせよ。指導は視ること聞くことから質問へ、企画・参画(2.56)で決定へ。会議では議して決して書して納得して、必ず実行を。',words:['目利き','視る','聞く','質問','企画','参画(2.56)','議して','決して','書して','納得','実行']},
      {text:'相談されたら、即決断、できない時は期日指定で回答を。それが信頼を作る。',words:['即決断','期日指定','回答','信頼']},
      {text:'提案はすべて許可。前提(現状、マイナス、原因、どうすれば、どうなる)をチェックし、コミットを忘れるな。',words:['提案','許可','前提','現状','マイナス','原因','どうすれば','どうなる','コミット']},
      {text:'数字だけを見るな。プロセスを注視せよ。個人別中間チェックによる問題発見と治療が、部下の成長と部門の業績向上に繋がる。',words:['数字','プロセス','個人別中間チェック','問題発見','治療','成長','業績向上']},
      {text:'困難でもあきらめるな。継続して目標に近づく努力をしろ。',words:['困難','あきらめるな','継続','目標','努力']},
      {text:'成果とプロセスに対して、オープンな信賞必罰を、厳しく暖かく行動で示そう。',words:['成果','プロセス','オープン','信賞必罰','厳しく','暖かく','行動']},
      {text:'先を視て、OODAの実践と部下の育成が、マネジャーの貢献を拡大し、自己の成長を促す。',words:['先','OODA','部下の育成','マネジャーの貢献','自己の成長']}
    ]},
    actions:{title:'マネジャー5つの行動',items:[
      {text:'自ら学び、自ら販買する。',words:['自ら学び','自ら販買']},
      {text:'自ら5Sし、自ら買い場を作る。',words:['自ら5S','自ら買い場']},
      {text:'従業員を観察から質問し、育成を行う。',words:['従業員','観察','質問','育成']},
      {text:'個人名で気配りと信賞必罰を行う。',words:['個人名','気配り','信賞必罰']},
      {text:'自らアイデアを出し、自ら他部門に応援する。',words:['自らアイデア','自ら他部門','応援']}
    ]}
  };

  const particleAdds={
    business:{0:['と'],1:['と'],3:['は'],6:['と'],8:['で']},
    manager:{0:['で'],1:['と'],4:['で'],6:['と'],7:['に'],9:['と']},
    actions:{1:['を'],3:['で'],4:['を']}
  };
  Object.entries(particleAdds).forEach(([t,rows])=>Object.entries(rows).forEach(([i,parts])=>{
    const item=TRACKS[t].items[Number(i)];
    parts.forEach(p=>{if(item.text.includes(p)&&!item.words.includes(p))item.words.push(p)});
    item.words.sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
  }));

  const fineMap={
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
  Object.entries(fineMap).forEach(([t,rows])=>rows.forEach((cfg,i)=>{
    const item=TRACKS[t].items[i];
    item._choiceWords=[...item.words];
    item._fineRequired=(cfg.required||[]).filter(x=>item.text.includes(x));
    item._fineOptional=(cfg.optional||[]).filter(x=>item.text.includes(x));
  }));

  let active=false,track='business',level='choice',idx=0,selected=[];
  const app=()=>document.getElementById('app');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s??'').normalize('NFKC').replace(/\s+/g,'').trim();
  const surfaceKey=s=>norm(s).toLowerCase().replace(/[、。・，,.．!！?？「」『』（）()\[\]【】…：:；;「」“”'’\-ー]/g,'');
  const toHira=s=>String(s??'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
  const fallbackReading=s=>toHira(norm(s).toLowerCase())
    .replace(/視る|見る/g,'みる').replace(/聞く|聴く/g,'きく').replace(/行う|おこなう/g,'おこなう')
    .replace(/暖かく|温かく/g,'あたたかく').replace(/繋がる|つながる/g,'つながる')
    .replace(/販買/g,'はんばい').replace(/参画/g,'さんかく').replace(/信賞必罰/g,'しんしょうひつばつ')
    .replace(/\s+/g,'').replace(/[、。・，,.．!！?？「」『』（）()\[\]【】…：:；;\-ー]/g,'');

  let tokenizerPromise=null;
  function getTokenizer(){
    if(tokenizerPromise)return tokenizerPromise;
    tokenizerPromise=new Promise((resolve,reject)=>{
      if(!window.kuromoji){reject(new Error('kuromoji unavailable'));return}
      window.kuromoji.builder({dicPath:'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'}).build((err,t)=>err?reject(err):resolve(t));
    });
    return tokenizerPromise;
  }
  async function readingKey(s){
    const raw=norm(s);
    try{
      const t=await getTokenizer();
      return t.tokenize(raw).map(x=>toHira(x.reading||x.surface_form||'')).join('').toLowerCase().replace(/\s+/g,'').replace(/[、。・，,.．!！?？「」『』（）()\[\]【】…：:；;\-ー]/g,'');
    }catch{return fallbackReading(raw)}
  }
  async function judgeValue(value,expected){
    if(!norm(value))return 'empty';
    const v=surfaceKey(value),e=surfaceKey(expected);
    if(v===e)return 'right';
    if(e.startsWith(v))return 'progress';
    const [vr,er]=await Promise.all([readingKey(value),readingKey(expected)]);
    if(vr===er)return 'right';
    if(er.startsWith(vr))return 'progress';
    return 'wrong';
  }
  async function isAccepted(value,expected){return (await judgeValue(value,expected))==='right'}

  const load=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}};
  const state=load();state.stats??={};
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const sid=(t,n,l)=>`${t}-${n+1}-${l}`;
  const getStat=(t,n,l)=>state.stats[sid(t,n,l)]||{ok:0,mid:0,ng:0};
  const total=()=>TRACKS[track].items.length;
  function mark(result){const k=sid(track,idx,level);state.stats[k]??={ok:0,mid:0,ng:0};state.stats[k][result]=(state.stats[k][result]||0)+1;state.last={track,level,index:idx,date:new Date().toISOString()};save()}
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);

  function prepareWords(item,kind){
    if(kind==='choice'){item.words=[...item._choiceWords];return}
    const optional=(item._fineOptional||[]).filter(()=>Math.random()<.35);
    const ordered=[...new Set([...(item._fineRequired||item._choiceWords),...optional])]
      .filter(w=>item.text.includes(w)).map(w=>({w,start:item.text.indexOf(w)})).sort((a,b)=>a.start-b.start);
    if(kind==='input'){item.words=ordered.map(x=>x.w);return}
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
  function distractors(item){
    const pools=TRACKS[track].items.flatMap(x=>level==='choice'?x._choiceWords:x._fineRequired);
    return shuffle([...new Set(pools.filter(w=>!item.words.includes(w)))]).slice(0,Math.min(6,Math.max(3,item.words.length>6?5:3)));
  }
  function tokenize(item,values=[]){
    let text=item.text;
    item.words.forEach((word,i)=>{const at=text.indexOf(word);if(at>=0)text=text.slice(0,at)+`@@${i}@@`+text.slice(at+word.length)});
    return esc(`${idx+1}. ${text}`).replace(/@@(\d+)@@/g,(_,n)=>`<span class="memoBlank">${values[+n]?esc(values[+n]):'＿＿＿＿'}</span>`)
  }
  function progressSummary(t,l){let ok=0,done=0;TRACKS[t].items.forEach((_,i)=>{const s=getStat(t,i,l),n=(s.ok||0)+(s.mid||0)+(s.ng||0);if(n)done++;if((s.ok||0)>0)ok++});return {ok,done,total:TRACKS[t].items.length}}
  function levelLabel(l){return l==='choice'?'初級・単語選択':l==='input'?'中級・細かい単語選択':l==='dense'?'上級・まとめ入力':'最上級・全文入力'}

  function injectStyle(){
    if(document.getElementById('memoStyle'))return;
    const s=document.createElement('style');s.id='memoStyle';s.textContent=`
      .memoTop{border:2px solid #6b5cff;background:#f8f7ff}.memoHead{display:flex;justify-content:space-between;gap:10px;align-items:center}.memoBadge{font-size:10px;font-weight:800;background:#ebe8ff;color:#5146c7;border-radius:99px;padding:5px 8px}.memoGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:10px}.memoChoice{padding:12px;border:1px solid #e2e3f1;border-radius:13px;background:#fff;text-align:left}.memoChoice b{display:block;margin-bottom:4px}.memoLevel{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.memoBlank{display:inline-block;min-width:64px;margin:2px 3px;padding:3px 6px;border-bottom:2px solid #6b5cff;background:#f0efff;border-radius:6px;font-weight:800;color:#3c348e}.memoWords{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.memoWord{border:1px solid #cfd3e4;background:#fff;border-radius:10px;padding:8px 10px;font-weight:750}.memoWord.used{opacity:.35}.memoQ{font-size:16px;font-weight:800;line-height:1.9}.memoAnswer{margin-top:12px;padding:11px;background:#f3f6fc;border-left:4px solid #6b5cff;border-radius:10px;line-height:1.75}.memoResult{margin-top:9px;font-size:13px;font-weight:800}.memoFull{min-height:150px}.memoTiny{font-size:10px;color:#737b8a}.memoScore{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.memoScore span{font-size:11px;background:#f3f5fa;border-radius:99px;padding:5px 8px}.memoInputs{display:grid;gap:9px;margin-top:12px}.memoInputRow{display:block}.memoInputRow input{margin:0}.memoFieldState{font-size:10px;margin-top:4px;min-height:14px}.memoWrong{border-color:#d92d20!important;background:#fff5f5!important}.memoRight{border-color:#12b76a!important;background:#f2fff8!important}.memoProgress{border-color:#f0b429!important;background:#fffaf0!important}.memoLive{margin-top:7px;font-size:11px;font-weight:800;min-height:18px}@media(max-width:700px){.memoGrid,.memoLevel{grid-template-columns:1fr}}
    `;document.head.appendChild(s)
  }
  function ensureLauncher(){
    injectStyle();const main=app();if(!main||document.getElementById('memoLauncher'))return;
    const box=document.createElement('div');box.className='box memoTop';box.id='memoLauncher';
    box.innerHTML=`<div class="memoHead"><div><div class="ttl">覚書専用学習</div><div class="sub">第1〜6巻とは混ぜず、各項目を番号順固定で覚えます。</div></div><span class="memoBadge">別枠</span></div><div class="acts"><button class="pri" id="openMemo">覚書を学習する</button></div>`;
    main.parentElement.insertBefore(box,main);
    document.getElementById('openMemo').onclick=()=>{active=true;document.querySelectorAll('[data-m]').forEach(x=>x.classList.remove('on'));renderHome()};
    document.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>{active=false;document.getElementById('openMemo')?.classList.remove('on')}));
    new MutationObserver(()=>{if(active&&!app()?.querySelector('[data-memo-root]'))setTimeout(()=>{if(active)renderQuestionOrHome()},0)}).observe(main,{childList:true,subtree:false})
  }
  function renderQuestionOrHome(){if(active&&state.sessionStarted)renderQuestion();else renderHome()}
  function renderHome(){
    state.sessionStarted=false;save();const main=app();if(!main)return;document.getElementById('openMemo')?.classList.add('on');
    const cards=Object.entries(TRACKS).map(([id,t])=>{const a=progressSummary(id,'choice'),b=progressSummary(id,'input'),c=progressSummary(id,'dense'),d=progressSummary(id,'full');return `<button class="memoChoice" data-track="${id}"><b>${esc(t.title)}</b><span class="sub">単語選択 ${a.ok}/${a.total}｜細かい単語選択 ${b.ok}/${b.total}｜まとめ入力 ${c.ok}/${c.total}｜全文入力 ${d.ok}/${d.total}</span></button>`}).join('');
    main.innerHTML=`<div data-memo-root><div class="box"><div class="memoHead"><div><div class="ttl">覚書</div><div class="sub">各項目は必ず番号順。途中をランダム出題しません。</div></div><span class="memoBadge">順番固定</span></div><div class="memoGrid">${cards}</div></div></div>`;
    main.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{track=b.dataset.track;renderLevel()})
  }
  function renderLevel(){
    const main=app(),title=TRACKS[track].title,n=total();
    main.innerHTML=`<div data-memo-root><div class="box"><div class="ttl">${esc(title)}｜難易度</div><div class="sub">4モードとも第1項目から第${n}項目まで順番固定です。</div><div class="memoLevel"><button class="memoChoice" data-level="choice"><b>初級：単語選択</b><span class="sub">重要語を候補から選んで穴埋め。</span></button><button class="memoChoice" data-level="input"><b>中級：細かい単語・文節を選択</b><span class="sub">候補から正しい単語・文節を順番に選んで穴埋め。</span></button><button class="memoChoice" data-level="dense"><b>上級：句読点ごとにまとめて入力</b><span class="sub">句読点まで続く部分を1つの空欄として入力。入力中に判定します。</span></button><button class="memoChoice" data-level="full"><b>最上級：一から全文入力</b><span class="sub">ヒントなしで全文入力。読みが合えば表記違いも正解扱い。</span></button></div><div class="acts"><button class="b" id="memoBack">← 覚書トップ</button></div></div></div>`;
    main.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;idx=0;state.sessionStarted=true;save();renderQuestion()});document.getElementById('memoBack').onclick=renderHome
  }
  function renderQuestion(){
    const main=app(),set=TRACKS[track],item=set.items[idx];if(!item)return renderClosing();
    prepareWords(item,level==='dense'?'dense':level==='input'?'input':'choice');
    const st=getStat(track,idx,level),n=set.items.length;selected=[];
    main.innerHTML=`<div data-memo-root>${renderDoneList(idx)}<div class="box"><div class="memoHead"><div><div class="ttl">${esc(set.title)}｜${levelLabel(level)}</div><div class="sub">第${idx+1}項目 / ${n}　※順番固定</div></div><span class="memoBadge">${idx+1}/${n}</span></div><div class="prog"><i style="width:${((idx+1)/n)*100}%"></i></div><div class="memoScore"><span>○ ${st.ok||0}</span><span>△ ${st.mid||0}</span><span>× ${st.ng||0}</span></div></div><div class="card" id="memoCard"></div><div class="acts"><button class="b" id="memoQuit">← 難易度選択へ</button><button class="b" id="memoRestart">第1項目からやり直す</button></div></div>`;
    document.getElementById('memoQuit').onclick=renderLevel;document.getElementById('memoRestart').onclick=()=>{idx=0;renderQuestion()};
    if(level==='choice'||level==='input')renderChoice(item);else if(level==='dense')renderInput(item);else renderFull(item)
  }
  function renderChoice(item){
    const card=document.getElementById('memoCard'),options=shuffle([...new Set([...item.words,...distractors(item)])]);
    function draw(){
      card.innerHTML=`<div class="meta">${level==='input'?'候補から単語・文節を順番にタップして穴を埋める':'重要語を順番にタップして穴を埋める'}</div><div class="memoQ">${tokenize(item,selected)}</div><div class="memoWords">${options.map(w=>`<button class="memoWord ${selected.includes(w)?'used':''}" data-word="${esc(w)}" ${selected.includes(w)?'disabled':''}>${esc(w)}</button>`).join('')}</div><div class="acts"><button class="b" id="memoUndo" ${selected.length?'':'disabled'}>← 1つ戻す</button><button class="pri" id="memoCheck" ${selected.length===item.words.length?'':'disabled'}>答え合わせ</button></div>`;
      card.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{if(selected.length<item.words.length){selected.push(b.dataset.word);draw()}});document.getElementById('memoUndo').onclick=()=>{selected.pop();draw()};document.getElementById('memoCheck').onclick=()=>gradeChoice(item)
    }draw()
  }
  function gradeChoice(item){const ok=selected.length===item.words.length&&selected.every((w,i)=>w===item.words[i]);mark(ok?'ok':'ng');showAutoResult(item,ok)}

  function setFieldVisual(input,state,status){
    input.classList.remove('memoRight','memoWrong','memoProgress');
    if(state==='right'){input.classList.add('memoRight');status.textContent='○ 正解';status.style.color='#087f5b'}
    else if(state==='wrong'){input.classList.add('memoWrong');status.textContent='× 違います';status.style.color='#b42318'}
    else if(state==='progress'){input.classList.add('memoProgress');status.textContent='ここまで合っています';status.style.color='#9a6700'}
    else{status.textContent='';status.style.color=''}
  }
  function renderInput(item){
    const card=document.getElementById('memoCard');
    card.innerHTML=`<div class="meta">句読点までをひとまとまりで入力</div><div class="memoQ">${tokenize(item)}</div><div class="memoInputs">${item.words.map((_,i)=>`<label class="memoInputRow"><input data-fill="${i}" autocomplete="off" autocapitalize="none" placeholder="答え"><div class="memoFieldState" data-fill-state="${i}"></div></label>`).join('')}</div><div class="acts"><button class="pri" id="memoInputCheck">答え合わせ</button></div><div class="memoTiny">読みが合えば、ひらがな・カタカナ・同音の表記違いも正解扱い。参画(2.56)は「参画2.56」でもOK。</div>`;
    const inputs=[...card.querySelectorAll('[data-fill]')];
    inputs.forEach((input,i)=>{
      let seq=0,timer=null;
      input.addEventListener('input',()=>{
        clearTimeout(timer);const mine=++seq;
        timer=setTimeout(async()=>{const state=await judgeValue(input.value,item.words[i]);if(mine!==seq)return;setFieldVisual(input,state,card.querySelector(`[data-fill-state="${i}"]`))},180)
      })
    });
    document.getElementById('memoInputCheck').onclick=()=>gradeInput(item)
  }
  async function gradeInput(item){
    const inputs=[...document.querySelectorAll('[data-fill]')],vals=inputs.map(x=>x.value);
    const each=await Promise.all(vals.map((v,i)=>isAccepted(v,item.words[i])));
    inputs.forEach((x,i)=>setFieldVisual(x,each[i]?'right':'wrong',document.querySelector(`[data-fill-state="${i}"]`)));
    const ok=each.every(Boolean);mark(ok?'ok':'ng');setTimeout(()=>showAutoResult(item,ok,vals,each),180)
  }
  function showAutoResult(item,ok,vals=null,each=null){
    const card=document.getElementById('memoCard'),last=idx===total()-1;
    card.innerHTML=`<div class="meta">第${idx+1}項目｜答え合わせ</div><div class="memoResult" style="color:${ok?'#087f5b':'#b42318'}">${ok?'○ 正解':'× もう一度覚える'}</div>${vals?`<div class="sub" style="margin-top:8px">${item.words.map((w,i)=>`${each[i]?'○':'×'} ${esc(vals[i]||'（未入力）')}`).join('<br>')}</div>`:''}<div class="memoAnswer">${esc(item.text)}</div>${ok?'':`<div class="sub" style="margin-top:8px">正答：${item.words.map(esc).join(' → ')}</div>`}<div class="acts"><button class="pri" id="memoNext">${last?'締めへ':'次の項目へ →'}</button><button class="b" id="memoRetry">この項目をもう一度</button></div>`;
    document.getElementById('memoNext').onclick=()=>{idx++;renderQuestion()};document.getElementById('memoRetry').onclick=renderQuestion
  }
  function renderFull(item){
    const card=document.getElementById('memoCard');
    card.innerHTML=`<div class="meta">ヒントなしで一から入力</div><div class="q">第${idx+1}項目の内容を全文入力してください。</div><textarea class="memoFull" id="memoFullInput" placeholder="ここに全文を入力"></textarea><div class="memoLive" id="memoFullState"></div><div class="acts"><button class="pri" id="memoFullCheck">答え合わせ</button><button class="b" id="memoReveal">答えを見る</button></div><div class="memoTiny">読みが合えば表記が違っても正解扱い。句読点・括弧の有無も判定では無視します。</div>`;
    const input=document.getElementById('memoFullInput'),status=document.getElementById('memoFullState');let seq=0,timer=null;
    input.addEventListener('input',()=>{clearTimeout(timer);const mine=++seq;timer=setTimeout(async()=>{const st=await judgeValue(input.value,item.text);if(mine!==seq)return;input.classList.remove('memoRight','memoWrong','memoProgress');if(st==='right'){input.classList.add('memoRight');status.textContent='○ 正解';status.style.color='#087f5b'}else if(st==='wrong'){input.classList.add('memoWrong');status.textContent='× 違う部分があります';status.style.color='#b42318'}else if(st==='progress'){input.classList.add('memoProgress');status.textContent='ここまで合っています';status.style.color='#9a6700'}else{status.textContent=''}},220)});
    document.getElementById('memoFullCheck').onclick=async()=>{const v=input.value,ok=await isAccepted(v,item.text);mark(ok?'ok':'ng');showFullResult(item,v,ok)};
    document.getElementById('memoReveal').onclick=()=>{const v=input.value.trim();if(!v&&!confirm('未入力で答えを見ますか？'))return;showFullResult(item,v,false,true)}
  }
  function showFullResult(item,v,ok,revealOnly=false){
    const card=document.getElementById('memoCard'),last=idx===total()-1;
    card.innerHTML=`<div class="memoResult" style="color:${ok?'#087f5b':'#b42318'}">${ok?'○ 正解':revealOnly?'正答を確認':'× 不正解'}</div><div class="meta" style="margin-top:10px">自分の回答</div><div class="memoAnswer">${esc(v||'（未入力）')}</div><div class="meta" style="margin-top:12px">正答</div><div class="memoAnswer">${esc(item.text)}</div><div class="acts">${revealOnly?'<button class="b" id="memoRetry">この項目をもう一度</button>':`<button class="pri" id="memoNext">${last?'締めへ':'次の項目へ →'}</button><button class="b" id="memoRetry">この項目をもう一度</button>`}</div>`;
    document.getElementById('memoRetry').onclick=renderQuestion;if(!revealOnly)document.getElementById('memoNext').onclick=()=>{idx++;renderQuestion()}
  }

  function renderDoneList(count,includeEnd=false){
    if(!count&&!includeEnd)return '';
    const set=TRACKS[track],limit=Math.min(count,set.items.length);
    const rows=set.items.slice(0,limit).map((item,i)=>`<div style="padding:8px 0;border-bottom:1px solid #e6e9f0;line-height:1.65"><b>${i+1}.</b> ${esc(item.text)}</div>`).join('');
    const end=includeEnd?`<div style="padding:10px 0 2px;font-weight:900">以上</div>`:'';
    return `<div class="box"><div class="ttl">${includeEnd?'完成形':'ここまでの完成文'}</div><div style="font-size:14px">${rows}${end}</div></div>`
  }
  function renderClosing(){
    const main=app(),set=TRACKS[track];
    main.innerHTML=`<div data-memo-root>${renderDoneList(set.items.length)}<div class="box"><div class="ttl">${esc(set.title)}｜最後の締め</div><div class="q">最後に「以上」と入力してください。</div><input id="memoEndInput" autocomplete="off" autocapitalize="none" placeholder="ここに入力"><div class="memoLive" id="memoEndState"></div><div class="acts"><button class="pri" id="memoEndCheck">締める</button></div></div></div>`;
    const input=document.getElementById('memoEndInput'),status=document.getElementById('memoEndState');let seq=0;
    input.addEventListener('input',async()=>{const mine=++seq,st=await judgeValue(input.value,'以上');if(mine!==seq)return;input.classList.remove('memoRight','memoWrong','memoProgress');if(st==='right'){input.classList.add('memoRight');status.textContent='○ 正解';status.style.color='#087f5b'}else if(st==='wrong'){input.classList.add('memoWrong');status.textContent='× 違います';status.style.color='#b42318'}else if(st==='progress'){input.classList.add('memoProgress');status.textContent='ここまで合っています';status.style.color='#9a6700'}else status.textContent=''});
    const check=async()=>{if(await isAccepted(input.value,'以上')){renderFinalFinish();return}status.textContent='「以上」と入力してください。';status.style.color='#b42318';input.classList.add('memoWrong')};
    document.getElementById('memoEndCheck').onclick=check;input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check()}})
  }
  function renderFinalFinish(){
    state.sessionStarted=false;save();const main=app(),set=TRACKS[track],summary=progressSummary(track,level);
    main.innerHTML=`<div data-memo-root>${renderDoneList(total(),true)}<div class="box"><div class="ttl">${esc(set.title)}｜完了</div><div class="q">第1項目から第${set.items.length}項目まで順番に完了しました。</div><div class="sub" style="margin-top:8px">この難易度で一度でも○になった項目：${summary.ok}/${summary.total}</div><div class="acts"><button class="pri" id="memoAgain">もう一度1から</button><button class="b" id="memoHome">覚書トップ</button></div></div></div>`;
    document.getElementById('memoAgain').onclick=()=>{idx=0;state.sessionStarted=true;save();renderQuestion()};document.getElementById('memoHome').onclick=renderHome
  }

  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',ensureLauncher);else ensureLauncher();
})();
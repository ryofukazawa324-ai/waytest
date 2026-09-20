(()=>{
  const BASE='memorandum-v4.js?v=1';
  fetch(BASE,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('覚書本体を読み込めませんでした');return r.text()})
    .then(src=>{
      const replaceBlock=(start,end,replacement)=>{
        const a=src.indexOf(start),b=src.indexOf(end,a);
        if(a<0||b<0)throw new Error('覚書修正箇所が見つかりません: '+start);
        src=src.slice(0,a)+replacement+src.slice(b);
      };

      src=src.replace('句読点まで続く部分を1つの空欄として入力。入力中に判定します。','句読点まで続く部分を1つの空欄として入力。答え合わせ時に判定します。');
      src=src.replace("main.parentElement.insertBefore(box,main);","main.parentElement.insertBefore(box,main);if(document.documentElement.dataset.examRunning==='1')box.style.display='none';");

      replaceBlock('  function renderInput(item){','  async function gradeInput(item){',`  function renderInput(item){
    const card=document.getElementById('memoCard');
    card.innerHTML=\`<div class="meta">句読点までをひとまとまりで入力</div><div class="memoQ">\${tokenize(item)}</div><div class="memoInputs">\${item.words.map((_,i)=>\`<label class="memoInputRow"><input data-fill="\${i}" autocomplete="off" autocapitalize="none" placeholder="答え"><div class="memoFieldState" data-fill-state="\${i}"></div></label>\`).join('')}</div><div class="acts"><button class="pri" id="memoInputCheck">答え合わせ</button></div><div class="memoTiny">入力中は判定しません。答え合わせを押した時だけ、読みも含めて判定します。参画(2.56)は「参画2.56」でもOK。</div>\`;
    document.getElementById('memoInputCheck').onclick=async()=>{
      const btn=document.getElementById('memoInputCheck');
      btn.disabled=true;btn.textContent='判定中…';
      try{await gradeInput(item)}finally{if(document.body.contains(btn)){btn.disabled=false;btn.textContent='答え合わせ'}}
    }
  }
`);

      replaceBlock('  function renderFull(item){','  function showFullResult(item,v,ok,revealOnly=false){',`  function renderFull(item){
    const card=document.getElementById('memoCard');
    card.innerHTML=\`<div class="meta">ヒントなしで一から入力</div><div class="q">第\${idx+1}項目の内容を全文入力してください。</div><textarea class="memoFull" id="memoFullInput" placeholder="ここに全文を入力"></textarea><div class="memoLive" id="memoFullState"></div><div class="acts"><button class="pri" id="memoFullCheck">答え合わせ</button><button class="b" id="memoReveal">答えを見る</button></div><div class="memoTiny">入力中は判定しません。答え合わせを押した時だけ読みも含めて判定します。句読点・括弧の有無は判定では無視します。</div>\`;
    const input=document.getElementById('memoFullInput'),status=document.getElementById('memoFullState');
    document.getElementById('memoFullCheck').onclick=async()=>{
      const btn=document.getElementById('memoFullCheck'),v=input.value;
      btn.disabled=true;btn.textContent='判定中…';status.textContent='';
      const ok=await isAccepted(v,item.text);
      mark(ok?'ok':'ng');showFullResult(item,v,ok)
    };
    document.getElementById('memoReveal').onclick=()=>{const v=input.value.trim();if(!v&&!confirm('未入力で答えを見ますか？'))return;showFullResult(item,v,false,true)}
  }
`);

      replaceBlock('  function renderClosing(){','  function renderFinalFinish(){',`  function renderClosing(){
    const main=app(),set=TRACKS[track];
    main.innerHTML=\`<div data-memo-root>\${renderDoneList(set.items.length)}<div class="box"><div class="ttl">\${esc(set.title)}｜最後の締め</div><div class="q">最後に「以上」と入力してください。</div><input id="memoEndInput" autocomplete="off" autocapitalize="none" placeholder="ここに入力"><div class="memoLive" id="memoEndState"></div><div class="acts"><button class="pri" id="memoEndCheck">締める</button></div></div></div>\`;
    const input=document.getElementById('memoEndInput'),status=document.getElementById('memoEndState');
    const check=async()=>{
      const btn=document.getElementById('memoEndCheck');btn.disabled=true;btn.textContent='判定中…';
      if(await isAccepted(input.value,'以上')){renderFinalFinish();return}
      status.textContent='「以上」と入力してください。';status.style.color='#b42318';input.classList.add('memoWrong');btn.disabled=false;btn.textContent='締める'
    };
    document.getElementById('memoEndCheck').onclick=check;
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();check()}})
  }
`);

      (0,eval)(src+'\n//# sourceURL=memorandum-v5-ime-safe.js');
    })
    .catch(e=>console.error('覚書の読み込みに失敗しました',e));
})();
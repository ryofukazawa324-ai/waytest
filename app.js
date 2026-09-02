let Q=[];
async function boot(){
  try{
    const txt=await fetch('questions-source.html',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('問題データの読込に失敗しました');return r.text()});
    const m=txt.match(/const Q=(\[\[.*?\]\]);let V=/s);
    if(!m)throw new Error('問題データを解析できませんでした');
    Q=JSON.parse(m[1]);
    init();
  }catch(e){document.getElementById('app').innerHTML='<div class="box empty">'+e.message+'。ページを再読み込みしてください。</div>'}
}
function init(){
let selected=JSON.parse(localStorage.getItem('waytest-volumes-v1')||'[1,2,6]').map(Number).filter(v=>[1,2,6].includes(v));
if(!selected.length)selected=[1,2,6];
let M='exam',quiz=[],i=0,locked=false,run=null;
const S=JSON.parse(localStorage.getItem('waytest-v1')||'{}');
const H=JSON.parse(localStorage.getItem('waytest-history-v1')||'[]');
const saveS=()=>localStorage.setItem('waytest-v1',JSON.stringify(S));
const saveH=()=>localStorage.setItem('waytest-history-v1',JSON.stringify(H.slice(0,100)));
const saveV=()=>localStorage.setItem('waytest-volumes-v1',JSON.stringify(selected));
const key=x=>x[0]+'-'+Q.indexOf(x);
const F=()=>Q.filter(x=>selected.includes(x[0]));
const W=()=>Q.filter(x=>selected.includes(x[0])&&(()=>{let s=S[key(x)];return s&&(s.ng||0)+(s.mid||0)>(s.ok||0)})());
const esc=x=>(x||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function sh(a){return [...a].sort(()=>Math.random()-.5)}
function mark(x,r){let k=key(x);S[k]??={ok:0,ng:0,mid:0};S[k][r]=(S[k][r]||0)+1;saveS()}
function volText(vs=selected){return vs.slice().sort((a,b)=>a-b).map(v=>'第'+v+'巻').join('・')}
function fmt(iso){let d=new Date(iso);return d.toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
function applyVolButtons(){document.querySelectorAll('[data-v]').forEach(b=>b.classList.toggle('on',selected.includes(Number(b.dataset.v))))}
function stats(){
  document.getElementById('st').textContent=F().length;
  document.getElementById('sd').textContent=H.length;
  if(H.length){let avg=H.reduce((a,h)=>a+h.score,0)/H.length;document.getElementById('sr').textContent=avg.toFixed(1)+'/10';document.getElementById('sw').textContent=H[0].score+'/10'}else{document.getElementById('sr').textContent='—';document.getElementById('sw').textContent='—'}
}
function padHTML(){return `<div class="handbox"><div class="handlabel">手書き回答 <span>指・Apple Pencil対応</span></div><canvas id="handpad" class="handpad"></canvas><div class="acts handacts"><button class="b" id="undoStroke">↶ 1画戻す</button><button class="b" id="eraser">消しゴム</button><button class="b danger" id="clearPad">全部消す</button></div></div>`}
function setupPad(){
  const c=document.getElementById('handpad');if(!c)return null;
  const ctx=c.getContext('2d');let strokes=[],current=null,erase=false;
  function resize(){
    const rect=c.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1),old=[...strokes];
    c.width=Math.round(rect.width*dpr);c.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';strokes=old;redraw();
  }
  function redraw(){
    const r=c.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,r.width,r.height);
    ctx.strokeStyle='#eef1f6';ctx.lineWidth=1;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(r.width/2,0);ctx.lineTo(r.width/2,r.height);ctx.moveTo(0,r.height/2);ctx.lineTo(r.width,r.height/2);ctx.stroke();ctx.setLineDash([]);
    strokes.forEach(s=>drawStroke(s));
  }
  function drawStroke(s){if(!s.pts.length)return;ctx.globalCompositeOperation=s.erase?'destination-out':'source-over';ctx.strokeStyle=s.erase?'rgba(0,0,0,1)':'#111827';ctx.lineWidth=s.erase?20:3;ctx.beginPath();ctx.moveTo(s.pts[0].x,s.pts[0].y);for(let p of s.pts.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalCompositeOperation='source-over'}
  function pos(e){let r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  c.addEventListener('pointerdown',e=>{e.preventDefault();c.setPointerCapture(e.pointerId);current={erase,pts:[pos(e)]};strokes.push(current)});
  c.addEventListener('pointermove',e=>{if(!current)return;e.preventDefault();current.pts.push(pos(e));redraw()});
  const end=e=>{if(current){e.preventDefault();current=null}};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
  document.getElementById('undoStroke').onclick=()=>{strokes.pop();redraw()};
  document.getElementById('clearPad').onclick=()=>{strokes=[];redraw()};
  document.getElementById('eraser').onclick=()=>{erase=!erase;document.getElementById('eraser').classList.toggle('on',erase);document.getElementById('eraser').textContent=erase?'✎ ペンに戻す':'消しゴム'};
  resize();setTimeout(resize,50);
  return {hasInk:()=>strokes.some(s=>!s.erase&&s.pts.length>1),clear:()=>{strokes=[];redraw()}}
}
document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{
  let v=Number(b.dataset.v);
  if(selected.includes(v)){
    if(selected.length===1){alert('出題する巻を1つ以上選んでください。');return}
    selected=selected.filter(x=>x!==v)
  }else selected.push(v);
  selected.sort((a,b)=>a-b);saveV();applyVolButtons();render()
});
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-m]').forEach(z=>z.classList.remove('on'));b.classList.add('on');M=b.dataset.m;render()
});
function render(){applyVolButtons();stats();if(M==='exam')examHome();if(M==='learn')learn();if(M==='fill')practice(F().filter(x=>x[1]==='穴埋め'),'穴埋め練習');if(M==='lesson')practice(F().filter(x=>x[1]!=='穴埋め'),'概要練習');if(M==='weak')practice(W(),'苦手復習');if(M==='history')historyView()}
function examHome(){
  let last=H[0],prev=H[1],delta=last&&prev?last.score-prev.score:null;
  document.getElementById('app').innerHTML=`<div class="box"><div class="ttl">本番10問</div><div class="q">${volText()} からランダムで10問</div><div class="sub">穴埋め・概要記入・四字熟語を混ぜて出題します。すべて手書きで回答し、正答例を見て「正解 / 不正解」を自己判定します。</div><div class="acts"><button class="pri" id="startExam">10問テストを開始</button></div>${last?`<div class="card"><div class="meta">直近 ${fmt(last.date)}｜${volText(last.volumes)}</div><div class="score">${last.score}/10点 ${delta===null?'':`<span class="delta ${delta>0?'up':delta<0?'down':'flat'}">${delta>0?'↑ +':delta<0?'↓ ':'→ '}${delta}点</span>`}</div></div>`:''}</div>`;
  document.getElementById('startExam').onclick=()=>startExamRun()
}
function startExamRun(){
  let pool=F();if(pool.length<10){alert('選択した巻の問題が10問未満です。');return}
  quiz=sh(pool).slice(0,10);i=0;run={date:new Date().toISOString(),volumes:[...selected],answers:[]};showExam()
}
function showExam(){
  locked=false;let x=quiz[i];
  document.getElementById('app').innerHTML=`<div class="card"><div class="meta">本番10問｜${volText(run.volumes)}｜原本メモ 第${x[0]}巻｜${x[1]}｜${i+1}/10</div><div class="prog"><i style="width:${i*10}%"></i></div><div class="q">${x[2]}</div>${padHTML()}<div class="acts"><button class="pri" id="reveal">答え合わせ</button></div><div class="ans" id="an"><b>正答例：</b>${x[3]}<div class="exp">${x[4]}</div></div><div class="acts" id="judge" style="display:none"><button class="pri" data-j="ok">○ 正解</button><button class="b danger" data-j="ng">× 不正解</button></div></div>`;
  const pad=setupPad();
  document.getElementById('reveal').onclick=()=>{if(!pad.hasInk()&&!confirm('まだ何も書いていません。答えを見ますか？'))return;document.getElementById('an').classList.add('show');document.getElementById('judge').style.display='flex';document.getElementById('reveal').style.display='none';document.querySelectorAll('.handacts button').forEach(b=>b.disabled=true)};
  document.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;let r=b.dataset.j;mark(x,r);run.answers.push({key:key(x),v:x[0],type:x[1],q:x[2],result:r});if(++i<10)showExam();else finishExam()})
}
function finishExam(){
  let score=run.answers.filter(a=>a.result==='ok').length;run.score=score;run.date=new Date().toISOString();H.unshift(run);saveH();stats();
  let prev=H[1],delta=prev?score-prev.score:null;
  let wrong=run.answers.filter(a=>a.result==='ng'),good=run.answers.filter(a=>a.result==='ok');
  document.getElementById('app').innerHTML=`<div class="box"><div class="ttl">本番10問 結果</div><div class="score">${score}/10点 ${delta===null?'':`<span class="delta ${delta>0?'up':delta<0?'down':'flat'}">${delta>0?'↑ +':delta<0?'↓ ':'→ '}${delta}点（前回比）</span>`}</div><div class="sub">${fmt(run.date)}｜${volText(run.volumes)}</div><div class="acts"><button class="pri" id="again">もう一度10問</button><button class="b" id="goHist">記録・傾向を見る</button></div></div>
  <div class="box"><div class="ttl">今回よく確認したいところ</div>${wrong.length?wrong.map(a=>`<div class="rankitem"><div class="rankq">第${a.v}巻｜${esc(a.q)}</div></div>`).join(''):'<div class="good">全問正解！</div>'}</div>
  <div class="box"><div class="ttl">今回合っていたところ</div>${good.map(a=>`<span class="tag">第${a.v}巻 ${esc(a.q).slice(0,24)}${a.q.length>24?'…':''}</span>`).join('')}</div>`;
  document.getElementById('again').onclick=()=>startExamRun();document.getElementById('goHist').onclick=()=>{M='history';document.querySelectorAll('[data-m]').forEach(z=>z.classList.toggle('on',z.dataset.m==='history'));render()}
}
function practice(a,t){
  if(!a.length){document.getElementById('app').innerHTML='<div class="box empty">対象問題がありません。</div>';return}
  quiz=sh(a);i=0;showPractice(t)
}
function showPractice(t){
  locked=false;let x=quiz[i];
  document.getElementById('app').innerHTML=`<div class="card"><div class="meta">${t}｜原本メモ 第${x[0]}巻｜${x[1]}｜${i+1}/${quiz.length}</div><div class="prog"><i style="width:${i/quiz.length*100}%"></i></div><div class="q">${x[2]}</div>${padHTML()}<div class="acts"><button class="pri" id="rev">答え・要点を見る</button></div><div class="ans" id="an"><b>答え：</b>${x[3]}<div class="exp">${x[4]}</div></div><div class="acts" id="grade" style="display:none"><button class="b" data-g="ok">できた</button><button class="b" data-g="mid">あやしい</button><button class="b" data-g="ng">できなかった</button></div></div>`;
  const pad=setupPad();
  document.getElementById('rev').onclick=()=>{if(!pad.hasInk()&&!confirm('まだ何も書いていません。答えを見ますか？'))return;document.getElementById('an').classList.add('show');document.getElementById('grade').style.display='flex';document.getElementById('rev').style.display='none';document.querySelectorAll('.handacts button').forEach(b=>b.disabled=true)};
  document.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;mark(x,b.dataset.g);if(++i<quiz.length)showPractice(t);else render()})
}
function learn(){
  document.getElementById('app').innerHTML='<div class="box"><div class="ttl">学習カード</div><input id="sea" placeholder="キーワード検索（例：5S、君子豹変、AIDEES）"><div id="cards"></div></div>';
  let p=()=>{let k=document.getElementById('sea').value.toLowerCase(),a=F().filter(x=>!k||(x[2]+x[3]+x[4]).toLowerCase().includes(k));document.getElementById('cards').innerHTML=a.length?a.map((x,n)=>`<div class="card"><div class="meta">原本メモ 第${x[0]}巻｜${x[1]}</div><div class="q">${x[2]}</div><div class="ans" id="a${n}"><b>答え：</b>${x[3]}<div class="exp">${x[4]}</div></div><div class="acts"><button class="b" onclick="document.getElementById('a${n}').classList.toggle('show')">答えを見る</button></div></div>`).join(''):'<div class="empty">該当なし</div>'};document.getElementById('sea').oninput=p;p()
}
function aggregate(){
  let m={};H.forEach(h=>(h.answers||[]).forEach(a=>{let z=m[a.key]??={key:a.key,v:a.v,q:a.q,ok:0,ng:0};z[a.result]++;m[a.key]=z}));
  return Object.values(m)
}
function historyView(){
  if(!H.length){document.getElementById('app').innerHTML='<div class="box empty">本番10問の記録はまだありません。</div>';return}
  let a=aggregate(),wrong=a.filter(x=>x.ng).sort((x,y)=>y.ng-x.ng||x.ok-y.ok).slice(0,5),good=a.filter(x=>x.ok).sort((x,y)=>y.ok-x.ok||x.ng-y.ng).slice(0,5);
  let rows=H.slice(0,20).map((h,n)=>{let older=H[n+1],d=older?h.score-older.score:null;return `<div class="hrow"><div class="hhead"><div><b>${fmt(h.date)}</b><div class="rankmeta">${volText(h.volumes)}</div></div><div class="score">${h.score}/10 ${d===null?'':`<span class="delta ${d>0?'up':d<0?'down':'flat'}">${d>0?'↑ +':d<0?'↓ ':'→ '}${d}</span>`}</div></div><div>${(h.answers||[]).filter(a=>a.result==='ng').slice(0,3).map(a=>`<span class="tag">× 第${a.v}巻 ${esc(a.q).slice(0,18)}…</span>`).join('')||'<span class="tag">全問正解</span>'}</div></div>`}).join('');
  document.getElementById('app').innerHTML=`<div class="box"><div class="ttl">点数の推移</div><div class="sub">最新${Math.min(H.length,20)}回を表示。↑↓は前回比です。</div><div class="history">${rows}</div></div>
  <div class="box"><div class="ttl">よく間違えるところ</div><div class="rank">${wrong.length?wrong.map(x=>`<div class="rankitem"><div class="rankq">第${x.v}巻｜${esc(x.q)}</div><div class="rankmeta">不正解 ${x.ng}回／正解 ${x.ok}回</div></div>`).join(''):'<div class="good">まだ目立った苦手はありません。</div>'}</div></div>
  <div class="box"><div class="ttl">よく合っているところ</div><div class="rank">${good.map(x=>`<div class="rankitem"><div class="rankq">第${x.v}巻｜${esc(x.q)}</div><div class="rankmeta">正解 ${x.ok}回／不正解 ${x.ng}回</div></div>`).join('')}</div></div>
  <div class="box"><div class="acts"><button class="b danger" id="clearHist">本番履歴を消去</button></div><div class="volnote">履歴はこの端末のブラウザ内に保存されます。</div></div>`;
  document.getElementById('clearHist').onclick=()=>{if(confirm('本番テストの日時・点数・回答履歴をすべて削除しますか？')){H.splice(0);saveH();render()}}
}
applyVolButtons();render();
}
boot();
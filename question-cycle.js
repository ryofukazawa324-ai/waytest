(()=>{
  const nativeSort=Array.prototype.sort;
  const nativeSetItem=Storage.prototype.setItem;
  const STORAGE_KEY='waytest-question-seen-v2';

  function isQuestionArray(a){
    return Array.isArray(a)&&a.length>0&&a.every(x=>Array.isArray(x)&&x.length>=5&&[1,2,6].includes(Number(x[0])));
  }
  function qid(x){return [x[0],String(x[2]||''),String(x[3]||'')].join('｜')}
  function loadSeen(){try{const a=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return new Set(Array.isArray(a)?a:[])}catch{return new Set()}}
  function saveSeen(set){try{nativeSetItem.call(localStorage,STORAGE_KEY,JSON.stringify(Array.from(set)))}catch{}}
  function questionFromStatKey(k){
    try{
      const m=String(k).match(/^(\d+)-(\d+)$/);if(!m||!Array.isArray(window.Q))return null;
      const x=window.Q[Number(m[2])];
      return x&&Number(x[0])===Number(m[1])?x:null;
    }catch{return null}
  }

  Storage.prototype.setItem=function(k,v){
    if(this===localStorage&&k==='waytest-v1'){
      try{
        const before=JSON.parse(localStorage.getItem(k)||'{}');
        const after=JSON.parse(String(v)||'{}');
        const seen=loadSeen();
        Object.keys(after).forEach(statKey=>{
          const b=before[statKey]||{},a=after[statKey]||{};
          if((a.ok||0)>(b.ok||0)){
            const x=questionFromStatKey(statKey);if(x)seen.add(qid(x));
          }
        });
        saveSeen(seen);
      }catch{}
    }
    return nativeSetItem.call(this,k,v);
  };

  Array.prototype.sort=function(compareFn){
    if(!isQuestionArray(this))return nativeSort.call(this,compareFn);
    nativeSort.call(this,compareFn);
    const pool=Array.from(this),seen=loadSeen(),ids=pool.map(qid);
    if(ids.length&&ids.every(id=>seen.has(id))){ids.forEach(id=>seen.delete(id));saveSeen(seen)}
    const unseen=[],done=[];
    pool.forEach(x=>(seen.has(qid(x))?done:unseen).push(x));
    const ordered=unseen.concat(done);
    ordered.forEach((x,i)=>{this[i]=x});
    return this;
  };
})();
(()=>{
  const nativeSlice=Array.prototype.slice;
  const STORAGE_KEY='waytest-question-cycle-v1';

  function isQuestionArray(a){
    return Array.isArray(a) && a.length>=10 && a.every(x=>Array.isArray(x) && x.length>=5 && [1,2,6].includes(Number(x[0])));
  }

  function qid(x){
    return [x[0],String(x[2]||''),String(x[3]||'')].join('｜');
  }

  function readState(){
    try{
      const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return v && typeof v==='object' ? v : {};
    }catch{return {}}
  }

  function saveState(v){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(v))}catch{}
  }

  Array.prototype.slice=function(start,end){
    if(start===0 && end===10 && isQuestionArray(this)){
      const pool=Array.from(this);
      const poolIds=pool.map(qid);
      const signature=poolIds.slice().sort().join('\n');
      const state=readState();
      const old=state[signature] && Array.isArray(state[signature].seen) ? state[signature].seen : [];
      const seen=new Set(old.filter(id=>poolIds.includes(id)));
      const unseen=pool.filter(x=>!seen.has(qid(x)));
      let selected=[];

      if(unseen.length>=10){
        selected=unseen.slice(0,10);
        selected.forEach(x=>seen.add(qid(x)));
        state[signature]={seen:Array.from(seen),updated:new Date().toISOString()};
      }else{
        selected=unseen.slice();
        const selectedIds=new Set(selected.map(qid));
        const need=10-selected.length;
        const newCycle=pool.filter(x=>!selectedIds.has(qid(x))).slice(0,need);
        selected.push(...newCycle);
        state[signature]={seen:newCycle.map(qid),updated:new Date().toISOString()};
      }

      const keys=Object.keys(state).sort((a,b)=>String(state[b]?.updated||'').localeCompare(String(state[a]?.updated||'')));
      keys.slice(12).forEach(k=>delete state[k]);
      saveState(state);
      return selected;
    }
    return nativeSlice.call(this,start,end);
  };
})();
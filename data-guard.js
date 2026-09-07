(()=>{
  const DATA_KEYS=['waytest-v1','waytest-history-v1','waytest-volumes-v1'];
  const BACKUP_KEY='waytest-data-backups-v1';
  try{
    const current={};
    let hasData=false;
    DATA_KEYS.forEach(k=>{
      const v=localStorage.getItem(k);
      if(v!==null){current[k]=v;hasData=true;}
    });
    if(hasData){
      const signature=JSON.stringify(current);
      let backups=[];
      try{backups=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]')}catch{backups=[]}
      if(!Array.isArray(backups))backups=[];
      if(!backups.length||backups[0].signature!==signature){
        backups.unshift({date:new Date().toISOString(),signature,data:current});
        backups=backups.slice(0,10);
        localStorage.setItem(BACKUP_KEY,JSON.stringify(backups));
      }
    }
  }catch(e){console.warn('answer data backup skipped',e)}

  // 出題はランダムのまま、よく正解している問題だけ少し後ろに回す。
  // 苦手・未習得 ＞ 普通 ＞ よく正解、ただし各グループは重なりを持たせて固定化しない。
  const nativeSort=Array.prototype.sort;
  function isQuestionArray(a){
    return Array.isArray(a)&&a.length>1&&a.every(x=>Array.isArray(x)&&x.length>=5&&[1,2,6].includes(Number(x[0])));
  }
  function statsFor(x){
    try{
      if(typeof Q==='undefined'||!Array.isArray(Q))return null;
      const idx=Q.indexOf(x);
      if(idx<0)return null;
      const all=JSON.parse(localStorage.getItem('waytest-v1')||'{}');
      return all[`${x[0]}-${idx}`]||null;
    }catch{return null}
  }
  function penalty(x){
    const s=statsFor(x);
    if(!s)return 0.18;
    const ok=Number(s.ok)||0,ng=Number(s.ng)||0,mid=Number(s.mid)||0,bad=ng+mid;
    if(bad>ok)return 0;
    if(ok>=3&&ok>=bad+2)return 0.55;
    if(ok>=2&&ok>bad)return 0.35;
    return 0.18;
  }
  Array.prototype.sort=function(compareFn){
    if(isQuestionArray(this)&&typeof compareFn==='function'){
      const decorated=Array.from(this,x=>({x,n:Math.random()+penalty(x)}));
      nativeSort.call(decorated,(a,b)=>a.n-b.n);
      decorated.forEach((z,i)=>{this[i]=z.x});
      return this;
    }
    return nativeSort.call(this,compareFn);
  };
})();
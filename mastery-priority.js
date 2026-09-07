(()=>{
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

  function masteryPenalty(x){
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
      const decorated=Array.from(this,x=>({x,n:Math.random()+masteryPenalty(x)}));
      nativeSort.call(decorated,(a,b)=>a.n-b.n);
      decorated.forEach((z,i)=>{this[i]=z.x});
      return this;
    }
    return nativeSort.call(this,compareFn);
  };
})();
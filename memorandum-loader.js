(()=>{
  const BASE='https://raw.githubusercontent.com/ryofukazawa324-ai/waytest/72ab07192e6e0c3ca583bf09f1d0a862c0ca91ce/memorandum-loader.js';
  const OLD=`  function prepareDenseBlanks(item){
    const required=[...(item._denseRequired||item.words||[])];
    const optional=(item._denseOptional||[]).filter(w=>Math.random()<.35);
    item.words=[...new Set([...required,...optional])]
      .filter(w=>item.text.includes(w))
      .sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
  }`;
  const NEW=`  function prepareDenseBlanks(item){
    const required=[...(item._denseRequired||item.words||[])];
    const optional=(item._denseOptional||[]).filter(w=>Math.random()<.35);
    const ordered=[...new Set([...required,...optional])]
      .filter(w=>item.text.includes(w))
      .map(w=>({w,start:item.text.indexOf(w)}))
      .sort((a,b)=>a.start-b.start);
    const merged=[];
    ordered.forEach(part=>{
      const end=part.start+part.w.length;
      if(!merged.length){merged.push({w:part.w,start:part.start,end});return}
      const last=merged[merged.length-1];
      const gap=item.text.slice(last.end,part.start);
      if(part.start>=last.end&&gap.trim()===''){
        last.w=item.text.slice(last.start,end);
        last.end=end;
      }else merged.push({w:part.w,start:part.start,end});
    });
    item.words=merged.map(x=>x.w);
  }`;
  fetch(BASE,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('覚書ベースを読み込めませんでした');return r.text()})
    .then(src=>{
      if(!src.includes(OLD))throw new Error('空欄結合の適用箇所が見つかりませんでした');
      src=src.replace(OLD,NEW);
      (0,eval)(src+'\n//# sourceURL=memorandum-loader-adjacent-merge.js');
    })
    .catch(e=>console.error('覚書の読み込みに失敗しました',e));
})();
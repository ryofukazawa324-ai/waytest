(()=>{
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    try{
      if(typeof Q==='undefined'||!Array.isArray(Q)||!Q.length){if(tries>200)clearInterval(timer);return}
      let changed=false;
      Q.forEach(x=>{
        if(x[1]!=='穴埋め')return;
        const prompt=String(x[2]||''),answer=String(x[3]||'');
        const hasRealBlank=prompt.includes('＿＿');
        const orderLike=prompt.includes('順番')||prompt.includes('優先する順')||prompt.includes('大事な順');
        const multiAnswer=/[23456789２３４５６７８９一二三四五六七八九]つ答え/.test(prompt)||/[23456789２３４５６７８９一二三四五六七八九]項目/.test(prompt);
        const separatorHeavy=!hasRealBlank&&(answer.includes('→')||(answer.match(/・/g)||[]).length>=2||(answer.match(/／/g)||[]).length>=2);
        if(orderLike||multiAnswer||separatorHeavy){x[1]='文字入力';changed=true}
      });
      clearInterval(timer);
      if(changed){
        const active=document.querySelector('[data-m].on');
        if(active) setTimeout(()=>active.click(),0);
      }
    }catch(e){if(tries>200)clearInterval(timer)}
  },20);
})();
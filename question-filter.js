(()=>{
  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    const res=await originalFetch(input,init);
    if(!url.includes('questions-source.html')) return res;
    const text=await res.text();
    const m=text.match(/const Q=(\[\[.*?\]\]);let V=/s);
    if(!m) return new Response(text,{status:res.status,statusText:res.statusText,headers:res.headers});
    let q=JSON.parse(m[1]);

    // 第1巻の旧「ユニーク最優先」は出題しない。
    q=q.filter(x=>!(x[0]===1 && x[2]==='ユニーク・クオリティ・スピード・コストの中で、最も優先順位が高いのは＿＿＿＿。'));

    // 「順番」「複数項目をまとめて答える」問題は手書きではなく文字入力＋自己判定。
    q=q.map(x=>{
      if(x[1]!=='穴埋め') return x;
      const prompt=String(x[2]||''),answer=String(x[3]||'');
      const hasRealBlank=prompt.includes('＿＿');
      const orderLike=prompt.includes('順番') || prompt.includes('優先する順') || prompt.includes('大事な順');
      const multiAnswer=/[23456789２３４５６７８９一二三四五六七八九]つ答え/.test(prompt) || /[23456789２３４５６７８９一二三四五六七八九]項目/.test(prompt);
      const separatorHeavy=!hasRealBlank && (answer.includes('→') || (answer.match(/・/g)||[]).length>=2 || (answer.match(/／/g)||[]).length>=2);
      return (orderLike||multiAnswer||separatorHeavy) ? [x[0],'文字入力',x[2],x[3],x[4]] : x;
    });

    // AIDEESの順番を答える問題も文字入力。
    q=q.map(x=>{
      const answer=String(x[3]||'');
      const isAideesOrder=String(x[2]||'').includes('AIDEES') &&
        answer.includes('Attention') && answer.includes('Interest') &&
        answer.includes('Desire') && answer.includes('Experience') &&
        answer.includes('Enthusiasm') && answer.includes('Share');
      return isAideesOrder ? [x[0],'文字入力',x[2],x[3],x[4]] : x;
    });

    const newPrompt='第6巻の重要な4項目を、優先する順番で答える。';
    if(!q.some(x=>x[0]===6 && x[2]===newPrompt)){
      q.push([6,'文字入力',newPrompt,'スピード・ユニーク・クオリティ・インカム＆コスト','第6巻では「スピード→ユニーク→クオリティ→インカム＆コスト」の順番を優先して覚える。']);
    }
    const replaced=text.replace(m[0],`const Q=${JSON.stringify(q)};let V=`);
    return new Response(replaced,{status:res.status,statusText:res.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
  };
})();
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
    q=q.filter(x=>!(x[0]===1 && x[2]==='ユニーク・クオリティ・スピード・コストの中で、最も優先順位が高いのは＿＿＿＿。'));
    const oldPrompt='第6巻の重要な4項目を、優先する順番で答える。';
    const newPrompt='事業を達成させるのに大事な4つの項目を、順番に答えてください。';
    q=q.filter(x=>!(x[0]===6 && x[2]===oldPrompt));
    if(!q.some(x=>x[0]===6 && x[2]===newPrompt)){
      q.push([6,'穴埋め',newPrompt,'スピード・ユニーク・クオリティ・インカム＆コスト','第6巻では「スピード→ユニーク→クオリティ→インカム＆コスト」の順番を優先して覚える。']);
    }
    const replaced=text.replace(m[0],`const Q=${JSON.stringify(q)};let V=`);
    return new Response(replaced,{status:res.status,statusText:res.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
  };
})();
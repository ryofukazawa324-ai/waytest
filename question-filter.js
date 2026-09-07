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

    // 5Sは穴埋めではなく、5項目まとめて答える概要問題として扱う。
    q=q.map(x=>x[0]===1&&x[2]==='5Sの「整理」とは？'?[x[0],'教訓',x[2],x[3],x[4]]:x);

    // 四人の部屋：順番だけでなく、A/B/C/Dそれぞれの特徴も答える。
    q=q.map(x=>x[0]===1&&x[2]==='四人の部屋で最も育てやすい順番は？'?[1,'教訓','「四人の部屋」を育てやすい順番に並べ、A君・B君・C君・D君がそれぞれどんな状態の人か答えてください。','育てやすさ：A君→D君→B君→C君／A君＝感じて動くことができる／B君＝感じるが遠慮してしまう／C君＝感じるが依頼心になってしまっている／D君＝感じず、何もせず','原本メモでは、A君はどんどん挑戦させる、B君は意見を促して遠慮をなくす、C君は行動へ落とし込む投げかけ、D君は正しい目を養わせ自分で判断する機会を与える。']:x);

    // 保存済みの回答データのインデックスをずらさないため、削除ではなく出題対象外にする。
    q=q.map(x=>x[0]===6&&x[2]==='心酔した顧客への対応で重要なことは？'?[0,'除外',x[2],x[3],x[4]]:x);

    const oldPrompt='第6巻の重要な4項目を、優先する順番で答える。';
    const newPrompt='事業を達成させるのに大事な4つの項目を、順番に答えてください。';
    q=q.filter(x=>!(x[0]===6 && x[2]===oldPrompt));
    if(!q.some(x=>x[0]===6 && x[2]===newPrompt)){
      q.push([6,'穴埋め',newPrompt,'スピード・ユニーク・クオリティ・インカム＆コスト','第6巻では「スピード→ユニーク→クオリティ→インカム＆コスト」の順番を優先して覚える。']);
    }

    // 五つのジンザイ：5種類と、それぞれの意味をまとめて答える。
    const jPrompt='「五つのジンザイ」を順番に並べ、それぞれの意味を答えてください。';
    if(!q.some(x=>x[0]===1&&x[2]===jPrompt)){
      q.push([1,'教訓',jPrompt,'人財→人材→人剤→人在→人罪／人財＝会社にとって宝となる人、革新をもたらす／人材＝会社にとって役立つ人、きっちりとこなしてくれる／人剤＝潤滑剤になってくれる人／人在＝ただいるだけの人／人罪＝周囲に悪い影響を与え、会社の成長を阻害する人','原本メモの「五つのジンザイ」の並びと意味。']);
    }

    // ザイコ：財庫から罪庫までの並びと、それぞれの意味をまとめて答える。
    const zPrompt='「財庫・材庫・剤庫・在庫・罪庫」を順番に並べ、それぞれの意味を答えてください。';
    if(!q.some(x=>x[0]===1&&x[2]===zPrompt)){
      q.push([1,'教訓',zPrompt,'財庫→材庫→剤庫→在庫→罪庫／財庫＝宝となるもの／材庫＝役に立つもの／剤庫＝潤滑剤の役割を果たすもの／在庫＝プラスにもマイナスにもならない、ただあるだけのもの／罪庫＝いつまでも棚に残り続け、収益の悪化を招くもの','原本メモでは、在庫・罪庫はどんどん減らしていく。']);
    }

    const replaced=text.replace(m[0],`const Q=${JSON.stringify(q)};let V=`);
    return new Response(replaced,{status:res.status,statusText:res.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
  };
})();
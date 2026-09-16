(()=>{
  const BASE='https://raw.githubusercontent.com/ryofukazawa324-ai/waytest/02072b2c0a46b24284839201760f924d3ee34102/memorandum-loader.js';
  fetch(BASE,{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error('覚書ベースを読み込めませんでした');return r.text()})
    .then(src=>{
      src=src.replace("l==='input'?'中級・細かい入力'","l==='input'?'中級・細かい単語選択'");
      src=src.replace('｜細かい入力 ${b.ok}/${b.total}','｜細かい単語選択 ${b.ok}/${b.total}');
      src=src.replace('<b>中級：細かい入力穴埋め</b><span class=\\"sub\\">単語・文節ごとに分かれた空欄を入力。</span>','<b>中級：細かい単語・文節を選択</b><span class=\\"sub\\">候補から正しい単語・文節を順番に選んで穴埋め。</span>');
      src=src.replace("if(level==='choice')renderChoice(item);else if(level==='input'||level==='dense')renderInput(item);else renderFull(item)","if(level==='choice'||level==='input')renderChoice(item);else if(level==='dense')renderInput(item);else renderFull(item)");
      src=src.replace('<div class=\"meta\">重要語を順番にタップして穴を埋める</div>','<div class=\"meta\">${level===\'input\'?\'候補から単語・文節を順番にタップして穴を埋める\':\'重要語を順番にタップして穴を埋める\'}</div>');
      (0,eval)(src+'\n//# sourceURL=memorandum-loader-v13-intermediate-choice.js');
    })
    .catch(e=>console.error('覚書の読み込みに失敗しました',e));
})();
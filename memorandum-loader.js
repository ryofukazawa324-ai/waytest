(()=>{
  const OLD='大きな夢を持てを目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const NEW='大きな夢を持て。目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  fetch('memorandum-v2.js?v=1',{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('覚書データを読み込めませんでした');return r.text()})
    .then(src=>{
      if(!src.includes(OLD))throw new Error('訂正対象の文言が見つかりませんでした');
      (0,eval)(src.replace(OLD,NEW)+'\n//# sourceURL=memorandum-v2-corrected.js');
    })
    .catch(e=>{console.error(e);});
})();
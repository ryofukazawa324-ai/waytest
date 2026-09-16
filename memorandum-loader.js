(()=>{
  const OLD3='大きな夢を持てを目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const NEW3='大きな夢を持て。目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const OLD10='先を視て、OODAの実践と部下の育成が、リーダーの貢献を拡大し、自己の成長を促す。';
  const NEW10='先を視て、OODAの実践と部下の育成が、マネジャーの貢献を拡大し、自己の成長を促す。';
  const INIT_OLD="window.addEventListener('DOMContentLoaded',ensureLauncher);";
  const INIT_NEW="if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',ensureLauncher);else ensureLauncher();";
  fetch('memorandum-v2.js?v=1',{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('覚書データを読み込めませんでした');return r.text()})
    .then(src=>{
      if(!src.includes(OLD3))throw new Error('第3訓の訂正対象が見つかりませんでした');
      if(!src.includes(OLD10))throw new Error('第10訓の訂正対象が見つかりませんでした');
      src=src.replace(OLD3,NEW3).replace(OLD10,NEW10);
      if(src.includes(INIT_OLD))src=src.replace(INIT_OLD,INIT_NEW);
      (0,eval)(src+'\n//# sourceURL=memorandum-v2-corrected.js');
    })
    .catch(e=>{console.error('覚書の読み込みに失敗しました',e);});
})();
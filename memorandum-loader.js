(()=>{
  const OLD3='大きな夢を持てを目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const NEW3='大きな夢を持て。目標と時と施策と役割優先を記せ。それが計画となる。必ず達成すると人に誓え。';
  const OLD10='先を視て、OODAの実践と部下の育成が、リーダーの貢献を拡大し、自己の成長を促す。';
  const NEW10='先を視て、OODAの実践と部下の育成が、マネジャーの貢献を拡大し、自己の成長を促す。';
  const INIT_OLD="window.addEventListener('DOMContentLoaded',ensureLauncher);";
  const INIT_NEW="if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',ensureLauncher);else ensureLauncher();";
  const ACTIVE_MARKER="  let active=false,track='business',level='choice',idx=0,selected=[];";
  const PARTICLE_PATCH=`  const particleAdds={
    business:{0:['と'],1:['と'],3:['は'],6:['と'],8:['で']},
    manager:{0:['で'],1:['と'],4:['で'],6:['と'],7:['に'],9:['と']},
    actions:{1:['を'],3:['で'],4:['を']}
  };
  Object.entries(particleAdds).forEach(([trackName,rows])=>{
    Object.entries(rows).forEach(([i,parts])=>{
      const item=TRACKS[trackName].items[Number(i)];
      parts.forEach(p=>{if(item.text.includes(p)&&!item.words.includes(p))item.words.push(p)});
      item.words.sort((a,b)=>item.text.indexOf(a)-item.text.indexOf(b));
    });
  });
`;
  fetch('memorandum-v2.js?v=2',{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('覚書データを読み込めませんでした');return r.text()})
    .then(src=>{
      if(!src.includes(OLD3))throw new Error('第3訓の訂正対象が見つかりませんでした');
      if(!src.includes(OLD10))throw new Error('第10訓の訂正対象が見つかりませんでした');
      src=src.replace(OLD3,NEW3).replace(OLD10,NEW10);
      if(src.includes(ACTIVE_MARKER))src=src.replace(ACTIVE_MARKER,PARTICLE_PATCH+ACTIVE_MARKER);
      if(src.includes(INIT_OLD))src=src.replace(INIT_OLD,INIT_NEW);
      (0,eval)(src+'\n//# sourceURL=memorandum-v2-corrected.js');
    })
    .catch(e=>{console.error('覚書の読み込みに失敗しました',e);});
})();
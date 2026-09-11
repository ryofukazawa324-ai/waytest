(()=>{
  const load=()=>{
    if(document.querySelector('script[data-waytest-app]'))return;
    const s=document.createElement('script');
    s.src='app-v8.js?v=2';
    s.dataset.waytestApp='1';
    document.body.appendChild(s);
  };
  Promise.resolve(window.__WAYTEST_SYNC_READY).catch(e=>console.error(e)).finally(load);
})();
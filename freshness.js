(()=>{
  const LOCAL_BUILD='20260912-0155';
  const CHECK_KEY='waytest-last-version-check';
  const CHECK_EVERY=60*1000;
  async function check(){
    try{
      const now=Date.now();
      const last=Number(sessionStorage.getItem(CHECK_KEY)||0);
      if(now-last<CHECK_EVERY)return;
      sessionStorage.setItem(CHECK_KEY,String(now));
      const r=await fetch('version.json?t='+now,{cache:'no-store'});
      if(!r.ok)return;
      const v=await r.json();
      if(v?.build&&v.build!==LOCAL_BUILD){
        const u=new URL(location.href);
        u.searchParams.set('build',v.build);
        location.replace(u.href);
      }
    }catch(e){console.warn('version check skipped',e)}
  }
  window.addEventListener('pageshow',check);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
  check();
})();
(()=>{
  const DATA_KEYS=['waytest-v1','waytest-history-v1','waytest-volumes-v1'];
  const BACKUP_KEY='waytest-data-backups-v1';
  try{
    const current={};
    let hasData=false;
    DATA_KEYS.forEach(k=>{
      const v=localStorage.getItem(k);
      if(v!==null){current[k]=v;hasData=true;}
    });
    if(!hasData)return;
    const signature=JSON.stringify(current);
    let backups=[];
    try{backups=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]')}catch{backups=[]}
    if(!Array.isArray(backups))backups=[];
    if(!backups.length||backups[0].signature!==signature){
      backups.unshift({date:new Date().toISOString(),signature,data:current});
      backups=backups.slice(0,10);
      localStorage.setItem(BACKUP_KEY,JSON.stringify(backups));
    }
  }catch(e){console.warn('answer data backup skipped',e)}
})();
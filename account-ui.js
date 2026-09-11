(()=>{
  function place(){
    const box=document.getElementById('cloudBox');
    const wrap=document.querySelector('.w');
    if(!box||!wrap)return;
    if(box.parentElement!==wrap||box!==wrap.lastElementChild)wrap.appendChild(box);
    box.classList.add('cloudFooter');
  }
  function style(){
    if(document.getElementById('cloudFooterStyle'))return;
    const s=document.createElement('style');
    s.id='cloudFooterStyle';
    s.textContent=`
      #cloudBox.cloudFooter{margin-top:34px;padding:10px 11px;background:transparent;border:1px solid #e7e9ee;border-radius:12px;box-shadow:none;opacity:.62;color:#7a8393}
      #cloudBox.cloudFooter:hover,#cloudBox.cloudFooter:focus-within{opacity:1;background:#fafbfc}
      #cloudBox.cloudFooter .ttl{font-size:11px;font-weight:700;color:#7a8393;margin-bottom:5px}
      #cloudBox.cloudFooter .sub{font-size:10px;color:#8a92a0;line-height:1.45}
      #cloudBox.cloudFooter input{font-size:12px;padding:8px 9px;margin-top:7px;background:#fff}
      #cloudBox.cloudFooter .acts{margin-top:7px;gap:5px}
      #cloudBox.cloudFooter .b,#cloudBox.cloudFooter .pri{font-size:10px;padding:6px 8px;border-radius:8px}
      #cloudBox.cloudFooter .pri{background:#8b94a5;border-color:#8b94a5}
      #cloudBox.cloudFooter .danger{color:#8a5960;border-color:#ddd3d5}
    `;
    document.head.appendChild(s);
  }
  window.addEventListener('DOMContentLoaded',()=>{
    style();
    const wrap=document.querySelector('.w');
    if(!wrap)return;
    place();
    new MutationObserver(place).observe(wrap,{childList:true,subtree:true});
  });
})();
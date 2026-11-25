// Makes Excel backups save into the phone's Documents folder when running as the installed Android/iOS app.
(function(){
  if(!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())) return;
  function hook(){
    if(!window.XLSX||XLSX.__nat) return false; XLSX.__nat=1;
    XLSX.writeFile=async function(wb,name){
      const b64=XLSX.write(wb,{type:'base64',bookType:'xlsx'});
      const FS=Capacitor.Plugins.Filesystem, SH=Capacitor.Plugins.Share;
      try{ await FS.writeFile({path:name,data:b64,directory:'DOCUMENTS',recursive:true}); }
      catch(e){
        try{ const r=await FS.writeFile({path:name,data:b64,directory:'CACHE'}); await SH.share({title:name,url:r.uri,dialogTitle:'Save backup'}); }catch(e2){}
      }
    };
    return true;
  }
  const iv=setInterval(()=>{ if(hook()) clearInterval(iv); },300); setTimeout(()=>clearInterval(iv),30000);
})();

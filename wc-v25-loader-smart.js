(function(){
  var BASE='./';
  var scripts=document.querySelectorAll('script[src*="wc-v25-loader"]');
  if(scripts.length){var s=scripts[scripts.length-1].src;BASE=s.substring(0,s.lastIndexOf('/')+1);}
  function load(src,delay,cb){
    setTimeout(function(){
      var el=document.createElement('script');
      el.src=BASE+src;
      el.onload=cb||function(){};
      document.head.appendChild(el);
    },delay);
  }
  function init(){
    load('wc-v25-bundle1.js',0,function(){
      load('wc-v25-bundle2.js',300,function(){
        load('wc-v25-bundle3.js',800,function(){
          load('wc-v25-bundle4.js',1200,function(){
            console.log('WC Editor v25 OK');
          });
        });
      });
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
})();

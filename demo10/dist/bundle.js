(()=>{var e,r,t={},o={};function n(e){var r=o[e];if(void 0!==r)return r.exports;var a=o[e]={exports:{}};return t[e](a,a.exports,n),a.exports}n.m=t,n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((r,t)=>(n.f[t](e,r),r)),[])),n.u=e=>e+".bundle.js",n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e={},r="webpack-demo10:",n.l=(t,o,a,i)=>{if(e[t])e[t].push(o);else{var c,u;if(void 0!==a)for(var l=document.getElementsByTagName("script"),s=0;s<l.length;s++){var p=l[s];if(p.getAttribute("src")==t||p.getAttribute("data-webpack")==r+a){c=p;break}}c||(u=!0,(c=document.createElement("script")).charset="utf-8",c.timeout=120,n.nc&&c.setAttribute("nonce",n.nc),c.setAttribute("data-webpack",r+a),c.src=t),e[t]=[o];var d=(r,o)=>{c.onerror=c.onload=null,clearTimeout(h);var n=e[t];if(delete e[t],c.parentNode&&c.parentNode.removeChild(c),n&&n.forEach((e=>e(o))),r)return r(o)},h=setTimeout(d.bind(null,void 0,{type:"timeout",target:c}),12e4);c.onerror=d.bind(null,c.onerror),c.onload=d.bind(null,c.onload),u&&document.head.appendChild(c)}},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var r=n.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={179:0};n.f.j=(r,t)=>{var o=n.o(e,r)?e[r]:void 0;if(0!==o)if(o)t.push(o[2]);else{var a=new Promise(((t,n)=>o=e[r]=[t,n]));t.push(o[2]=a);var i=n.p+n.u(r),c=new Error;n.l(i,(t=>{if(n.o(e,r)&&(0!==(o=e[r])&&(e[r]=void 0),o)){var a=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;c.message="Loading chunk "+r+" failed.\n("+a+": "+i+")",c.name="ChunkLoadError",c.type=a,c.request=i,o[1](c)}}),"chunk-"+r,r)}};var r=(r,t)=>{var o,a,[i,c,u]=t,l=0;if(i.some((r=>0!==e[r]))){for(o in c)n.o(c,o)&&(n.m[o]=c[o]);u&&u(n)}for(r&&r(t);l<i.length;l++)a=i[l],n.o(e,a)&&e[a]&&e[a][0](),e[i[l]]=0},t=self.webpackChunkwebpack_demo10=self.webpackChunkwebpack_demo10||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),n.e(847).then(function(e){var r=n(847);document.open(),document.write("<h1>"+r+"</h1>"),document.close()}.bind(null,n)).catch(n.oe)})();
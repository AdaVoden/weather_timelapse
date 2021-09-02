var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let c,u;function l(t,e){return c||(c=document.createElement("a")),c.href=e,t===c.href}function a(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function i(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function p(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function m(){return h(" ")}function $(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function y(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function v(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function b(t){u=t}const k=[],_=[],x=[],w=[],q=Promise.resolve();let A=!1;function E(t){x.push(t)}let I=!1;const S=new Set;function T(){if(!I){I=!0;do{for(let t=0;t<k.length;t+=1){const e=k[t];b(e),j(e.$$)}for(b(null),k.length=0;_.length;)_.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];S.has(e)||(S.add(e),e())}x.length=0}while(k.length);for(;w.length;)w.pop()();A=!1,I=!1,S.clear()}}function j(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const C=new Set;function M(t,e){t&&t.i&&(C.delete(t),t.i(e))}function N(t,n,s,c){const{fragment:u,on_mount:l,on_destroy:a,after_update:i}=t.$$;u&&u.m(n,s),c||E((()=>{const n=l.map(e).filter(r);a?a.push(...n):o(n),t.$$.on_mount=[]})),i.forEach(E)}function L(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function O(t,e){-1===t.$$.dirty[0]&&(k.push(t),A||(A=!0,q.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,r,s,c,l,a,i,f=[-1]){const p=u;b(e);const h=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:r.context||[]),callbacks:n(),dirty:f,skip_bound:!1,root:r.target||p.$$.root};i&&i(h.root);let m=!1;if(h.ctx=s?s(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return h.ctx&&l(h.ctx[t],h.ctx[t]=r)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](r),m&&O(e,t)),n})):[],h.update(),m=!0,o(h.before_update),h.fragment=!!c&&c(h.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);h.fragment&&h.fragment.l(t),t.forEach(d)}else h.fragment&&h.fragment.c();r.intro&&M(e.$$.fragment),N(e,r.target,r.anchor,r.customElement),T()}b(p)}class D{$destroy(){L(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const F=[];function R(t,e){return{subscribe:X(t,e).subscribe}}function X(e,n=t){let o;const r=new Set;function c(t){if(s(e,t)&&(e=t,o)){const t=!F.length;for(const t of r)t[1](),F.push(t,e);if(t){for(let t=0;t<F.length;t+=2)F[t][0](F[t+1]);F.length=0}}}return{set:c,update:function(t){c(t(e))},subscribe:function(s,u=t){const l=[s,u];return r.add(l),1===r.size&&(o=n(c)||t),s(e),()=>{r.delete(l),0===r.size&&(o(),o=null)}}}}const z=X(5);function B(t){let e;const n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(null),e=n.responseText,e}function H(e,n){return function(e,n,s){const c=!Array.isArray(e),u=c?[e]:e,l=n.length<2;return R(s,(e=>{let s=!1;const i=[];let f=0,d=t;const p=()=>{if(f)return;d();const o=n(c?i[0]:i,e);l?e(o):d=r(o)?o:t},h=u.map(((t,e)=>a(t,(t=>{i[e]=t,f&=~(1<<e),s&&p()}),(()=>{f|=1<<e}))));return s=!0,p(),function(){o(h),d()}}))}([e,n],(([t,e])=>function(t,e){const n=t,o=parseFloat(n.slice(2)),r=parseFloat(n.slice(0,2));return parseFloat(30*r+o/2)/e}(t,e)))}function P(e){let n,r,s,c,u,a,b,k,_,x,w,q,A,E,I,S,T,j,C,M,N,L=G(e[3])+"",O=e[4]?"play":"pause",W=G(e[5])+"";return{c(){n=p("div"),r=p("img"),c=m(),u=p("div"),a=p("div"),b=p("span"),k=h(L),_=m(),x=p("span"),w=h("click anywhere to "),q=h(O),A=h(" / drag to seek"),E=m(),I=p("span"),S=h(W),T=m(),j=p("progress"),g(r,"draggable","false"),l(r.src,s=e[7])||g(r,"src",s),g(r,"alt","Timelapse"),g(r,"class","svelte-13cfdq"),g(b,"class","time svelte-13cfdq"),g(x,"class","svelte-13cfdq"),g(I,"class","time svelte-13cfdq"),g(a,"class","info svelte-13cfdq"),j.value=C=e[3]/e[5]||0,g(j,"class","svelte-13cfdq"),g(u,"class","controls svelte-13cfdq"),v(u,"opacity",e[5]&&e[6]?1:0),g(n,"class","svelte-13cfdq")},m(t,o){var s;f(t,n,o),i(n,r),i(n,c),i(n,u),i(u,a),i(a,b),i(b,k),i(a,_),i(a,x),i(x,w),i(x,q),i(x,A),i(a,E),i(a,I),i(I,S),i(u,T),i(u,j),M||(N=[$(r,"mousemove",e[8]),$(r,"touchmove",(s=e[8],function(t){return t.preventDefault(),s.call(this,t)})),$(r,"mousedown",e[9]),$(r,"mouseup",e[10])],M=!0)},p(t,[e]){128&e&&!l(r.src,s=t[7])&&g(r,"src",s),8&e&&L!==(L=G(t[3])+"")&&y(k,L),16&e&&O!==(O=t[4]?"play":"pause")&&y(q,O),32&e&&W!==(W=G(t[5])+"")&&y(S,W),40&e&&C!==(C=t[3]/t[5]||0)&&(j.value=C),96&e&&v(u,"opacity",t[5]&&t[6]?1:0)},i:t,o:t,d(t){t&&d(n),M=!1,o(N)}}}function G(t){if(isNaN(t))return"...";const e=Math.floor(t/60);return(t=Math.floor(t%60))<10&&(t="0"+t),`${e}:${t}`}function J(e,n,o){let r,s,c,u,l=t,i=t,f=t;var d,p;d=z,p=t=>o(15,r=t),e.$$.on_destroy.push(a(d,p)),e.$$.on_destroy.push((()=>l())),e.$$.on_destroy.push((()=>i())),e.$$.on_destroy.push((()=>f()));let h,m,$,g,y,{allsky:v=!1}=n,b=0,k=!0;const _=1e3/r,x=_/1e3;let w,q,A=!0;function E(t){void 0!==g&&(g.pause(),o(4,k=!0)),h="/images/"+t+"/",o(1,$=function(t){return R(B(t),(function(e){const n=setInterval((async()=>{e(B(t))}),12e4);return function(){clearInterval(n)}}))}(h+"lastimage")),l(),l=a($,(t=>o(16,s=t))),o(0,m=H($,z)),i(),i=a(m,(t=>o(17,c=t))),o(5,y=c),o(3,b=0),o(2,g=function(){const{subscribe:t,set:e,update:n}=X(h+"0000.jpg");let c;function u(){c=setInterval((()=>{b<y&&(n((t=>function(t,e){t=t.split("/").at(-1),console.log(t),t=t.split(".")[0],e=e.split(".")[0];let n,o=parseInt(t)+2,r=parseInt(e);return(o-60)%100==0&&0!==o&&(o-=60,o+=100),o>=r&&(o=r),n=""+o,n=`${h}${n.padStart(4,"0")}.jpg`,n}(t,s))),o(3,b+=x))}),_)}function l(){clearInterval(c)}function a(t){t<0&&(t=0);let n=h+function(t,e,n){const o=t/e*(e*n*2);let r=parseInt(o%60);r%2==1&&(r-=1);const s=parseInt((o-r)/60),c=(""+r).padStart(2,"0");return(""+s).padStart(2,"0")+c+".jpg"}(t,y,r);e(n)}return{subscribe:t,play:()=>u(),pause:()=>l(),seek:t=>a(t)}}()),f(),f=a(g,(t=>o(7,u=t)))}return e.$$set=t=>{"allsky"in t&&o(11,v=t.allsky)},e.$$.update=()=>{2048&e.$$.dirty&&E(v?"AllSkyCamImages":"WeatherCamImages")},[m,$,g,b,k,y,A,u,function(t){if(clearTimeout(w),w=setTimeout((()=>o(6,A=!1)),2500),o(6,A=!0),!y)return;if("touchmove"!==t.type&&!(1&t.buttons))return;const e="touchmove"===t.type?t.touches[0].clientX:t.clientX,{left:n,right:r}=this.getBoundingClientRect();o(3,b=y*(e-n)/(r-n)),g.seek(b)},function(t){q=new Date},function(t){new Date-q<300&&(k?(o(4,k=!1),g.play()):(o(4,k=!0),g.pause()))},v]}class K extends D{constructor(t){super(),W(this,t,J,P,s,{allsky:11})}}function Q(t){let e,n,o,r,s,c,u,l,a,v,b,k,_,x,w,q,A=t[0]?"All Sky":"Weather";return s=new K({props:{allsky:t[0]}}),{c(){var t;e=p("header"),e.innerHTML='<div class="left"><h1>Rothney Astrophysical Observatory</h1></div>  \n\n        <div class="right"><h1>Weather Timelapse</h1></div>',n=m(),o=p("main"),r=p("div"),(t=s.$$.fragment)&&t.c(),c=m(),u=p("div"),l=p("input"),a=m(),v=p("label"),b=h(A),k=m(),_=p("footer"),g(e,"class","flex-container row"),g(r,"class","player"),g(l,"type","checkbox"),g(l,"name","allsky"),g(v,"for","allsky"),g(u,"class","toggle"),g(o,"class","flex-container column")},m(d,p){f(d,e,p),f(d,n,p),f(d,o,p),i(o,r),N(s,r,null),i(o,c),i(o,u),i(u,l),l.checked=t[0],i(u,a),i(u,v),i(v,b),f(d,k,p),f(d,_,p),x=!0,w||(q=$(l,"change",t[1]),w=!0)},p(t,[e]){const n={};1&e&&(n.allsky=t[0]),s.$set(n),1&e&&(l.checked=t[0]),(!x||1&e)&&A!==(A=t[0]?"All Sky":"Weather")&&y(b,A)},i(t){x||(M(s.$$.fragment,t),x=!0)},o(t){!function(t,e,n,o){if(t&&t.o){if(C.has(t))return;C.add(t),(void 0).c.push((()=>{C.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}(s.$$.fragment,t),x=!1},d(t){t&&d(e),t&&d(n),t&&d(o),L(s),t&&d(k),t&&d(_),w=!1,q()}}}function U(t,e,n){let o=!1;return[o,function(){o=this.checked,n(0,o)}]}return new class extends D{constructor(t){super(),W(this,t,U,Q,s,{})}}({target:document.body,props:{}})}();

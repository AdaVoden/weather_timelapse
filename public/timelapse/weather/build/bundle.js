var weather=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let u,c;function i(t,e){return u||(u=document.createElement("a")),u.href=e,t===u.href}function l(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function a(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function m(){return $(" ")}function h(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function y(t){return function(e){return e.preventDefault(),t.call(this,e)}}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function b(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function k(t){c=t}const _=[],x=[],w=[],P=[],S=Promise.resolve();let E=!1;function I(t){w.push(t)}function M(t){P.push(t)}let z=!1;const A=new Set;function T(){if(!z){z=!0;do{for(let t=0;t<_.length;t+=1){const e=_[t];k(e),C(e.$$)}for(k(null),_.length=0;x.length;)x.pop()();for(let t=0;t<w.length;t+=1){const e=w[t];A.has(e)||(A.add(e),e())}w.length=0}while(_.length);for(;P.length;)P.pop()();E=!1,z=!1,A.clear()}}function C(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const N=new Set;function j(t,e){t&&t.i&&(N.delete(t),t.i(e))}function L(t,e,n,o){if(t&&t.o){if(N.has(t))return;N.add(t),undefined.c.push((()=>{N.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function D(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}function O(t){t&&t.c()}function W(t,n,s,u){const{fragment:c,on_mount:i,on_destroy:l,after_update:a}=t.$$;c&&c.m(n,s),u||I((()=>{const n=i.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(I)}function X(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function q(t,e){-1===t.$$.dirty[0]&&(_.push(t),E||(E=!0,S.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function B(e,r,s,u,i,l,a,f=[-1]){const d=c;k(e);const $=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:r.context||[]),callbacks:n(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};a&&a($.root);let m=!1;if($.ctx=s?s(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return $.ctx&&i($.ctx[t],$.ctx[t]=r)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](r),m&&q(e,t)),n})):[],$.update(),m=!0,o($.before_update),$.fragment=!!u&&u($.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);$.fragment&&$.fragment.l(t),t.forEach(p)}else $.fragment&&$.fragment.c();r.intro&&j(e.$$.fragment),W(e,r.target,r.anchor,r.customElement),T()}k(d)}class H{$destroy(){X(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const R=[];function F(t,e){return{subscribe:G(t,e).subscribe}}function G(e,n=t){let o;const r=new Set;function u(t){if(s(e,t)&&(e=t,o)){const t=!R.length;for(const t of r)t[1](),R.push(t,e);if(t){for(let t=0;t<R.length;t+=2)R[t][0](R[t+1]);R.length=0}}}return{set:u,update:function(t){u(t(e))},subscribe:function(s,c=t){const i=[s,c];return r.add(i),1===r.size&&(o=n(u)||t),s(e),()=>{r.delete(i),0===r.size&&(o(),o=null)}}}}const U=G(5);function J(t){let e;const n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(null),e=n.responseText,e}function K(e,n,s){return function(e,n,s){const u=!Array.isArray(e),c=u?[e]:e,i=n.length<2;return F(s,(e=>{let s=!1;const a=[];let f=0,p=t;const d=()=>{if(f)return;p();const o=n(u?a[0]:a,e);i?e(o):p=r(o)?o:t},$=c.map(((t,e)=>l(t,(t=>{a[e]=t,f&=~(1<<e),s&&d()}),(()=>{f|=1<<e}))));return s=!0,d(),function(){o($),p()}}))}([e,n],(([t,e])=>function(t,e,n){const o=parseFloat(t);if(n>o)return 0;const r=o-n,s=Math.floor(r%60);return(30*Math.floor((r-s)/100)+s/2)/e}(t,e,s)))}function Q(e){let n,o;return{c(){n=d("img"),g(n,"draggable","false"),i(n.src,o=e[3])||g(n,"src",o),g(n,"alt","Timelapse")},m(t,e){f(t,n,e)},p(t,[e]){8&e&&!i(n.src,o=t[3])&&g(n,"src",o)},i:t,o:t,d(t){t&&p(n)}}}let V="AllSkyCamImages",Y="WeatherCamImages";function Z(t){return`${String(t).padStart(4,"0")}.jpg`}function tt(t){t=function(t){(t=Math.floor(t))%2==1&&(t=parseInt(t-1));return t}(t);const e=String(t).split("");if(e.length>=2){e.pop();const n=e.pop();parseInt(n)>=6&&(t-=60,t+=100)}return t>2400&&(t=0),t}function et(e,n,o){let r,s,u,c,i=t,a=t,f=()=>(a(),a=l(_,(t=>o(10,s=t))),_),p=t;var d,$;d=U,$=t=>o(11,u=t),e.$$.on_destroy.push(l(d,$)),e.$$.on_destroy.push((()=>i())),e.$$.on_destroy.push((()=>a())),e.$$.on_destroy.push((()=>p()));let m,h,y,g,{paused:v=!0}=n,{time:b}=n,{allsky:k}=n,{totalPlaytime:_}=n;f();const x=1e3/u,w=x/1e3;function P(t){const{subscribe:e,set:n,update:c}=G(m+t);let i;function l(){clearInterval(i)}function a(t){if(t<0&&(t=0),t<s){let e=m+function(t,e){const n=t*e*2;return Z(tt(100*Math.floor(n/60)+Math.floor(n%60)+h))}(t,u);n(e)}}function f(){b<s&&(c((t=>function(t,e){t=t.split("/").at(-1),e=e.split("/").at(-1),t=t.split(".")[0],e=e.split(".")[0];let n=parseInt(t)+2,o=parseInt(e);n=tt(n),n>=o&&(n=o);let r=Z(n);return`${m}${r}`}(t,r))),o(4,b+=w))}return{subscribe:e,play:()=>{i=setInterval((()=>{f()}),x)},pause:()=>l(),seek:t=>a(t),resetStartPoint:()=>function(){l();let t=m+Z(h);n(t)}(),next:()=>f()}}function S(t,e){void 0!==g&&g.pause(),h=e,m=`/images/${t}/`,o(2,y=function(t){return F(J(t),(function(e){const n=setInterval((async()=>{e(J(t))}),12e4);return function(){clearInterval(n)}}))}(m+"lastimage")),i(),i=l(y,(t=>o(9,r=t))),f(o(0,_=K(y,U,e))),o(4,b=0)}function E(t,e){S(t,e);const n=Z(e);o(1,g=P(n)),p(),p=l(g,(t=>o(3,c=t)))}return k?(h=1200,E(V,h)):(h=500,E(Y,h)),e.$$set=t=>{"paused"in t&&o(5,v=t.paused),"time"in t&&o(4,b=t.time),"allsky"in t&&o(6,k=t.allsky),"totalPlaytime"in t&&f(o(0,_=t.totalPlaytime))},e.$$.update=()=>{66&e.$$.dirty&&(k?(S(V,1200),g.resetStartPoint()):(S(Y,500),g.resetStartPoint())),34&e.$$.dirty&&(v?g.pause():g.play()),18&e.$$.dirty&&g.seek(b)},[_,g,y,c,b,v,k]}class nt extends H{constructor(t){super(),B(this,t,et,Q,s,{paused:5,time:4,allsky:6,totalPlaytime:0})}}function ot(t){let e,n,r,s,u,c,i,l,k,_,w,P,S,E,I,z,A,T,C,N,q,B,H,R=rt(t[1])+"",F=t[2]?"play":"pause",G=rt(t[5])+"";function U(e){t[9](e)}function J(e){t[10](e)}let K={paused:t[2],allsky:t[0]};return void 0!==t[1]&&(K.time=t[1]),void 0!==t[3]&&(K.totalPlaytime=t[3]),n=new nt({props:K}),x.push((()=>D(n,"time",U))),x.push((()=>D(n,"totalPlaytime",J))),{c(){e=d("div"),O(n.$$.fragment),u=m(),c=d("div"),i=d("div"),l=d("span"),k=$(R),_=m(),w=d("span"),P=$("click anywhere to "),S=$(F),E=$(" / drag to seek"),I=m(),z=d("span"),A=$(G),T=m(),C=d("progress"),g(l,"class","time svelte-pv6ez4"),g(w,"class","svelte-pv6ez4"),g(z,"class","time svelte-pv6ez4"),g(i,"class","info svelte-pv6ez4"),C.value=N=t[1]/t[5]||0,g(C,"class","svelte-pv6ez4"),g(c,"class","controls svelte-pv6ez4"),b(c,"opacity",t[5]&&t[4]?1:0),g(e,"class","svelte-pv6ez4")},m(o,r){f(o,e,r),W(n,e,null),a(e,u),a(e,c),a(c,i),a(i,l),a(l,k),a(i,_),a(i,w),a(w,P),a(w,S),a(w,E),a(i,I),a(i,z),a(z,A),a(c,T),a(c,C),q=!0,B||(H=[h(e,"mousemove",t[6]),h(e,"touchmove",y(t[6])),h(e,"mousedown",t[7]),h(e,"touchstart",y(t[7])),h(e,"touchend",y(t[8])),h(e,"mouseup",t[8])],B=!0)},p(t,[e]){const o={};4&e&&(o.paused=t[2]),1&e&&(o.allsky=t[0]),!r&&2&e&&(r=!0,o.time=t[1],M((()=>r=!1))),!s&&8&e&&(s=!0,o.totalPlaytime=t[3],M((()=>s=!1))),n.$set(o),(!q||2&e)&&R!==(R=rt(t[1])+"")&&v(k,R),(!q||4&e)&&F!==(F=t[2]?"play":"pause")&&v(S,F),(!q||32&e)&&G!==(G=rt(t[5])+"")&&v(A,G),(!q||34&e&&N!==(N=t[1]/t[5]||0))&&(C.value=N),(!q||48&e)&&b(c,"opacity",t[5]&&t[4]?1:0)},i(t){q||(j(n.$$.fragment,t),q=!0)},o(t){L(n.$$.fragment,t),q=!1},d(t){t&&p(e),X(n),B=!1,o(H)}}}function rt(t){if(isNaN(t))return"...";const e=Math.floor(t/60);return(t=Math.floor(t%60))<10&&(t="0"+t),`${e}:${t}`}function st(e,n,o){let r,s=t;e.$$.on_destroy.push((()=>s()));let u,c,i,{allsky:a=!1}=n,f=0,p=!0,d=!0;return e.$$set=t=>{"allsky"in t&&o(0,a=t.allsky)},[a,f,p,u,d,r,function(t){if(clearTimeout(c),c=setTimeout((()=>o(4,d=!1)),2500),o(4,d=!0),!u)return;if("touchmove"!==t.type&&!(1&t.buttons))return;const e="touchmove"===t.type?t.touches[0].clientX:t.clientX,{left:n,right:s}=this.getBoundingClientRect();o(1,f=r*(e-n)/(s-n))},function(t){i=new Date},function(t){new Date-i<300&&o(2,p=!p)},function(t){f=t,o(1,f)},function(t){u=t,o(3,u),s(),s=l(u,(t=>o(5,r=t)))}]}class ut extends H{constructor(t){super(),B(this,t,st,ot,s,{allsky:0})}}function ct(t){let e,n,o,r,s,u,c,i,l,h,y,b,k,_,x=t[0]?"AllSky":"Weather";return y=new ut({props:{allsky:t[0]}}),{c(){e=d("header"),n=d("div"),n.innerHTML='<img src="/timelapse/weather/uc-rothney.png" class="header-img" alt="University of Calgary logo"/>',o=m(),r=d("div"),s=d("h1"),u=$(x),c=$(" Timelapse"),i=m(),l=d("main"),h=d("div"),O(y.$$.fragment),b=m(),k=d("footer"),g(n,"class","left"),g(r,"class","right"),g(e,"class","flex-container row"),g(h,"class","player"),g(l,"class","flex-container column")},m(t,p){f(t,e,p),a(e,n),a(e,o),a(e,r),a(r,s),a(s,u),a(s,c),f(t,i,p),f(t,l,p),a(l,h),W(y,h,null),f(t,b,p),f(t,k,p),_=!0},p(t,[e]){(!_||1&e)&&x!==(x=t[0]?"AllSky":"Weather")&&v(u,x);const n={};1&e&&(n.allsky=t[0]),y.$set(n)},i(t){_||(j(y.$$.fragment,t),_=!0)},o(t){L(y.$$.fragment,t),_=!1},d(t){t&&p(e),t&&p(i),t&&p(l),X(y),t&&p(b),t&&p(k)}}}function it(t,e,n){return[!1]}return new class extends H{constructor(t){super(),B(this,t,it,ct,s,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map

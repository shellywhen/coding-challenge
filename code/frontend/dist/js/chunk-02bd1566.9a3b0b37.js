(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-02bd1566"],{"0ccb":function(t,e,a){var n=a("50c4"),r=a("1148"),i=a("1d80"),c=Math.ceil,s=function(t){return function(e,a,s){var o,l,u=String(i(e)),d=u.length,m=void 0===s?" ":String(s),f=n(a);return f<=d||""==m?u:(o=f-d,l=r.call(m,c(o/m.length)),l.length>o&&(l=l.slice(0,o)),t?u+l:l+u)}};t.exports={start:s(!1),end:s(!0)}},1148:function(t,e,a){"use strict";var n=a("a691"),r=a("1d80");t.exports="".repeat||function(t){var e=String(r(this)),a="",i=n(t);if(i<0||i==1/0)throw RangeError("Wrong number of repetitions");for(;i>0;(i>>>=1)&&(e+=e))1&i&&(a+=e);return a}},"4d90":function(t,e,a){"use strict";var n=a("23e7"),r=a("0ccb").start,i=a("9a0c");n({target:"String",proto:!0,forced:i},{padStart:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}})},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,a){var n=a("1d80"),r=a("5899"),i="["+r+"]",c=RegExp("^"+i+i+"*"),s=RegExp(i+i+"*$"),o=function(t){return function(e){var a=String(n(e));return 1&t&&(a=a.replace(c,"")),2&t&&(a=a.replace(s,"")),a}};t.exports={start:o(1),end:o(2),trim:o(3)}},"6ca0":function(t,e,a){},"9a0c":function(t,e,a){var n=a("342f");t.exports=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(n)},a9e3:function(t,e,a){"use strict";var n=a("83ab"),r=a("da84"),i=a("94ca"),c=a("6eeb"),s=a("5135"),o=a("c6b6"),l=a("7156"),u=a("c04e"),d=a("d039"),m=a("7c73"),f=a("241c").f,p=a("06cf").f,h=a("9bf2").f,b=a("58a8").trim,g="Number",v=r[g],I=v.prototype,x=o(m(I))==g,y=function(t){var e,a,n,r,i,c,s,o,l=u(t,!1);if("string"==typeof l&&l.length>2)if(l=b(l),e=l.charCodeAt(0),43===e||45===e){if(a=l.charCodeAt(2),88===a||120===a)return NaN}else if(48===e){switch(l.charCodeAt(1)){case 66:case 98:n=2,r=49;break;case 79:case 111:n=8,r=55;break;default:return+l}for(i=l.slice(2),c=i.length,s=0;s<c;s++)if(o=i.charCodeAt(s),o<48||o>r)return NaN;return parseInt(i,n)}return+l};if(i(g,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var N,w=function(t){var e=arguments.length<1?0:t,a=this;return a instanceof w&&(x?d((function(){I.valueOf.call(a)})):o(a)!=g)?l(new v(y(e)),a,w):y(e)},E=n?f(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),A=0;E.length>A;A++)s(v,N=E[A])&&!s(w,N)&&h(w,N,p(v,N));w.prototype=I,I.constructor=w,c(r,g,w)}},bece:function(t,e,a){"use strict";a.r(e);var n,r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"c2"}},[a("div",{staticClass:"tooltip"}),a("div",{staticClass:"left-wrapper"},[a("span",{staticClass:"title"},[t._v(" Daily Temperature of Hong Kong")]),a("el-radio",{attrs:{label:"1"},model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},[t._v("Max")]),a("el-radio",{attrs:{label:"2"},model:{value:t.radio,callback:function(e){t.radio=e},expression:"radio"}},[t._v("Min")])],1),a("div",[a("svg",{attrs:{id:"heatmap"}})])])},i=[],c=a("d4ec"),s=a("bee2"),o=a("262e"),l=a("2caf"),u=a("9ab4"),d=a("5698"),m=(a("99af"),a("4de4"),a("4160"),a("d81d"),a("a9e3"),a("d3b7"),a("25f0"),a("4d90"),a("159b"),a("b85c")),f=a("1157"),p=a.n(f);(function(t){t[t["maximum"]=0]="maximum",t[t["minimum"]=1]="minimum"})(n||(n={}));var h,b,g,v,I,x=n.maximum,y=800,N=300,w=12/14,E="95vw",A="80vh",T=.07,k=.005,_=.05,O=.02,S=.08,M=.02,F=1,V=.08,j=2,C="interpolatePlasma",Y=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],G=[],L=Number.NEGATIVE_INFINITY,P=Number.NEGATIVE_INFINITY,J=Number.POSITIVE_INFINITY,R=Number.POSITIVE_INFINITY,B=1970,z=2020,W=8,X=function(t){z=parseInt(t[t.length-1].date.substring(0,4)),B=z-W+1;for(var e=[],a=B;a<=z;a++){G.push(a);for(var n=[],r=0;r<12;r++)n.push({month:r,year:a,maximum:Number.NEGATIVE_INFINITY,minimum:Number.POSITIVE_INFINITY,minlist:[],maxlist:[]});e.push(n)}for(var i in t.forEach((function(t,a){var n=parseInt(t.date.substring(5,7))-1,r=parseInt(t.date.substring(0,4))-B;if(!(r<0)){var i=parseInt(t.max_temperature),c=parseInt(t.min_temperature);e[r][n].maximum=Math.max(e[r][n].maximum,i),e[r][n].minimum=Math.min(e[r][n].minimum,c),e[r][n].minlist.push(c),e[r][n].maxlist.push(i)}})),e){e[i]=e[i].filter((function(t){return t.maximum!==Number.NEGATIVE_INFINITY}));var c,s=Object(m["a"])(e[i]);try{for(s.s();!(c=s.n()).done;){var o=c.value;L=Math.max(L,o.maximum),P=Math.max(P,o.minimum),J=Math.min(J,o.maximum),R=Math.min(R,o.minimum)}}catch(l){s.e(l)}finally{s.f()}}return e},D=function(t){var e=d["select"]("#".concat(t));e.style("width",E).style("height",A);var a=p()("#".concat(t)).width()||y,n=p()("#".concat(t)).height()||N;y=a*(1-T-k),N=n*(1-_)*w;var r=e.append("g").attr("transform","translate(".concat(a*T,", ").concat(n*_,")"));return r},U=function(){b=d["scaleBand"]().domain(Y).range([0,y]).paddingOuter(O).paddingInner(S).align(F),g=d["scaleBand"]().domain(G.map((function(t){return t.toString()}))).range([0,N]).paddingOuter(M).paddingInner(S).align(F),v=function(t){var e=(t-J)/(L-J);return d[C](e)},I=function(t){var e=(t-R)/(P-R);return d[C](e)},function(t){var e=(t-R)/(L-R);return d[C](e)}},$=function(){h.selectAll(".legend").remove();for(var t=h.append("g").attr("transform","translate(".concat(0,", ",N*(1+_),")")).classed("legend",!0),e=[],a=x===n.maximum?J:R,r=x===n.maximum?L:P,i=x===n.maximum?v:I,c=a;c<=r;c++)e.push(c.toString());var s=d["scaleBand"]().domain(e).range([0,y/2]).paddingInner(.02).paddingOuter(O).align(1),o=t.append("g").classed("annotation",!0).attr("transform","translate(0, ".concat(s.bandwidth(),")")).call(d["axisBottom"](s));o.select(".domain").remove(),o.selectAll(".tick").select("line").remove(),o.selectAll(".tick").select("text").attr("dy","0.3em"),t.append("g").classed("legend-block",!0).selectAll("rect").data(e).enter().append("rect").attr("x",(function(t){return s(t.toString())})).attr("y",0).attr("width",s.bandwidth()).attr("height",s.bandwidth()).style("fill",(function(t){return i(t)})),t.append("text").attr("x",s.range()[1]+9).classed("tick-text",!0).style("font-size","0.8rem").style("text-anchor","start").attr("y",s.bandwidth()/2+4).text("Temperature (℃)")},H=function(t){t.append("g").classed("x-axis",!0).attr("transform","translate(".concat(0,", ",0,")")).call(d["axisTop"](b)).style("font-size","0.8rem").style("font-family","inherit").selectAll(".tick text").classed("tick-text",!0),t.append("g").classed("y-axis",!0).attr("transform","translate(".concat(0,", ",0,")")).call(d["axisLeft"](g)).style("font-size","0.8rem").style("font-family","inherit").selectAll(".tick text").classed("tick-text",!0)},K=function(t){return x===n.maximum?v(t.maximum):I(t.minimum)},q=function(t){return t<window.innerWidth/4*3?t+15:t-.2*window.innerWidth},Q=function(t,e){d["select"]("#c2").select(".tooltip").style("visibility","visible").html("Time: ".concat(e.year,"-").concat(String(e.month+1).padStart(2,"0")," &nbsp;&nbsp;  max: ").concat(e.maximum," &nbsp;&nbsp;  min: ").concat(e.minimum," ")).style("left",q(t.pageX)+"px").style("top",t.pageY+"px");d["select"](this).style("stroke-width",2)},Z=function(){d["select"]("#c2").select(".tooltip").style("visibility","hidden"),d["select"](this).style("stroke-width",0)},tt=function(t,e){var a=t.append("g").classed("bar-wrapper",!0).attr("transform",(function(){var t=b.step()*F*b.paddingOuter(),e=g.step()*F*g.paddingOuter();return"translate(".concat(t,", ").concat(e,")")})).selectAll("g").data(e).enter().append("g").classed("bar-row-container",!0).attr("transform",(function(t){return"translate(".concat(0,", ",g(t[0].year),")")})).selectAll("g").data((function(t){return t})).enter().append("g").classed("bar-container",!0).attr("transform",(function(t){return"translate(".concat(b(Y[t.month]),", 0)")}));a.append("rect").classed("bar",!0).attr("width",b.bandwidth()).attr("height",g.bandwidth()).attr("rx",Math.min(j,V*b.bandwidth())).attr("ry",Math.min(j,V*g.bandwidth())).style("fill",K).style("stroke-width","0").style("stroke","#b8b8ab").on("mouseover",Q).on("mouseout",Z);var n=d["scaleLinear"]().domain([0,30]).range([0,b.bandwidth()]),r=d["scaleLinear"]().domain([R,L]).range([g.bandwidth(),0]),i=d["line"]().x((function(t,e){return n(e)})).y((function(t){return r(t)}));a.append("path").attr("d",(function(t){return i(t.minlist)})).style("stroke","#ededed").style("fill","none"),a.append("path").attr("d",(function(t){return i(t.maxlist)})).style("stroke","#018026").style("fill","none")},et=function(t,e){var a=X(t);h=D(e),U(),H(h),tt(h,a),$()},at=function(){x=x===n.minimum?n.maximum:n.minimum,d["selectAll"](".bar").style("fill",K),$()},nt=a("60a3"),rt=function(t){Object(o["a"])(a,t);var e=Object(l["a"])(a);function a(){var t;return Object(c["a"])(this,a),t=e.apply(this,arguments),t.radio="1",t}return Object(s["a"])(a,[{key:"radioChanged",value:function(){at()}},{key:"mounted",value:function(){d["csv"]("data/temperature_daily.csv").then((function(t){return et(t,"heatmap")}))}}]),a}(nt["b"]);Object(u["a"])([Object(nt["c"])("radio",{immediate:!0,deep:!0})],rt.prototype,"radioChanged",null),rt=Object(u["a"])([Object(nt["a"])({name:"C2"})],rt);var it=rt,ct=it,st=(a("fb20"),a("2877")),ot=Object(st["a"])(ct,r,i,!1,null,null,null);e["default"]=ot.exports},fb20:function(t,e,a){"use strict";a("6ca0")}}]);
//# sourceMappingURL=chunk-02bd1566.9a3b0b37.js.map
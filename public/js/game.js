!function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=1)}([function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e+0,this.y=i+0}return s(t,[{key:"mag2",value:function(){return this.x*this.x+this.y*this.y}},{key:"mag",value:function(){return Math.sqrt(this.mag2())}},{key:"add",value:function(e){return new t(this.x+e.x,this.y+e.y)}},{key:"subtract",value:function(e){return new t(this.x-e.x,this.y-e.y)}},{key:"scale",value:function(e){return new t(this.x*e,this.y*e)}}]),t}();t.exports=n},function(t,e,i){"use strict";var s=1e3,n=.95*window.innerWidth,r=.95*window.innerHeight,a=document.getElementById("gameCanvas");a.width=n,a.height=r;var o=a.getContext("2d"),h=io("http://127.0.0.1:3000"),u=i(2),c=i(4),l=i(5),f=i(6),p=i(7),y=i(8).init(h),d=prompt("Please enter a username: ");h.emit("join",d);for(var v=new u(h),g=new f,m=[],w="",x=[],k=Math.round(n*r*18e-6),b=0;b<k;b++)x.push(new p(3,s,s,v)),x.push(new p(2,s,s,v)),x.push(new p(1,s,s,v));h.on("drop",function(t){y.calc(t)}),h.on("message",function(t){console.log("Message: "+t)}),h.on("state",function(t){w=t.leader;var e=t.player,i=t.enemies||[],s=t.removedPlayers,n=t.addedPlayers,r=t.updatedAsteroids;v.setState(e),v.score=t.score;for(var a=0;a<i.length;a++){var o=i[a],h=o.id;g.has(h)||g.set(h,new c(h,"")),g.get(h).setState(o)}for(var u=0;u<s.length;u++)g.delete(s[u]);for(var f=0;f<n.length;f++){var p=n[f];p.id!=v.id&&g.set(p.id,new c(p.id,p.username))}for(var y=0;y<r.length;y++){var d=r[y],x=d.id;null==m[x]&&(m[x]=new l(x%3+1)),m[x].setState(d)}});setInterval(function(){!function(){y.update();for(var t=0;t<g.length;t++)g[t].update();for(var e=0;e<m.length;e++)m[e].update();if(v.alive){for(var i=0;i<x.length;i++)x[i].update();v.update()}}(),function(){if(null!=v){o.clearRect(0,0,n,r),o.setTransform(1,0,0,1,n/2-v.pos.x,r/2-v.pos.y),o.strokeStyle="white",o.strokeRect(0,0,s,s);for(var t=0;t<x.length;t++)x[t].draw(o);for(var e=g.values(),i=0;i<e.length;i++)e[i].draw(o);for(var a=0;a<m.length;a++)null!=m[a]&&m[a].draw(o);v.alive&&v.draw(o),o.setTransform(1,0,0,1,0,0),o.font="12px serif",o.fillStyle="white",o.fillText("Ping: "+y.currentLatency,n-100,10),o.font="14px serif",o.fillStyle="white",o.fillText("Score: "+v.score,20,20),o.font="24px serif",o.fillStyle="white";var h=w==v.id?"You are the leader.":"Leader: "+(g.get(w)||{username:" "}).username;o.fillText(h,n/2-50,20),v.alive||(o.font="32px serif",o.fillStyle="white",o.fillText("You died.",50,150))}}()},1e3/30),console.log("Client v0.1.8")},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=i(3),r=i(0),a=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.tick=0,this.socket=e,this.id="null",this.alive=!0,this.pos=new r(0,0),this.vel=new r(0,0),this.rotation=0,this.keys=new n,this.sprite=new Image,this.sprite.src="img/player.png",this.spriteT=new Image,this.spriteT.src="img/playerT.png",this.spriteT2=new Image,this.spriteT2.src="img/playerT2.png"}return s(t,[{key:"setState",value:function(t){this.id=t.id,this.pos.x=t.x,this.pos.y=t.y,this.vel.x=t.vx,this.vel.y=t.vy,this.rotation=t.rotation,this.alive=t.alive}},{key:"update",value:function(){var t={W:!1,A:!1,S:!1,D:!1};this.tick++,this.tick%=30,this.alive&&(this.thrust=!1,this.tick++,this.tick%=30,this.keys.isPressed(37)&&(t.A=!0),this.keys.isPressed(39)&&(t.D=!0),(this.keys.isPressed(38)||this.keys.isPressed(32))&&(t.W=!0,this.thrust=!0,this.vel.x+=Math.cos(this.rotation),this.vel.y+=Math.sin(this.rotation)),this.socket.emit("input",t)),this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x*=.9,this.vel.y*=.9,console.log("V = "+this.vel.mag())}},{key:"draw",value:function(t){this.alive&&(t.save(),t.translate(this.pos.x,this.pos.y),t.rotate(this.rotation+Math.PI/2),t.translate(-this.pos.x,-this.pos.y),this.thrust?this.tick%10>5?t.drawImage(this.spriteT,this.pos.x-19,this.pos.y-24):t.drawImage(this.spriteT2,this.pos.x-19,this.pos.y-24):t.drawImage(this.sprite,this.pos.x-19,this.pos.y-24),t.restore())}}]),t}();t.exports=a},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.pressedKeys=[],document.addEventListener("keydown",this.keydown.bind(this)),document.addEventListener("keyup",this.keyup.bind(this))}return s(t,[{key:"keydown",value:function(t){this.pressedKeys[t.keyCode]=!0}},{key:"keyup",value:function(t){this.pressedKeys[t.keyCode]=!1}},{key:"isPressed",value:function(t){return!!this.pressedKeys[t]}}]),t}();t.exports=n},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=i(0),r=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.username=i,this.pos=new n(0,0),this.vel=new n(0,0),this.sprite=new Image,this.sprite.src="img/player.png",this.spriteT=new Image,this.spriteT.src="img/playerT.png",this.spriteT2=new Image,this.spriteT2.src="img/playerT2.png",this.rotation=0,this.tick=0,this.thrust=!1,this.alive=!0}return s(t,[{key:"setState",value:function(t){this.pos.x=t.x,this.pos.y=t.y,this.vel.x=t.vx,this.vel.y=t.vy,this.rotation=t.rotation,this.thrust=t.thrust,this.alive=t.alive}},{key:"update",value:function(){this.alive&&(this.tick++,this.tick%=6,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y)}},{key:"draw",value:function(t){this.alive&&(t.save(),t.translate(this.pos.x,this.pos.y),t.rotate(this.rotation+Math.PI/2),t.translate(-this.pos.x,-this.pos.y),this.thrust?this.tick>2?t.drawImage(this.spriteT,this.pos.x-19,this.pos.y-24):t.drawImage(this.spriteT2,this.pos.x-19,this.pos.y-24):t.drawImage(this.sprite,this.pos.x-19,this.pos.y-24),t.restore(),t.font="12px serif",t.fillStyle="white",t.fillText(this.username,this.pos.x-25,this.pos.y+45))}}]),t}();t.exports=r},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=i(0),r=function(){function t(e){switch(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.pos=new n(0,0),this.vel=new n(0,0),this.sprite=new Image,this.sprite.src="",this.radius=0,e){case 1:this.sprite.src="img/rock1.png",this.radius=10;break;case 2:this.sprite.src="img/rock2.png",this.radius=15;break;case 3:this.sprite.src="img/rock3.png",this.radius=25}}return s(t,[{key:"setState",value:function(t){this.pos.x=t.x,this.pos.y=t.y,this.vel.x=t.vx,this.vel.y=t.vy}},{key:"update",value:function(){this.pos.x+=this.vel.x,this.pos.y+=this.vel.y}},{key:"draw",value:function(t){t.save(),t.translate(this.pos.x,this.pos.y),t.rotate(this.rotation+Math.PI/2),t.translate(-this.pos.x,-this.pos.y),t.drawImage(this.sprite,this.pos.x-this.radius,this.pos.y-this.radius),t.restore()}}]),t}();t.exports=r},function(t,e,i){"use strict";var s,n,r;"function"==typeof Symbol&&Symbol.iterator;n=[],void 0===(r="function"==typeof(s=function(){function t(t){switch(this.clear(),arguments.length){case 0:break;case 1:"length"in t?i(this,Array.prototype.concat.apply([],t)):this.copy(t);break;default:i(this,arguments)}}var e=t.prototype={constructor:t,get:function(t){var e=this._data[this.hash(t)];return e&&e[1]},set:function(t,e){var i=this.hash(t);i in this._data||this.size++,this._data[i]=[t,e]},multi:function(){i(this,arguments)},copy:function(t){for(var e in t._data)e in this._data||this.size++,this._data[e]=t._data[e]},has:function(t){return this.hash(t)in this._data},search:function(t){for(var e in this._data)if(this._data[e][1]===t)return this._data[e][0];return null},delete:function(t){var e=this.hash(t);e in this._data&&(this.size--,delete this._data[e])},type:function(t){var e=Object.prototype.toString.call(t),i=e.slice(8,-1).toLowerCase();return t||"domwindow"!==i&&"window"!==i?i:t+""},keys:function(){var t=[];return this.forEach(function(e,i){t.push(i)}),t},values:function(){var t=[];return this.forEach(function(e){t.push(e)}),t},entries:function(){var t=[];return this.forEach(function(e,i){t.push([i,e])}),t},count:function(){return this.size},clear:function(){this._data={},this.size=0},clone:function(){return new t(this)},hash:function(e){switch(this.type(e)){case"undefined":case"null":case"boolean":case"number":case"regexp":return e+"";case"date":return"♣"+e.getTime();case"string":return"♠"+e;case"array":for(var i=[],s=0;s<e.length;s++)i[s]=this.hash(e[s]);return"♥"+i.join("⁞");default:return e.hasOwnProperty("_hmuid_")||(e._hmuid_=++t.uid,function(t,e){Object.defineProperty&&Object.defineProperty(t,e,{enumerable:!1})}(e,"_hmuid_")),"♦"+e._hmuid_}},forEach:function(t,e){for(var i in this._data){var s=this._data[i];t.call(e||this,s[1],s[0])}}};function i(t,e){for(var i=0;i<e.length;i+=2)t.set(e[i],e[i+1])}return t.uid=0,["set","multi","copy","delete","clear","forEach"].forEach(function(t){var i=e[t];e[t]=function(){return i.apply(this,arguments),this}}),t.prototype.remove=t.prototype.delete,t})?s.apply(e,n):s)||(t.exports=r)},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=function(){function t(e,i,s,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=Math.random()*i,this.y=Math.random()*s,this.maxX=i,this.maxY=s,this.player=n,this.size=e}return s(t,[{key:"update",value:function(){switch(this.x<0&&(this.x+=this.maxX),this.x>this.maxX&&(this.x-=this.maxX),this.y<0&&(this.y+=this.maxY),this.y>this.maxY&&(this.y-=this.maxY),this.size){case 1:this.x+=.5*this.player.vel.x,this.y+=.5*this.player.vel.y;break;case 2:this.x+=.33*this.player.vel.x,this.y+=.33*this.player.vel.y;break;case 3:this.x+=.165*this.player.vel.x,this.y+=.165*this.player.vel.y}}},{key:"draw",value:function(t){t.beginPath(),t.rect(this.x,this.y,this.size,this.size),t.fillStyle="#ffffff",t.fill(),t.closePath()}}]),t}();t.exports=n},function(t,e,i){"use strict";var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();var n=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.socket=e,this.lastDrip=Date.now(),this.tick=0,this.data=[],this.count=0,this.currentLatency=0}return s(t,[{key:"getMean",value:function(){if(0==this.data.length)return-1;for(var t=0,e=0;e<this.data.length;e++)t+=this.data[e];return t/=this.data.length}},{key:"getSd",value:function(t){if(0==this.data.length)return-1;for(var e=0,i=0;i<this.data.length;i++)e+=this.data[i]*this.data[i];return e-=t*t,Math.sqrt(e)}},{key:"calc",value:function(t){this.count%=10;var e=t.server-t.client,i=this.getMean(),s=this.getSd(i);(this.data.length<5||Math.abs(i-e)<2*s)&&(this.data[this.count++]=e)}},{key:"update",value:function(){if(1==this.tick){var t=Date.now();this.socket.emit("drip",t),this.lastDrip=t}else 2==this.tick&&(this.currentLatency=Math.round(this.getMean()));this.tick++,this.tick%=30}}],[{key:"init",value:function(e){return new t(e)}}]),t}();t.exports=n}]);
//# sourceMappingURL=game.js.map
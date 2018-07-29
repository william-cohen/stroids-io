!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=1)}([function(t,e,i){"use strict";var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var s=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.x=e+0,this.y=i+0}return n(t,[{key:"mag2",value:function(){return this.x*this.x+this.y*this.y}},{key:"mag",value:function(){return Math.sqrt(this.mag2())}},{key:"add",value:function(e){return new t(this.x+e.x,this.y+e.y)}},{key:"subtract",value:function(e){return new t(this.x-e.x,this.y-e.y)}},{key:"scale",value:function(e){return new t(this.x*e,this.y*e)}}]),t}();t.exports=s},function(t,e,i){"use strict";var n=1e3,s=.95*window.innerWidth,r=.95*window.innerHeight,o=document.getElementById("gameCanvas");o.width=s,o.height=r;var a=o.getContext("2d"),h=i(2),u=i(4),c=i(5),l=prompt("Please enter a username: "),f=io("http://127.0.0.1:3000");f.emit("join",l);var p=new h(f),y=new c;f.on("message",function(t){console.log("Message: "+t)}),f.on("state",function(t){var e=t.player,i=t.enemies||[];p.setState(e);for(var n=0;n<i.length;n++){var s=i[n],r=s.id;y.has(r)||y.set(r,new u(r,"Enemy")),y.get(r).setState(s)}});setInterval(function(){!function(){for(var t=0;t<y.length;t++)y[t].update();p.update()}(),function(){if(null!=p){a.clearRect(0,0,s,r),a.setTransform(1,0,0,1,s/2-p.pos.x,r/2-p.pos.y),a.strokeStyle="white",a.strokeRect(0,0,n,n),console.log(y);for(var t=y.values(),e=0;e<t.length;e++)t[e].draw(a);p.draw(a),a.setTransform(1,0,0,1,0,0),a.font="12px serif",a.fillStyle="white",a.fillText("Ping: null",s-100,10),a.font="14px serif",a.fillStyle="white",a.fillText("Score: "+p.score,20,20),a.font="24px serif",a.fillStyle="white",a.fillText("DEVELOPMENT",s/2-50,20),p.alive||(a.font="32px serif",a.fillStyle="white",a.fillText("You died.",50,150),a.font="32px serif",a.fillStyle="white",a.fillText("Respawning...",50,250))}}()},1e3/30),console.log("Client v0.0.4")},function(t,e,i){"use strict";var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var s=i(3),r=i(0),o=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.tick=0,this.socket=e,this.alive=!0,this.pos=new r(0,0),this.vel=new r(0,0),this.rotation=0,this.keys=new s,this.sprite=new Image,this.sprite.src="img/player.png",this.spriteT=new Image,this.spriteT.src="img/playerT.png",this.spriteT2=new Image,this.spriteT2.src="img/playerT2.png"}return n(t,[{key:"setState",value:function(t){this.pos.x=t.x,this.pos.y=t.y,this.vel.x=t.vx,this.vel.y=t.vy,this.rotation=t.rotation}},{key:"update",value:function(){var t={W:!1,A:!1,S:!1,D:!1};this.tick++,this.tick%=30,this.alive&&(this.thrust=!1,this.tick++,this.tick>5&&(this.tick-=5),this.keys.isPressed(37)&&(t.A=!0),this.keys.isPressed(39)&&(t.D=!0),(this.keys.isPressed(38)||this.keys.isPressed(32))&&(t.W=!0,this.thrust=!0,this.vel.x+=Math.cos(this.rotation),this.vel.y+=Math.sin(this.rotation)),this.socket.emit("input",t)),this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x*=.9,this.vel.y*=.9}},{key:"draw",value:function(t){this.alive&&(t.save(),t.translate(this.pos.x,this.pos.y),t.rotate(this.rotation+Math.PI/2),t.translate(-this.pos.x,-this.pos.y),this.thrust?this.tick>2?t.drawImage(this.spriteT,this.pos.x-19,this.pos.y-24):t.drawImage(this.spriteT2,this.pos.x-19,this.pos.y-24):t.drawImage(this.sprite,this.pos.x-19,this.pos.y-24),t.restore())}}]),t}();t.exports=o},function(t,e,i){"use strict";var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var s=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.pressedKeys=[],document.addEventListener("keydown",this.keydown.bind(this)),document.addEventListener("keyup",this.keyup.bind(this))}return n(t,[{key:"keydown",value:function(t){this.pressedKeys[t.keyCode]=!0}},{key:"keyup",value:function(t){this.pressedKeys[t.keyCode]=!1}},{key:"isPressed",value:function(t){return!!this.pressedKeys[t]}}]),t}();t.exports=s},function(t,e,i){"use strict";var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();var s=i(0),r=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.id=e,this.username=i,this.pos=new s(0,0),this.vel=new s(0,0),this.sprite=new Image,this.sprite.src="img/player.png",this.spriteT=new Image,this.spriteT.src="img/playerT.png",this.spriteT2=new Image,this.spriteT2.src="img/playerT2.png",this.rotation=0}return n(t,[{key:"setState",value:function(t){this.pos.x=t.x,this.pos.y=t.y,this.vel.x=t.vx,this.vel.y=t.vy,this.rotation=t.rotation}},{key:"update",value:function(){this.alive&&(this.tick++,this.tick>5&&(this.tick-=5),this.pos.x+=this.vel.x,this.pos.y+=this.vel.y)}},{key:"draw",value:function(t){this.alive&&(t.save(),t.translate(this.pos.x,this.pos.y),t.rotate(this.rotation+Math.PI/2),t.translate(-this.pos.x,-this.pos.y),this.thrust?this.tick>2?t.drawImage(this.spriteT,this.pos.x-19,this.pos.y-24):t.drawImage(this.spriteT2,this.pos.x-19,this.pos.y-24):t.drawImage(this.sprite,this.pos.x-19,this.pos.y-24),t.restore(),t.font="12px serif",t.fillStyle="white",t.fillText(this.username,this.pos.x-25,this.pos.y+45))}}]),t}();t.exports=r},function(t,e,i){"use strict";var n,s,r;"function"==typeof Symbol&&Symbol.iterator;s=[],void 0===(r="function"==typeof(n=function(){function t(t){switch(this.clear(),arguments.length){case 0:break;case 1:"length"in t?i(this,Array.prototype.concat.apply([],t)):this.copy(t);break;default:i(this,arguments)}}var e=t.prototype={constructor:t,get:function(t){var e=this._data[this.hash(t)];return e&&e[1]},set:function(t,e){var i=this.hash(t);i in this._data||this.size++,this._data[i]=[t,e]},multi:function(){i(this,arguments)},copy:function(t){for(var e in t._data)e in this._data||this.size++,this._data[e]=t._data[e]},has:function(t){return this.hash(t)in this._data},search:function(t){for(var e in this._data)if(this._data[e][1]===t)return this._data[e][0];return null},delete:function(t){var e=this.hash(t);e in this._data&&(this.size--,delete this._data[e])},type:function(t){var e=Object.prototype.toString.call(t),i=e.slice(8,-1).toLowerCase();return t||"domwindow"!==i&&"window"!==i?i:t+""},keys:function(){var t=[];return this.forEach(function(e,i){t.push(i)}),t},values:function(){var t=[];return this.forEach(function(e){t.push(e)}),t},entries:function(){var t=[];return this.forEach(function(e,i){t.push([i,e])}),t},count:function(){return this.size},clear:function(){this._data={},this.size=0},clone:function(){return new t(this)},hash:function(e){switch(this.type(e)){case"undefined":case"null":case"boolean":case"number":case"regexp":return e+"";case"date":return"♣"+e.getTime();case"string":return"♠"+e;case"array":for(var i=[],n=0;n<e.length;n++)i[n]=this.hash(e[n]);return"♥"+i.join("⁞");default:return e.hasOwnProperty("_hmuid_")||(e._hmuid_=++t.uid,function(t,e){Object.defineProperty&&Object.defineProperty(t,e,{enumerable:!1})}(e,"_hmuid_")),"♦"+e._hmuid_}},forEach:function(t,e){for(var i in this._data){var n=this._data[i];t.call(e||this,n[1],n[0])}}};function i(t,e){for(var i=0;i<e.length;i+=2)t.set(e[i],e[i+1])}return t.uid=0,["set","multi","copy","delete","clear","forEach"].forEach(function(t){var i=e[t];e[t]=function(){return i.apply(this,arguments),this}}),t.prototype.remove=t.prototype.delete,t})?n.apply(e,s):n)||(t.exports=r)}]);
//# sourceMappingURL=game.js.map
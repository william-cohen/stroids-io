/*TODO:
 * Fix enemy leader sprite                              DONE
 * Check disconnect bug                                 DONE
 * Change ammount of stars based on screen res          DONE(kinda)
 * Movement INTERPOLATION :O
 * Fix mobile controls (look into quicktap or whatever)
 */
const CONNECTION = "http://127.0.0.1:3000";

var MOBILE = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    // alert("Mobile detected!");
    MOBILE = true;
}

var canvas = document.getElementById("gameCanvas");
var CANVAS_WIDTH = 0.95 * window.innerWidth;
var CANVAS_HEIGHT = 0.95 * window.innerHeight;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var ctx = canvas.getContext("2d");

var mobileTouches = [];
if (MOBILE) {
    canvas.addEventListener("touchstart", function(event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            mobileTouches.push(touches[i]);
            // console.log("Touch start");
        }
    }, false);

    canvas.addEventListener("touchend", function(event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            console.log(touches[i]);
            for (var j = 0; j < mobileTouches.length; j++) {
                if (touches[i].identifier == mobileTouches[j].identifier) {
                    mobileTouches.splice(j, 1);
                    // console.log("Touch end");
                }
            }
        }
    }, false);
    // canvas.addEventListener("touchmove", function(event) {
    //     mobileTouches = event.touches;
    //     // console.log(event.touches);
    // }, false);
}

var username = prompt("Please enter a username: ");

var message_timer = 0;
var message = "";

var socket = io(CONNECTION); //FIXME IP Address and Port
var ping = 0;

var server_start_time = Date.now() - 15; //Bad assumption

function getPing() {
    var startTime = Date.now();
    socket.emit("drip");
    socket.on("drop", function(time) {
        ping = Date.now() - startTime;
        server_start_time = Date.now() - (time + ping);
    });
}

function getTimeElapsed() {
    return Date.now() - server_start_time;
}

function KeyListener() {
    this.pressedKeys = [];

    this.keydown = function (e) {
        this.pressedKeys[e.keyCode] = true;
    };

    this.keyup = function (e) {
        this.pressedKeys[e.keyCode] = false;
    };

    this.isPressed = function (key) {
        return this.pressedKeys[key] ? true : false;
    };

    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}

function Vector2f(x, y) {
    this.x = 0.0 + x;
    this.y = 0.0 + y;

    this.mag2 = function() {
        return (this.x*this.x + this.y*this.y);
    };

    this.mag = function() {
        return Math.sqrt(this.mag2());
    };

    this.add = function(vec) {
        return new Vector2f(this.x+vec.x, this.y+vec.y);
    };

    this.subtract = function(vec) {
        return new Vector2f(this.x-vec.x, this.y-vec.y);
    };

    this.scale = function(a) {
        return new Vector2f(this.x*a, this.y*a);
    };
}

function Star(size) {
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = Math.random() * CANVAS_HEIGHT;
    this.size = size;

    this.update = function () {

        if (!player.alive) return;

        if (this.x < 0) this.x += CANVAS_WIDTH;
        if (this.x > CANVAS_WIDTH) this.x -= CANVAS_WIDTH;
        if (this.y < 0) this.y += CANVAS_HEIGHT;
        if (this.y > CANVAS_HEIGHT) this.y -= CANVAS_HEIGHT;

        switch (this.size) {
            case 3:
                this.x -= player.vel.x;
                this.y -= player.vel.y;
                break;
            case 2:
                this.x -= 0.66 * player.vel.x;
                this.y -= 0.66 * player.vel.y;
                break;
            case 1:
                this.x -= 0.33 * player.vel.x;
                this.y -= 0.33 * player.vel.y;
                break;
            default:
                break;
        }

    };

    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
    };

}

function Enemy(id, username) {
    this.id = id;
    this.username = username;
    this.pos = new Vector2f(-1.0, -1.0);
    this.vel = new Vector2f(0.0, 0.0);
    this.sprite = new Image();
    this.sprite.src = 'img/player.png';
    this.spriteT = new Image();
    this.spriteT.src = 'img/playerT.png';
    this.spriteT2 = new Image();
    this.spriteT2.src = 'img/playerT2.png';
    this.rotation = 0.0;
    this.alive = true;
    this.tick = 0;

    this.update = function() {
        if (!this.alive) return;

        this.tick++;
        if (this.tick > 5) this.tick -= 5;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    };

    this.draw = function () {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI/2);
        ctx.translate(-this.pos.x, -this.pos.y);
        if (this.thrust) {
            if (this.tick > 2) {
                ctx.drawImage(this.spriteT, this.pos.x - 19, this.pos.y - 24);
            } else {
                ctx.drawImage(this.spriteT2, this.pos.x - 19, this.pos.y - 24);
            }
        } else {
            ctx.drawImage(this.sprite, this.pos.x - 19, this.pos.y - 24);
        }
        ctx.restore();
        ctx.font = '12px serif';
        ctx.fillStyle = 'white'
        ctx.fillText(username, this.pos.x - 25, this.pos.y + 45);
    };

    this.setLeader = function (isLeader) {
        if (isLeader) {
            this.sprite = new Image();
            this.sprite.src = 'img/leader.png';
            this.spriteT = new Image();
            this.spriteT.src = 'img/leaderT.png';
            this.spriteT2 = new Image();
            this.spriteT2.src = 'img/leaderT2.png';
        } else {
            this.sprite = new Image();
            this.sprite.src = 'img/player.png';
            this.spriteT = new Image();
            this.spriteT.src = 'img/playerT.png';
            this.spriteT2 = new Image();
            this.spriteT2.src = 'img/playerT2.png';
        }
    };
}

function Asteroid(size) {
    this.pos = new Vector2f(0.0, 0.0);
    this.vel = new Vector2f(0.0, 0.0);
    this.sprite = new Image();
    this.sprite.src = '';
    this.radius = 0;
    switch (size) {
        case 1:
            this.sprite.src = 'img/rock1.png';
            this.radius = 10;
            break;
        case 2:
            this.sprite.src = 'img/rock2.png';
            this.radius = 15;
            break;
        case 3:
            this.sprite.src = 'img/rock3.png';
            this.radius = 25;
            break;
        default:
            break;
    }
    this.rotation = 0.0;

    this.update = function() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    };

    this.draw = function () {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI/2);
        ctx.translate(-this.pos.x, -this.pos.y);
        ctx.drawImage(this.sprite, this.pos.x - this.radius, this.pos.y - this.radius);

        ctx.restore();
    };
}

function Player(id, username, x, y) {
    this.tick = 0;
    this.id = id;
    this.username = username;
    this.score = 0;
    this.spawn_timer = 5;

    this.mobile = {left: false, right: false, thrust: false};

    this.alive = true;
    this.pos = new Vector2f(x, y);
    this.vel = new Vector2f(0.0, 0.0);

    this.rotation = 0.0;
    this.keys = new KeyListener();
    this.sprite = new Image();
    this.sprite.src = 'img/player.png';
    this.spriteT = new Image();
    this.spriteT.src = 'img/playerT.png';
    this.spriteT2 = new Image();
    this.spriteT2.src = 'img/playerT2.png';
    this.thrust = false;
    this.update = function () {
        this.tick++; this.tick %= 30;
        if (this.alive) {
            this.thrust = false;

            this.tick++;
            if (this.tick > 5) this.tick -= 5;

            //Left Arrow Key
            if (this.keys.isPressed(37) || this.mobile.left) {
                socket.emit("input", 37);
            }
            //Right Arrow Key
            if (this.keys.isPressed(39) || this.mobile.right) {
                socket.emit("input", 39);
            }
            //Up Arrow Key
            if (this.keys.isPressed(38) || this.keys.isPressed(32) || this.mobile.thrust) {
                socket.emit("input", 38);
                this.thrust = true;
                this.vel.x += Math.cos(this.rotation);
                this.vel.y += Math.sin(this.rotation);
            }
        } else {
            if (this.tick == 0) {
                this.spawn_timer--;
                if (this.spawn_timer == 0) {
                    socket.emit("join", this.username);
                }
            }
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.vel.x *= 0.9;
        this.vel.y *= 0.9;

    };

    this.setPos = function(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    };

    this.draw = function () {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + Math.PI / 2);
        ctx.translate(-this.pos.x, -this.pos.y);
        if (this.thrust) {
            if (this.tick > 2) {
                ctx.drawImage(this.spriteT, this.pos.x - 19, this.pos.y - 24);
            } else {
                ctx.drawImage(this.spriteT2, this.pos.x - 19, this.pos.y - 24);
            }
        } else {
            ctx.drawImage(this.sprite, this.pos.x - 19, this.pos.y - 24);
        }
        ctx.restore();

    };

    this.setLeader = function (isLeader) {
        if (isLeader) {
            this.sprite = new Image();
            this.sprite.src = 'img/leader.png';
            this.spriteT = new Image();
            this.spriteT.src = 'img/leaderT.png';
            this.spriteT2 = new Image();
            this.spriteT2.src = 'img/leaderT2.png';
        } else {
            this.sprite = new Image();
            this.sprite.src = 'img/player.png';
            this.spriteT = new Image();
            this.spriteT.src = 'img/playerT.png';
            this.spriteT2 = new Image();
            this.spriteT2.src = 'img/playerT2.png';
        }
    };
}

var leaderID = -1;
var leaderMessage = "Leader: ";
var player = null;
var enemies = [];
var asteroids = [];
var num_stars = Math.round(CANVAS_WIDTH * CANVAS_HEIGHT * 0.000018);
var stars = [];

console.log(username);

socket.emit("join", username);

socket.on("id", function(info) {
    console.log("Player ID recieved (" + info.id + "). Joining game...");
    for (var i = 0; i < num_stars; i++) {
        stars.push(new Star(3));
        stars.push(new Star(2));
        stars.push(new Star(1));
    }

    for (var i = 0; i < info.a; i++) {
        asteroids.push(new Asteroid(i%3+1));
    }

    server_start_time = Date.now() - (info.time + 50); //Magic 50 :^)

    player = new Player(info.id, username, info.x, info.y);
});

socket.on("join", function(enemy) {
    console.log("Enemy " + enemy.id + " [" + enemy.name + "] joined.");

    var enemy = new Enemy(enemy.id, enemy.name);
    enemies[enemy.id] = enemy;

});

socket.on("score", function(score) {
   //console.log("Score: " + score);
   player.score = score;
});

socket.on("message", function(text) {
    message = text;
    message_timer = 2;
});

socket.on("a_pos", function(info) {
    var delta_t = getTimeElapsed() - info.t;
    // console.log(delta_t);
    var offX = info.vx * (30/1000) * delta_t;
    var offY = info.vx * (30/1000) * delta_t;

    var i = info.id;

    if (asteroids[i] == null) return;

    asteroids[i].pos.x = info.x + offX;
    asteroids[i].pos.y = info.y + offY;
    asteroids[i].vel.x = info.vx;
    asteroids[i].vel.y = info.vy;



    var asteroid = new Asteroid(info.x + offX, info.y + offY, info.vx, info.vy, info.i%3+1);
    asteroids[info.i] = asteroid;
});

socket.on("leader", function(info) {
    if (player.id == info.id) {
        player.setLeader(true);
        leaderMessage = "You are the leader.";
    } else {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i] == null) continue;
            enemies[i].setLeader(false);
            if (enemies[i].id == info.id) {
                leaderMessage = "Leader: " + enemies[i].username;
                enemies[i].setLeader(true);
            }
        }

    }
    leaderID = info.id;
});

socket.on("e_pos", function(enemy) {
    // console.log("Update: " + enemy.id);
    var i = enemy.id;
    if (enemies[i] == null) return;
    enemies[i].pos.x = enemy.x;
    enemies[i].pos.y = enemy.y;
    enemies[i].vel.x = enemy.vx;
    enemies[i].vel.y = enemy.vy;
    enemies[i].rotation = enemy.rotation;
    enemies[i].thrust = enemy.thrust;
});

socket.on("p_pos", function(info) {
    player.pos.x = info.x;
    player.pos.y = info.y;
    player.vel.x = info.vx;
    player.vel.y = info.vy;
    player.rotation = info.rotation;

});

socket.on("disconnect", function() {
    console.log("Disconnected from the game.");
    alert("Server no longer online.");
});

socket.on("connect", function() {
    console.log("Connected to the game!");
});

socket.on("kill", function(id) {
    console.log("Player " + id + " is dead.");
    if (id == player.id) {
        player.alive = false;
    } else {
        enemies[id].alive = false;
    }

});

socket.on("leave", function(id) {
    console.log("Player with ID " + id + " has left.");
    enemies[id] = null;

});

function update() {
    if (player == null) return;

    if (MOBILE) {
        player.mobile = {left: false, right: false, thrust: false};

        for (var i = 0; i < mobileTouches.length; i++) {
            if (mobileTouches[i].pageX < CANVAS_WIDTH/4) {
                player.mobile.left = true;
            } else if (mobileTouches[i].pageX < CANVAS_WIDTH/2) {
                player.mobile.right = true;
            } else if (mobileTouches[i].pageX > CANVAS_WIDTH/2 + CANVAS_WIDTH/4){
                player.mobile.thrust = true;
            }
        }
    }

    for (var i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    for (var i = 0; i < asteroids.length; i++) {
        if (asteroids[i] == null) continue;
        asteroids[i].update();
    }
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i] == null) continue;
        enemies[i].update();
    }
    player.update();
}

function draw() {
    if (player == null) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (var i = 0; i < stars.length; i++) {
        stars[i].draw();
    }
    ctx.setTransform(1, 0, 0, 1, CANVAS_WIDTH / 2 - player.pos.x, CANVAS_HEIGHT / 2 - player.pos.y);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(0,0,1000,1000);

    for (var i = 0; i < asteroids.length; i++) {
        if (asteroids[i] == null) continue;
        asteroids[i].draw();
    }

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i] == null) continue;
        enemies[i].draw();
    }

    player.draw();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '12px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Ping: ' + ping, CANVAS_WIDTH - 100, 10);

    ctx.font = '14px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + player.score, 20, 20);

    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(leaderMessage, CANVAS_WIDTH/2 - 50, 20);

    if (!player.alive) {
        ctx.font = '32px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('You died.', 50, 150);
        ctx.font = '32px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Respawning in ' + player.spawn_timer + '...', 50, 250);
    }

    if (message_timer > 0) {
        ctx.font = '24px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(message, 50, 100);
        message_timer -= 1/60;
    }

    //Mobile controls
    //FIXME Dogshit
    if (MOBILE) {
        ctx.strokeStyle = 'white';
        ctx.rect(0,CANVAS_HEIGHT - CANVAS_HEIGHT/4 - 4,CANVAS_WIDTH/4,CANVAS_HEIGHT/4);
        ctx.rect(CANVAS_WIDTH/4,CANVAS_HEIGHT - CANVAS_HEIGHT/4 - 4,CANVAS_WIDTH/4,CANVAS_HEIGHT/4);
        ctx.rect(CANVAS_WIDTH/2 + CANVAS_WIDTH/4 - 5,CANVAS_HEIGHT - CANVAS_HEIGHT/4 - 4,CANVAS_WIDTH/4,CANVAS_HEIGHT/4);
        ctx.stroke();
    }
}

var FPS = 30;
var tick = 0;
setInterval(function () {
    //Every seccond
    if (tick % 15 == 0) {
        getPing();
    }
    tick %= 60; tick++;
    update();
    draw();
}, 1000 / FPS);

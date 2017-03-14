var mariogame = (function() {
    var p = {};
    (function() {
        var n = !1,
            t = /xyz/.test(function() {
                xyz
            }) ? /\b_super\b/ : /.*/;
        this.Class = function() {}, Class.extend = function(i, r) {
            function f() {
                !n && this.init && this.init.apply(this, arguments)
            }
            var e, o, u;
            r && (p[r] = f), e = this.prototype, n = !0, o = new this, n = !1;
            for (u in i) o[u] = typeof i[u] == "function" && typeof e[u] == "function" && t.test(i[u]) ? function(n, t) {
                return function() {
                    var r = this._super,
                        i;
                    return this._super = e[n], i = t.apply(this, arguments), this._super = r, i
                }
            }(u, i[u]) : i[u];
            return f.prototype = o, f.prototype.constructor = f, f.extend = arguments.callee, f
        }
    })();

    var globalMarioPosition = {x: 0, y: 0};
    var globalObstacles = [];
    var screenObstacles = [];

    var bt = "Content/audio/",
        g = "Content/",
        b = "<div />",
        oi = "<canvas />",
        nr = "figure",
        kt = "matter",
        ci = "tool",
        e = {
            none: 0,
            left: 1,
            up: 2,
            right: 3,
            down: 4
        },
        a = {
            normal: 0,
            fire: 1
        },
        ft = {
            sleep: 0,
            awake: 1
        },
        h = {
            small: 1,
            big: 2
        },
        w = {
            mushroom: 0,
            plant: 1
        },
        k = {
            normal: 0,
            shell: 1
        },
        u = {
            none: 0,
            left: 1,
            top: 2,
            right: 4,
            bottom: 8,
            all: 15
        },
        n = {
            enemies: g + "mario-enemies.png",
            sprites: g + "mario-sprites.png",
            objects: g + "mario-objects.png",
            peach: g + "mario-peach.png",
            ghost: g + "mario-ghost.png"
        },
        i = {
            interval: 20,
            bounce: 15,
            cooldown: 20,
            gravity: 2,
            start_lives: 3,
            max_width: 400,
            max_height: 15,
            jumping_v: 27,
            walking_v: 5,
            mushroom_v: 3,
            ballmonster_v: 2,
            spiked_turtle_v: 1.5,
            small_turtle_v: 3,
            big_turtle_v: 2,
            shell_v: 10,
            shell_wait: 25,
            star_vx: 4,
            star_vy: 16,
            bullet_v: 12,
            max_coins: 100,
            pipeplant_count: 150,
            pipeplant_v: 1,
            invincible: 10800,
            invulnerable: 1e3,
            blinkfactor: 5
        },
        nt = function(n) {
            return "url(" + n + ")"
        },
        ri = function(n, t) {
            return n.x > t.x + 16 ? !1 : n.x + 16 < t.x ? !1 : n.y + n.state * 32 - 4 < t.y ? !1 : n.y + 4 > t.y + t.state * 32 ? !1 : !0
        };
    Math.sign = function(n) {
        return n > 0 ? 1 : n < 0 ? -1 : 0
    };
    var ui = Class.extend({
            init: function() {
                this.reset()
            },
            reset: function() {
                this.left = !1, this.right = !1, this.accelerate = !1, this.up = !1, this.down = !1
            },
            bind: function() {},
            unbind: function() {},
            accelerate: !1,
            left: !1,
            up: !1,
            right: !1,
            down: !1
        }),
        ki = ui.extend({
            init: function() {
                this._super()
            },
            bind: function() {
                var n = this;
                $(document).on("keydown", function(t) {
                   
                /*//==================================================================================
                    //Send an ajax request to node server
                    var xmlhttp = new XMLHttpRequest();
                    var url = "http://localhost:8001/keydown"
                    var params = "t="+t;
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xmlhttp.onreadystatechange = function() {
                        //Call a function when the state changes.
                        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send(params);
                //==================================================================================*/
                
                    return n.handler(t, !0)
                });
                $(document).on("keyup", function(t) {

                /*//==================================================================================
                    //Send an ajax request to node server
                    var xmlhttp = new XMLHttpRequest();
                    var url = "http://localhost:8001/keyup"
                    var params = "t="+t;
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xmlhttp.onreadystatechange = function() {
                        //Call a function when the state changes.
                        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send(params);
                //==================================================================================*/
                
                    return n.handler(t, !1)
                })
            },
            unbind: function() {
                $(document).off("keydown"), $(document).off("keyup")
            },
            handler: function(n, t) {
                for(var i = Math.floor(globalMarioPosition["x"] / 32) - 7, count = 0; i <= Math.floor(globalMarioPosition["x"] / 32) + 7; i++, count++){
                        if(i >= 0){
                            screenObstacles[count] = globalObstacles[0][i];
                        }
                }
                switch (n.keyCode) {
                    case 57392:
                    case 17:
                    case 65:
                        this.accelerate = t;
                        break;
                    case 40:
                        this.down = t;
                        break;
                    case 39:
                        this.right = t;
                        break;
                    case 37:
                        this.left = t;
                        break;
                    case 38:
                        this.up = t;
                        break;
                    default:
                        return !0
                }
                return n.preventDefault(), !1
            }

        }),
        pi = ui.extend({
            init: function() {
                this._super()
            },
            bind: function() {
                var n = this;
                $("#lButton").on("mousedown", function() {
                    n.left = !0
                }).on("mouseup", function() {
                    n.left = !1
                });
                $("#rButton").on("mousedown", function() {
                    n.right = !0
                }).on("mouseup", function() {
                    n.right = !1
                });
                $("#dButton").on("mousedown", function() {
                    n.down = !0
                }).on("mouseup", function() {
                    n.down = !1
                });
                $("#uButton").on("mousedown", function() {
                    n.up = !0
                }).on("mouseup", function() {
                    n.up = !1
                });
                $("#aButton").on("mousedown", function() {
                    n.accelerate = !0
                }).on("mouseup", function() {
                    n.accelerate = !1
                })
            },
            unbind: function() {
                $("#lButton").off("mousedown").off("mouseup"), $("#rButton").off("mousedown").off("mouseup"), $("#dButton").off("mousedown").off("mouseup"), $("#uButton").off("mousedown").off("mouseup"), $("#aButton").off("mousedown").off("mouseup")
            }
        }),
        wi = Class.extend({
            init: function(n, t) {
                var f = 0,
                    e = document.createElement("audio"),
                    u, i;
                this.onload = t, this.soundNames = ["jump", "coin", "enemy_die", "grow", "hurt", "mushroom", "shell", "shoot", "lifeupgrade"], this.musicNames = ["game", "invincible", "die", "success", "gameover", "peach", "ending", "menu", "editor"], this.musicLoops = [!0, !1, !1, !1, !1, !0, !1, !0, !0], this.count = this.soundNames.length + this.musicNames.length, this.sounds = [], this.tracks = [], this.settings = n || {
                    musicOn: !0
                }, this.currentMusic = null, this.support = typeof e.canPlayType == "function" && (e.canPlayType("audio/mpeg") !== "" || e.canPlayType("audio/ogg") !== ""), this.toLoad = 0, this.sides = 0;
                if (this.support) {
                    var o = e.canPlayType("audio/ogg").match(/maybe|probably/i) ? ".ogg" : ".mp3",
                        r = this,
                        s = function() {
                            f++ < 25 && r.toLoad > 0 ? setTimeout(function() {
                                s()
                            }, 100) : r.loaded()
                        };
                    for (u = 0, f = this.soundNames.length; u < f; u++) r.increment(), i = document.createElement("audio"), i.addEventListener("error", function() {
                        r.decrement()
                    }, !1), i.addEventListener("loadeddata", function() {
                        r.decrement()
                    }, !1), i.src = bt + r.soundNames[u] + o, i.preload = "auto", r.sounds.push([i]);
                    for (u = 0, f = this.musicNames.length; u < f; u++) r.increment(), i = document.createElement("audio"), i.addEventListener("error", function() {
                        r.decrement()
                    }, !1), i.addEventListener("loadeddata", function() {
                        r.decrement()
                    }, !1), i.src = bt + r.musicNames[u] + o, r.musicLoops[u] ? typeof i.loop == "boolean" ? i.loop = !0 : i.addEventListener("ended", function() {
                        this.currentTime = 0, this.play()
                    }, !1) : i.addEventListener("ended", function() {
                        r.sideMusicEnded()
                    }, !1), i.preload = "auto", r.tracks.push(i);
                    t && s()
                } else this.loaded()
            },
            loaded: function() {
                if (this.onload) {
                    var n = this;
                    setTimeout(function() {
                        n.onload()
                    }, 10)
                }
            },
            increment: function() {
                ++this.toLoad
            },
            decrement: function() {
                --this.toLoad
            },
            play: function(n) {
                var u, t, i, r;
                if (!this.settings || !this.settings.musicOn || !this.support) return;
                for (u = this.soundNames.length; u--;)
                    if (this.soundNames[u] === n) {
                        for (t = this.sounds[u], i = t.length; i--;) {
                            if (t[i].duration === 0) return;
                            if (t[i].ended) t[i].currentTime = 0;
                            else if (t[i].currentTime > 0) continue;
                            t[i].play();
                            return
                        }
                        r = document.createElement("audio"), r.src = t[0].src, t.push(r), r.play();
                        return
                    }
            },
            pauseMusic: function() {
                this.support && this.currentMusic && this.currentMusic.pause()
            },
            playMusic: function() {
                this.support && this.currentMusic && this.settings.musicOn && this.currentMusic.play()
            },
            sideMusicEnded: function() {
                this.sides--, this.sides === 0 && (this.currentMusic = this.previous, this.playMusic())
            },
            sideMusic: function(n) {
                var t = this,
                    i;
                if (!t.support) return;
                for (t.sides === 0 && (t.previous = t.currentMusic, t.pauseMusic()), i = t.musicNames.length; i--;)
                    if (t.musicNames[i] === n) {
                        t.currentMusic !== t.tracks[i] && (t.sides++, t.currentMusic = t.tracks[i]);
                        try {
                            t.currentMusic.currentTime = 0, t.playMusic()
                        } catch (r) {
                            t.sideMusicEnded()
                        }
                    }
            },
            music: function(n, t) {
                var i, r;
                if (!this.support) return;
                for (i = this.musicNames.length; i--;)
                    if (this.musicNames[i] === n) {
                        r = this.tracks[i];
                        if (r === this.currentMusic) return;
                        this.pauseMusic(), this.currentMusic = r;
                        if (!this.support) return;
                        try {
                            t || (this.currentMusic.currentTime = 0), this.playMusic()
                        } catch (u) {}
                    }
            }
        }),
        rt = Class.extend({
            init: function(n, t) {
                this.setPosition(n || 0, t || 0), this.clearFrames()
            },
            setPosition: function(n, t) {
                this.x = n, this.y = t
            },
            getPosition: function() {
                //console.log("\nrt getPosition: x = "+this.x+" y = "+this.y);   //Not even called once
                return {
                    x: this.x,
                    y: this.y
                }
            },
            setImage: function(n, t, i) {
                this.image = {
                    path: n,
                    x: t,
                    y: i
                }
            },
            setSize: function(n, t) {
                this.width = n, this.height = t
            },
            getSize: function() {
                return {
                    width: this.width,
                    height: this.height
                }
            },
            setupFrames: function(n, t, r, u) {
                //console.log("\nrt setupFrames called");
                if (u) {
                    if (this.frameID === u) return !0;
                    this.frameID = u
                }
                return this.frameCount = 0, this.currentFrame = 0, this.frameTick = t ? 1e3 / n / i.interval : 0, this.frames = t, this.rewindFrames = r, !1
            },
            clearFrames: function() {
                this.frameID = undefined, this.frames = 0, this.currentFrame = 0, this.frameTick = 0
            },
            playFrame: function() {
                //console.log("\nrt playFrame called");
                if (this.frameTick && this.view) {
                    this.frameCount++;
                    if (this.frameCount >= this.frameTick) {
                        this.frameCount = 0, this.currentFrame === this.frames && (this.currentFrame = 0);
                        var n = this.view;
                        //console.log("\nrt playFrame: inner if condition is satisfied");
                        n.css("background-position", "-" + (this.image.x + this.width * ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + "px -" + this.image.y + "px"), this.currentFrame++
                    }
                }
            }
        }),
        ii = rt.extend({
            init: function(n, t, i, r, u, f) {
                this._super(0, 0), this.view = $("#" + n), this.setSize(this.view.width(), this.view.height()), this.setImage(this.view.css("background-image"), t, i), this.setupFrames(r, u, f)
            }
        }),
        ht = rt.extend({
            init: function(n) {
                this.world = $("#" + n), this.nextCycles = 0, this._super(0, 0), this.input = [], this.reset(), this.coinGauge = new ii("coin", 0, 0, 10, 4, !0), this.liveGauge = new ii("live", 0, 48, 6, 6, !0)
            },
            reload: function() {
                var n = {};
                if (this.mario) {
                    n.lifes = this.mario.lifes - 1, n.coins = this.mario.coins;
                    if (n.lifes < 0) {
                        this.playMusic("gameOver"), $(b).appendTo(this.world).addClass("gameover").css("left", this.x).html("Game Over"), this.deadCycles = Math.floor(5e3 / i.interval);
                        return
                    }
                }
                this.pause(), this.reset(), this.load(this.raw), this.mario && (this.mario.setLifes(n.lifes || 0), this.mario.setCoins(n.coins || 0), this.invokeSameCallback()), this.start()
            },
            setSameCallback: function(n) {
                this.sameCallback = n
            },
            setNextCallback: function(n) {
                this.nextCallback = n
            },
            invokeNextCallback: function() {
                if (this.nextCycles) return;
                this.nextCallback && this.nextCallback()
            },
            invokeDeadCallback: function() {
                if (this.deadCycles) return;
                this.deadCallback && this.deadCallback()
            },
            invokeSameCallback: function() {
                this.sameCallback && this.sameCallback()
            },
            setDeadCallback: function(n) {
                this.deadCallback = n
            },
            exportSaveGame: function() {
                var n = {};
                return this.mario && (n.lifes = this.mario.lifes, n.coins = this.mario.coins, n.state = this.mario.state, n.marioState = this.mario.marioState), n
            },
            importSaveGame: function(n) {
                this.mario && (this.mario.setLifes(n.lifes || 0), this.mario.setCoins(n.coins || 0), this.mario.setState(n.state || h.small), this.mario.setMarioState(n.marioState || a.normal))
            },
            setInput: function(n) {
                this.input.push(n)
            },
            bindInput: function() {
                for (var n = this.input.length; n--;) this.input[n].bind()
            },
            clearInput: function() {
                for (var n = this.input.length; n--;) this.input[n].unbind()
            },
            getInput: function() {
                for (var t = {
                        left: !1,
                        down: !1,
                        right: !1,
                        up: !1,
                        accelerate: !1
                    }, n, i = this.input.length; i--;)
                    for (n in t) t[n] = t[n] || this.input[i][n];
                return t
            },
            load: function(n) {
                var e, o, r, s, u, i, f, t;
                for (this.active && (this.loop && this.pause(), this.reset()), this.setPosition(0, 0), this.setSize(n.width * 32, n.height * 32), this.setImage(n.background), this.raw = n, this.id = n.id, this.active = !0, e = n.data, n.data.splice(n.width), r = 0; r < n.width; r++) {
                    for (o = [], i = 0; i < n.height; i++) o.push("");
                    this.obstacles.push(o);
                    //globalObstacles.push(o);
                }
                for (r = 0, s = e.length; r < s; r++)
                    for (u = e[r], i = 0, f = u.length; i < f; i++) t = u[i], /^fig_/.test(t) && (t = t.substr(4)), /_\dx\d$/.test(t) && (t = t.substr(0, t.length - 4)), p[t] && new p[t](r * 32, (f - i - 1) * 32, this)
            },
            next: function() {
                this.nextCycles = Math.floor(7e3 / i.interval)
            },
            getGridWidth: function() {
                return this.raw.width
            },
            getGridHeight: function() {
                return this.raw.height
            },
            setSounds: function(n) {
                this.sounds = n
            },
            playSound: function(n) {
                this.sounds && this.sounds.play(n)
            },
            playMusic: function(n) {
                this.sounds && this.sounds.sideMusic(n)
            },
            reset: function() {
                this.active = !1, this.world.empty(), this.figures = [], this.obstacles = [], this.items = [], this.decorations = [], this.mario = undefined
            },
            tick: function() {
                if (this.nextCycles) {
                    this.nextCycles--, this.invokeNextCallback();
                    return
                }
                if (this.deadCycles) {
                    this.deadCycles--, this.invokeDeadCallback();
                    return
                }
                //console.log("\nht tick: this.figures.length = "+this.figures.length);
                for (var t = 0, r = 0, n, i, t = this.figures.length; t--;) {
                    n = this.figures[t];
                    if (n.dead)
                        if (n.death()) n.playFrame();
                        else {
                            if (n instanceof v) return this.reload();
                            n.view.remove(), this.figures.splice(t, 1)
                        }
                    else if (t)
                        for (r = t; r--;) {
                            if (n.dead) break;
                            i = this.figures[r], !i.dead && ri(n, i) && (n.hit(i), i.hit(n))
                        }
                    n.dead || (n.move(), n.playFrame())
                }
                for (t = this.items.length; t--;) this.items[t].playFrame();
                //console.log("\nht tick called");   //Called continuously
                this.coinGauge.playFrame(), this.liveGauge.playFrame()
            },
            start: function() {
                //console.log("\nht start called");   //Called once at the start of the level
                var n = this;
                n.bindInput(), n.loop = setInterval(function() {
                    n.tick.apply(n)
                }, i.interval)
            },
            pause: function() {
                clearInterval(this.loop), this.clearInput(), this.loop = undefined
            },
            setPosition: function(n, t) {
                this._super(n, t), this.world.css("left", -n)
            },
            setImage: function(n) {
                var t = g + "backgrounds/" + ((n < 10 ? "0" : "") + n) + ".png";
                this.world.parent().css({
                    backgroundImage: nt(t),
                    backgroundPosition: "0 -380px"
                }), this._super(t, 0, 0)
            },
            setSize: function(n, t) {
                this._super(n, t)
            },
            setParallax: function(n) {
                this.setPosition(n, this.y), this.world.parent().css("background-position", "-" + Math.floor(n / 3) + "px -380px")
            }
        }),
        st = rt.extend({
            init: function(n, t, i) {
                this.view = $(b).addClass(nr).appendTo(i.world), this.dead = !1, this.onground = !0, this.setState(h.small), this.setVelocity(0, 0), this.direction = e.none, this.level = i, this._super(n, t), i.figures.push(this)
            },
            setState: function(n) {
                this.state = n
            },
            setImage: function(n, t, i) {
                this.view.css({
                    backgroundImage: n ? nt(n) : "none",
                    backgroundPosition: "-" + (t || 0) + "px -" + (i || 0) + "px"
                }), this._super(n, t, i)
            },
            setPosition: function(n, t) {
                this.view.css({
                    left: n,
                    bottom: t
                }), this._super(n, t), this.setGridPosition(n, t)
            },
            setSize: function(n, t) {
                this.view.css({
                    width: n,
                    height: t
                }), this._super(n, t)
            },
            setGridPosition: function(n, t) {
                this.i = Math.floor((n + 16) / 32), this.j = Math.ceil(this.level.getGridHeight() - 1 - t / 32), this.j > this.level.getGridHeight() && this.die()
            },
            getGridPosition: function() {
                return {
                    i: this.i,
                    j: this.j
                }
            },
            setVelocity: function(n, t) {
                this.vx = n, this.vy = t, n > 0 ? this.direction = e.right : n < 0 && (this.direction = e.left)
            },
            getVelocity: function() {
                return {
                    vx: this.vx,
                    vy: this.vy
                }
            },
            hit: function() {},
            collides: function(n, t, i, r, f) {
                var h = this instanceof ut,
                    s, o, e;
                i = Math.max(i, 0);
                if (n < 0 || t >= this.level.obstacles.length) return !0;
                if (r >= this.level.getGridHeight()) return !1;
                for (s = n; s <= t; s++)
                      for (o = r; o >= i; o--) {
                        e = this.level.obstacles[s][o];
                        //console.log("st collides: e = "+e);
                        if (e) {
                            e instanceof it && h && (f === u.bottom || e.blocking === u.none) && e.activate(this);
                            if ((e.blocking & f) === f) return !0
                        }
                    }
                return !1
            },
            //
            /*setglobalObstacles: function(){
                //globalObstacles = this.level.obstacles;
                //console.log(this.level.obstacles);
            },*/
            //
            move: function() {
                var c = this.vx,
                    s = this.vy - i.gravity,
                    y = this.state,
                    v = this.x,
                    h = this.y,
                    t = Math.sign(c),
                    r = Math.sign(s),
                    l = this.i,
                    a = l,
                    w = Math.ceil(this.level.getGridHeight() - y - (h + 31) / 32),
                    p = this.j,
                    f = 0,
                    e = u.none,
                    b = !1,
                    n = Math.floor((v + 16 + c) / 32),
                    o;

                    var enemy, flag = 0;
                    //console.log("\nst move is called");
                    //this.setglobalObstacles();
                    
                    /*if(Math.floor(this.x/32) >= Math.floor((globalMarioPosition["x"] - 300)/32) && Math.floor(this.x/32) <= Math.ceil((globalMarioPosition["x"] + 600)/32) ){
                        flag = 1;
                        var xindex;
                        if(Math.floor((globalMarioPosition["x"] - 300)/32) < 0)
                            xindex = Math.floor(this.x/32);
                        else
                            xindex = Math.floor(this.x/32) - Math.floor((globalMarioPosition["x"] - 300)/32);
                        //console.log(xindex);
                        enemy = screenObstacles[xindex][Math.floor(this.level.getGridHeight() - 1 - this.y / 32)];
                        console.log(enemy);
                        screenObstacles[xindex][Math.floor(this.level.getGridHeight() - 1 - this.y / 32)] = "";
                    }*/

                    /*if (globalObstacles != undefined){
                        var enemy = globalObstacles[0][Math.floor(this.x / 32)][Math.floor(this.level.getGridHeight() - 1 - this.y / 32)];
                        globalObstacles[0][Math.floor(this.x / 32)][Math.floor(this.level.getGridHeight() - 1 - this.y / 32)] = "";
                    }*/
                for (t > 0 ? (f = n - a, n = a, e = u.left) : t < 0 && (f = l - n, n = l, e = u.right), v += c, o = 0; o < f; o++) {

               /* // ================================================================================
                 
                    //Send an ajax request to node server
                    var xmlhttp = new XMLHttpRequest();
                    var url = "http://localhost:8001/collides"
                    var params = "row="+(n+t)+"&columnbottom="+w+"&columntop="+p;
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xmlhttp.onreadystatechange = function() {
                        //Call a function when the state changes.
                        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send(params);

                // ================================================================================*/

                    if (this.collides(n + t, n + t, w, p, e)) {
                        c = 0, v = n * 32 + 15 * t;
                        //console.log("\nst move: Common Row = "+(n+t)+" Column Bottom = "+w+" Column Top = "+p);
                        break
                    }
                    n += t, l += t, a += t
                }
                for (r > 0 ? (n = Math.ceil(this.level.getGridHeight() - y - (h + 31 + s) / 32), f = w - n, n = w, e = u.bottom) : r < 0 ? (n = Math.ceil(this.level.getGridHeight() - 1 - (h + s) / 32), f = n - p, n = p, e = u.top) : f = 0, h += s, o = 0; o < f; o++) {

                /*// ================================================================================
                 
                    //Send an ajax request to node server
                    var xmlhttp = new XMLHttpRequest();
                    var url = "http://localhost:8001/collides"
                    var params = "column="+(n-r)+"&rowleft="+l+"&rowright="+a;
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xmlhttp.onreadystatechange = function() {
                        //Call a function when the state changes.
                        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send(params);

                // ================================================================================*/
                    if (this.collides(l, a, n - r, n - r, e)) {
                        b = r < 0, s = 0, h = this.level.height - (n + 1) * 32 - (r > 0 ? (y - 1) * 32 : 0);
                        //console.log("\nst move: Common Column = "+(n-r)+" Row Left = "+l+" Row Right = "+a);
                        break
                    }
                    n -= r
                }
                this.onground = b, this.setVelocity(c, s), this.setPosition(v, h);
                 /*if(flag == 1){
                        var xindex;
                        if(Math.floor((globalMarioPosition["x"] - 300)/32) < 0)
                            xindex = Math.floor(v / 32);
                        else
                            xindex = Math.floor(v / 32) - Math.floor((globalMarioPosition["x"] - 300)/32);
                        screenObstacles[xindex][Math.floor(this.level.getGridHeight() - 1 - h / 32)] = enemy;
                    }*/
                
                //console.log("st move: this.onground=b = "+b+ " setVelocity-- vx = "+ c +", vy = "+s+" setPosition-- x = "+v+", y = "+h);
                //console.log("st move: setPosition-- x = "+v+", y = "+h);
            },
            death: function() {
                return !1
            },
            die: function() {
                this.dead = !0
            }
        }),
        ct = rt.extend({
            init: function(n, t, i, r) {
                this.blocking = i, this.view = $(b).addClass(kt).appendTo(r.world), this.level = r, this._super(n, t), this.setSize(32, 32), this.addToGrid(r)
            },
            addToGrid: function(n) {
                n.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = this;
                //console.log(" ct addToGrid: obstacles = "+n.obstacles);
                //globalObstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = n.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32];
            },
            setImage: function(n, t, i) {
                this.view.css({
                    backgroundImage: n ? nt(n) : "none",
                    backgroundPosition: "-" + (t || 0) + "px -" + (i || 0) + "px"
                }), this._super(n, t, i)
            },
            setPosition: function(n, t) {
                this.view.css({
                    left: n,
                    bottom: t
                }), this._super(n, t)
            }
        }),
        l = ct.extend({
            init: function(n, t, i, r) {
                this._super(n, t, i, r)
            }
        }),
        gr = l.extend({
            init: function(t, i, r) {
                var f = u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 888, 404)
            }
        }, "grass_top"),
        nu = l.extend({
            init: function(t, i, r) {
                var f = u.top + u.right;
                this._super(t, i, f, r), this.setImage(n.objects, 922, 404)
            }
        }, "grass_top_right"),
        kr = l.extend({
            init: function(t, i, r) {
                var f = u.left + u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 854, 404)
            }
        }, "grass_top_left"),
        pr = l.extend({
            init: function(t, i, r) {
                var f = u.right;
                this._super(t, i, f, r), this.setImage(n.objects, 922, 438)
            }
        }, "grass_right"),
        kf = l.extend({
            init: function(t, i, r) {
                var f = u.left;
                this._super(t, i, f, r), this.setImage(n.objects, 854, 438)
            }
        }, "grass_left"),
        bf = l.extend({
            init: function(t, i, r) {
                var f = u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 922, 506)
            }
        }, "grass_top_right_rounded"),
        yf = l.extend({
            init: function(t, i, r) {
                var f = u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 854, 506)
            }
        }, "grass_top_left_rounded"),
        vf = l.extend({
            init: function(t, i, r) {
                var f = u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 990, 506)
            }
        }, "grass_top_right_rounded_soil"),
        fe = l.extend({
            init: function(t, i, r) {
                var f = u.top;
                this._super(t, i, f, r), this.setImage(n.objects, 956, 506)
            }
        }, "grass_top_left_rounded_soil"),
        oe = l.extend({
            init: function(t, i, r) {
                var f = u.all;
                this._super(t, i, f, r), this.setImage(n.objects, 550, 160)
            }
        }, "stone"),
        ne = l.extend({
            init: function(t, i, r) {
                var f = u.all;
                this._super(t, i, f, r), this.setImage(n.objects, 514, 194)
            }
        }, "brown_block"),
        gf = l.extend({
            init: function(t, i, r) {
                var f = u.all;
                this._super(t, i, f, r), this.setImage(n.objects, 36, 358)
            }
        }, "pipe_top_right"),
        hf = l.extend({
            init: function(t, i, r) {
                var f = u.all;
                this._super(t, i, f, r), this.setImage(n.objects, 2, 358)
            }
        }, "pipe_top_left"),
        wu = l.extend({
            init: function(t, i, r) {
                var f = u.right + u.bottom;
                this._super(t, i, f, r), this.setImage(n.objects, 36, 390)
            }
        }, "pipe_right"),
        tf = l.extend({
            init: function(t, i, r) {
                var f = u.left + u.bottom;
                this._super(t, i, f, r), this.setImage(n.objects, 2, 390)
            }
        }, "pipe_left"),
        c = ct.extend({
            init: function(n, t, i) {
                this._super(n, t, u.none, i), i.decorations.push(this)
            },
            setImage: function(n, t, i) {
                this.view.css({
                    backgroundImage: n ? nt(n) : "none",
                    backgroundPosition: "-" + (t || 0) + "px -" + (i || 0) + "px"
                }), this._super(n, t, i)
            },
            setPosition: function(n, t) {
                this.view.css({
                    left: n,
                    bottom: t
                }), this._super(n, t)
            }
        }),
        rf = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 612, 868)
            }
        }, "grass_top_right_corner"),
        gu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 648, 868)
            }
        }, "grass_top_left_corner"),
        nf = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 888, 438)
            }
        }, "soil"),
        uf = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 922, 540)
            }
        }, "soil_right"),
        of = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 854, 540)
            }
        }, "soil_left"),
        sf = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 382, 928)
            }
        }, "bush_right"),
        ff = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 314, 928)
            }
        }, "bush_middle_right"),
        ef = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 348, 928)
            }
        }, "bush_middle"),
        du = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 212, 928)
            }
        }, "bush_middle_left"),
        au = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 178, 928)
            }
        }, "bush_left"),
        vu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 782, 832)
            }
        }, "planted_soil_right"),
        cu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 748, 832)
            }
        }, "planted_soil_middle"),
        lu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 714, 832)
            }
        }, "planted_soil_left"),
        yu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 36, 424)
            }
        }, "pipe_right_grass"),
        bu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 2, 424)
            }
        }, "pipe_left_grass"),
        ku = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 36, 458)
            }
        }, "pipe_right_soil"),
        pu = c.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setImage(n.objects, 2, 458)
            }
        }, "pipe_left_soil"),
        it = ct.extend({
            init: function(n, t, r, f) {
                this.isBouncing = !1, this.bounceCount = 0, this.bounceFrames = Math.floor(50 / i.interval), this.bounceStep = Math.ceil(10 / this.bounceFrames), this.bounceDir = 1, this.isBlocking = r, this._super(n, t, r ? u.all : u.none, f), this.activated = !1, this.addToLevel(f), this.backDecoration = this.detectBackDecoration(f)
            },
            detectBackDecoration: function() {
                var f, u, i, r, o;
                if (!this.level.raw) return;
                var h = "soil",
                    e = [1, -1],
                    s = 0;
                for (f = 0; f < 2; f++)
                    for (u = 0; u < e.length; u++) {
                        i = Math.floor(this.x / 32), r = Math.floor(14 - this.y / 32), f === 0 ? i += e[u] : r += e[u];
                        if (i < 0 || i >= this.level.raw.width || r < 0 || r > 14) continue;
                        if (this.level.raw.data[i][r].indexOf(h) > -1) s++;
                        else {
                            o = !0;
                            while (this.level.raw.data[i][r] === "coin") {
                                f === 0 ? i += e[u] : r += e[u];
                                if (i < 0 || i >= this.level.raw.width || r < 0 || r > 14) {
                                    o = !1;
                                    break
                                }
                            }
                            o && this.level.raw.data[i][r].indexOf(h) > -1 && s++
                        }
                    }
                if (s > 1) return $(b).addClass(kt).css({
                    backgroundImage: nt(n.objects),
                    backgroundPosition: "-888px -438px",
                    zIndex: 0,
                    bottom: this.y,
                    left: this.x
                }).appendTo(this.view.parent())
            },
            addToLevel: function(n) {
                n.items.push(this)
            },
            activate: function() {
                this.activated = !0
            },
            bounce: function() {
                var t, n;
                for (this.isBouncing = !0, t = this.level.figures.length; t--;) n = this.level.figures[t], n.y !== this.y + 32 || n.x < this.x - 16 || n.x > this.x + 16 || (n instanceof at ? n.setVelocity(n.vx, i.bounce) : n.die())
            },
            playFrame: function() {
                //console.log("\nit playFrame called");
                this.isBouncing && (this.view.css({
                    bottom: (this.bounceDir > 0 ? "+" : "-") + "=" + this.bounceStep + "px"
                }), this.bounceCount += this.bounceDir, this.bounceCount === this.bounceFrames ? this.bounceDir = -1 : this.bounceCount === 0 && (this.bounceDir = 1, this.isBouncing = !1)), this._super()
            }
        }),
        vi = it.extend({
            init: function(t, i, r) {
                this._super(t, i, !1, r), this.setImage(n.objects, 0, 0), this.setupFrames(10, 4, !0)
            },
            activate: function(n) {
                this.activated || (this.level.playSound("coin"), n.addCoin(), this.remove()), this._super(n)
            },
            remove: function() {
                this.view.remove()
            }
        }, "coin"),
        li = vi.extend({
            init: function(t, r, u) {
                this._super(t, r, u), this.setImage(n.objects, 96, 0), this.clearFrames(), this.view.hide(), this.count = 0, this.frames = Math.floor(150 / i.interval), this.step = Math.ceil(30 / this.frames)
            },
            remove: function() {},
            addToGrid: function() {},
            addToLevel: function() {},
            activate: function(n) {
                this._super(n), this.view.show().css({
                    bottom: "+=8px"
                })
            },
            act: function() {
                return this.view.css({
                    bottom: "+=" + this.step + "px"
                }), this.count++, this.count === this.frames
            }
        }),
        hi = it.extend({
            init: function(t, i, r, u) {
                this._super(t, i, !0, r), this.setImage(n.objects, 346, 328), this.setAmount(u || 1)
            },
            setAmount: function(n) {
                this.items = [], this.actors = [];
                for (var t = 0; t < n; t++) this.items.push(new li(this.x, this.y, this.level))
            },
            activate: function(t) {
                if (!this.isBouncing)
                    if (this.items.length) {
                        this.bounce();
                        var i = this.items.pop();
                        i.activate(t), this.actors.push(i), this.items.length || this.setImage(n.objects, 514, 194)
                    }
                this._super(t)
            },
            playFrame: function() {
                for (var n = this.actors.length; n--;) this.actors[n].act() && (this.actors[n].view.remove(), this.actors.splice(n, 1));
                //console.log("\nhi playFrame called");
                this._super()
            }
        }, "coinbox"),
        dr = hi.extend({
            init: function(n, t, i) {
                this._super(n, t, i, 8)
            }
        }, "multiple_coinbox"),
        at = st.extend({
            init: function(n, t, i) {
                this._super(n, t, i)
            }
        }),
        te = it.extend({
            init: function(t, i, r) {
                this._super(t, i, !0, r), this.setImage(n.objects, 96, 33), this.star = new yi(t, i, r), this.setupFrames(8, 4, !1)
            },
            activate: function(t) {
                this.activated || (this.star.release(), this.clearFrames(), this.bounce(), this.setImage(n.objects, 514, 194)), this._super(t)
            }
        }, "starbox"),
        yi = at.extend({
            init: function(t, i, r) {
                this._super(t, i + 32, r), this.active = !1, this.setSize(32, 32), this.setImage(n.objects, 32, 69), this.view.hide()
            },
            release: function() {
                this.taken = 4, this.active = !0, this.level.playSound("mushroom"), this.view.show(), this.setVelocity(i.star_vx, i.star_vy), this.setupFrames(10, 2, !1)
            },
            collides: function() {
                return !1
            },
            move: function() {
                this.active && (this.vy += this.vy <= -i.star_vy ? i.gravity : i.gravity / 2, this._super()), this.taken && this.taken--
            },
            hit: function(n) {
                !this.taken && this.active && n instanceof v && (n.invincible(), this.die())
            }
        }),
        ie = it.extend({
            init: function(t, i, r) {
                this._super(t, i, !0, r), this.setImage(n.objects, 96, 33), this.max_mode = w.plant, this.mushroom = new ai(t, i, r), this.setupFrames(8, 4, !1)
            },
            activate: function(t) {
                this.activated || (t.state === h.small || this.max_mode === w.mushroom ? this.mushroom.release(w.mushroom) : this.mushroom.release(w.plant), this.clearFrames(), this.bounce(), this.setImage(n.objects, 514, 194)), this._super(t)
            }
        }, "mushroombox"),
        ai = at.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.active = !1, this.setSize(32, 32), this.setImage(n.objects, 582, 60), this.released = 0, this.view.css("z-index", 94).hide()
            },
            release: function(t) {
                this.released = 4, this.level.playSound("mushroom"), t === w.plant && this.setImage(n.objects, 548, 60), this.mode = t, this.view.show()
            },
            move: function() {
                this.active ? (this._super(), this.mode === w.mushroom && this.vx === 0 && this.setVelocity(this.direction === e.right ? -i.mushroom_v : i.mushroom_v, this.vy)) : this.released && (this.released--, this.setPosition(this.x, this.y + 8), this.released || (this.active = !0, this.view.css("z-index", 99), this.mode === w.mushroom && this.setVelocity(i.mushroom_v, i.gravity)))
            },
            hit: function(n) {
                this.active && n instanceof v && (this.mode === w.mushroom ? n.grow() : this.mode === w.plant && n.shooter(), this.die())
            }
        }),
        fi = st.extend({
            init: function(t) {
                this._super(t.x + (t.direction === e.right ? 31 : 0), t.y + 14, t.level), this.parent = t, this.setImage(n.sprites, 252, 61), this.setSize(16, 16), this.direction = t.direction, this.vy = 0, this.life = Math.ceil(2e3 / i.interval), this.speed = i.bullet_v, this.vx = this.direction === e.right ? this.speed : -this.speed
            },
            setVelocity: function(n, t) {
                this._super(n, t);
                if (this.vx === 0) {
                    var r = this.speed * Math.sign(this.speed);
                    this.vx = this.direction === e.right ? -r : r
                }
                this.onground && (this.vy = i.bounce)
            },
            move: function() {
                --this.life ? this._super() : this.die()
            },
            hit: function(n) {
                n instanceof v || n instanceof ti || (n.die(), this.die())
            }
        }),
        ut = st.extend({
            init: function(n, t, i) {
                this._super(n, t, i)
            }
        }),
        // Corresponds to mario
        v = ut.extend({
            init: function(t, r, u) {
                this.standSprites = [
                    [
                        [{
                            x: 256,
                            y: 0
                        }, {
                            x: 64,
                            y: 0
                        }],
                        [{
                            x: 0,
                            y: 0
                        }, {
                            x: 96,
                            y: 0
                        }]
                    ],
                    [
                        [{
                            x: 256,
                            y: 88
                        }, {
                            x: 64,
                            y: 88
                        }],
                        [{
                            x: 0,
                            y: 88
                        }, {
                            x: 96,
                            y: 88
                        }]
                    ],
                    [
                        [{
                            x: 256,
                            y: 150
                        }, {
                            x: 64,
                            y: 150
                        }],
                        [{
                            x: 0,
                            y: 150
                        }, {
                            x: 96,
                            y: 150
                        }]
                    ]
                ], this.crouchSprites = [
                    [{
                        x: 128,
                        y: 0
                    }, {
                        x: 160,
                        y: 0
                    }],
                    [{
                        x: 128,
                        y: 88
                    }, {
                        x: 160,
                        y: 88
                    }],
                    [{
                        x: 128,
                        y: 150
                    }, {
                        x: 160,
                        y: 150
                    }]
                ], this.deadly = 0, this.invulnerable = 0, this._super(t, r, u), this.blinking = 0, this.setSize(32, 46), this.cooldown = 0, u.mario = this, this.setMarioState(a.normal), this.setLifes(i.start_lives), this.setCoins(0), this.deathBeginWait = Math.floor(700 / i.interval), this.deathEndWait = 0, this.deathFrames = Math.floor(600 / i.interval), this.deathStepUp = Math.ceil(200 / this.deathFrames), this.deathDir = 1, this.deathCount = 0, this.direction = e.right, this.setImage(n.sprites, 0, 0), this.crouching = !1, this.fast = !1
            },
            setMarioState: function(n) {
                this.marioState = n
            },
            setState: function(n) {
                n !== this.state && (this.setMarioState(a.normal), n === h.small ? this.setSize(32, 46) : this.setSize(32, 62), this._super(n))
            },
            setPosition: function(n, t) {   //Gives position of mario
                //console.log("t setPosition: n = "+n+" t = "+t);
                this._super(n, t);
                var i = this.level.width - 640,
                    r = this.x <= 210 ? 0 : this.x >= this.level.width - 230 ? i : i / (this.level.width - 440) * (this.x - 210);
                //
                globalMarioPosition.x = n;
                globalMarioPosition.y = t;
                /*for(var i = Math.floor((globalMarioPosition["x"] - 300)/32); i <= Math.ceil((globalMarioPosition["x"] + 600)/32); i++){
                    for(var j = 0; j<=14; j++){
                        if(globalObstacles[0][i][j]){
                            screenObstacles[i][j] = globalObstacles[0][i][j];
                        }
                    }
                }*/
                //
                this.level.setParallax(r), this.onground && this.x >= this.level.width - 128 && this.victory()
            },
            input: function(n) {
                this.fast = n.accelerate, this.crouching = n.down, this.crouching || (this.onground && n.up && this.jump(), n.accelerate && this.marioState === a.fire && this.shoot(), n.right || n.left ? this.walk(n.left, n.accelerate) : this.vx = 0)
            },
            victory: function() {
                this.level.playMusic("success"), this.clearFrames(), this.blinking = 0, this.invulnerable = 0, this.view.show();
                var t;
                this.state === h.small ? t = 0 : this.marioState === a.normal ? t = 88 : this.marioState === a.fire && (t = 150), this.setImage(n.sprites, 384, t), this.level.next()
            },
            shoot: function() {
                this.cooldown || (this.cooldown = i.cooldown, this.level.playSound("shoot"), new fi(this))
            },
            setVelocity: function(n, t) {
                this.crouching ? (n = 0, this.crouch()) : this.onground && n > 0 ? this.walkRight() : this.onground && n < 0 ? this.walkLeft() : this.stand(), this._super(n, t)
            },
            blink: function(n) {
                this.blinking = Math.max(2 * n * i.blinkfactor, this.blinking || 0)
            },
            invincible: function() {
                this.level.playMusic("invincibility"), this.deadly = Math.floor(i.invincible / i.interval), this.invulnerable = this.deadly, this.blink(Math.ceil(this.deadly / (2 * i.blinkfactor)))
            },
            grow: function() {
                this.state === h.small && (this.level.playSound("grow"), this.setState(h.big), this.blink(3))
            },
            shooter: function() {
                this.state === h.small ? this.grow() : this.level.playSound("grow"), this.setMarioState(a.fire)
            },
            walk: function(n, t) {
                this.vx = i.walking_v * (t ? 2 : 1) * (n ? -1 : 1)
            },
            walkRight: function() {
                this.state === h.small ? this.setupFrames(8, 2, !1, "WalkRightSmall") || this.setImage(n.sprites, 32, 0) : this.marioState === a.normal ? this.setupFrames(9, 2, !1, "WalkRightBig") || this.setImage(n.sprites, 32, 88) : this.marioState === a.fire && (this.setupFrames(9, 2, !1, "WalkRightFire") || this.setImage(n.sprites, 32, 150))
            },
            walkLeft: function() {
                this.state === h.small ? this.setupFrames(8, 2, !1, "WalkLeftSmall") || this.setImage(n.sprites, 288, 0) : this.marioState === a.normal ? this.setupFrames(9, 2, !1, "WalkLeftBig") || this.setImage(n.sprites, 288, 88) : this.marioState === a.fire && (this.setupFrames(9, 2, !1, "WalkLeftFire") || this.setImage(n.sprites, 288, 150))
            },
            stand: function() {
                var i = this.state + this.marioState - 1,
                    t = this.standSprites[i][this.direction === e.left ? 0 : 1][this.onground ? 0 : 1];
                this.setImage(n.sprites, t.x, t.y), this.clearFrames()
            },
            crouch: function() {
                var i = this.state + this.marioState - 1,
                    t = this.crouchSprites[i][this.direction === e.left ? 0 : 1];
                this.setImage(n.sprites, t.x, t.y), this.clearFrames()
            },
            jump: function() {
                this.level.playSound("jump"), this.vy = i.jumping_v
            },
            move: function() {
                //console.log(this.level.getInput());
                this.input(this.level.getInput()), this._super()
            },
            addCoin: function() {
                this.setCoins(this.coins + 1)
            },
            playFrame: function() {
                //console.log("\nv playFrame called");
                this.blinking && (this.blinking % i.blinkfactor == 0 && this.view.toggle(), this.blinking--), this.cooldown && this.cooldown--, this.deadly && this.deadly--, this.invulnerable && this.invulnerable--, this._super()
            },
            setCoins: function(n) {
                this.coins = n, this.coins < i.max_coins || (this.addLife(), this.coins -= i.max_coins), this.level.world.parent().children("#coinNumber").text(this.coins)
            },
            addLife: function() {
                this.level.playSound("lifeupgrade"), this.setLifes(this.lifes + 1)
            },
            setLifes: function(n) {
                this.lifes = n, this.level.world.parent().children("#liveNumber").text(this.lifes)
            },
            death: function() {
                return this.deathBeginWait ? (this.deathBeginWait--, !0) : this.deathEndWait ? --this.deathEndWait : (this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + "px"
                }), this.deathCount += this.deathDir, this.deathCount === this.deathFrames ? this.deathDir = -1 : this.deathCount === 0 && (this.deathEndWait = Math.floor(1800 / i.interval)), !0)
            },
            die: function() {
                //console.log("v die is called");
                this.setMarioState(a.normal), this.deathStepDown = Math.ceil(240 / this.deathFrames), this.setSize(32, 48), this.setupFrames(9, 2, !0), this.setImage(n.sprites, 416, 0), this.level.playMusic("die"), this._super()
            },
            hurt: function(n) {
                //console.log("v hurt is called");
                if (this.deadly) n.die();
                else {
                    if (this.invulnerable) return;
                    this.state === h.small ? this.die() : (this.invulnerable = Math.floor(i.invulnerable / i.interval), this.blink(Math.ceil(this.invulnerable / (2 * i.blinkfactor))), this.setState(h.small), this.level.playSound("hurt"))
                }
            }
        }, "mario"),
        re = ut.extend({
            init: function(t, i, r) {
                this.width = 80, this._super(t, i, r), this.setSize(46, 64), this.direction = e.right, this.setImage(n.peach, 0, 80)
            },
            setVelocity: function(t, i) {
                this._super(t, i), t !== 0 ? this.setupFrames(6, 4, !1, "Walk") || this.setImage(n.peach, 138, 80) : this.frameTick && (this.clearFrames(), this.setImage(n.peach, 0, 80))
            }
        }, "peach"),
        ee = ut.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.direction = e.right, this.setSize(32, 62), this.setImage(n.sprites, 0, 88)
            },
            setVelocity: function(t, i) {
                this._super(t, i), t !== 0 ? this.setupFrames(9, 2, !1, "WalkRightBig") || this.setImage(n.sprites, 32, 88) : this.frameTick && (this.clearFrames(), this.setImage(n.sprites, 0, 88))
            }
        }, "bigmario"),
        tt = st.extend({
            init: function(n, t, i) {
                this._super(n, t, i), this.speed = 0
            },
            hide: function() {
                this.invisible = !0, this.view.hide()
            },
            show: function() {
                this.invisible = !1, this.view.show()
            },
            move: function() {
                if (!this.invisible) {
                    this._super();
                    if (this.vx === 0) {
                        var n = this.speed * Math.sign(this.speed);
                        this.setVelocity(this.direction === e.right ? -n : n, this.vy)
                    }
                }
            },
            collides: function(n, t, i, r, f) {
                var e, o;
                if (this.j + 1 < this.level.getGridHeight())
                    for (e = n; e <= t; e++) {
                        if (e < 0 || e >= this.level.getGridWidth()) return !0;
                        o = this.level.obstacles[e][this.j + 1];
                        if (!o || (o.blocking & u.top) !== u.top) return !0
                    }
                return this._super(n, t, i, r, f)
            },
            setSpeed: function(n) {
                this.speed = n, this.setVelocity(-n, 0)
            },
            hurt: function() {
                //console.log("tt hurt is called");
                this.die()
            },
            hit: function(n) {
                if (this.invisible) return;
                n instanceof v && (n.vy < 0 && n.y - n.vy >= this.y + this.state * 32 ? (n.setVelocity(n.vx, i.bounce), this.hurt(n)) : n.hurt(this))
            }
        }),
        ue = tt.extend({
            init: function(n, t, r) {
                this._super(n, t, r), this.setSize(34, 32), this.setSpeed(i.ballmonster_v), this.death_mode = k.normal, this.deathCount = 0
            },
            setVelocity: function(t, i) {
                this._super(t, i), this.direction === e.left ? this.setupFrames(6, 2, !1, "LeftWalk") || this.setImage(n.enemies, 34, 188) : this.setupFrames(6, 2, !0, "RightWalk") || this.setImage(n.enemies, 0, 228)
            },
            death: function() {
                if (this.death_mode === k.normal) return --this.deathCount;
                this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + this.deathStep + "px"
                }), this.deathCount += this.deathDir;
                if (this.deathCount === this.deathFrames) this.deathDir = -1;
                else if (this.deathCount === 0) return !1;
                return !0
            },
            die: function() {
                this.clearFrames(), this.death_mode === k.normal ? (this.level.playSound("enemy_die"), this.setImage(n.enemies, 102, 228), this.deathCount = Math.ceil(600 / i.interval)) : this.death_mode === k.shell && (this.level.playSound("shell"), this.setImage(n.enemies, 68, this.direction === e.right ? 228 : 188), this.deathFrames = Math.floor(250 / i.interval), this.deathDir = 1, this.deathStep = Math.ceil(150 / this.deathFrames)), this._super()
            }
        }, "ballmonster"),
        ti = tt.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setSize(34, 32), this.speed = 0, this.setImage(n.enemies, 0, 494)
            },
            activate: function(n, t) {
                this.setupFrames(6, 4, !1), this.setPosition(n, t), this.show()
            },
            takeBack: function(n) {
                n.setShell(this) && this.clearFrames()
            },
            move: function() {
                this._super()
            },
            hit: function(n) {
                if (this.invisible) return;
                this.vx ? n instanceof v ? n.y < this.y + this.height / 2 ? n.hurt(this) : (this.setSpeed(0), n.setVelocity(n.vx, i.bounce)) : (n.deathMode = k.shell, n.die()) : n instanceof v ? (this.setSpeed(n.direction === e.right ? -i.shell_v : i.shell_v), n.setVelocity(n.vx, i.bounce)) : n instanceof si && n.state === h.small && this.takeBack(n)
            },
            collides: function(n, t, i, r, u) {
                var e, f, o;
                if (n < 0 || t >= this.level.obstacles.length) return !0;
                if (i < 0 || r >= this.level.getGridHeight()) return !1;
                for (e = n; e <= t; e++)
                    for (f = r; f >= i; f--) {
                        o = this.level.obstacles[e][f];
                        if (o && (o.blocking & u) === u) return !0
                    }
                return !1
            }
        }, "shell"),
        si = tt.extend({
            init: function(n, t, r) {
                this.walkSprites = [
                    [{
                        x: 34,
                        y: 382
                    }, {
                        x: 0,
                        y: 437
                    }],
                    [{
                        x: 34,
                        y: 266
                    }, {
                        x: 0,
                        y: 325
                    }]
                ], this._super(n, t, r), this.wait = 0, this.deathMode = k.normal, this.deathFrames = Math.floor(250 / i.interval), this.deathStepUp = Math.ceil(150 / this.deathFrames), this.deathStepDown = Math.ceil(182 / this.deathFrames), this.deathDir = 1, this.deathCount = 0, this.setSize(34, 54), this.setShell(new ti(n, t, r))
            },
            setShell: function(n) {
                return this.shell || this.wait ? !1 : (this.shell = n, n.hide(), this.setState(h.big), !0)
            },
            setState: function(n) {
                this._super(n), n === h.big ? this.setSpeed(i.big_turtle_v) : this.setSpeed(i.small_turtle_v)
            },
            setVelocity: function(t, i) {
                this._super(t, i);
                var u = this.direction === e.right,
                    r = this.walkSprites[this.state - 1][u ? 1 : 0],
                    f = Math.sign(t) + "-" + this.state;
                this.setupFrames(6, 2, u, f) || this.setImage(n.enemies, r.x, r.y)
            },
            die: function() {
                this._super(), this.clearFrames(), this.deathMode === k.normal ? (this.level.playSound("enemy_die"), this.deathFrames = Math.floor(600 / i.interval), this.setImage(n.enemies, 102, 437)) : this.deathMode === k.shell && (this.level.playSound("shell"), this.setImage(n.enemies, 68, this.state === h.small ? this.direction === e.right ? 437 : 382 : 325))
            },
            death: function() {
                if (this.deathMode === k.normal) return --this.deathFrames;
                this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + "px"
                }), this.deathCount += this.deathDir;
                if (this.deathCount === this.deathFrames) this.deathDir = -1;
                else if (this.deathCount === 0) return !1;
                return !0
            },
            move: function() {
                this.wait && this.wait--, this._super()
            },
            hurt: function() {
                if (this.state === h.small) return this.die();
                this.level.playSound("enemy_die"), this.wait = i.shell_wait, this.setState(h.small), this.shell.activate(this.x, this.y), this.shell = undefined
            },
            hit: function(n) {
                if (this.wait) return;
                this._super(n)
            }
        }, "greenturtle"),
        df = tt.extend({
            init: function(n, t, r) {
                this._super(n, t, r), this.setSize(34, 32), this.setSpeed(i.spiked_turtle_v), this.deathFrames = Math.floor(250 / i.interval), this.deathStepUp = Math.ceil(150 / this.deathFrames), this.deathStepDown = Math.ceil(182 / this.deathFrames), this.deathDir = 1, this.deathCount = 0
            },
            setVelocity: function(t, i) {
                this._super(t, i), this.direction === e.left ? this.setupFrames(4, 2, !0, "LeftWalk") || this.setImage(n.enemies, 0, 106) : this.setupFrames(6, 2, !1, "RightWalk") || this.setImage(n.enemies, 34, 147)
            },
            death: function() {
                this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + "px"
                }), this.deathCount += this.deathDir;
                if (this.deathCount === this.deathFrames) this.deathDir = -1;
                else if (this.deathCount === 0) return !1;
                return !0
            },
            die: function() {
                this.level.playSound("shell"), this.clearFrames(), this._super(), this.setImage(n.enemies, 68, this.direction === e.left ? 106 : 147)
            },
            hit: function(n) {
                if (this.invisible) return;
                n instanceof v && n.hurt(this)
            }
        }, "spikedturtle"),
        af = tt.extend({
            init: function(n, t, i) {
                this._super(n, t, i), this.setSize(33, 32), this.setMode(ft.sleep, e.left)
            },
            die: function() {},
            setMode: function(t, i) {
                (this.mode !== t || this.direction !== i) && (this.mode = t, this.direction = i, this.setImage(n.ghost, 33 * (t + i - 1), 0))
            },
            move: function() {
                var n = this.level.mario;
                //console.log("\naf move: n = "+n);
                if (n && Math.abs(this.x - n.x) <= 800) {
                    var t = Math.sign(n.x - this.x),
                        u = Math.sign(n.y - this.y) * .5,
                        i = t ? t + 2 : this.direction,
                        r = n.direction === i ? ft.awake : ft.sleep;
                    //console.log("\naf move: posx = "+(this.x+t)+" posy = "+(this.y+u));
                    this.setMode(r, i), r && this.setPosition(this.x + t, this.y + u)
                } else this.setMode(ft.sleep, this.direction)
            },
            hit: function(n) {
                n instanceof v && n.hurt(this)
            }
        }, "ghost"),
        dt = tt.extend({
            init: function(t, i, r) {
                this._super(t, i, r), this.setSize(34, 42), this.setupFrames(5, 2, !0), this.setImage(n.enemies, 0, 3)
            },
            setVelocity: function() {
                this._super(0, 0)
            },
            die: function() {
                this.level.playSound("shell"), this.clearFrames(), this._super()
            },
            hit: function(n) {
                if (this.invisible) return;
                n instanceof v && n.hurt(this)
            }
        }),
        cf = dt.extend({
            init: function(n, t, r) {
                this._super(n, t, r), this.deathFrames = Math.floor(250 / i.interval), this.deathStepUp = Math.ceil(100 / this.deathFrames), this.deathStepDown = Math.ceil(132 / this.deathFrames), this.deathDir = 1, this.deathCount = 0
            },
            die: function() {
                this._super(), this.setImage(n.enemies, 68, 3)
            },
            death: function() {
                this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + "px"
                }), this.deathCount += this.deathDir;
                if (this.deathCount === this.deathFrames) this.deathDir = -1;
                else if (this.deathCount === 0) return !1;
                return !0
            }
        }, "staticplant"),
        lf = dt.extend({
            init: function(t, r, u) {
                this.bottom = r - 48, this.top = r - 6, this._super(t + 16, r - 6, u), this.setDirection(e.down), this.setImage(n.enemies, 0, 56), this.deathFrames = Math.floor(250 / i.interval), this.deathFramesExtended = 6, this.deathFramesExtendedActive = !1, this.deathStep = Math.ceil(100 / this.deathFrames), this.deathDir = 1, this.deathCount = 0, this.view.css("z-index", 95)
            },
            setGridPosition: function(n, t) {
                this.i = Math.floor(n / 32), this.j = Math.ceil(this.level.getGridHeight() - 1 - (t + 6) / 32), this.j > this.level.getGridHeight() && this.die()
            },
            setDirection: function(n) {
                this.direction = n
            },
            setPosition: function(n, t) {
                (t === this.bottom || t === this.top) && (this.minimum = i.pipeplant_count, this.setDirection(this.direction === e.up ? e.down : e.up)), this._super(n, t)
            },
            blocked: function() {
                var t, n;
                if (this.y === this.bottom) {
                    for (t = !1, this.y += 48, n = this.level.figures.length; n--;)
                        if (this.level.figures[n] != this && ri(this.level.figures[n], this)) {
                            t = !0;
                            break
                        }
                    return this.y -= 48, t
                }
                return !1
            },
            move: function() {
                this.minimum === 0 ? this.blocked() || this.setPosition(this.x, this.y - (this.direction - 3) * i.pipeplant_v) : this.minimum--
            },
            die: function() {
                this._super(), this.setImage(n.enemies, 68, 56)
            },
            death: function() {
                return this.deathFramesExtendedActive ? (this.setPosition(this.x, this.y - 8), --this.deathFramesExtended) : (this.view.css({
                    bottom: (this.deathDir > 0 ? "+" : "-") + "=" + this.deathStep + "px"
                }), this.deathCount += this.deathDir, this.deathCount === this.deathFrames ? this.deathDir = -1 : this.deathCount === 0 && (this.deathFramesExtendedActive = !0), !0)
            }
        }, "pipeplant"),
        et = [{
            width: 252,
            height: 15,
            id: 0,
            background: 1,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "mushroombox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "ballmonster", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "mushroombox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "coinbox", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "coinbox", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "starbox", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "multiple_coinbox", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "coin", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "brown_block", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "brown_block", "coin", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "brown_block", "brown_block", "", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "brown_block", "coin", "brown_block", "brown_block", "coin", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "brown_block", "brown_block", "brown_block", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "coin", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "coin", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "coin", "", "coin", "", "coin", "", "coin", "", "coin", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"]
            ]
        }, {
            width: 220,
            height: 15,
            id: 1,
            background: 1,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "multiple_coinbox", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "greenturtle", "grass_top_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "coin", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "coin", "brown_block", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "mushroombox", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "starbox", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "greenturtle", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "grass_top_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "coin", "coin", "", "ballmonster", "brown_block", "brown_block", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "mushroombox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "ballmonster", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "coin", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "coin", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "coinbox", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "mushroombox", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "coinbox", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "coin", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "coin", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"]
            ]
        }, {
            width: 220,
            height: 15,
            id: 2,
            background: 1,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "coin", "coin", "brown_block", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "coin", "coin", "coin", "brown_block", "brown_block", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_left", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "coin", "", "", "coin", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "coin", "", "", "coin", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "coin", "", "", "coin", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "coin", "", "", "coin", "coin", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "", "", "coin", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "coin", "coin", "", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "coin", "", "", "", "", "coin", "grass_top", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "coin", "", "", "", "", "coin", "grass_top", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "coin", "coin", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "grass_top", "soil", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "grass_top", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "brown_block", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "coin", "brown_block", "coin", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "brown_block", "coin", "brown_block", "", "multiple_coinbox", "", "coinbox", "", "", "mushroombox", "", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "coin", "brown_block", "coin", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "brown_block", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "coin", "coin", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "pipeplant", "pipe_top_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "pipe_top_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "coin", "coin", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top"],
                ["", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "starbox", "", "", "", "grass_top", "soil", "soil", "planted_soil_left", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "bush_middle", "grass_top", "soil", "soil", "planted_soil_right", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "bush_middle", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "planted_soil_left", "soil"],
                ["", "coin", "coin", "", "", "bush_right", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "coin", "coin", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "planted_soil_right", "soil"],
                ["", "coin", "coin", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "greenturtle", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "bush_left", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "bush_middle_left", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "bush_middle", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "bush_right", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top_right"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "coin", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"]
            ]
        }, {
            width: 194,
            height: 15,
            id: 3,
            background: 8,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "coinbox", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "ballmonster", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "multiple_coinbox", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "ballmonster", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "coinbox", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "brown_block", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "coinbox", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "brown_block", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "coinbox", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "ballmonster", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "stone", "grass_top", "stone", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner", "planted_soil_left"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "coinbox", "", "", "", "", "stone", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil", "soil", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "stone", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "coin", "coin", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "coinbox", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "pipeplant", "pipe_top_left", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "pipe_top_right", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "mushroombox", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"]
            ]
        }, {
            width: 203,
            height: 15,
            id: 4,
            background: 8,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "spikedturtle", "brown_block", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "multiple_coinbox", "", "", "", "stone", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "mushroombox", "grass_top", "planted_soil_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top_right_rounded", "soil_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "stone", "stone", "", "multiple_coinbox", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "stone", "stone", "", "multiple_coinbox", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "coin", "coin", "", "", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "coin", "coin", "", "", "stone", "stone", "", "", "", "", "", "", "", "grass_top_right_rounded"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "stone", "stone", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "stone", "brown_block", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "ballmonster", "stone", "stone", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "stone", "stone", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "", "", "stone", "stone", "brown_block", "", "", "", "", "", "brown_block", "brown_block"],
                ["", "", "coin", "", "", "stone", "stone", "", "", "", "", "", "", "brown_block", "brown_block"],
                ["", "", "coin", "", "", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "", "spikedturtle", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "", "", "stone", "brown_block", "brown_block", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "coin", "", "", "stone", "brown_block", "brown_block", "brown_block", "", "", "", "", "", "brown_block"],
                ["", "", "coin", "", "", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "coin", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "stone", "", "", "", "", "stone", "", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "stone", "", "", "", "", "", "", "stone", "soil", "soil"],
                ["", "", "", "", "", "stone", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "stone", "stone", "", "coinbox", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "starbox", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "stone", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "ballmonster", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_left_rounded"],
                ["", "", "", "", "spikedturtle", "stone", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "grass_top_right_rounded"],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "stone", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "stone", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "spikedturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil"],
                ["", "", "", "", "coinbox", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "spikedturtle", "brown_block", "", "", "multiple_coinbox", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "stone", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "stone", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "stone", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "stone", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "greenturtle", "stone", "stone", "stone", "stone", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "", "grass_top"],
                ["", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone", "stone", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "grass_top_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"]
            ]
        }, {
            width: 140,
            height: 15,
            id: 5,
            background: 3,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "mushroombox", "", "", "", "brown_block", "", "", "", "", "", "mario", "stone", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "stone", "", ""],
                ["", "", "brown_block", "", "", "", "", "multiple_coinbox", "", "", "", "", "stone", "", ""],
                ["", "", "brown_block", "", "", "", "", "coinbox", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "ballmonster", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "greenturtle", "stone", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "pipeplant", "pipe_top_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_left", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "bush_middle_left", "mushroombox", "soil", "planted_soil_middle", "soil", "soil", "grass_top", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_right", "soil", "soil", "grass_top", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "soil", "soil", "grass_top", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "greenturtle", "stone", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "greenturtle", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "spikedturtle", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "brown_block", "", "", "", "", ""],
                ["multiple_coinbox", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "", "brown_block", "coin", "coin", "stone", "brown_block", ""],
                ["", "", "", "", "", "", "", "stone", "brown_block", "coin", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "spikedturtle", "stone", "", "", "coin", "coin", "stone", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "coin", "", "ballmonster", "stone", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "coin", "coin", "stone", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "coin", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "coin", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_left", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "ballmonster", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_right", "soil", "soil", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "grass_top_right", "grass_right", "grass_right", "grass_top_right_corner", "soil", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_top_right_corner", "soil", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "greenturtle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "coinbox", "", "", "", "coinbox", "", "", "bush_left", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "coinbox", "", "", "", "coinbox", "", "", "bush_middle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "brown_block", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "brown_block", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "mushroombox", "", "", "", "brown_block", "coin", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "mushroombox", "", "", "", "brown_block", "coin", "", "", "", "", "greenturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "coin", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"]
            ]
        }, {
            width: 165,
            height: 15,
            id: 6,
            background: 3,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil"],
                ["", "", "mushroombox", "", "", "", "stone", "", "", "", "bush_middle_right", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "multiple_coinbox", "", "", "", "stone", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner"],
                ["", "", "mushroombox", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "bush_left", "grass_top"],
                ["", "", "brown_block", "", "coin", "coin", "brown_block", "coin", "coin", "", "", "brown_block", "", "bush_middle_left", "grass_top"],
                ["", "", "", "", "coin", "coin", "brown_block", "coin", "coin", "", "", "brown_block", "", "bush_middle_left", "grass_top"],
                ["", "", "", "", "coin", "coin", "coin", "coin", "coin", "", "", "brown_block", "", "bush_middle_right", "grass_top"],
                ["", "", "", "", "coin", "coin", "coin", "coin", "coin", "", "", "brown_block", "", "bush_right", "grass_top"],
                ["", "", "", "", "coin", "coin", "coin", "coin", "coin", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "coin", "coin", "coin", "coin", "coin", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "coin", "coin", "coin", "coin", "coin", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "stone", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "bush_left", "grass_top"],
                ["brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "bush_middle", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "mushroombox", "", "brown_block", "", "bush_middle_right", "grass_top"],
                ["", "", "coin", "", "", "", "brown_block", "", "", "", "", "brown_block", "", "bush_right", "grass_top"],
                ["", "coin", "", "coin", "", "", "brown_block", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "coin", "", "", "", "brown_block", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "coin", "", "coin", "", "", "brown_block", "", "", "", "brown_block", "", "", "stone", "grass_top"],
                ["", "", "coin", "", "", "", "brown_block", "", "", "", "brown_block", "", "", "", "grass_top"],
                ["", "coin", "", "coin", "", "", "brown_block", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "coin", "", "", "", "brown_block", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "", "", "", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_grass"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "multiple_coinbox", "", "", "", "spikedturtle", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "greenturtle", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "coin", "coin", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "coin", "coin", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "coin", "coin", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top"],
                ["", "", "", "", "starbox", "", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "stone", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "staticplant", "grass_top", "soil", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "stone", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "stone", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"]
            ]
        }, {
            width: 177,
            height: 15,
            id: 7,
            background: 5,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "ballmonster", "brown_block", "", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "greenturtle", "grass_top", "planted_soil_right", "soil"],
                ["", "mushroombox", "", "", "", "brown_block", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil", "soil", "planted_soil_left", "soil", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "grass_top", "soil", "planted_soil_left", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "grass_top", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "coin", "coin", "", "brown_block", "", "", "", "", "ballmonster", "grass_top", "soil", "planted_soil_right", "soil", "soil"],
                ["", "coin", "coin", "", "brown_block", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "brown_block", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "mushroombox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "grass_top", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_top_left_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "brown_block", "soil", "brown_block", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "soil", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "staticplant", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "coinbox", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "brown_block", "", "", "", "bush_left", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "mushroombox", "", "", "", "bush_middle_left", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "brown_block", "", "", "", "bush_middle_right", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "coinbox", "", "", "", "bush_middle", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "bush_middle_left", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "bush_right", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "staticplant", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "coin", "soil", "brown_block", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "grass_top", "brown_block", "soil", "soil", "soil", "brown_block", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "brown_block", "soil_right", "soil_right", "brown_block", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "multiple_coinbox", "", "", "", "", "brown_block", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top_right_rounded", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "coin", "coin", "", "", "", "pipe_top_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "spikedturtle", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "planted_soil_left", "soil"],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"]
            ]
        }, {
            width: 181,
            height: 15,
            id: 8,
            background: 5,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "mushroombox", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_left", "grass_top_left_corner", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "pipeplant", "pipe_top_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right_grass"],
                ["", "", "", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "mushroombox", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right", "grass_top"],
                ["", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "grass_top_left_rounded_soil", "soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "coin", "brown_block", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "coin", "coin", "brown_block", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "coin", "coin", "mushroombox", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "coin", "coin", "multiple_coinbox", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "coin", "coin", "brown_block", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_top_right_corner"],
                ["", "", "", "coin", "brown_block", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left_grass"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "staticplant", "grass_top", "planted_soil_right"],
                ["", "mushroombox", "", "", "", "brown_block", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "bush_left", "grass_top", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "grass_top", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "grass_top_right_rounded", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "starbox", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "staticplant", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "coinbox", "coin", "coin", "coin", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"]
            ]
        }, {
            width: 242,
            height: 15,
            id: 9,
            background: 6,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "multiple_coinbox", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "spikedturtle", "brown_block", "", "", "", "bush_left", "grass_top", "soil", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "spikedturtle", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "coin", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_top_right_corner", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top_right", "grass_top_right_corner", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top_right", "grass_top_right_corner"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "mushroombox", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "coinbox", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "ballmonster", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top_left", "grass_left", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top", "soil", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top", "planted_soil_left", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top", "planted_soil_right", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top", "soil", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top_right", "grass_right", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_top_left_corner", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", ""],
                ["", "", "", "coin", "coin", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "pipe_left_soil", "pipe_left_soil", "pipe_left"],
                ["", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right_grass", "pipe_right_soil", "pipe_right_soil", "pipe_right_soil", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "mushroombox", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "coinbox", "", "", "", "bush_middle", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "coinbox", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "multiple_coinbox", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "coinbox", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_left", "stone", "", "", "", ""],
                ["", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "ballmonster", "grass_top", "soil", "planted_soil_right", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "grass_top_left", "grass_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "stone", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "staticplant", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "soil"],
                ["", "starbox", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", "", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "stone", "", "coin", "", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "stone", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "spikedturtle", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "mushroombox", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "coinbox", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "stone", "", "", ""],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "brown_block", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            ]
        }, {
            width: 161,
            height: 15,
            id: 10,
            background: 6,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "stone", ""],
                ["", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "planted_soil_right", "stone", ""],
                ["", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "multiple_coinbox", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "ballmonster", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "greenturtle", "grass_top", "planted_soil_left", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "planted_soil_right", "stone", "", "", "", ""],
                ["", "", "", "", "coin", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["coin", "coin", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "coin", "coin", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil", "stone", "", ""],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "planted_soil_middle", "soil", "stone", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "grass_top", "planted_soil_right", "soil", "stone", "", ""],
                ["", "", "", "", "", "mushroombox", "", "", "bush_left", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "bush_middle", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "", "", "coinbox", "", "", "bush_middle_right", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "", ""],
                ["", "", "", "brown_block", "", "", "", "", "ballmonster", "grass_top_right", "grass_right", "grass_right", "stone", "", ""],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "coin", "coin", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_left", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "coinbox", "", "", "bush_right", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_left", "stone", "coin", "stone"],
                ["", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "planted_soil_middle", "stone", "coin", "stone"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_middle", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "planted_soil_right", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "grass_right", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "coin", "stone"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "brown_block", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "multiple_coinbox", "", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_right", "grass_right", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "mushroombox", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "coinbox", "", "", "ballmonster", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "grass_top_left", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "grass_top", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "grass_top", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "grass_top_right", "stone", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            ]
        }, {
            width: 106,
            height: 15,
            id: 11,
            background: 2,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "mario", "grass_top_left", "grass_left", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_right", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left_grass", "pipe_left_soil", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "starbox", "", "", "", "", "brown_block", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "coin", "coin", "coin", "spikedturtle", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "coin", "soil", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "coin", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left", "grass_left", "grass_top_left_corner", "coin", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "coin", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_left", "grass_left", "grass_top_left_corner", "soil", "soil", "soil", "coin", "soil", "stone"],
                ["", "", "", "", "", "", "grass_top", "planted_soil_left", "soil", "soil", "mushroombox", "soil", "coin", "soil", "stone"],
                ["", "", "", "", "", "", "grass_top", "planted_soil_middle", "soil", "soil", "coinbox", "soil", "coin", "soil", "stone"],
                ["", "", "", "", "", "", "grass_top", "planted_soil_right", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["coinbox", "", "", "", "brown_block", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "ballmonster", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "stone", "", "brown_block", "", ""],
                ["", "", "", "", "", "", "", "staticplant", "grass_top_right_rounded", "soil_right", "stone", "coin", "coin", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "coin", "coin", "coin", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "stone", "coin", "coin", "coin", "brown_block"],
                ["", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "stone", "coin", "coin", "coin", "brown_block"],
                ["", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "stone", "coin", "coin", "coin", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "stone", "coin", "coin", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "coin", "coin", "brown_block", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "brown_block", "soil_left"],
                ["", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "stone"],
                ["", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil", "soil", "soil", "soil", "coin", "soil", "soil"],
                ["", "", "", "", "", "bush_right", "grass_top", "coinbox", "soil", "soil", "soil", "coin", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "starbox", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "pipeplant", "pipe_top_left", "pipe_left", "stone", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "stone", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "coin", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "multiple_coinbox", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "coin", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "coin", "", "", "", "", "", "", "", ""],
                ["", "coin", "coin", "stone", "", "", "", "coin", "", "", "", "", "", "", ""],
                ["", "coin", "coin", "stone", "", "", "", "", "coin", "", "", "", "", "", ""],
                ["", "coin", "coin", "stone", "", "", "", "", "", "coin", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "coin", "coin", "stone", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "coin", "coin", "stone", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "coin", "coin", "stone", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "stone", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "stone", "soil", "soil"],
                ["", "", "mushroombox", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top_right_rounded_soil", "soil_right", "soil_right", "stone", "soil_right", "soil_right"],
                ["", "", "", "", "", "staticplant", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"]
            ]
        }, {
            width: 233,
            height: 15,
            id: 12,
            background: 2,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "coin", "", "", "grass_top", "coinbox", "soil", "soil", "soil", "grass_top", "grass_top_left_rounded_soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "brown_block", "soil", "soil", "soil", "grass_top_right_rounded_soil", "grass_top", "grass_top_right_rounded_soil", "soil_right", "soil_right"],
                ["", "", "coin", "", "", "grass_top", "coinbox", "soil", "soil", "soil", "soil", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "grass_top", "brown_block", "soil", "soil", "soil", "soil", "grass_top", "soil", "soil", "soil"],
                ["", "", "coin", "", "bush_left", "grass_top", "coinbox", "soil", "soil", "planted_soil_left", "soil", "grass_top_right_rounded_soil", "soil_right", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "coin", "", "bush_middle_left", "grass_top", "soil", "soil", "soil", "planted_soil_right", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top_left_rounded_soil", "grass_top", "soil"],
                ["", "", "coin", "", "bush_right", "grass_top", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left", "grass_top", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "soil", "grass_top", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "coin", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "planted_soil_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "greenturtle", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "planted_soil_right", "grass_top_right_rounded_soil", "soil_right", "soil_right"],
                ["", "", "coin", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "soil", "soil", "soil", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "planted_soil_left", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_right", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "mushroombox", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "brown_block", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "multiple_coinbox", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "brown_block", "", "", "", "greenturtle", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "coin", "grass_top"],
                ["", "", "", "coinbox", "", "", "", "bush_left", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "grass_top", "soil", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_left", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "planted_soil_right", "soil", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "bush_left", "grass_top", "soil", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil", "grass_top", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "grass_top", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "soil", "grass_top", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "grass_top", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "coinbox", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "coinbox", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "planted_soil_left", "grass_top", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "planted_soil_middle", "grass_top_right_rounded_soil", "soil_right", "coin", "grass_top"],
                ["", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "grass_top", "planted_soil_middle", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "planted_soil_right", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "soil", "grass_top", "soil", "soil"],
                ["", "starbox", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "coin", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "grass_top", "soil", "grass_top", "planted_soil_right"],
                ["", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "coin", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "coin", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "grass_top", "coin", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "grass_top", "grass_top_left_rounded_soil", "soil_left", "soil_left"],
                ["", "coin", "", "", "grass_top", "soil", "soil", "soil", "grass_top", "soil", "soil", "grass_top", "grass_top", "soil", "soil"],
                ["", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "grass_top", "soil", "soil"],
                ["", "", "", "ballmonster", "grass_top", "soil", "planted_soil_middle", "soil", "grass_top", "soil", "soil", "soil", "grass_top", "grass_top_left_rounded_soil", "soil_left"],
                ["", "coin", "", "", "grass_top", "soil", "planted_soil_right", "soil", "multiple_coinbox", "soil", "soil", "soil", "grass_top", "grass_top", "soil"],
                ["", "", "", "bush_left", "grass_top", "soil", "soil", "soil", "grass_top", "soil", "coin", "soil", "grass_top", "grass_top", "soil"],
                ["", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "grass_top", "planted_soil_left", "soil", "soil", "grass_top_right_rounded_soil", "grass_top", "soil"],
                ["", "coin", "", "bush_middle", "grass_top", "soil", "soil", "grass_top_left_rounded_soil", "grass_top", "planted_soil_middle", "soil", "soil", "coin", "grass_top", "planted_soil_left"],
                ["", "", "", "bush_middle_left", "grass_top", "coin", "soil", "grass_top", "grass_top", "planted_soil_right", "grass_top_left_rounded_soil", "soil_left", "soil_left", "grass_top", "planted_soil_middle"],
                ["", "", "", "bush_middle_right", "grass_top", "soil", "soil", "grass_top", "grass_top_right_rounded_soil", "soil_right", "grass_top", "soil", "soil", "grass_top", "planted_soil_middle"],
                ["", "coin", "", "bush_right", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "grass_top", "planted_soil_right"],
                ["", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "coin", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "ballmonster", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "mushroombox", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_left", "soil", "soil", "grass_top", "coin", "grass_top"],
                ["", "", "", "coinbox", "", "", "bush_middle", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "grass_top", "soil", "grass_top"],
                ["", "", "", "multiple_coinbox", "", "", "bush_right", "grass_top", "soil", "planted_soil_right", "soil", "mushroombox", "grass_top", "coin", "grass_top"],
                ["", "", "", "coinbox", "", "", "greenturtle", "grass_top", "soil", "soil", "soil", "soil", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top", "mushroombox", "soil", "soil", "soil", "grass_top", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "grass_top", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "greenturtle", "grass_top", "planted_soil_left", "grass_top", "soil", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "bush_left", "grass_top", "planted_soil_middle", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "bush_middle_left", "grass_top", "planted_soil_right", "grass_top_right_rounded_soil", "grass_top_left_rounded_soil", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top_left_rounded_soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            ]
        }, {
            width: 162,
            height: 15,
            id: 13,
            background: 2,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "coin", "", "coin", "", "coin", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mario", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "ballmonster", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "coin", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "mushroombox", "", "", "coin", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "coin", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "coin", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "coin", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "grass_top", "coin", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "coin", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "coin", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "coin", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "coin", "planted_soil_left", "soil", "grass_top_left_rounded_soil", "soil_left"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "planted_soil_middle", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "coinbox", "soil", "planted_soil_right", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "starbox", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil", "multiple_coinbox", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "coinbox", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "greenturtle", "grass_top", "soil", "soil", "planted_soil_left", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_middle", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top", "soil", "soil", "planted_soil_right", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "spikedturtle", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "planted_soil_middle", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "brown_block", "", "", "", "grass_top", "soil", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "soil_left", "grass_top_right_rounded_soil", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "mushroombox", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "soil_left"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "ballmonster", "grass_top", "soil", "grass_top_left_rounded_soil", "soil_left", "coin", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "coin", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top", "planted_soil_middle", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top", "planted_soil_right", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_middle", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "planted_soil_right", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil", "soil", "soil", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "", "greenturtle", "grass_top", "soil", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "multiple_coinbox", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "multiple_coinbox", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil", "soil", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "stone", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top_left", "stone", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil"],
                ["", "", "", "", "", "", "", "", "", "ballmonster", "grass_top", "planted_soil_left", "soil", "grass_top_right_rounded_soil", "soil_right"],
                ["", "", "", "", "", "", "", "grass_top_left_rounded", "soil_left", "soil_left", "grass_top", "planted_soil_right", "soil", "coin", "grass_top_left_rounded_soil"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "spikedturtle", "grass_top", "planted_soil_left", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "grass_top_left_rounded", "soil_left", "grass_top", "planted_soil_right", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "coinbox", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "brown_block", "", "", "", "grass_top", "soil", "grass_top_right_rounded_soil", "soil_right", "soil_right", "grass_top", "soil", "planted_soil_left", "coin", "grass_top"],
                ["", "coinbox", "", "", "", "grass_top", "soil", "soil", "soil", "planted_soil_middle", "grass_top", "soil", "planted_soil_middle", "coin", "grass_top"],
                ["", "brown_block", "", "", "", "grass_top", "soil", "soil", "grass_top_left_rounded_soil", "soil_left", "grass_top", "soil", "planted_soil_middle", "coin", "grass_top"],
                ["", "coinbox", "", "", "ballmonster", "grass_top", "soil", "soil", "grass_top", "soil", "grass_top", "soil", "planted_soil_right", "coin", "grass_top"],
                ["", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "spikedturtle", "grass_top", "soil", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "grass_top", "soil", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "greenturtle", "grass_top_right", "grass_top_right_corner", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "coin", "grass_top_right_rounded_soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "grass_top_right_rounded", "soil_right", "soil_right", "soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            ]
        }, {
            width: 155,
            height: 15,
            id: 14,
            background: 4,
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "mario", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "coinbox"],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "coinbox"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "coinbox"],
                ["", "", "", "", "", "brown_block", "", "", "", "", "", "", "", "", "coinbox"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left"],
                ["coin", "", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right"],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "ballmonster", "brown_block", "", "", "", "", "", "", "", "", "greenturtle", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "brown_block", "stone", "brown_block"],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "ballmonster", "brown_block", "", "", "", "", "", "", "", "", "spikedturtle", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["coin", "", "", "brown_block", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "brown_block", "", "", "", "", "", "", "", "", "brown_block", "stone", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "greenturtle", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "brown_block", "", "", "", "stone", ""],
                ["", "coin", "coin", "", "", "pipeplant", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "coin", "coin", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "mushroombox", "", "", "", "greenturtle", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "spikedturtle", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "spikedturtle", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "starbox", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "stone", "", "", "", "", "greenturtle", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "mushroombox", "", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "multiple_coinbox", "", "stone"],
                ["", "", "", "", "stone", "", "", "", "", "", "", "greenturtle", "multiple_coinbox", "", "brown_block"],
                ["", "", "", "", "stone", "", "", "", "", "", "", "", "multiple_coinbox", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "stone", "", ""],
                ["", "", "", "", "stone", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "stone", "", "", "", "", "", "", "", "stone", "stone", "brown_block"],
                ["", "", "", "", "", "stone", "", "", "", "", "", "spikedturtle", "stone", "stone", "brown_block"],
                ["", "", "", "", "", "", "stone", "", "", "", "", "", "stone", "stone", "brown_block"],
                ["", "", "", "", "", "", "", "stone", "", "", "", "", "stone", "stone", "brown_block"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_left", "pipe_left", "pipe_left", "pipe_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "pipe_top_right", "pipe_right", "pipe_right", "pipe_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "starbox", "", "", "", "", "spikedturtle", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "ballmonster", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "spikedturtle", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "", "stone", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "stone", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "coin", "stone", "", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "coin", "coin", "stone", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "coin", "coin", "coin", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "coin", "coin", "coin", "coin", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "coin", "coin", "coin", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "coin", "coin", "stone", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "", "coin", "stone", "", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "stone", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "greenturtle", "stone", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "brown_block", "brown_block", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "brown_block", "brown_block", "", "spikedturtle", "stone", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "staticplant", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "stone", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "spikedturtle", "brown_block", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "brown_block", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "spikedturtle", "brown_block", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "", "brown_block", "", "", "", "", "", "", "stone", "", "", "", "", ""],
                ["", "spikedturtle", "brown_block", "", "", "", "", "", "brown_block", "stone", "", "", "", "", ""],
                ["", "", "staticplant", "brown_block", "brown_block", "brown_block", "brown_block", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "mushroombox", "", "", "spikedturtle", "brown_block", "", "stone", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "stone", "", ""],
                ["", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "spikedturtle", "brown_block", "", "stone", "", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "brown_block", "brown_block", "brown_block", "brown_block", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "stone", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "stone", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "stone", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "stone", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "stone", "stone", "stone", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "stone", "", "", "", "stone"],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "stone", "stone", "stone", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "brown_block", "", "", "", "", "", ""]
            ]
        }];
    /*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
     * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
     * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
     *
     * Version: 0.5.0
     *
     */
    (function(n) {
        jQuery.fn.extend({
            slimScroll: function(t) {
                var r = {
                        wheelStep: 20,
                        width: "auto",
                        height: "250px",
                        size: "7px",
                        color: "#000",
                        distance: "1px",
                        start: "top",
                        opacity: .4,
                        alwaysVisible: !1,
                        railVisible: !1,
                        railColor: "#333",
                        railOpacity: "0.2",
                        railClass: "slimScrollRail",
                        barClass: "slimScrollBar",
                        wrapperClass: "slimScrollDiv",
                        allowPageScroll: !1,
                        scroll: 0
                    },
                    i = ops = n.extend(r, t);
                return this.each(function() {
                    function o(n, i, u) {
                        var f = n,
                            s, o;
                        i && (f = parseInt(r.css("left")) + n * ot / 100 * r.outerWidth(), s = t.outerWidth() - r.outerWidth(), f = Math.min(Math.max(f, 0), s), r.css({
                            left: f + "px"
                        })), l = parseInt(r.css("left")) / (t.outerWidth() - r.outerWidth()), f = l * (t[0].scrollWidth - t.outerWidth()), u && (f = n, o = f / t[0].scrollWidth * t.outerWidth(), r.css({
                            left: o + "px"
                        })), t.scrollLeft(f), p(), e()
                    }

                    function ut() {
                        w = Math.max(t.outerWidth() / t[0].scrollWidth * t.outerWidth(), lt), r.css({
                            width: w + "px"
                        })
                    }

                    function p() {
                        ut(), clearTimeout(d), c = at && l == ~~l;
                        if (w >= t.outerWidth()) {
                            c = !0;
                            return
                        }
                        r.stop(!0, !0).fadeIn("fast"), ft && f.stop(!0, !0).fadeIn("fast")
                    }

                    function e() {
                        h || (d = setTimeout(function() {
                            v || y || (r.fadeOut("slow"), f.fadeOut("slow"))
                        }, 1e3))
                    }
                    var k, v, y, d, w, l, lt = 30,
                        c = !1,
                        ot = parseInt(i.wheelStep),
                        rt = i.width,
                        it = i.height,
                        u = i.size,
                        ct = i.color,
                        ht = i.distance,
                        a = i.start,
                        st = i.opacity,
                        h = i.alwaysVisible,
                        ft = i.railVisible,
                        yt = i.railColor,
                        vt = i.railOpacity,
                        at = i.allowPageScroll,
                        nt = i.scroll,
                        t = n(this),
                        g, s, et;
                    if (t.parent().hasClass("slimScrollDiv")) {
                        nt && (r = t.parent().find(".slimScrollBar"), f = t.parent().find(".slimScrollRail"), o(t.scrollLeft() + parseInt(nt), !1, !0));
                        return
                    }
                    g = n(b).addClass(i.wrapperClass).css({
                        position: "relative",
                        overflow: "hidden",
                        width: rt,
                        height: it
                    }), t.css({
                        overflow: "hidden",
                        width: rt,
                        height: it
                    });
                    var f = n(b).addClass(i.railClass).css({
                            height: u,
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            display: h && ft ? "block" : "none",
                            "border-radius": u,
                            background: yt,
                            opacity: vt,
                            zIndex: 300
                        }),
                        r = n(b).addClass(i.barClass).css({
                            background: ct,
                            height: u,
                            position: "absolute",
                            bottom: 0,
                            opacity: st,
                            display: h ? "block" : "none",
                            "border-radius": u,
                            BorderRadius: u,
                            MozBorderRadius: u,
                            WebkitBorderRadius: u,
                            zIndex: 400
                        }),
                        tt = {
                            left: ht
                        };
                    f.css(tt), r.css(tt), t.wrap(g), t.parent().append(r), t.parent().append(f), r.draggable({
                        axis: "x",
                        containment: "parent",
                        start: function() {
                            y = !0
                        },
                        stop: function() {
                            y = !1, e()
                        },
                        drag: function() {
                            o(0, n(this).position().left, !1)
                        }
                    }), f.hover(function() {
                        p()
                    }, function() {
                        e()
                    }), r.hover(function() {
                        v = !0
                    }, function() {
                        v = !1
                    }), t.hover(function() {
                        k = !0, p(), e()
                    }, function() {
                        k = !1, e()
                    }), s = function(n) {
                        if (!k) return;
                        var n = n || window.event,
                            t = 0;
                        n.wheelDelta && (t = -n.wheelDelta / 120), n.detail && (t = n.detail / 3), o(t, !0), n.preventDefault && !c && n.preventDefault(), c || (n.returnValue = !1)
                    }, et = function() {
                        window.addEventListener ? (this.addEventListener("DOMMouseScroll", s, !1), this.addEventListener("mousewheel", s, !1)) : document.attachEvent("onmousewheel", s)
                    }, et(), ut(), a === "bottom" ? (r.css({
                        top: t.outerWidth() - r.outerWidth()
                    }), o(0, !0)) : typeof a == "object" && (o(n(a).position().left, null, !0), h || r.hide())
                }), this
            }
        }), jQuery.fn.extend({
            slimscroll: jQuery.fn.slimScroll
        })
    })(jQuery);
    var bi = ht.extend({
            init: function(n) {
                var t = this;
                this.world = $("#" + n), this.grid = !1, this.setPosition(0, 0), this.world.slimScroll({
                    height: 480
                }).droppable({
                    accept: ".block",
                    drop: function(n, i) {
                        var r = $(i.draggable),
                            f = Math.floor((i.offset.left + r.width() / 2 - t.world.offset().left + t.world.scrollLeft()) / 32),
                            u = Math.floor((i.offset.top + r.height() / 2 - t.world.offset().top + t.world.scrollTop()) / 32);
                        t.addItem(r.data("name"), f, u)
                    }
                }), this.reset(), this.undoList = []
            },
            reset: function() {
                var t, r, n, i;
                for (this._super(), $(oi).addClass("grid").appendTo(this.world), t = [], r = 100; r--;) {
                    for (n = [], i = 15; i--;) n.push("");
                    t.push(n)
                }
                this.load({
                    height: 15,
                    width: 100,
                    background: 1,
                    id: 0,
                    data: t
                })
            },
            adjustRaw: function() {
                var n = this.raw.width - this.raw.data.length,
                    i, r, t;
                if (n > 0)
                    for (t = n; t--;) {
                        for (i = [], r = 15; r--;) i.push("");
                        this.raw.data.push(i)
                    } else n < 0 && this.raw.data.splice(this.raw.width);
                n = this.raw.width - this.obstacles.length;
                if (n > 0)
                    for (t = n; t--;) this.obstacles.push(new Array(15));
                //console.log("\nbi adjustRaw called"); //Not called even once
                return this.raw
            },
            save: function() {
                return JSON.stringify(this.raw)
            },
            changeWidth: function(n) {
                this.raw.width = n, this.adjustRaw(), this.world.scrollLeft(0).children().each(function(t, i) {
                    var r = $(i);
                    r.position().left < n * 32 || r.remove()
                });
                for (var t = this.figures.length; t--;) this.figures[t].i < n || this.figures.splice(t, 1);
                this.setSize(32 * n, this.height)
            },
            setSize: function(n, t) {
                this._super(n, t), this.generateGrid()
            },
            setImage: function(n) {
                this.raw && (this.raw.background = n), this._super(n)
            },
            generateGrid: function() {
                var n = $(".grid", this.world).get(0).getContext("2d"),
                    t;
                n.canvas.width = this.width, n.canvas.height = this.height, n.clearRect(0, 0, n.canvas.width, n.canvas.height);
                if (this.grid) {
                    for (t = 32; t < this.width; t += 32) n.moveTo(t, 0), n.lineTo(t, 480);
                    for (t = 32; t < 480; t += 32) n.moveTo(0, t), n.lineTo(9600, t);
                    n.lineWidth = .5, n.strokeStyle = "#FF00FF", n.stroke()
                }
            },
            setItem: function(n, t, i, r) {
                //console.log("\nbi setItem called");   //Not even called once
                this.setItems([n], [t], [i], r)
            },
            setItems: function(n, t, i, r) {
                for (var e = [], u = 0, f = t.length; u < f; u++) e.push({
                    name: this.raw.data[t[u]][i[u]],
                    x: t[u],
                    y: i[u]
                }), this.raw.data[t[u]][i[u]] = n[u];
                r || this.pushUndoList(e)
            },
            addItem: function(n, t, i, r) {
                var v, a, u, o, s, f, e;
                if (t < 0 || t >= this.raw.width) return;
                if (n === "mario" && this.mario && this.mario.i < this.raw.width) {
                    v = this.mario.i, a = this.mario.j, this.mario.view.remove(), this.setItems(["", "mario"], [v, t], [a, i]), new p[n](32 * t, 448 - 32 * i, this);
                    return
                }
                this.removeView(t, i), u = new p[n](32 * t, 448 - 32 * i, this);
                if (u.onDrop && u.onDrop(t, i)) return;
                var c = [],
                    l = [],
                    h = [];
                if (u.width_blocks && u.height_blocks && u.master)
                    for (o = u.width_blocks / 2, s = u.height_blocks / 2, n = u.master, f = Math.ceil(t - o); f < Math.ceil(t + o); f++) {
                        if (f < 0 || f >= this.raw.width) continue;
                        for (e = Math.ceil(i - s); e < Math.ceil(i + s); e++) c.push(n), l.push(f), h.push(e), this.removeView(f, e), new p[n](32 * f, 448 - 32 * e, this)
                    } else c.push(n), l.push(t), h.push(i);
                //console.log("\nbi addItem called");   //Not even called once
                this.setItems(c, l, h, r)
            },
            removeItem: function(n, t, i) {
                this.removeView(n, t), this.setItem("", n, t, i)
            },
            removeView: function(n, t) {
                var i, r;
                if (this.obstacles[n][t]) this.obstacles[n][t].view.remove(), this.obstacles[n][t] = undefined;
                else
                    for (i = this.figures.length; i--;) r = this.figures[i].getGridPosition(), r.i === n && r.j === t && (this.figures[i].view.remove(), this.figures.splice(i, 1))
            },
            pushUndoList: function(n) {
                this.undoList.push(n)
            },
            popUndoList: function() {
                return this.undoList.pop()
            },
            undo: function() {
                var t, n, u, i, r;
                if (this.undoList.length)
                    for (t = this.popUndoList(), n = 0, u = t.length; n < u; n++) i = t[n].x, r = t[n].y, t[n].name ? this.addItem(t[n].name, i, r, !0) : this.removeItem(i, r, !0)
            },
            start: function() {},
            pause: function() {},
            toggleGrid: function() {
                this.grid ? this.gridOff() : this.gridOn()
            },
            gridOn: function() {
                this.grid = !0, this.generateGrid()
            },
            gridOff: function() {
                this.grid = !1, this.generateGrid()
            },
            setParallax: function() {}
        }),
        vt = ht.extend({
            init: function(n, t, i) {
                this.world = $("#" + n), this.edit = t, this.setPosition(0, 0), this.reset(), this.css = i || {}, this.world.slimScroll({
                    height: this.world.height()
                })
            },
            load: function(n) {
                var r = 0,
                    i, t;
                this.obstacles = [];
                for (i in p) n && n.indexOf(i) === -1 || (this.obstacles.push([]), t = new p[i](r, 0, this), t.view.addClass("block").draggable({
                    stack: !1,
                    cursor: "move",
                    cursorAt: {
                        top: t.height / 2,
                        left: t.width / 2
                    },
                    opacity: .8,
                    distance: 0,
                    appendTo: "body",
                    revert: !1,
                    helper: "clone"
                }).data("name", i).css(this.css), r += t.width + 2 * (t.x - r))
            },
            getGridHeight: function() {
                return 1
            },
            getGridWidth: function() {
                return this.obstacles.length
            },
            start: function() {},
            pause: function() {}
        }),
        gt = rt.extend({
            init: function(n, t, i) {
                this.view = $(b).addClass(ci).appendTo(i.world), this._super(n, t), this.level = i
            },
            addToGrid: function(n, t) {
                this.level.obstacles[n / 32][14 - t / 32] = this;
                //console.log("gt addToGrid: level.obstacles "+this.level.obstacles);
            },
            onDrop: function() {},
            setImage: function(n, t, i) {
                this.view.css({
                    backgroundImage: n ? nt(n) : "none",
                    backgroundPosition: "-" + (t || 0) + "px -" + (i || 0) + "px"
                }), this._super(n, t, i)
            },
            setPosition: function(n, t) {
                this.view.css({
                    left: n,
                    bottom: t
                }), this._super(n, t)
            },
            setSize: function(n, t) {
                this._super(n, t), this.view.css({
                    width: n,
                    height: t
                })
            }
        }),
        pf = gt.extend({
            init: function(n, t, i) {
                this._super(n, t, i), this.view.css("border", "1px solid #000"), this.setSize(32, 32)
            },
            onDrop: function(n, t) {
                return this.level.setItem("", n, t), this.view.remove(), !0
            }
        }, "Eraser-1x1"),
        o = gt.extend({
            init: function(n, t, i, r, u, f) {
                this._super(n, t, i), this.master = f, this.width_blocks = r, this.height_blocks = u, this.setSize(r * 32, u * 32)
            },
            onDrop: function() {
                return this.view.remove(), !1
            }
        }),
        wf = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 2, 2, "soil"), this.setImage(n.objects, 1071, 3)
            }
        }, "Soil-2x2"),
        hu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 3, 3, "soil"), this.setImage(n.objects, 1071, 3)
            }
        }, "Soil-3x3"),
        or = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 4, 4, "soil"), this.setImage(n.objects, 1071, 3)
            }
        }, "Soil-4x4"),
        sr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 2, 1, "grass_top"), this.setImage(n.objects, 1071, 136)
            }
        }, "Grass_Top-2x1"),
        hr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 4, 1, "grass_top"), this.setImage(n.objects, 1071, 136)
            }
        }, "Grass_Top-4x1"),
        er = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "grass_left"), this.setImage(n.objects, 1090, 172)
            }
        }, "Grass_Left-1x2"),
        ar = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "grass_left"), this.setImage(n.objects, 1090, 172)
            }
        }, "Grass_Left-1x4"),
        vr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "grass_right"), this.setImage(n.objects, 1125, 172)
            }
        }, "Grass_Right-1x2"),
        cr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "grass_right"), this.setImage(n.objects, 1125, 172)
            }
        }, "Grass_Right-1x4"),
        lr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "soil_left"), this.setImage(n.objects, 1160, 172)
            }
        }, "Soil_Left-1x2"),
        ir = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "soil_left"), this.setImage(n.objects, 1160, 172)
            }
        }, "Soil_Left-1x4"),
        ur = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "soil_right"), this.setImage(n.objects, 1090, 303)
            }
        }, "Soil_Right-1x2"),
        rr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "soil_right"), this.setImage(n.objects, 1090, 303)
            }
        }, "Soil_Right-1x4"),
        fr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "pipe_left_soil"), this.setImage(n.objects, 1125, 303)
            }
        }, "Pipe_Soil_Left-1x2"),
        yr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "pipe_left_soil"), this.setImage(n.objects, 1125, 303)
            }
        }, "Pipe_Soil_Left-1x4"),
        uu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "pipe_right_soil"), this.setImage(n.objects, 1160, 303)
            }
        }, "Pipe_Soil_Right-1x2"),
        ru = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "pipe_right_soil"), this.setImage(n.objects, 1160, 303)
            }
        }, "Pipe_Soil_Right-1x4"),
        iu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "pipe_left"), this.setImage(n.objects, 1090, 434)
            }
        }, "Pipe_Left-1x2"),
        fu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "pipe_left"), this.setImage(n.objects, 1090, 434)
            }
        }, "Pipe_Left-1x4"),
        su = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 2, "pipe_right"), this.setImage(n.objects, 1125, 434)
            }
        }, "Pipe_Right-1x2"),
        ou = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 4, "pipe_right"), this.setImage(n.objects, 1125, 434)
            }
        }, "Pipe_Right-1x4"),
        eu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 1, "multiple_coinbox"), this.setImage(n.objects, 956, 574)
            }
        }, "multiple_coinbox-1x1"),
        tu = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 1, "coinbox"), this.setImage(n.objects, 990, 574)
            }
        }, "coinbox-1x1"),
        br = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 1, "mushroombox"), this.setImage(n.objects, 956, 540)
            }
        }, "mushroombox-1x1"),
        wr = o.extend({
            init: function(t, i, r) {
                this._super(t, i, r, 1, 1, "starbox"), this.setImage(n.objects, 990, 540)
            }
        }, "starbox-1x1"),
        ei = ht.extend({
            init: function(n) {
                this.world = $("#" + n), this.setPosition(0, 0), this.input = [], this.speeches = [], this.currentSpeeches = [], this.animations = [], this.currentAnimations = [], this.cycles = 0, this.maxCycles = 0, this.reset()
            },
            load: function(n) {
                var s, r, h, o, t, u, f, e;
                for (this._super(n), this.onend = n.onend || function() {}, this.maxCycles = Math.ceil(n.duration / i.interval), s = 0; s < n.characters.length; s++) {
                    for (r = n.characters[s], h = new p[r.name](r.x, r.y, this), t = 0; t < r.speeches.length; t++) o = r.speeches[t], this.speeches.push({
                        figure: h,
                        start: Math.floor(o.start / i.interval),
                        end: Math.floor(o.end / i.interval),
                        text: o.text
                    });
                    for (t = 0; t < r.animations.length; t++) {
                        u = r.animations[t], f = {
                            figure: h,
                            start: Math.floor(u.start / i.interval),
                            end: Math.floor(u.end / i.interval)
                        };
                        for (e in u) f[e] === undefined && (f[e] = u[e]);
                        this.animations.push(f)
                    }
                }
                this.speeches.sort(function(n, t) {
                    return t.start - n.start
                }), this.animations.sort(function(n, t) {
                    return t.start - n.start
                })
            },
            createSpeech: function(n) {
                var t = n.figure.view.position();
                n.element = $(b).addClass("speech-bubble").appendTo(this.world).text(n.text).css({
                    left: t.left - 90,
                    top: t.top - n.figure.view.height() - 40
                })
            },
            removeSpeech: function(n) {
                var t = this.currentSpeeches[n];
                t.element.remove(), this.currentSpeeches.splice(n, 1)
            },
            createAnimation: function(n) {
                if (n.x !== undefined) {
                    var i = (n.x - n.figure.x) / (n.end - n.start),
                        t = n.figure.vy;
                    n.figure.setVelocity(i, t)
                }
                n.background !== undefined && n.figure.setImage(n.background.image, n.background.x, n.background.y)
            },
            removeAnimation: function(n) {
                var t = this.currentAnimations[n];
                t.x !== undefined && t.figure.setVelocity(0, t.figure.vy), this.currentAnimations.splice(n, 1)
            },
            tick: function() {
                var n = 0,
                    r, i, t;
                if (this.cycles === this.maxCycles) {
                    this.onend(), this.pause();
                    return
                }
                for (n = this.currentSpeeches.length; n--;) this.currentSpeeches[n].end === this.cycles ? this.removeSpeech(n) : this.currentSpeeches[n].figure.vx !== 0 && this.currentSpeeches[n].element.css({
                    left: "+=" + this.currentSpeeches[n].figure.vx
                });
                for (n = this.currentAnimations.length; n--;) this.currentAnimations[n].end === this.cycles && this.removeAnimation(n);
                while (this.speeches.length && this.speeches[this.speeches.length - 1].start === this.cycles) i = this.speeches.pop(), this.createSpeech(i), this.currentSpeeches.push(i);
                while (this.animations.length && this.animations[this.animations.length - 1].start === this.cycles) t = this.animations.pop(), this.createAnimation(t), this.currentAnimations.push(t);
                for (n = this.figures.length; n--;) r = this.figures[n], r.move(), r.playFrame();
                for (n = this.items.length; n--;) this.items[n].playFrame();
                this.cycles = this.cycles + 1
            }
        }),
        ni = {
            data: [
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_left"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "planted_soil_middle"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_left", "grass_top", "soil", "planted_soil_right"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_left", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_middle_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "bush_right", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "soil", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_left", "soil"],
                ["", "", "", "", "", "", "", "", "", "", "", "", "grass_top", "planted_soil_middle", "soil"]
            ],
            width: 20,
            height: 15,
            id: 15,
            background: 4,
            onend: function() {},
            duration: 16e3,
            characters: [{
                name: "bigmario",
                x: -30,
                y: 96,
                speeches: [{
                    start: 7500,
                    end: 10500,
                    text: "Oh Daisy!"
                }],
                animations: [{
                    start: 2500,
                    end: 4100,
                    x: 100
                }, {
                    start: 7900,
                    end: 9900,
                    x: 260
                }, {
                    start: 14e3,
                    end: 14e3,
                    background: {
                        x: 384,
                        y: 88,
                        image: n.sprites
                    }
                }]
            }, {
                name: "peach",
                x: 520,
                y: 96,
                speeches: [{
                    start: 0,
                    end: 3e3,
                    text: "Mario!"
                }, {
                    start: 4e3,
                    end: 7e3,
                    text: "Thank you, Mario!"
                }, {
                    start: 1e4,
                    end: 13e3,
                    text: "I love you, Mario!"
                }],
                animations: [{
                    start: 7e3,
                    end: 1e4,
                    x: 320
                }, {
                    start: 14e3,
                    end: 14e3,
                    background: {
                        x: 38,
                        y: 2,
                        image: n.peach
                    }
                }]
            }, ]
        },
        s, pt, yt, wt, lt = {
            top: "auto",
            left: "auto",
            position: "relative",
            margin: "1px"
        },
        tr = ["grass_top_left", "grass_top", "grass_top_right", "grass_right", "grass_left", "grass_top_left_rounded", "grass_top_left_rounded_soil", "grass_top_right_rounded", "grass_top_right_rounded_soil", "grass_top_left_corner", "grass_top_right_corner", "soil", "soil_left", "soil_right", "planted_soil_left", "planted_soil_middle", "planted_soil_right", "bush_left", "bush_middle_left", "bush_middle", "bush_middle_right", "bush_right", "pipe_top_left", "pipe_top_right", "pipe_left", "pipe_right", "pipe_left_grass", "pipe_right_grass", "pipe_left_soil", "pipe_right_soil", "brown_block", "stone", "coin", "multiple_coinbox-1x1", "coinbox-1x1", "mushroombox-1x1", "starbox-1x1", "Eraser-1x1"],
        di = ["greenturtle", "ballmonster", "spikedturtle", "pipeplant", "staticplant", "mario", "ghost", "shell"],
        gi = ["Soil-2x2", "Soil-3x3", "Soil-4x4", "Grass_Left-1x4", "Grass_Right-1x4", "Soil_Left-1x4", "Soil_Right-1x4", "Pipe_Soil_Left-1x4", "Pipe_Soil_Right-1x4", "Pipe_Left-1x4", "Pipe_Right-1x4", "Grass_Top-2x1", "Grass_Top-4x1", "Grass_Left-1x2", "Grass_Right-1x2", "Soil_Left-1x2", "Soil_Right-1x2", "Pipe_Soil_Left-1x2", "Pipe_Soil_Right-1x2", "Pipe_Left-1x2", "Pipe_Right-1x2"],
        f, d, ot = {},
        r = {
            keys: {
                settings: "mario5settings",
                game: "mario5game"
            },
            check: function() {
                return typeof localStorage === undefined ? !1 : !0
            },
            settings: {},
            saveSettings: function() {
                if (!r.check()) return;
                localStorage.setItem(r.keys.settings, JSON.stringify(r.settings))
            },
            loadSettings: function() {
                var u = {
                        musicOn: !0,
                        gridOn: !1
                    },
                    n, f, t, i;
                if (r.check())
                    for (n = 0; n < localStorage.length; n++)
                        if (localStorage.key(n) === r.keys.settings) {
                            f = localStorage.getItem(r.keys.settings), t = JSON.parse(f);
                            for (i in t) u[i] = t[i];
                            break
                        }
                r.settings = u
            },
            saveGame: function(n) {
                if (!r.check()) return;
                localStorage.setItem(r.keys.game, JSON.stringify(n))
            },
            loadGame: function() {
                if (r.check())
                    for (var n = 0; n < localStorage.length; n++)
                        if (localStorage.key(n) === r.keys.game) return JSON.parse(localStorage.getItem(r.keys.game));
                return !1
            },
            eraseGame: function() {
                if (!r.check()) return;
                localStorage.removeItem(r.keys.game)
            }
        },
        y = {
            init: function() {
                var t = $(".dia").css("opacity", 0),
                    n = y.getRandom();
                t.eq(n).css("opacity", 1).addClass("dia-current"), t.eq(y.getRandom(n)).addClass("dia-next")
            },
            getRandom: function(n) {
                var i = $(".dia").length,
                    t = 0;
                do t = Math.floor(Math.random() * i), t === i && t--; while (t === n);
                return t
            },
            start: function() {
                $(".dia.dia-current").animate({
                    opacity: 1
                }, 3e3, y.transition)
            },
            stop: function() {
                $(".dia").stop();
                var n = $(".dia-current").css("opacity") * 1;
                n < 1 && y.next()
            },
            transition: function() {
                //console.log("\ny transition called");   //Not even called once
                var n = 2e3;
                $(".dia-next").animate({
                    opacity: 1
                }, n), $(".dia-current").animate({
                    opacity: 0
                }, n, function() {
                    y.next(), y.start()
                })
            },
            next: function() {
                //console.log("\ny next called");   //Called once at the beginning of the level
                var n = $(".dia").index(".dia-next");
                $(".dia-current").removeClass("dia-current").css("opacity", 0), $(".dia-next").removeClass("dia-next").addClass("dia-current").css("opacity", 1), $(".dia").eq(y.getRandom(n)).addClass("dia-next")
            }
        },
        t = {
            current: "",
            setup: function() {
                t.callbacks(), r.loadSettings(), t.music(), t.buttons(), t.handlers(), t.account()
            },
            editor: function() {
                s = new bi("edit_world"), r.settings.gridOn ? s.gridOn() : s.gridOff(), pt = new vt("editorBricksItems", s, lt), pt.load(tr), yt = new vt("editorFiguresItems", s, lt), yt.load(di), wt = new vt("editorSpecialItems", s, lt), wt.load(gi)
            },
            game: function() {
                var i = new ki,
                    n = new pi;
                f = new ht("world"), d = new wi(r.settings, t.initSound), f.setSounds(d), f.setInput(i), f.setInput(n), t.keyboard = i, t.touch = n
            },
            music: function() {
                var n = $("#soundButton > img"),
                    t = {};
                t = r.settings.musicOn ? {
                    src: n.attr("src").replace("sound_off", "sound_on"),
                    title: n.attr("data-sound-on")
                } : {
                    src: n.attr("src").replace("sound_on", "sound_off"),
                    title: n.attr("data-sound-off")
                }, n.attr(t)
            },
            sound: function() {
                r.settings.musicOn ? d.playMusic() : d.pauseMusic(), t.music()
            },
            editorReset: function() {
                $("#canvas_width").val(s.raw.width).change(), $(".editorBackground").removeClass("picked").eq(s.raw.background - 1).addClass("picked")
            },
            ajaxHandlers: function() {
                $("#ajax a").click(function(n) {
                    return t.performAjax(this.href), n.preventDefault(), !0
                }), $("#ajax div[data-level-load]").click(function() {
                    var i = $(this).attr("data-level-load") * 1;
                    //console.log("\nt ajaxHandlers: data-level-details");
                    t.load(i)
                }), $("#ajax div[data-level-details]").click(function() {
                    var i = $(this).attr("data-level-details") * 1;
                    //console.log("\nt ajaxHandlers: data-level-details");
                    t.layer("dynamic"), $("#dynamic-content").empty().load("/Level/Details/" + i)
                }), $("#ajax div[data-level-rate]").click(function() {
                    var i = $(this).attr("data-level-rate") * 1;
                    t.performAjax("/Level/Rate/" + i)
                }), $("#ajax div[data-level-edit]").click(function() {
                    var i = $(this).attr("data-level-edit") * 1;
                    $("#ajax").empty(), $.getJSON("/Level/Get/" + i, function(n) {
                        s.reset(), s.load(n), t.editorReset(), t.section("edit")
                    })
                }), $("#ajax .star").rating(), $("#ajax span.stars").stars(), openid.init("openid_identifier")
            },
            performAjax: function(n, i) {
                t.section("ajax"), $("#ajax").empty().load(n, function() {
                    t.ajaxHandlers(), i && i()
                })
            },
            layer: function(n) {
                $(".layer").hide().filter("#" + n).show()
            },
            section: function(n, i) {
                //console.log("\nt section called");
                if (t.current === n) return;
                t.current = n, location.hash !== "#" + n && (location.hash = n), (arguments.length < 2 || !i) && d && d.music(n), $(".layer").hide(), n === "menu" ? y.start() : y.stop(), $(".section:visible").hide("slide", {
                    direction: "left"
                }, 400), $("#" + n).show("slide", {
                    direction: "right"
                }, 400), $("#bottomnav").children(":visible").hide(400), $("#" + n + "_buttons").show(400).length > 0 ? $("#bottompanel").show() : $("#bottompanel").hide(), n === "game" ? f.start() : f.pause()
            },
            level: function(n, i) {
                t.section("levelloading", !0), ot.custom = !1, ot.editor = !1, f.load(et[n]), globalObstacles.push(et[n].data); /*console.log(et[n].data),*/
                 for(var i = Math.floor(globalMarioPosition["x"] / 32) - 7, count = 0; i <= Math.floor(globalMarioPosition["x"] / 32) + 7; i++, count++){
                        if(i >= 0){
                            screenObstacles[count] = globalObstacles[0][i];
                        }
                } 
                i && f.importSaveGame(i), f.setDeadCallback(t.end), f.setNextCallback(t.next), f.setSameCallback(t.same), t.showGame()
            },
            custom: function(n, i) {
                t.section("levelloading", !0), ot.custom = !0, ot.editor = i, f.load(n), i ? (f.importSaveGame({
                    lifes: 0,
                    coins: 0,
                    state: h.small,
                    marioState: a.normal
                }), f.setDeadCallback(function() {
                    t.section("edit")
                })) : f.setDeadCallback(function() {
                    t.performAjax("/Level/Rate/" + f.id)
                }), f.setSameCallback(), f.setNextCallback(f.deadCallback), t.showGame()
            },
            load: function(n) {
                $("#ajax").empty(), $.getJSON("/Level/Get/" + n, function(n) {
                    t.custom(n, !1)
                })
            },
            next: function() {
                f.pause();
                var i = f.exportSaveGame(),
                    n = f.id + 1;
                i.level = n, n < et.length && n >= 0 ? (r.saveGame(i), f.load(et[n]), f.importSaveGame(i), f.start()) : n === et.length ? t.ending() : t.showMenu()
            },
            same: function() {
                var n = f.exportSaveGame();
                n.level = f.id, r.saveGame(n)
            },
            end: function() {
                f.reset(), r.eraseGame(), t.showMenu()
            },
            ending: function() {
                f.reset(), r.eraseGame();
                var n = new ei("endingAnimation");
                n.load(ni), n.start(), d.music("ending"), $("#endingContainer").on("click", function() {
                    n.pause(), $(this).off("click").hide(), t.showMenu()
                }).show()
            },
            showMenu: function() {
                t.section("menu")
            },
            showGame: function() {
                //console.log("\nt showGame called");
                t.section("game")
            },
            buttons: function() {
                var u = function(n) {
                        s.changeWidth(n), $("#range_value").html(n)
                    },
                    n = $("#canvas_width"),
                    i;
                n.get(0).type === "range" ? n.change(function() {
                    var t = n.val() * 1,
                        r = n.attr("max") * 1,
                        i = n.attr("min") * 1;
                    t = isNaN(t) ? 100 : Math.min(r, Math.max(t, i)), u(t)
                }) : (i = $('<div id="new_' + n.attr("id") + '"></div>'), n.after(i).hide().change(function() {
                    this.value * 1 != i.slider("value") * 1 && i.slider({
                        value: this.value
                    }), u(this.value * 1)
                }), i.slider({
                    min: n.attr("min") * 1,
                    max: n.attr("max") * 1,
                    step: 1,
                    change: function(t, i) {
                        n.val(i.value).change()
                    }
                })), $(".editorBackground").click(function() {
                    var n = $(".editorBackground").removeClass("picked").index(this);
                    $(this).addClass("picked"), s.setImage(n + 1)
                }), $("#gridEdit").click(function() {
                    s.toggleGrid(), r.settings.gridOn = !r.settings.gridOn, r.saveSettings()
                }), $("#undoEdit").click(function() {
                    s.undo()
                }), $("#playEdit").click(function() {
                    t.custom(s.raw, !0)
                }), $("#saveEdit").click(function() {
                    var n = s.id ? "/Level/Edit/" + s.id : "/Level/Save";
                    t.performAjax(n, function() {
                        var n = s.save();
                        console.log(n), $("#Content").val(n)
                    })
                }), $("#newEditor").click(function() {
                    s.reset(), t.editorReset(), t.section("edit")
                }), $("#lastEditor").click(function() {
                    t.section("edit")
                }), $("#loadEditor").click(function() {
                    t.performAjax("/Level/Load")
                }), $("#newGame").click(function() {
                    r.loadGame() || f.active ? t.section("continue") : t.level(0)
                }), $("#customGame").click(function() {
                    t.performAjax("/Level/")
                }), $("#editGame").click(function() {
                    t.section("editor")
                }), $("#noContinue").click(function() {
                    r.eraseGame(), t.level(0)
                }), $("#yesContinue").click(function() {
                    if (f.active) t.showGame();
                    else {
                        var n = r.loadGame();
                        t.level(n.level, n)
                    }
                })
            },
            handlers: function() {
                ni.onend = function() {
                    var n = $("#credits").outerHeight();
                    d.music("credit"), $("#credits").animate({
                        top: 480 - n
                    }, 6e4, function() {
                        $("#endingContainer").click(), $(this).css("top", "480px")
                    })
                }, $("#infoButton").click(function() {
                    t.layer("info")
                }), $("#controlsButton").click(function() {
                    t.layer("controls")
                }), $("#menuButton").click(function() {
                    t.showMenu()
                }), $("#soundButton").click(function() {
                    r.settings.musicOn = !r.settings.musicOn, t.sound(), r.saveSettings()
                }), window.onhashchange = function() {
                    var n = location.hash.substr(1);
                    t.current !== n && t.section(n)
                }, $(".exit").click(function() {
                    $(this).parent().hide()
                })
            },
            account: function() {
                $("#loginButton").click(function() {
                    t.performAjax("/Account/LogOn")
                }), $("#registerButton").click(function() {
                    t.performAjax("/Account/Register")
                }), $("#profileButton").click(function() {
                    t.performAjax("/Account/ChangePassword")
                }), $("#logoutButton").click(function() {
                    t.performAjax("/Account/LogOff", window.userChanged)
                })
            },
            initSound: function() {
                y.init(), t.showMenu(), $("#loading").fadeOut(400), $("body").removeClass("no-overflow")
            },
            updateUser: function() {
                $.get("/Account/Status", function(n) {
                    $("#loginButton,#registerButton,#profileButton,#logoutButton").remove(), $("#topnav").append(n), t.account()
                })
            },
            callbacks: function() {
                window.userChanged = function() {
                    t.updateUser(), t.ajaxHandlers()
                }, window.saveSuccess = function(n) {
                    !n.error && n.id ? (s.raw.id = n.id, s.id = n.id, t.section("edit"), t.layer("success")) : $("#errorContainer").text(n.error)
                }, window.saveFailure = function() {
                    t.layer("failure")
                }, window.ratingComplete = function(n) {
                    if (n && n.responseText === "" && n.status === 200) {
                        var i = $("form").attr("action").replace("/Rate/", "/Ratings/");
                        i ? t.performAjax(i) : t.showMenu(), t.layer("thanks")
                    } else $("#ajax").html(n.responseText), t.ajaxHandlers()
                }, window.handleOpenIdFailure = function() {
                    $(".openidblock").remove()
                }, window.handleOpenIdSuccess = function() {
                    var n, i;
                    window.handleOpenIdFailure(), t.updateUser(), n = $("#form0").attr("action").split("?"), n.length > 1 && n[1].indexOf("ReturnUrl=") === 0 && (i = decodeURIComponent(n[1].substr(10)), t.performAjax(i))
                }
            }
        };
    window.SHRSB_Settings = {
        shr_class: {
            src: "/Content/shareholic",
            link: "",
            service: "5,7,304,247,88,74,2,313",
            apikey: "0747414f47c2b684cf5480c36b2478689",
            localize: !0,
            shortener: "bitly",
            shortener_key: "",
            designer_toolTips: !0,
            tip_bg_color: "black",
            tip_text_color: "white",
            twitter_template: "${title} - ${short_link} via @Shareaholic"
        }
    }, window.SHRSB_Globals = {
        perfoption: "1"
    }, $(document).ready(function() {
        t.setup(), t.editor(), t.game()
    })

   /* var screenObstaclesPass = setInterval(function(){
        //Send an ajax request to node server
                    var xmlhttp = new XMLHttpRequest();
                    var url = "http://localhost:8001/screenObstacles";
                    var params = screenObstacles;
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xmlhttp.onreadystatechange = function() {
                        //Call a function when the state changes.
                        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            //console.log(xmlhttp.responseText);
                        }
                    }
                    xmlhttp.send(params);
    },100);*/

    return {
        globalMarioPosition: globalMarioPosition,
        globalObstacles: globalObstacles,
        screenObstacles: screenObstacles,
        screenObstaclesPass: screenObstaclesPass
    };

})()

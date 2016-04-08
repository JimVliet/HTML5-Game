var functionFile;
(function (functionFile) {
    function setupPlayerKeys(game) {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyLib['space'] = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        return keyLib;
    }
    functionFile.setupPlayerKeys = setupPlayerKeys;
    function fixWrongTextures() {
    }
    functionFile.fixWrongTextures = fixWrongTextures;
    function setupSolidLayer(game, layer, map, debug) {
        layer.visible = false;
        var layerTiles = layer.tileIds, layerlength = layerTiles.length, mapWidth = layer.size['x'], mapHeight = layer.size['y'], usedTiles = {}, x, y;
        for (var index = 0; index < layerlength; index++) {
            if (layerTiles[index] != 0 && !(index in usedTiles)) {
                x = index % mapWidth;
                y = Math.floor(index / mapWidth);
                var curY = y, maxWidth = mapWidth - 1, curBestRect = [1, x, y, x, y];
                while (curY < mapHeight && layerTiles[curY * mapWidth + x] && !(curY * mapWidth + x in usedTiles)) {
                    var curX = x, curYIndex = curY * mapWidth, surface;
                    while (curX + 1 <= maxWidth && layerTiles[curYIndex + curX + 1] != 0 && !(curYIndex + curX + 1 in usedTiles)) {
                        curX++;
                    }
                    maxWidth = curX;
                    surface = (curX - x + 1) * (curY - y + 1);
                    if (surface > curBestRect[0]) {
                        curBestRect = [surface, x, y, curX, curY];
                    }
                    curY++;
                }
                var xPixel = curBestRect[1] * map.tileWidth, yPixel = curBestRect[2] * map.tileHeight, xEndPixel = (curBestRect[3] + 1) * map.tileWidth, yEndPixel = (curBestRect[4] + 1) * map.tileHeight, body = game.physics.p2.createBody(xPixel, yPixel, 0, false);
                body.addRectangle(xEndPixel - xPixel, yEndPixel - yPixel, (xEndPixel - xPixel) / 2, (yEndPixel - yPixel) / 2, 0);
                body.debug = debug;
                game.physics.p2.addBody(body);
                layer.bodies.push(body);
                for (var usedY = y; usedY <= curBestRect[4]; usedY++) {
                    var yIndex = mapWidth * usedY;
                    for (var usedX = x; usedX <= curBestRect[3]; usedX++) {
                        usedTiles[yIndex + usedX] = null;
                    }
                }
            }
        }
    }
    functionFile.setupSolidLayer = setupSolidLayer;
    function loadGameLevel(game, levelToLoad) {
        game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), false);
        game.state.start('TiledMapLoader', true, true);
    }
    functionFile.loadGameLevel = loadGameLevel;
    function copyObject(object) {
        var objectCopy = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                objectCopy[key] = object[key];
            }
        }
        return objectCopy;
    }
    functionFile.copyObject = copyObject;
})(functionFile || (functionFile = {}));
var Manager;
(function (Manager) {
    (function (AnimType) {
        AnimType[AnimType["LEFT"] = 0] = "LEFT";
        AnimType[AnimType["RIGHT"] = 1] = "RIGHT";
        AnimType[AnimType["IDLE"] = 2] = "IDLE";
        AnimType[AnimType["UPDOWN"] = 3] = "UPDOWN";
        AnimType[AnimType["ATTACK"] = 4] = "ATTACK";
        AnimType[AnimType["NONE"] = 5] = "NONE";
    })(Manager.AnimType || (Manager.AnimType = {}));
    var AnimType = Manager.AnimType;
    var AnimManager = (function () {
        function AnimManager(GameObject, options) {
            if (options === void 0) { options = { 'Attack': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39] }; }
            this.gameObject = GameObject;
            this.gameObject.smoothed = false;
            this.gameObject.animations.add('Idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 5, true);
            this.gameObject.animations.add('Walk', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
            this.gameObject.animations.add('Attack', options['Attack'], 50, false).onComplete.add(this.attackDone, this);
            this.gameObject.animations.add('Die', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, false);
            this.gameObject.animations.play('Idle');
            this.current = AnimType.IDLE;
        }
        AnimManager.prototype.attack = function () {
            this.gameObject.animations.play('Attack');
            this.current = AnimType.ATTACK;
        };
        AnimManager.prototype.attackDone = function () {
            this.current = AnimType.NONE;
            this.gameObject.attackAnimFinished();
        };
        AnimManager.prototype.updateAnimation = function (type) {
            if (this.current == AnimType.ATTACK)
                return;
            if (this.current == AnimType.NONE) {
                switch (type) {
                    case AnimType.LEFT:
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                        return;
                    case AnimType.RIGHT:
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                        return;
                    case AnimType.UPDOWN:
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                        return;
                    default:
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                        return;
                }
            }
            switch (type) {
                case AnimType.LEFT:
                    if (this.current != AnimType.LEFT) {
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                    }
                    return;
                case AnimType.RIGHT:
                    if (this.current != AnimType.RIGHT) {
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                    }
                    return;
                case AnimType.UPDOWN:
                    if (this.current != AnimType.UPDOWN) {
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                    }
                    return;
                default:
                    if (this.current != AnimType.IDLE) {
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                    }
                    return;
            }
        };
        return AnimManager;
    })();
    Manager.AnimManager = AnimManager;
})(Manager || (Manager = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObjects;
(function (GameObjects) {
    var AnimManager = Manager.AnimManager;
    var AnimType = Manager.AnimType;
    (function (GameObjectType) {
        GameObjectType[GameObjectType["PLAYER"] = 0] = "PLAYER";
    })(GameObjects.GameObjectType || (GameObjects.GameObjectType = {}));
    var GameObjectType = GameObjects.GameObjectType;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, currentLevel, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.objectType = GameObjectType.PLAYER;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 45;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;
            this.keyListener = functionFile.setupPlayerKeys(this.game);
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5, 0.5);
            this.body.clearShapes();
            this.body.fixedRotation = true;
            this.body.addRectangle(14, 5, 0, 16, 0);
            this.AnimManager = new AnimManager(this, { 'Attack': [30, 31, 32, 33, 34, 35, 35, 34, 33, 32, 31] });
        }
        Player.prototype.update = function () {
            this.updateMoveSpeed();
            this.updateMovementControl();
        };
        Player.prototype.updateMoveSpeed = function () {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        };
        Player.prototype.updateMovementControl = function () {
            this.body.setZeroVelocity();
            var ang = 0;
            if (this.keyListener['s'].isDown) {
                ang -= 3;
            }
            if (this.keyListener['w'].isDown) {
                ang += 3;
            }
            if (this.keyListener['d'].isDown) {
                ang += 1;
            }
            if (this.keyListener['a'].isDown) {
                ang -= 1;
            }
            var diagSpeed = this.moveSpeed * 0.7071, anim = AnimType.IDLE;
            switch (ang) {
                case 4:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 1:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(this.moveSpeed);
                    break;
                case -2:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -3:
                    anim = AnimType.UPDOWN;
                    this.body.moveDown(this.moveSpeed);
                    break;
                case -4:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -1:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(this.moveSpeed);
                    break;
                case 2:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 3:
                    anim = AnimType.UPDOWN;
                    this.body.moveUp(this.moveSpeed);
                    break;
            }
            if (this.keyListener['space'].isDown && this.canAttack) {
                return this.attack();
            }
            this.AnimManager.updateAnimation(anim);
        };
        Player.prototype.attack = function () {
            this.AnimManager.attack();
            var timer = this.game.time.add(new Phaser.Timer(this.game, true));
            timer.add(this.attackDelay, this.cooldownFinished, this);
            timer.start();
            this.canAttack = false;
            this.moveSpeedMod -= 0.6;
        };
        Player.prototype.cooldownFinished = function () {
            this.canAttack = true;
        };
        Player.prototype.attackAnimFinished = function () {
            this.moveSpeedMod += 0.6;
        };
        return Player;
    })(Phaser.Sprite);
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
var GameStates;
(function (GameStates) {
    var TiledMapLoader = (function (_super) {
        __extends(TiledMapLoader, _super);
        function TiledMapLoader(game, state) {
            _super.call(this);
            this.game = game;
            this.mapName = state.mapName;
            this.mapURL = state.mapURL;
            this.StateToStart = state;
            this.mapCacheKey = Phaser.Plugin.Tiled.utils.cacheKey(this.mapName, 'tiledmap');
        }
        TiledMapLoader.prototype.preload = function () {
            this.MainText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 80, 'Loading ' + this.mapName + " 0%", { fill: '#ffffff' });
            this.MainText.anchor.x = 0.5;
            this.SubText = this.game.add.text(this.game.width / 2, this.game.height / 2 + 80, 'Completed loading: ', { fill: '#ffffff' });
            this.SubText.anchor.x = 0.5;
            this.game.load.tiledmap(this.mapCacheKey, this.StateToStart.mapURL, null, Phaser.Tilemap.TILED_JSON);
            this.StateToStart.customPreload(this.game);
            this.game.load.onFileComplete.add(this.fileCompleted, this);
        };
        TiledMapLoader.prototype.create = function () {
            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            this.game.state.start(this.StateToStart.mapName, true, false);
        };
        TiledMapLoader.prototype.fileCompleted = function (progress, cacheKey) {
            this.MainText.setText('Loading ' + this.mapName + ' ' + progress + "%");
            this.SubText.setText('Completed loading: ' + cacheKey);
            if (cacheKey == this.mapCacheKey) {
                var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
                var tileSets = this.game.cache.getTilemapData(this.mapCacheKey).data.tilesets;
                for (var n = 0; n < tileSets.length; n++) {
                    var currentSet = tileSets[n];
                    this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9), 'tileset', currentSet.name), 'maps/' + currentSet.image);
                }
            }
        };
        TiledMapLoader.prototype.shutdown = function () {
            this.game.load.onFileComplete.remove(this.fileCompleted, this);
            this.MainText.destroy();
            this.SubText.destroy();
            this.game.state.remove('TiledMapLoader');
        };
        return TiledMapLoader;
    })(Phaser.State);
    GameStates.TiledMapLoader = TiledMapLoader;
})(GameStates || (GameStates = {}));
var GameLevels;
(function (GameLevels) {
    var Level2 = (function (_super) {
        __extends(Level2, _super);
        function Level2() {
            _super.call(this);
            this.mapName = 'Level2';
            this.mapURL = 'maps/Level2.json';
        }
        Level2.prototype.customPreload = function (game) {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('HollywoodVines', 'sounds/mp3/HollywoodVines.mp3');
        };
        Level2.prototype.create = function () {
            this.setupCurrentLevel();
            this.game.add.audio('HollywoodVines').play(undefined, 0, 0.5, true);
        };
        Level2.prototype.setupCurrentLevel = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);
            this.player = new GameObjects.Player(this.game, 120, 920, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840 / this.game.width) / 2)));
        };
        return Level2;
    })(Phaser.State);
    GameLevels.Level2 = Level2;
})(GameLevels || (GameLevels = {}));
var GameLevels;
(function (GameLevels) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.call(this);
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
            this.hasBeenFixed = 0;
        }
        Level1.prototype.customPreload = function (game) {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
        };
        Level1.prototype.create = function () {
            this.setupCurrentLevel();
            this.game.add.audio('Pershdal-Dung').play(undefined, 0, 0.3, true);
            this.setupNextLevel();
        };
        Level1.prototype.setupCurrentLevel = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);
            this.player = new GameObjects.Player(this.game, 408, 280, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840 / this.game.width) / 2)));
            console.log(this.map.getTilelayer('Objects').tileIds);
        };
        Level1.prototype.setupNextLevel = function () {
            var nextLevelBody = this.game.physics.p2.createBody(128, 74, 0, false);
            nextLevelBody.addRectangle(this.map.tileWidth / 8, this.map.tileHeight / 4, this.map.tileWidth / 2, this.map.tileHeight / 4, 0);
            nextLevelBody.onBeginContact.add(this.nextLevel, this);
            this.game.physics.p2.addBody(nextLevelBody);
            this.map.getTilelayer('Solid').bodies.push(nextLevelBody);
        };
        Level1.prototype.nextLevel = function () {
            functionFile.loadGameLevel(this.game, new GameLevels.Level2());
        };
        return Level1;
    })(Phaser.State);
    GameLevels.Level1 = Level1;
})(GameLevels || (GameLevels = {}));
var GameLevels;
(function (GameLevels) {
    var SolidTest = (function (_super) {
        __extends(SolidTest, _super);
        function SolidTest() {
            _super.call(this);
            this.mapName = 'SolidTestMap';
            this.mapURL = 'maps/SolidTestMap.json';
        }
        SolidTest.prototype.customPreload = function (game) {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        };
        SolidTest.prototype.create = function () {
            this.setupCurrentLevel();
        };
        SolidTest.prototype.setupCurrentLevel = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            this.game.camera.scale.set(1);
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, true);
        };
        SolidTest.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        };
        return SolidTest;
    })(Phaser.State);
    GameLevels.SolidTest = SolidTest;
})(GameLevels || (GameLevels = {}));
var MyGame;
(function (MyGame) {
    var RPGame = (function () {
        function RPGame(width, height) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create }, false, false);
        }
        RPGame.prototype.preload = function () {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
            this.game.add.plugin(new Phaser.Plugin.Debug(this.game, this.game.stage));
        };
        RPGame.prototype.create = function () {
            if (window.location.href.indexOf('objectConverter') != -1) {
                functionFile.loadGameLevel(this.game, new GameLevels.SolidTest());
            }
            else {
                functionFile.loadGameLevel(this.game, new GameLevels.Level1());
            }
        };
        return RPGame;
    })();
    MyGame.RPGame = RPGame;
})(MyGame || (MyGame = {}));
window.onload = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var widthAspectRatio = 16;
    var heightAspectRatio = 9;
    var aspectMultiplier = Math.min(winW / widthAspectRatio, winH / heightAspectRatio);
    var gameVar = new MyGame.RPGame(aspectMultiplier * widthAspectRatio, aspectMultiplier * heightAspectRatio);
};
//# sourceMappingURL=generated.js.map
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="GameObjects.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameStates;
(function (GameStates) {
    var AITest = (function (_super) {
        __extends(AITest, _super);
        function AITest() {
            _super.call(this);
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
        }
        AITest.prototype.customPreload = function (game) {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            //game.load.audio('HollywoodVines', 'sounds/mp3/HollywoodVines.mp3');
        };
        AITest.prototype.create = function () {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            //Add tilemap and setup the solid layer
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            //Setup the object layer
            functionFile.addSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);
            //Add player object
            this.player = new GameObjects.Player(this.game, 408, 280, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            //Setup the camera
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(4.5);
            //Play music
            this.game.add.audio('Pershdal-Dung').play(undefined, 0, 0.3, true);
        };
        AITest.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        };
        return AITest;
    })(Phaser.State);
    GameStates.AITest = AITest;
    var SolidTest = (function (_super) {
        __extends(SolidTest, _super);
        function SolidTest() {
            _super.call(this);
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
        }
        SolidTest.prototype.customPreload = function (game) {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        };
        SolidTest.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            this.game.camera.scale.set(1.5);
            var pointList = functionFile.setupSolidLayer(this.map.getTilelayer('Solid'));
            var polyList = functionFile.turnIntoPolygons(pointList, this.map.tileWidth, this.map.tileHeight);
            var graphics = this.game.add.graphics(0, 0);
            for (var i = 0; i < polyList.length; i++) {
                graphics.beginFill(Phaser.Color.getRandomColor());
                graphics.drawPolygon(polyList[i]);
                graphics.endFill();
            }
        };
        SolidTest.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        };
        return SolidTest;
    })(Phaser.State);
    GameStates.SolidTest = SolidTest;
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
            //Load the custom assets needed for the state
            this.StateToStart.customPreload(this.game);
            this.game.load.onFileComplete.add(this.fileCompleted, this);
        };
        TiledMapLoader.prototype.create = function () {
            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            this.game.state.start(this.StateToStart.mapName, true, false);
            console.log('LoadCompleted');
        };
        TiledMapLoader.prototype.fileCompleted = function (progress, cacheKey) {
            this.MainText.setText('Loading ' + this.mapName + ' ' + progress + "%");
            this.SubText.setText('Completed loading: ' + cacheKey);
            if (cacheKey == this.mapCacheKey) {
                var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
                var cacheKey = this.mapCacheKey;
                var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
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
/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
/// <reference path="scripts/GameObjects.ts"/>
var MyGame;
(function (MyGame) {
    var RPGame = (function () {
        function RPGame(width, height) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create }, false, false);
        }
        RPGame.prototype.preload = function () {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
        };
        RPGame.prototype.create = function () {
            if (window.location.href.indexOf('objectConverter') != -1) {
                loadGameLevel(this.game, new GameStates.SolidTest());
            }
            else {
                loadGameLevel(this.game, new GameStates.AITest());
            }
        };
        return RPGame;
    })();
    MyGame.RPGame = RPGame;
})(MyGame || (MyGame = {}));
function loadGameLevel(game, levelToLoad) {
    game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), false);
    game.state.start('TiledMapLoader', true, true);
}
window.onload = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var widthAspectRatio = 16;
    var heightAspectRatio = 9;
    var aspectMultiplier = Math.min(winW / widthAspectRatio, winH / heightAspectRatio);
    var gameVar = new MyGame.RPGame(aspectMultiplier * widthAspectRatio, aspectMultiplier * heightAspectRatio);
};
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
var functionFile;
(function (functionFile) {
    var Polygon = Phaser.Polygon;
    function setupWASDKeys(game) {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        return keyLib;
    }
    functionFile.setupWASDKeys = setupWASDKeys;
    function addSolidLayer(game, layer, map, debug) {
        var pointList = functionFile.setupSolidLayer(layer);
        for (var i = 0; i < pointList.length; i++) {
            var x = pointList[i][1] * map.tileWidth, y = pointList[i][2] * map.tileHeight, xEnd = (pointList[i][3] + 1) * map.tileWidth, yEnd = (pointList[i][4] + 1) * map.tileHeight, body = game.physics.p2.createBody(x, y, 0, false);
            body.addRectangle(xEnd - x, yEnd - y, (xEnd - x) / 2, (yEnd - y) / 2, 0);
            body.debug = debug;
            game.physics.p2.addBody(body);
            layer.bodies.push(body);
        }
    }
    functionFile.addSolidLayer = addSolidLayer;
    function setupSolidLayer(layer) {
        layer.visible = false;
        //Declare variables
        var layerTiles = layer.tileIds, layerlength = layerTiles.length, mapWidth = layer.size['x'], mapHeight = layer.size['y'], usedTiles = {}, rectList = [], x, y;
        for (var index = 0; index < layerlength; index++) {
            if (layerTiles[index] != 0 && !(index in usedTiles)) {
                x = index % mapWidth;
                y = Math.floor(index / mapHeight);
                var curY = y, maxWidth = mapWidth - 1, curBestRect = [1, x, y, x, y];
                while (curY < mapHeight && layerTiles[curY * mapWidth + x] && !(curY * mapWidth + x in usedTiles)) {
                    var curX = x, curYIndex = curY * mapWidth, surface;
                    //Check if the tile isn't outside the map and if it's a wall and if it isn't already used
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
                rectList.push(curBestRect);
                //Update usedTiles list
                for (var usedY = y; usedY <= curBestRect[4]; usedY++) {
                    var yIndex = mapWidth * usedY;
                    for (var usedX = x; usedX <= curBestRect[3]; usedX++) {
                        usedTiles[yIndex + usedX] = null;
                    }
                }
            }
        }
        return rectList;
    }
    functionFile.setupSolidLayer = setupSolidLayer;
    function turnIntoPolygons(rectArray, tileWidth, tileHeight) {
        var polygonList = [];
        for (var i = 0; i < rectArray.length; i++) {
            var x = rectArray[i][1] * tileWidth, y = rectArray[i][2] * tileHeight, xEnd = (rectArray[i][3] + 1) * tileWidth, yEnd = (rectArray[i][4] + 1) * tileHeight;
            var poly = new Polygon(new Phaser.Point(x, y), new Phaser.Point(xEnd, y), new Phaser.Point(xEnd, yEnd), new Phaser.Point(x, yEnd));
            polygonList.push(poly);
        }
        return polygonList;
    }
    functionFile.turnIntoPolygons = turnIntoPolygons;
})(functionFile || (functionFile = {}));
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="functionFile.ts"/>
var GameObjects;
(function (GameObjects) {
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
            this.moveSpeed = 40;
            this.keyListener = functionFile.setupWASDKeys(this.game);
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5, 0.5);
            this.body.fixedRotation = true;
            this.body.debug = false;
            this.body.clearShapes();
            this.body.addRectangle(14, 5, 0, 16, 0);
            //Setup animations
            this.smoothed = false;
            this.animations.add('Idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 5, true);
            this.animations.add('Right', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
            this.animations.add('Left', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
            this.animations.add('AttackRight', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
            this.animations.add('AttackLeft', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
            this.animations.add('DieRight', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
            this.animations.add('DieLeft', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
            this.animations.play('Idle');
        }
        Player.prototype.update = function () {
            this.updateMovementControl();
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
            var diagSpeed = this.moveSpeed * 0.7071;
            switch (ang) {
                case 4:
                    this.playRight();
                    this.body.moveRight(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 1:
                    this.playRight();
                    this.body.moveRight(this.moveSpeed);
                    break;
                case -2:
                    this.playRight();
                    this.body.moveRight(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -3:
                    this.playUpDown();
                    this.body.moveDown(this.moveSpeed);
                    break;
                case -4:
                    this.playLeft();
                    this.body.moveLeft(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -1:
                    this.playLeft();
                    this.body.moveLeft(this.moveSpeed);
                    break;
                case 2:
                    this.playLeft();
                    this.body.moveLeft(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 3:
                    this.playUpDown();
                    this.body.moveUp(this.moveSpeed);
                    break;
                default:
                    this.playIdle();
                    break;
            }
        };
        Player.prototype.playRight = function () {
            if (this.animations.currentAnim.name != "Right") {
                this.scale.x = 1;
                this.animations.play('Right');
            }
        };
        Player.prototype.playLeft = function () {
            if (this.animations.currentAnim.name != "Left") {
                this.scale.x = -1;
                this.animations.play('Left');
            }
        };
        Player.prototype.playIdle = function () {
            if (this.animations.currentAnim.name != "Idle") {
                this.animations.play('Idle');
            }
        };
        Player.prototype.playUpDown = function () {
            if (this.scale.x < 0) {
                this.playLeft();
                return;
            }
            this.playRight();
        };
        return Player;
    })(Phaser.Sprite);
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
//# sourceMappingURL=generated.js.map
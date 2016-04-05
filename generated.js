/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
var functionFile;
(function (functionFile) {
    function setupWASDKeys(game) {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        return keyLib;
    }
    functionFile.setupWASDKeys = setupWASDKeys;
    function convertTiledMapLayer(map, layer) {
        var tile;
        for (var y = 0, h = layer.size.y; y < h; y++) {
            for (var x = 0, w = layer.size.x; x < w; x++) {
                if (!layer.tiles[y])
                    continue;
                tile = layer.tiles[y][x];
            }
        }
    }
    functionFile.convertTiledMapLayer = convertTiledMapLayer;
})(functionFile || (functionFile = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            this.moveSpeed = 250;
            this.keyListener = functionFile.setupWASDKeys(this.game);
            this.game.physics.arcade.enable(this);
            this.body.collideWorldBounds = true;
        }
        Player.prototype.update = function () {
            this.updateMovementControl();
        };
        Player.prototype.updateMovementControl = function () {
            var xVel = 0.0;
            var yVel = 0.0;
            if (this.keyListener['s'].isDown) {
                yVel += this.moveSpeed;
            }
            if (this.keyListener['w'].isDown) {
                yVel -= this.moveSpeed;
            }
            if (this.keyListener['d'].isDown) {
                xVel += this.moveSpeed;
            }
            if (this.keyListener['a'].isDown) {
                xVel -= this.moveSpeed;
            }
            if (xVel != 0 && yVel != 0) {
                this.body.velocity.x = xVel * 0.7071;
                this.body.velocity.y = yVel * 0.7071;
            }
            else {
                this.body.velocity.x = xVel;
                this.body.velocity.y = yVel;
            }
        };
        return Player;
    })(Phaser.Sprite);
    GameObjects.Player = Player;
})(GameObjects || (GameObjects = {}));
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
            loadGameLevel(this.game, new GameStates.AITest());
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
/// <reference path="GameObjects.ts"/>
var GameStates;
(function (GameStates) {
    var AITest = (function (_super) {
        __extends(AITest, _super);
        function AITest() {
            _super.call(this);
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
        }
        AITest.prototype.preload = function () {
            this.game.load.spritesheet('PlayerTileset', 'images/tilesets/TestingTile.png', 32, 32);
        };
        AITest.prototype.create = function () {
            this.map = this.game.add.tiledmap(this.mapName);
            //Setup physics
            this.game.time.advancedTiming = true;
            //Add player object
            this.player = new GameObjects.Player(this.game, 80, 100, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            //Setup the camera
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(4);
        };
        AITest.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
            this.game.debug.cameraInfo(this.game.camera, 32, 64);
        };
        return AITest;
    })(Phaser.State);
    GameStates.AITest = AITest;
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
//# sourceMappingURL=generated.js.map
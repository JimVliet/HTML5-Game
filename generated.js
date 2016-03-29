/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
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
            this.mapName = 'AI-Test';
            this.mapURL = 'maps/AI-Test.json';
        }
        AITest.prototype.create = function () {
            this.map = this.game.add.tiledmap(this.mapName);
        };
        return AITest;
    })(Phaser.State);
    GameStates.AITest = AITest;
    var MineLevel = (function (_super) {
        __extends(MineLevel, _super);
        function MineLevel() {
            _super.call(this);
            this.mapName = 'mijn2';
            this.mapURL = 'maps/mijn2.json';
        }
        MineLevel.prototype.create = function () {
            this.map = this.game.add.tiledmap(this.mapName);
            //(<any>this.game.physics.p2).convertTiledmap;
            //console.log(this.map);
        };
        return MineLevel;
    })(Phaser.State);
    GameStates.MineLevel = MineLevel;
    var BeginMap2 = (function (_super) {
        __extends(BeginMap2, _super);
        function BeginMap2() {
            _super.call(this);
            this.mapName = 'BEGINMAP2';
            this.mapURL = 'maps/BEGINMAP2.json';
        }
        BeginMap2.prototype.create = function () {
            this.map = this.game.add.tiledmap(this.mapName);
        };
        return BeginMap2;
    })(Phaser.State);
    GameStates.BeginMap2 = BeginMap2;
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
/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
var MyGame;
(function (MyGame) {
    var RPGame = (function () {
        function RPGame(width, height) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
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
//# sourceMappingURL=generated.js.map
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
    var TiledMapLoader = (function (_super) {
        __extends(TiledMapLoader, _super);
        function TiledMapLoader() {
            _super.apply(this, arguments);
        }
        TiledMapLoader.prototype.preload = function () {
            var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
            var cacheKey = cacheKeyFunc(game.mapName, 'tiledmap');
            var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
            for (var n = 0; n < tileSets.length; n++) {
                var currentSet = tileSets[n];
                this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9), 'tileset', currentSet.name), 'maps/' + currentSet.image);
            }
        };
        TiledMapLoader.prototype.create = function () {
            this.game.add.tiledmap(game.mapName);
        };
        return TiledMapLoader;
    })(Phaser.State);
    GameStates.TiledMapLoader = TiledMapLoader;
})(GameStates || (GameStates = {}));
/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
var Tiled = Phaser.Plugin.Tiled;
var game;
var RPGame = (function () {
    function RPGame(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        this.mapName = 'mijn2';
        this.mapURL = 'maps/mijn2.json';
    }
    RPGame.prototype.loadMap = function (url, filename) {
        this.game.load.tiledmap(Phaser.Plugin.Tiled.utils.cacheKey(filename, 'tiledmap'), url, null, Phaser.Tilemap.TILED_JSON);
    };
    RPGame.prototype.preload = function () {
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        game.loadMap(game.mapURL, game.mapName);
    };
    RPGame.prototype.create = function () {
        this.game.state.add('TiledMapLoader', GameStates.TiledMapLoader, true);
    };
    return RPGame;
})();
window.onload = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var widthAspectRatio = 16;
    var heightAspectRatio = 9;
    var aspectMultiplier = Math.min(winW / widthAspectRatio, winH / heightAspectRatio);
    game = new RPGame(aspectMultiplier * widthAspectRatio, aspectMultiplier * heightAspectRatio);
};
//# sourceMappingURL=generated.js.map